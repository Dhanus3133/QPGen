from typing import Any, Callable, ClassVar
from strawberry.types import Info
from strawberry_django.permissions import DjangoPermissionExtension
from django.core.exceptions import ValidationError
from endsem.models import EndSemSubject
from users.graphql.types import UserType


class IsAEndSemFaculty(DjangoPermissionExtension):
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
        if not user:
            raise ValidationError("You are not logged in.")
        if info.context.request.user.is_superuser or await EndSemSubject.objects.filter(faculty=info.context.request.user).aexists():
            return await resolver()
        raise ValidationError("You don't have the permission.")
