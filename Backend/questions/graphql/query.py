import json
from typing import List, Optional
from asgiref.sync import sync_to_async
from strawberry.scalars import JSON
from strawberry.types import Info
import strawberry_django
from strawberry_django.filters import strawberry
from strawberry_django.permissions import IsAuthenticated, Iterable
from coe.graphql.permission import IsACOE
from questions.gate import generate_gate_questions
from questions.generate import Generate
from questions.graphql.permission import IsAFaculty
from questions.graphql.types import (
    AnalysisType,
    BloomsTaxonomyLevelType,
    CourseType,
    ExamMarkType,
    ExamType,
    FacultiesHandlingType,
    LessonType,
    MarkRangeType,
    PreviousYearsQPType,
    QuestionType,
    RegulationType,
    SubjectType,
    SyllabusType,
    TopicType,
)

from questions.models import (
    Analysis,
    Course,
    CreateSyllabus,
    Exam,
    ExamMark,
    FacultiesHandling,
    Lesson,
    Question,
    Subject,
    Syllabus,
    Topic,
)


@strawberry.type
class Query:
    question: Optional[QuestionType] = strawberry_django.field(
        permission_classes=[IsAFaculty]
    )
    regulations: List[RegulationType] = strawberry_django.field(
        extensions=[IsAuthenticated()]
    )
    mark_ranges: List[MarkRangeType] = strawberry_django.field(
        extensions=[IsAuthenticated()]
    )
    blooms_taxonomy_levels: List[BloomsTaxonomyLevelType] = strawberry_django.field(
        extensions=[IsAuthenticated()]
    )
    previous_years: List[PreviousYearsQPType] = strawberry_django.field(
        extensions=[IsAuthenticated()]
    )

    @strawberry_django.connection(strawberry_django.relay.ListConnectionWithTotalCount[QuestionType], permission_classes=[IsAFaculty])
    def question_contains_filter(self, question: str) -> Iterable[Question]:
        return Question.objects.filter(question__icontains=question)

    @strawberry_django.field(extensions=[IsAuthenticated()])
    async def get_subjects(
        self,
        info: Info,
        regulation: int,
        programme: str,
        degree: str,
        semester: int,
        department: str,
    ) -> List[FacultiesHandlingType]:
        user = info.context.request.user
        return await sync_to_async(list)(
            user.faculties.filter(
                course__regulation__year=regulation,
                course__department__programme__name__iexact=programme,
                course__department__degree__name__iexact=degree,
                course__semester=semester,
                course__department__branch_code__iexact=department,
            ).distinct("subject")
        )

    @strawberry_django.field(extensions=[IsACOE()])
    def generate_questions(
        self,
        info: Info,
        course: int,
        lids: List[int],
        marks: List[int],
        counts: List[int],
        choices: List[bool],
        exam: int,
        save_analysis: bool,
        use_ai: bool,
        avoid_question_ids: List[int],
    ) -> JSON:
        # lids = [3, 4]
        # lids = [1, 2]
        # marks = [2, 12, 16]
        # count = [5, 2, 1]
        # choices = [False, True, True]
        return Generate(course, lids, marks, counts, choices, exam, save_analysis, use_ai, avoid_question_ids).generate_questions()

    @strawberry_django.field(extensions=[IsAuthenticated()])
    async def departments_access_to(self, info: Info) -> List[FacultiesHandlingType]:
        user = info.context.request.user
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

    @strawberry_django.field(extensions=[IsAuthenticated()])
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

    @strawberry_django.connection(strawberry_django.relay.ListConnectionWithTotalCount[QuestionType], extensions=[IsAuthenticated()], permission_classes=[IsAFaculty])
    def get_questions(
        self,
        info: Info,
        regulation: int,
        programme: str, degree: str,
        semester: int,
        department: str,
        subject_code: str,
        unit: int,
        search: str,
    ) -> Iterable[Question]:
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

    @strawberry_django.field(extensions=[IsAuthenticated()])
    async def get_courses(self) -> List[CourseType]:
        return await sync_to_async(list)(Course.objects.filter(active=True))

    @strawberry_django.field(extensions=[IsAuthenticated()])
    async def get_subjects_by_id(self, course_id: int) -> List[SubjectType]:
        return await sync_to_async(list)(
            Subject.objects.filter(lessons__syllabuses__course__id=course_id).distinct(
                "lessons__subject"
            )
        )

    @strawberry_django.field(extensions=[IsAuthenticated()])
    async def get_lessons_by_id(
        self, subject_id: int
    ) -> List[SyllabusType]:
        return await sync_to_async(list)(
            Syllabus.objects.filter(
                lesson__subject=subject_id
            ).order_by("lesson", "unit").distinct("lesson")
        )

    # @strawberry_django.field()
    @strawberry_django.field(permission_classes=[IsAFaculty])
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

    @strawberry_django.field(extensions=[IsAuthenticated()])
    async def validate_create_syllabus(self, info: Info) -> bool:
        user = info.context.request.user
        if await CreateSyllabus.objects.filter(
            faculty=user, is_completed=False
        ).aexists():
            return True
        else:
            return False

    @strawberry_django.field(extensions=[IsAuthenticated()])
    async def get_all_subjects(self, info: Info) -> List[SubjectType]:
        return await sync_to_async(list)(Subject.objects.all())

    @strawberry_django.field(extensions=[IsAuthenticated()])
    async def get_lessons_by_subject_id(self, subject_id: int) -> List[LessonType]:
        return await sync_to_async(list)(Lesson.objects.filter(subject=subject_id))

    @strawberry_django.field(extensions=[IsACOE()])
    async def faculties_handlings(
        self, info: Info, course: int, subject: int
    ) -> List[FacultiesHandlingType]:
        return await sync_to_async(list)(
            FacultiesHandling.objects.filter(course=course, subject=subject)
        )

    @strawberry_django.field(extensions=[IsACOE()])
    async def exams(self, info: Info) -> Optional[List[ExamType]]:
        return await sync_to_async(list)(Exam.objects.all())

    @strawberry_django.field(extensions=[IsACOE()])
    async def exam_marks(self, info: Info) -> Optional[List[ExamMarkType]]:
        return await sync_to_async(list)(ExamMark.objects.filter(active=True))

    @strawberry_django.field(extensions=[IsACOE()])
    async def analysis(self, info: Info, exam: str) -> Optional[List[AnalysisType]]:
        return await sync_to_async(list)(Analysis.objects.filter(courses__active=True, exam=exam))

    @strawberry_django.field(extensions=[IsACOE()])
    def generate_questions_gate(
        self,
        info: Info,
        course: int,
        lids: List[List[int]],
        marks: List[List[int]],
        counts: List[List[int]],
        choices: List[List[bool]],
        exam: int,
        use_ai: bool,
        avoid_question_ids: List[int],
    ) -> JSON:
        return generate_gate_questions(course, lids, marks, counts, choices, exam, use_ai, avoid_question_ids)
        # data = {}
        # options = {}
        # data_sets = []
        # for i in range(len(lids)):
        #     qD = Generate(
        #         course, lids, marks, counts, choices, exam, False, use_ai, avoid_question_ids, None, True
        #     ).generate_questions()
        #     if isinstance(qD, dict):
        #         if i == 0 and 'options' in qD:
        #             options = qD.get('options')
        #         questions = qD.get('questions')
        #
        # questionsData = {
        #     "questions": data,
        #     "options": options,
        #     "analytics": {"co": 0, "btl": 0}
        # }
        # return json.dumps(questionsData)
