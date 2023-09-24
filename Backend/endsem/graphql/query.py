from strawberry.types import Info
import strawberry_django
from strawberry_django.filters import strawberry
from coe.graphql.permission import IsACOE
from endsem.graphql.permission import IsAEndSemFaculty


@strawberry.type
class Query:
    @strawberry_django.field(extensions=[IsAEndSemFaculty()])
    async def is_end_sem_faculty(self, info: Info) -> bool:
        return True
