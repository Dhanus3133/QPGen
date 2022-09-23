from strawberry_django_plus import gql
from typing import List
from questions.models import Question


@gql.django.type(Question)
class Question(gql.Node):
    id: gql.auto
    question: str
    answer: str
