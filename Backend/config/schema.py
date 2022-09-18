import strawberry
from questions.types import Question
from typing import List


@strawberry.type
class Query:
    questions: List[Question] = strawberry.django.field()

schema = strawberry.Schema(query=Query)
