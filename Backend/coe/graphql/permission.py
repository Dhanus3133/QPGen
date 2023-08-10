from typing import Any, Callable, ClassVar
from asgiref.sync import sync_to_async
from strawberry.types import Info
from strawberry_django.permissions import DjangoNoPermission, DjangoPermissionExtension

from coe.models import COE
from users.graphql.types import UserType


class IsACOE(DjangoPermissionExtension):
    """Mark a field as only resolvable by the COE."""

    DEFAULT_ERROR_MESSAGE: ClassVar[str] = "You don't have permission"
    SCHEMA_DIRECTIVE_DESCRIPTION: ClassVar[str] = "Can only be resolved by the COE."

    async def resolve_for_user(
        self,
        resolver: Callable,
        user: UserType,
        *,
        info: Info,
        source: Any,
    ):
        if not info.context.request.user.is_authenticated:
            raise DjangoNoPermission
        user = info.context.request.user
        if not user:
            raise DjangoNoPermission
        if await COE.objects.filter(coe=user, active=True).aexists():
            return await resolver()
        # raise DjangoNoPermission
