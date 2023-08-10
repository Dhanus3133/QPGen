import strawberry
from typing import List
from asgiref.sync import sync_to_async
import strawberry_django
from strawberry_django import auth
from strawberry.types import Info
from coe.graphql.permission import IsACOE

from users.graphql.types import UserType
from users.models import User


@strawberry.type
class Query:
    me: UserType = auth.current_user()

    @strawberry_django.field()
    def is_authorized(self, info: Info) -> bool:
        return info.context.request.user.is_authenticated

    @strawberry.field(extensions=[IsACOE()])
    async def faculties(self, _: Info) -> List[UserType]:
        return await sync_to_async(list)(User.objects.filter(is_active=True))
