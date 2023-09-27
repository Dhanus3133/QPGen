from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model
from strawberry import relay
from strawberry import auto
from strawberry.relay.types import GlobalID
import strawberry_django


@strawberry_django.type(get_user_model())
class UserType(relay.Node):
    id: GlobalID
    email: auto
    first_name: auto
    last_name: auto
    password: auto
    is_active: auto

    @strawberry_django.field(only=["first_name", "last_name"])
    def full_name(self, root: AbstractUser) -> str:
        return f"{root.first_name or ''} {root.last_name or ''}".strip()


@strawberry_django.type(get_user_model())
class UserSignupInput:
    first_name: auto
    last_name: auto
    email: auto
    password: auto


@strawberry_django.type(get_user_model())
class UserLoginInput:
    email: auto
    password: auto
