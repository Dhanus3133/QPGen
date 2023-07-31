from types import NoneType
from typing import Optional
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from strawberry.django import auth
from strawberry.types import Info
from strawberry_django_plus import gql
import strawberry_django_jwt.mutations as jwt_mutations
from strawberry_django_jwt.decorators import login_required
from django.contrib.auth.password_validation import validate_password
from coe.graphql.permissions import IsACOE

from users.models import NewUser, User
from .types import UserType
from .input import UserInput, UserInputPartial
from django.core.exceptions import ObjectDoesNotExist


@gql.type
class Mutation:

    """
    mutation Login {
      login(password: "admin", username: "admin@admin.com") {
        id
      }
    }
    """

    login: Optional[UserType] = auth.login()

    """
    mutation Logout {
        logout
    }
    """

    logout: NoneType = auth.logout()

    """
    mutation Register {
        register(
            data: {username: "admin", email: "admin@admin.com", password: "admin123"}
        ) {
            id
        }
    }
    """

    # register: UserType = auth.register(UserInput)

    token_auth = jwt_mutations.ObtainJSONWebTokenAsync.obtain
    verify_token = jwt_mutations.VerifyAsync.verify
    refresh_token = jwt_mutations.RefreshAsync.refresh
    delete_token_cookie = jwt_mutations.DeleteJSONWebTokenCookieAsync.delete_cookie

    @gql.django.field(permission_classes=[IsACOE])
    @login_required
    def update_user(self, info: Info, data: UserInputPartial) -> UserType:
        user = info.context.request.user
        [
            user.__setattr__(key, val) if val else ""
            for key, val in data.__dict__.items()
        ]
        user.save()
        return user

    @gql.django.field
    def create_new_user(
        self, info: Info, first_name: str, last_name: str, email: str, password: str
    ) -> bool:

        user = NewUser(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password,
        )
        user.save()
        user.verify_email()
        return True

    @gql.django.field
    def verify_email_signup(self, info: Info, token: str) -> bool:
        try:
            user = NewUser.objects.get(email_secret=token)
        except ObjectDoesNotExist:
            return False
        user.email_secret = ""
        user.email_verified = True
        user.save()
        return True
