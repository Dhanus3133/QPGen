from typing import List, Optional
from strawberry_django_plus import gql

from questions.models import FacultiesHandling, Lesson, Question, Subject, Syllabus


@gql.django.input(Syllabus)
class SyllabusInput:
    course: int
    unit: int
    lesson: int


@gql.django.input(Subject)
class SubjectInput:
    code: gql.auto
    subject_name: gql.auto
    co: gql.auto


@gql.django.input(Lesson)
class LessonInput:
    name: gql.auto
    subject: int
    objective: gql.auto
    outcome: gql.auto
    outcome_btl: List[int]


@gql.django.input(Question)
class QuestionInput:
    lesson: gql.auto
    question: gql.auto
    answer: gql.auto
    mark: gql.NodeInput
    btl: gql.NodeInput
    difficulty: gql.auto
    created_by: Optional[gql.NodeInput]
    topics: gql.auto
    previous_years: gql.auto
    priority: gql.auto
    scenario_based: gql.auto


@gql.django.partial(Question)
class QuestionInputPartial(gql.NodeInput, QuestionInput):
    pass
    # question: gql.auto
    # answer: gql.auto
    # mark: gql.NodeInput
    # btl: gql.NodeInput
    # difficulty: gql.auto
    # topics: Optional[List[gql.NodeInput]]
    # previous_years: Optional[List[gql.NodeInput]]
