from os import walk
from typing import List, cast

from strawberry_django_plus.relay import GlobalID
from questions.graphql.permissions import IsAFaculty
from questions.models import CreateSubject, Lesson, Topic
from strawberry.types import Info
from strawberry_django_plus import gql
from strawberry_django_jwt.decorators import login_required
from questions.graphql.inputs import QuestionInput, QuestionInputPartial
from questions.graphql.types import QuestionType, TopicType
from users.models import User


@gql.type
class Mutation:
    create_question: QuestionType = gql.django.create_mutation(
        QuestionInput, permission_classes=[IsAFaculty]
    )
    update_question: QuestionType = gql.django.update_mutation(
        QuestionInputPartial, permission_classes=[IsAFaculty]
    )

    @login_required
    @gql.django.input_mutation(permission_classes=[IsAFaculty])
    async def create_topic(
        self,
        info: Info,
        lesson: int,
        name: str,
        regulation: int,
        programme: str,
        degree: str,
        semester: int,
        department: str,
        subject_code: str,
        unit: int,
    ) -> TopicType:
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
                    syllabuses__unit=unit,
                ),
            ),
        )


    @gql.django.field
    async def assign_subject_to_faculties(
        self, info: Info, faculties: List[int]
    ) -> bool:
        for faculty in faculties:
            cs = await CreateSubject.objects.acreate(
                faculty=await User.objects.aget(id=faculty)
            )
            await cs.send_token_email()
        return True
