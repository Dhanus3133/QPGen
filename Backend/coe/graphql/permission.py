from typing import Any, Callable, ClassVar
from django.core.exceptions import ValidationError
from strawberry.types import Info
from strawberry_django.permissions import DjangoPermissionExtension

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
        user = info.context.request.user
        if not user:
            raise ValidationError("You are not logged in.")
        if await COE.objects.filter(coe=user, active=True).aexists():
            return await resolver()
        raise ValidationError("You don't have the permission.")
