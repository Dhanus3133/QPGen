import strawberry
from strawberry import auto
from .models import Question
from typing import List


@strawberry.django.type(Question)
class Question:
    id: auto
    question: auto
