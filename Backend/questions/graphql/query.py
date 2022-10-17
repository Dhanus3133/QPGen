from typing import List
import strawberry
from strawberry.scalars import JSON
from strawberry.types import Info
from strawberry_django_plus import gql
from django.contrib.auth.decorators import login_required

from questions.graphql.types import QuestionType

# from generate import generate_questions
# from .types import HelloType


@strawberry.type
class HelloType:
    hello: JSON
    name: str
    age: int


@gql.type
class Query:
    questions: List[QuestionType] = gql.django.field()
    @gql.django.field
    async def hello(self, info: Info) -> JSON:
        lids = [3, 4]
        marks = [2, 12, 16]
        count = [5, 2, 1]
        choices = [False, True, True]
        # return generate_questions(lids, marks, count, choices)
        return {"hello": "COme on"}
    
    # @login_required
    # @gql.django.field
    # def 
