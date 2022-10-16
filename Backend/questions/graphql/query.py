import strawberry
from strawberry.scalars import JSON
from strawberry.types import Info
from strawberry_django_plus import gql

# from generate import generate_questions
# from .types import HelloType

@strawberry.type
class HelloType:
    hello: str
    name: str
    age: int

class HelloValue:
    hello = "Hello Sir"
    name = "Dhanus"
    age = 18


@gql.type
class Query:
    @gql.django.field
    async def hello(self, info: Info) -> JSON:
        lids = [3, 4]
        marks = [2, 12, 16]
        count = [5, 2, 1]
        choices = [False, True, True]
        # return generate_questions(lids, marks, count, choices)

        return {"hello":"COme on"}
