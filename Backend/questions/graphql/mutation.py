from typing import List, cast
from asgiref.sync import sync_to_async
from django.db import IntegrityError
import strawberry
from strawberry.types import Info
from strawberry_django import mutations
from strawberry_django.auth.queries import strawberry_django
from strawberry_django.permissions import IsAuthenticated
from coe.graphql.permission import IsACOE
from questions.graphql.input import LessonInput, QuestionInput, QuestionInputPartial, SubjectInput
from questions.graphql.permission import IsAFaculty

from questions.graphql.types import FacultiesHandlingType, LessonType, QuestionType, SubjectType, TopicType
from questions.models import Course, CreateSyllabus, FacultiesHandling, Lesson, Subject, Syllabus, Topic
from users.models import User


@strawberry.type
class Mutation:
    create_question: QuestionType = mutations.create(
        QuestionInput, permission_classes=[IsAFaculty]
    )
    update_question: QuestionType = mutations.update(
        QuestionInputPartial, permission_classes=[IsAFaculty]
    )
    create_subject: SubjectType = mutations.create(
        SubjectInput, extensions=[IsAuthenticated()], handle_django_errors=True
    )
    create_lesson: LessonType = mutations.create(
        LessonInput, extensions=[IsAuthenticated()], handle_django_errors=True
    )

    @mutations.input_mutation(permission_classes=[IsAFaculty])
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
        return cast(
            TopicType,
            await Topic.objects.acreate(
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

    @strawberry_django.field(extensions=[IsACOE()])
    async def assign_subject_to_faculties(
        self, info: Info, faculties: List[int]
    ) -> bool:
        objs = [
            CreateSyllabus(faculty=await User.objects.aget(id=faculty))
            for faculty in faculties
        ]
        await CreateSyllabus.objects.abulk_create(objs=objs)
        return True

    @strawberry_django.mutation(extensions=[IsAuthenticated()])
    async def create_syllabuses(
        self, info: Info, course: int, units: List[int], lessons: List[int]
    ) -> bool:
        c = await Course.objects.aget(id=course)
        cs = await CreateSyllabus.objects.filter(
            is_completed=False, faculty=info.context.request.user
        ).alast()
        if not cs:
            raise ValueError("You don't have the permisson!")
        objs = [
            Syllabus(
                course=c,
                unit=units[i],
                lesson=await Lesson.objects.aget(id=lessons[i])
            )
            for i in range(len(units))
        ]
        try:
            s = await Syllabus.objects.abulk_create(objs=objs)
        except IntegrityError as err:
            raise ValueError(
                "Syllabus with this Course and Lesson already exists."
            )
        cs.is_completed = True
        await cs.syllabus.aset(s)
        await cs.asave(update_fields=["is_completed"])

        fh, _ = await FacultiesHandling.objects.aget_or_create(
            course=c,
            subject=await Subject.objects.aget(lessons=lessons[0]),
        )
        await fh.faculties.aadd(info.context.request.user)
        return True

    @ strawberry_django.field(extensions=[IsACOE()])
    async def assign_faculties(
        self, info: Info, course: int, subject: int, faculties: List[int]
    ) -> bool:
        fh, created = await FacultiesHandling.objects.aget_or_create(
            course=await Course.objects.aget(id=course),
            subject=await Subject.objects.aget(id=subject),
        )
        f = await sync_to_async(User.objects.filter)(id__in=faculties)
        await fh.faculties.aset(f)
        return True

    @ strawberry_django.field(permission_classes=[IsAFaculty])
    async def update_topic(self, info: Info, topic: int, active: bool) -> bool:
        await Topic.objects.filter(id=topic).aupdate(active=active)
        return True
