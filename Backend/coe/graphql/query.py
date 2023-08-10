from strawberry.types import Info
import strawberry_django
from strawberry_django.filters import strawberry
from strawberry_django.permissions import IsAuthenticated
from coe.models import COE


@strawberry.type
class Query:
    @strawberry_django.field(extensions=[IsAuthenticated()])
    async def is_COE(self, info: Info) -> bool:
        user = info.context.request.user
        if await COE.objects.filter(coe=user, active=True).aexists():
            return True
        return False
