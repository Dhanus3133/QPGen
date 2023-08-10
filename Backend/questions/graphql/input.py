from typing import List, Optional
from strawberry import auto
from strawberry_django.auth.queries import strawberry_django
from strawberry_django.fields.types import NodeInput
from questions.models import Lesson, Question, Subject, Syllabus


@strawberry_django.input(Syllabus)
class SyllabusInput:
    course: int
    unit: int
    lesson: int


@strawberry_django.input(Subject)
class SubjectInput:
    code: auto
    subject_name: auto
    co: auto


@strawberry_django.input(Lesson)
class LessonInput:
    name: auto
    subject: int
    objective: auto
    outcome: auto
    outcome_btl: List[int]


@strawberry_django.input(Question)
class QuestionInput:
    lesson: auto
    question: auto
    answer: auto
    mark: NodeInput
    btl: NodeInput
    difficulty: auto
    created_by: Optional[NodeInput]
    topics: auto
    previous_years: auto
    priority: auto
    scenario_based: auto


@strawberry_django.partial(Question)
class QuestionInputPartial(NodeInput, QuestionInput):
    pass
    # question: auto
    # answer: auto
    # mark: NodeInput
    # btl: NodeInput
    # difficulty: auto
    # topics: Optional[List[NodeInput]]
    # previous_years: Optional[List[NodeInput]]

