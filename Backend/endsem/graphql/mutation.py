from typing import List, Optional, cast
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
import strawberry
from strawberry.types import Info
from strawberry_django import mutations
from coe.graphql.permission import IsACOE
from endsem.graphql.input import EndSemQuestionInput, EndSemQuestionInputPartial
from endsem.graphql.permission import IsTheEndSemFaculty
from endsem.models import EndSemQuestion, EndSemSubject
from endsem.graphql.types import EndSemQuestionType
from questions.models import Subject
from users.graphql.types import UserType
from users.models import User


@strawberry.type
class Mutation:
    create_end_sem_question: EndSemQuestionType = mutations.create(
        EndSemQuestionInput,
        permission_classes=[IsTheEndSemFaculty],
        handle_django_errors=True
    )
    update_end_sem_question: EndSemQuestionType = mutations.update(
        EndSemQuestionInputPartial,
        permission_classes=[IsTheEndSemFaculty],
        handle_django_errors=True
    )

    @mutations.input_mutation(extensions=[IsACOE()], handle_django_errors=True)
    async def create_end_sem_subject(
        self,
        info: Info,
        subject: int,
        password: str,
        semester: int,
        marks: List[int],
        counts: List[int],
        choices: List[bool],
    ) -> UserType:
        sub = await Subject.objects.aget(id=subject)
        email = f'{sub.code.lower()}_endsem@citchennai.net'

        if await User.objects.filter(email=email).aexists():
            raise ValidationError(f'{email} already exists')

        user = await User.objects.acreate(
            first_name=sub.code,
            email=email,
            password=make_password(password)
        )
        endsem_subject = await EndSemSubject.objects.acreate(
            semester=semester,
            subject=sub,
            marks=marks,
            counts=counts,
            choices=choices,
        )
        await endsem_subject.faculties.aadd(user)

        questions = []
        q = 1

        for i, (mark, count, choice) in enumerate(zip(marks, counts, choices)):
            for _ in range(count):
                questions.append(EndSemQuestion(
                    subject=endsem_subject,
                    part=i + 1,
                    number=q,
                    roman=1,
                    option=1,
                    mark=mark,
                    question=f'Question {q}',
                ))
                if choice:
                    questions.append(EndSemQuestion(
                        subject=endsem_subject,
                        part=i + 1,
                        number=q,
                        roman=2,
                        option=1,
                        mark=mark,
                        question=f'Question {q}',
                    ))
                q += 1

        await EndSemQuestion.objects.abulk_create(questions)
        return user

    @mutations.input_mutation(permission_classes=[IsTheEndSemFaculty], handle_django_errors=True)
    def delete_end_sem_question(
        self,
        info: Info,
        id: int,
    ) -> Optional[EndSemQuestionType]:
        question = EndSemQuestion.objects.get(id=id)
        if EndSemQuestion.objects.filter(
            subject=question.subject.id,
            part=question.part,
            number=question.number,
            roman=question.roman,
        ).count() <= 1:
            raise ValidationError(
                'Cannot delete the last question'
            )
        else:
            question.delete()
        return cast(EndSemQuestionType, question)
