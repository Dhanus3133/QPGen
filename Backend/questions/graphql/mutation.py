from typing import List, cast
from django.db.utils import IntegrityError
from strawberry_django_plus.permissions import IsAuthenticated
from coe.graphql.permissions import IsACOE

from questions.graphql.permissions import IsAFaculty
from questions.models import (
    Course,
    CreateSyllabus,
    FacultiesHandling,
    Lesson,
    Subject,
    Topic,
    Syllabus,
)
from strawberry.types import Info
from strawberry_django_plus import gql
from strawberry_django_jwt.decorators import login_required
from questions.graphql.inputs import (
    LessonInput,
    QuestionInput,
    QuestionInputPartial,
    SubjectInput,
)
from questions.graphql.types import (
    LessonType,
    QuestionType,
    SubjectType,
    TopicType,
)
from users.models import User


@gql.type
class Mutation:
    create_question: QuestionType = gql.django.create_mutation(
        QuestionInput, permission_classes=[IsAFaculty]
    )
    update_question: QuestionType = gql.django.update_mutation(
        QuestionInputPartial, permission_classes=[IsAFaculty]
    )
    create_subject: SubjectType = gql.django.create_mutation(
        SubjectInput, directives=[IsAuthenticated]
    )
    create_lesson: LessonType = gql.django.create_mutation(
        LessonInput, directives=[IsAuthenticated]
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

    @gql.django.field(permission_classes=[IsACOE])
    async def assign_subject_to_faculties(
        self, info: Info, faculties: List[int]
    ) -> bool:
        objs = [
            CreateSyllabus(faculty=await User.objects.aget(id=faculty))
            for faculty in faculties
        ]
        await CreateSyllabus.objects.abulk_create(objs=objs)
        return True

    @login_required
    @gql.django.field
    def create_syllabuses(
        self, info: Info, course: int, units: List[int], lessons: List[int]
    ) -> bool:
        c = Course.objects.get(id=course)
        cs = CreateSyllabus.objects.filter(
            is_completed=False, faculty=info.context.request.user
        ).first()
        if not cs:
            return ValueError("You don't have the permisson!")
        objs = [
            Syllabus(course=c, unit=units[i],
                     lesson=Lesson.objects.get(id=lessons[i]))
            for i in range(len(units))
        ]
        try:
            s = Syllabus.objects.bulk_create(objs=objs)
        except IntegrityError as err:
            raise ValueError(
                "Syllabus with this Course and Lesson already exists."
            )
        cs.is_completed = True
        cs.syllabus.set(s)
        cs.save(update_fields=["is_completed"])

        fh, created = FacultiesHandling.objects.get_or_create(
            course=c,
            subject=Lesson.objects.get(id=lessons[0]).subject,
        )
        fh.faculties.add(info.context.request.user)

        return True

    @gql.django.field(permission_classes=[IsACOE])
    def assign_faculties(
        self, info: Info, course: int, subject: int, faculties: List[int]
    ) -> bool:
        fh, created = FacultiesHandling.objects.get_or_create(
            course=Course.objects.get(id=course),
            subject=Subject.objects.get(id=subject),
        )
        f = User.objects.filter(id__in=faculties)
        fh.faculties.set(f)
        return True

    @login_required
    @gql.django.field(permission_classes=[IsAFaculty])
    async def update_topic(self, info: Info, topic: int, active: bool) -> bool:
        await Topic.objects.filter(id=topic).aupdate(active=active)
        return True
