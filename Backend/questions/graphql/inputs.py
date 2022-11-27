from typing import List, Optional
from strawberry_django_plus import gql

from questions.models import Lesson, Question, Subject


@gql.django.input(Subject)
class SubjectInput:
    code: gql.auto
    subject_name: gql.auto
    co: gql.auto
    co_description: gql.auto
    course_outcome: gql.auto


@gql.django.input(Lesson)
class LessonInput:
    name: gql.auto
    subject: gql.NodeInput


@gql.django.input(Question)
class QuestionInput:
    lesson: gql.NodeInput
    question: gql.auto
    answer: gql.auto
    mark: gql.NodeInput
    start_mark: gql.auto
    end_mark: gql.auto
    btl: gql.NodeInput
    difficulty: gql.auto
    created_by: gql.NodeInput
    previous_years: Optional[List[gql.NodeInput]]
    created_at: gql.auto


# @gql.django.input(Question)
# class QuestionInput:
#     question: gql.auto
#     answer: gql.auto
#     mark: gql.NodeInput
#     start_mark: gql.auto
#     end_mark: gql.auto
#     btl: gql.NodeInput
#     difficulty: gql.auto
#     updated_by: UserType
#     previous_years: Optional[List[gql.NodeInput]]
#     updated_at: gql.auto
