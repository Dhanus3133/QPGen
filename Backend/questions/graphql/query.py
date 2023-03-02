from strawberry_django_plus.gql import relay
from typing import Iterable, List, Optional
from asgiref.sync import sync_to_async
from coe.graphql.permissions import IsACOE
from generate import Generate
import strawberry
from strawberry.scalars import JSON
from strawberry.types import Info
from strawberry_django_plus import gql
from strawberry_django_jwt.decorators import login_required
from core.utils import get_current_user_from_info
from questions.graphql.permissions import IsAFaculty

from questions.graphql.types import (
    BloomsTaxonomyLevelType,
    CourseType,
    FacultiesHandlingType,
    LessonType,
    MarkRangeType,
    PreviousYearsQPType,
    QuestionType,
    SubjectType,
    SyllabusType,
    TopicType,
)

from questions.models import (
    Course,
    CreateSyllabus,
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

    @gql.django.field(permission_classes=[IsACOE])
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

    @gql.django.field
    @login_required
    async def departments_access_to(self, info: Info) -> List[FacultiesHandlingType]:
        user = await get_current_user_from_info(info)
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
        search: str,
    ) -> List[QuestionType]:
        return Question.objects.filter(
            lesson__syllabuses__course__regulation__year=regulation,
            lesson__syllabuses__course__department__programme__name__iexact=programme,
            lesson__syllabuses__course__department__degree__name__iexact=degree,
            lesson__syllabuses__course__semester=semester,
            lesson__syllabuses__course__department__branch_code__iexact=department,
            lesson__syllabuses__lesson__subject__code=subject_code,
            lesson__syllabuses__unit=unit,
            question__icontains=search,
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

    @gql.django.field
    @login_required
    async def validate_create_syllabus(self, info: Info) -> bool:
        user = await get_current_user_from_info(info)
        if await CreateSyllabus.objects.filter(
            faculty=user, is_completed=False
        ).aexists():
            return True
        else:
            return False

    @gql.django.field
    @login_required
    async def get_all_subjects(self, info: Info) -> List[SubjectType]:
        return await sync_to_async(list)(Subject.objects.all())

    @gql.django.field
    @login_required
    async def get_lessons_by_subject_id(self, subject_id: int) -> List[LessonType]:
        return await sync_to_async(list)(Lesson.objects.filter(subject=subject_id))

    @gql.django.field(permission_classes=[IsACOE])
    async def faculties_handlings(
        self, info: Info, course: int, subject: int
    ) -> List[FacultiesHandlingType]:
        return await sync_to_async(list)(
            FacultiesHandling.objects.filter(course=course, subject=subject)
        )
