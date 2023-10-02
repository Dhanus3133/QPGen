from typing import List
from strawberry.types import Info
import strawberry_django
from strawberry_django.filters import strawberry
from strawberry_django.permissions import IsAuthenticated
from strawberry_django.relay import sync_to_async
from endsem.graphql.permission import IsAEndSemFaculty, IsTheEndSemFaculty
from endsem.graphql.types import EndSemQuestionType, EndSemSubjectType
from endsem.models import EndSemQuestion, EndSemSubject


@strawberry.type
class Query:
    @strawberry_django.field(extensions=[IsAuthenticated()])
    async def is_end_sem_faculty(self, info: Info) -> bool:
        return info.context.request.user.is_superuser or await EndSemSubject.objects.filter(faculties=info.context.request.user).aexists()

    @strawberry_django.field(extensions=[IsAEndSemFaculty()])
    async def get_end_sem_subjects(self, info: Info) -> List[EndSemSubjectType]:
        if info.context.request.user.is_superuser:
            return await sync_to_async(list)(EndSemSubject.objects.all())
        return await sync_to_async(list)(EndSemSubject.objects.filter(faculties=info.context.request.user))

    @strawberry_django.field(permission_classes=[IsTheEndSemFaculty])
    async def end_sem_questions(self, info: Info, subject: str) -> List[EndSemQuestionType]:
        return await sync_to_async(list)(EndSemQuestion.objects.filter(subject__subject__code=subject))
