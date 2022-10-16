from strawberry_django_plus import gql
from typing import List
from django.contrib.auth import get_user_model


@gql.django.type(get_user_model())
class User(gql.Node):
    id: gql.auto
    first_name: str    
    last_name: str
    password: str
    is_active: bool


@gql.django.type(get_user_model())
class UserSignupInput:
    name: str
    email: str
    password: str


