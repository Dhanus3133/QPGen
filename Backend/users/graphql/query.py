from asgiref.sync import sync_to_async
from graphql.type import directives
from strawberry_django_plus.permissions import IsAuthenticated
from coe.graphql.permissions import IsACOE
from core.utils import get_current_user_from_info
from users.models import User
from .types import UserType
import strawberry
from typing import List, Optional
from strawberry.django import auth
from strawberry.types import Info
from strawberry_django_plus import gql
from strawberry_django_jwt.decorators import login_required

# from gqlauth.core.directives import TokenRequired, IsAuthenticated


@gql.type
class Query:
    me: UserType = login_required(auth.current_user())

    @gql.django.field
    async def is_authorized(self, info: Info) -> bool:
        return info.context.request.user.is_authenticated

    @gql.django.field(permission_classes=[IsACOE])
    @login_required
    async def faculties(self, info: Info) -> List[UserType]:
        return await sync_to_async(list)(User.objects.filter(is_active=True))
