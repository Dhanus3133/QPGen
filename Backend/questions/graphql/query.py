from base64 import b64decode
from django.contrib.auth import login
from django.contrib.auth.hashers import base64
from strawberry_django_plus.gql import relay
from typing import Any, Iterable, List, Optional
from asgiref.sync import sync_to_async
from generate import Generate
import strawberry
from strawberry.scalars import ID, JSON, Base16
from strawberry.types import Info
from strawberry_django.auth.queries import resolve_current_user
from strawberry_django_plus import gql
from strawberry_django_jwt.decorators import login_required
from core.utils import (
    decode_id_from_gql_id,
    get_current_user_from_info,
    get_lazy_query_set_as_list,
)

from questions.graphql.types import (
    BloomsTaxonomyLevelType,
    CourseType,
    FacultiesHandlingType,
    MarkRangeType,
    PreviousYearsQPType,
    QuestionType,
    SubjectType,
    SyllabusType,
    LessonType,
    TopicType,
)
from strawberry.django import auth

from questions.models import (
    Course,
    FacultiesHandling,
    Lesson,
    Question,
    Subject,
    Syllabus,
    Topic,
)


@strawberry.type
class HelloType:
    hello: JSON
    name: str
    age: int


@gql.type
class Query:
    question: Optional[QuestionType] = relay.node()
    questions: relay.Connection[QuestionType] = login_required(relay.connection())
    subjects: List[SubjectType] = login_required(gql.django.field())
    syllabuses: List[SyllabusType] = login_required(gql.django.field())
    mark_ranges: List[MarkRangeType] = login_required(gql.django.field())
    blooms_taxonomy_levels: List[BloomsTaxonomyLevelType] = login_required(
        gql.django.field()
    )
    previous_years: List[PreviousYearsQPType] = login_required(gql.django.field())

    @relay.connection
    def question_contains_filter(self, question: str) -> Iterable[QuestionType]:
        return Question.objects.filter(question__icontains=question)

    @gql.django.field
    @login_required
    async def get_subjects(
        self,
        info: Info,
        regulation: int,
        programme: str,
        degree: str,
        semester: int,
        department: str,
    ) -> List[FacultiesHandlingType]:
        user = await get_current_user_from_info(info)
        return await sync_to_async(list)(
            user.faculties.filter(
                course__regulation__year=regulation,
                course__department__programme__name__iexact=programme,
                course__department__degree__name__iexact=degree,
                course__semester=semester,
                course__department__branch_code__iexact=department,
            ).distinct("subject")
        )

        # return Syllabus.objects.filter(
        #     course__regulation__year=regulation,
        #     course__department__programme__name=programme,
        #     course__department__degree__name=degree,
        # ).distinct('lesson__subject')

    @gql.django.field
    @login_required
    def generate_questions(
        self,
        info: Info,
        course: int,
        lids: List[int],
        marks: List[int],
        counts: List[int],
        choices: List[bool],
    ) -> JSON:
        # lids = [3, 4]
        # lids = [1, 2]
        # marks = [2, 12, 16]
        # count = [5, 2, 1]
        # choices = [False, True, True]
        return Generate(course, lids, marks, counts, choices).generate_questions()
        # return {"hello": "COme on"}

    @gql.django.field
    @login_required
    async def departments_access_to(self, info: Info) -> List[FacultiesHandlingType]:
        user = await get_current_user_from_info(info)
        # return await sync_to_async(list)(user.faculties.filter(course__active=True).prefetch_related('course', 'subject'))
        return await sync_to_async(list)(
            user.faculties.filter(course__active=True)
            .select_related(
                "course__regulation",
                "course__department",
                "course__department__programme",
                "course__department__degree",
            )
            .distinct("course__regulation", "course__department", "course__semester")
        )

    @gql.django.field
    @login_required
    async def get_lessons(
        self,
        info: Info,
        regulation: int,
        programme: str,
        degree: str,
        semester: int,
        department: str,
        subject_code: str,
    ) -> List[SyllabusType]:
        user = await get_current_user_from_info(info)
        # return await sync_to_async(list)(user.faculties.filter(course__active=True).prefetch_related('course', 'subject'))
        return await sync_to_async(list)(
            Syllabus.objects.filter(
                course__regulation__year=regulation,
                course__department__programme__name__iexact=programme,
                course__department__degree__name__iexact=degree,
                course__semester=semester,
                course__department__branch_code__iexact=department,
                lesson__subject__code=subject_code,
            ).order_by("unit")
        )
        # user.faculties.filter(course__active=True).select_related('course__regulation', 'course__department', 'course__department__programme', 'course__department__degree').distinct('course__regulation', 'course__department', 'course__semester'))

    @relay.connection()
    @login_required
    def get_questions(
        self,
        info: Info,
        regulation: int,
        programme: str,
        degree: str,
        semester: int,
        department: str,
        subject_code: str,
        unit: int,
    ) -> List[QuestionType]:
        return Question.objects.filter(
            lesson__syllabuses__course__regulation__year=regulation,
            lesson__syllabuses__course__department__programme__name__iexact=programme,
            lesson__syllabuses__course__department__degree__name__iexact=degree,
            lesson__syllabuses__course__semester=semester,
            lesson__syllabuses__course__department__branch_code__iexact=department,
            lesson__syllabuses__lesson__subject__code=subject_code,
            lesson__syllabuses__unit=unit,
        ).order_by("-updated_at", "-created_at")

    @gql.django.field
    @login_required
    # def get_courses(self, lessons: List[int]) -> List[CourseType]:
    #     print(lessons)
    async def get_courses(self) -> List[CourseType]:
        return await sync_to_async(list)(Course.objects.filter(active=True))

    @gql.django.field
    @login_required
    async def get_subjects_by_id(self, course_id: int) -> List[SubjectType]:
        return await sync_to_async(list)(
            Subject.objects.filter(lessons__syllabuses__course__id=course_id).distinct(
                "lessons__subject"
            )
        )

    @gql.django.field
    @login_required
    async def get_lessons_by_id(
        self, course_id: int, subject_id: int
    ) -> List[SyllabusType]:
        return await sync_to_async(list)(
            Syllabus.objects.filter(
                course=course_id, lesson__subject=subject_id
            ).order_by("unit")
        )

    # @gql.django.field
    # @login_required
    # async def get_question(self, id: int) -> QuestionType:
    #     return await sync_to_async(Question.objects.get)(pk=id)

    @gql.django.field
    @login_required
    async def get_topics(
        self,
        info: Info,
        regulation: int,
        programme: str,
        degree: str,
        semester: int,
        department: str,
        subject_code: str,
        unit: int,
    ) -> List[TopicType]:
        return await sync_to_async(list)(
            Topic.objects.filter(
                lesson__syllabuses__course__regulation__year=regulation,
                lesson__syllabuses__course__department__programme__name__iexact=programme,
                lesson__syllabuses__course__department__degree__name__iexact=degree,
                lesson__syllabuses__course__semester=semester,
                lesson__syllabuses__course__department__branch_code__iexact=department,
                lesson__syllabuses__lesson__subject__code=subject_code,
                lesson__syllabuses__unit=unit,
            ).order_by("name")
        )
