from typing import Any, Callable, ClassVar
from asgiref.sync import sync_to_async
from strawberry.types import Info
from strawberry_django.permissions import DjangoNoPermission, DjangoPermissionExtension

from questions.models import FacultiesHandling, Lesson
from users.graphql.types import UserType


class IsAFaculty(DjangoPermissionExtension):
    """Mark a field as only resolvable by the faculties of the subject."""

    DEFAULT_ERROR_MESSAGE: ClassVar[str] = "User is not a faculty for this Subject"
    SCHEMA_DIRECTIVE_DESCRIPTION: ClassVar[str] = "Can only be resolved by the faculty."

    async def resolve_for_user(
        self,
        resolver: Callable,
        user: UserType,
        info: Info,
        _: Any,
        **kwargs
    ):
        if not info.context.request.user.is_authenticated:
            raise DjangoNoPermission

        if type(kwargs["input"]["lesson"]) is int:
            l = await sync_to_async(Lesson)(Lesson.objects.get(pk=kwargs["input"]["lesson"]))
        else:
            l = await sync_to_async(Lesson)(Lesson.objects.get(pk=kwargs["input"]["lesson"]["id"].node_id))

        user = info.context.request.user

        fh = await sync_to_async(list)(FacultiesHandling.objects.filter(
            subject=l.subject, course__active=True
        ))
        user = info.context.request.user
        for f in fh:
            if f.faculties.contains(user):
                return await resolver()
        raise DjangoNoPermission
