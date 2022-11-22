from typing import Optional
from django.contrib.auth import get_user_model
from strawberry_django_plus import gql

@gql.django.input(get_user_model())
class UserInput:
    # username: gql.auto
    email: gql.auto
    password: gql.auto
    first_name: gql.auto
    last_name: gql.auto
#
#
@gql.django.partial(get_user_model())
class UserInputPartial:
    first_name: Optional[str]
    last_name: Optional[str]
