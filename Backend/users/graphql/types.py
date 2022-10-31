from logging import info
from typing import Any
from strawberry_django_plus import gql
from django.contrib.auth import get_user_model


@gql.django.type(get_user_model())
class UserType(gql.relay.Node):
    id: gql.auto
    email: gql.auto
    first_name: gql.auto
    last_name: gql.auto
    password: gql.auto
    is_active: gql.auto


@gql.django.type(get_user_model())
class UserSignupInput:
    first_name: gql.auto
    last_name: gql.auto
    email: gql.auto
    password: gql.auto


@gql.django.type(get_user_model())
class UserLoginInput:
    email: gql.auto
    password: gql.auto

from strawberry import BasePermission
