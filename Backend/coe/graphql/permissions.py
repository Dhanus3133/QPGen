from typing import Any
from asgiref.sync import sync_to_async
from strawberry.permission import BasePermission
from strawberry.types import Info

from coe.models import COE


class IsACOE(BasePermission):
    message = "You are not authorized!"

    @sync_to_async
    def has_permission(self, source: Any, info: Info, **kwargs) -> bool:
        user = info.context.request.user
        if COE.objects.filter(coe=user, active=True).exists():
            return True
        return False
