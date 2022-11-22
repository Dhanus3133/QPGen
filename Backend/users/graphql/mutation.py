from types import NoneType
from typing import Optional
from django.contrib.auth import get_user_model
from strawberry.django import auth
from strawberry.types import Info
from strawberry_django_plus import gql
import strawberry_django_jwt.mutations as jwt_mutations
from strawberry_django_jwt.decorators import login_required

from users.models import User
from .types import UserType
from .input import UserInput, UserInputPartial


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

    register: UserType = auth.register(UserInput)

    token_auth = jwt_mutations.ObtainJSONWebTokenAsync.obtain
    verify_token = jwt_mutations.VerifyAsync.verify
    refresh_token = jwt_mutations.RefreshAsync.refresh
    delete_token_cookie = jwt_mutations.DeleteJSONWebTokenCookieAsync.delete_cookie

    @gql.django.field
    @login_required
    def update_user(self, info: Info, data: UserInputPartial) -> UserType:
        user = info.context.request.user
        [user.__setattr__(key, val) if val else "" for key,
         val in data.__dict__.items()]
        user.save()
        return user
