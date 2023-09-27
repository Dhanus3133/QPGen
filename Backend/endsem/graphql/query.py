from typing import List
from strawberry.types import Info
import strawberry_django
from strawberry_django.filters import strawberry
from strawberry_django.relay import sync_to_async
from coe.graphql.permission import IsACOE
from endsem.graphql.permission import IsAEndSemFaculty
from endsem.graphql.types import EndSemQuestionType
from endsem.models import EndSemQuestion


@strawberry.type
class Query:
    @strawberry_django.field(extensions=[IsAEndSemFaculty()])
    async def is_end_sem_faculty(self, info: Info) -> bool:
        return True

    @strawberry_django.field(extensions=[IsACOE()])
    async def end_sem_questions(self, info: Info, subject: str) -> List[EndSemQuestionType]:
        return await sync_to_async(list)(EndSemQuestion.objects.filter(subject__subject__code=subject))
