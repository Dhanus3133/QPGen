from typing import Optional
from strawberry import ID
import strawberry_django
from endsem.models import EndSemQuestion


@strawberry_django.input(EndSemQuestion)
class EndSemQuestionInput:
    subject: ID
    part: int
    number: int
    roman: int
    option: int
    question: str
    answer: Optional[str]
    mark: int


@strawberry_django.partial(EndSemQuestion)
class EndSemQuestionInputPartial:
    id: ID
    option: Optional[int]
    question: Optional[str]
    answer: Optional[str]
    mark: Optional[int]
