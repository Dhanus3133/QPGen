from typing import Optional
import strawberry_django
from strawberry import auto
from django.contrib.auth import get_user_model


@strawberry_django.input(get_user_model())
class UserInput:
    email: auto
    password: auto
    first_name: auto
    last_name: auto


@strawberry_django.partial(get_user_model())
class UserInputPartial:
    first_name: Optional[str]
    last_name: Optional[str]
