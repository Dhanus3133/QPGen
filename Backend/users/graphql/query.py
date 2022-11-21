from core.utils import get_current_user_from_info
from .types import UserType
import strawberry
from typing import List
from strawberry.django import auth
from strawberry.types import Info
from strawberry_django_plus import gql
# from strawberry_django_jwt.decorators import login_required
from gqlauth.core.directives import TokenRequired, IsAuthenticated


@gql.type
class Query:
    # users: List[UserType] = gql.django.field(directives=[IsAuthenticated()], pagination=True)
    users: List[UserType] = gql.django.field(
        pagination=True, directives=[IsAuthenticated(), TokenRequired()]
    )
    me: UserType = auth.current_user()

    # @gql.django.field
    # @login_required
    # async def me(self, info: Info) -> UserType:
    #     user = await get_current_user_from_info(info)
    #     return user
