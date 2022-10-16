import strawberry
from typing import List
from strawberry.django import auth
from strawberry.types import Info
from strawberry_django_plus import gql
from strawberry_django_jwt.decorators import login_required

from .types import UserType
from core.utils import get_current_user_from_info


@gql.type
class Query:
    users: List[UserType] = gql.django.field()
    me: UserType = auth.current_user()

    # @gql.django.field
    # @login_required
    # async def me(self, info: Info) -> UserType:
    #     user = await get_current_user_from_info(info)
    #     return user
