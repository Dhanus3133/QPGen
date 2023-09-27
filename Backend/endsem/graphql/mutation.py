from typing import List
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
import strawberry
from strawberry.types import Info
from strawberry_django import mutations

from coe.graphql.permission import IsACOE
from endsem.models import EndSemQuestion, EndSemSubject
from questions.models import Subject
from users.graphql.types import UserType
from users.models import User


@strawberry.type
class Mutation:
    @mutations.input_mutation(extensions=[IsACOE()], handle_django_errors=True)
    async def create_end_sem_subject(
        self,
        info: Info,
        subject: int,
        password: str,
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
            subject=sub,
        )
        await endsem_subject.faculties.aadd(user)

        questions = []
        q = 1

        for i, (mark, count, choice) in enumerate(zip(marks, counts, choices)):
            for num in range(count):
                questions.append(EndSemQuestion(
                    subject=endsem_subject,
                    part=i + 1,
                    number=q,
                    roman=1,
                    mark=mark,
                    question=f'Question {q}',
                ))
                if choice:
                    questions.append(EndSemQuestion(
                        subject=endsem_subject,
                        part=i + 1,
                        number=q,
                        roman=2,
                        mark=mark,
                        question=f'Question {q}',
                    ))
                q += 1

        await EndSemQuestion.objects.abulk_create(questions)
        return user
