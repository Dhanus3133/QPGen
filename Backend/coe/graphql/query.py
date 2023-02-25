from strawberry.types import Info
from strawberry_django_plus import gql
from coe.models import COE
from core.utils import get_current_user_from_info


@gql.type
class Query:
    @gql.django.field
    async def is_COE(self, info: Info) -> bool:
        user = await get_current_user_from_info(info)
        if await COE.objects.filter(coe=user, active=True).aexists():
            return True
        return False
