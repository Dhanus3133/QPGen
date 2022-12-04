from typing import cast
from questions.models import Lesson, Topic
from strawberry.types import Info
from strawberry_django_plus import gql
from strawberry_django_jwt.decorators import login_required
from questions.graphql.inputs import QuestionInput, QuestionInputPartial
from questions.graphql.types import QuestionType, TopicType


@gql.type
class Mutation:
    create_question: QuestionType = gql.django.create_mutation(QuestionInput)
    update_question: QuestionType = gql.django.update_mutation(
        QuestionInputPartial
    )
    # create_question: QuestionType = gql.django.create_mutation(QuestionInput)

    @login_required
    @gql.django.input_mutation
    async def create_topic(self, info: Info, name: str, regulation: int, programme: str, degree: str, semester: int, department: str, subject_code: str, unit: int) -> TopicType:
        return await cast(
            TopicType,
            Topic.objects.acreate(
                name=name,
                lesson=await Lesson.objects.aget(
                    syllabuses__course__regulation__year=regulation,
                    syllabuses__course__department__programme__name__iexact=programme,
                    syllabuses__course__department__degree__name__iexact=degree,
                    syllabuses__course__semester=semester,
                    syllabuses__course__department__branch_code__iexact=department,
                    syllabuses__lesson__subject__code=subject_code,
                    syllabuses__unit=unit
                )
            )
        )
