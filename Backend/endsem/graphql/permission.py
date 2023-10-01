from typing import Any, Callable, ClassVar
from asgiref.sync import sync_to_async
from strawberry import BasePermission
from strawberry.types import Info
from strawberry_django.permissions import DjangoPermissionExtension
from django.core.exceptions import ValidationError
from endsem.models import EndSemQuestion, EndSemSubject
from users.graphql.types import UserType


class IsAEndSemFaculty(DjangoPermissionExtension):
    """Mark a field as only resolvable by the End Sem Faculty."""

    DEFAULT_ERROR_MESSAGE: ClassVar[str] = "You don't have permission"
    SCHEMA_DIRECTIVE_DESCRIPTION: ClassVar[str] = "Can only be resolved by the End Sem Faculty."

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
        if info.context.request.user.is_superuser or await EndSemSubject.objects.filter(faculties=info.context.request.user).aexists():
            return await resolver()
        raise ValidationError("You don't have the permission.")


class IsTheEndSemFaculty(BasePermission):
    message = "User is not a faculty for this Subject"

    @sync_to_async
    def has_permission(self, source: Any, info: Info, **kwargs) -> bool:
        if not info.context.request.user.is_authenticated:
            return False

        s = None

        if info.context.request.user.is_superuser:
            return True

        if "pk" in kwargs:
            s = EndSemQuestion.objects.get(id=kwargs["pk"]).subject
        elif "subject" in kwargs:
            s = EndSemSubject.objects.get(subject__code=kwargs["subject"])
        elif "data" in kwargs:
            if "subject" in kwargs['data']:
                s = EndSemSubject.objects.get(id=kwargs["data"]["subject"])
            elif "id" in kwargs['data']:
                s = EndSemQuestion.objects.get(id=kwargs["data"]["id"]).subject
        elif "input" in kwargs:
            if "id" in kwargs['input']:
                s = EndSemQuestion.objects.get(
                    id=kwargs["input"]["id"]
                ).subject

        if s is None:
            return False

        user = info.context.request.user

        if s.faculties.contains(user):
            return True

        return False
