import strawberry_django
import strawberry
from typing import Optional
from django.core.exceptions import ObjectDoesNotExist
from strawberry.types import Info
from strawberry_django import auth
# from coe.graphql.permission import IsACOE
# from users.graphql.input import UserInputPartial

from users.graphql.types import UserType
from users.models import NewUser


@strawberry.type
class Mutation:
    login: Optional[UserType] = auth.login()
    logout: bool = auth.logout()

    # @strawberry_django.field(extensions=[IsACOE()])
    # def update_user(self, info: Info, data: UserInputPartial) -> UserType:
    #     user = info.context.request.user
    #     [
    #         user.__setattr__(key, val) if val else ""
    #         for key, val in data.__dict__.items()
    #     ]
    #     user.save()
    #     return user

    @strawberry_django.field
    def create_new_user(self, _: Info, first_name: str, last_name: str, email: str, password: str) -> bool:
        user = NewUser(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password,
        )
        user.save()
        user.verify_email()
        return True

    @strawberry_django.field
    def verify_email_signup(self, _: Info, token: str) -> bool:
        try:
            user = NewUser.objects.get(email_secret=token)
        except ObjectDoesNotExist:
            return False
        user.email_secret = ""
        user.email_verified = True
        user.save()
        return True
