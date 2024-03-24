from concurrent.futures import wait
from typing import List, Optional, cast
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
import strawberry
from strawberry.types import Info
from strawberry_django import mutations
from strawberry_django.permissions import IsAuthenticated
from endsem.graphql.input import EndSemQuestionInput, EndSemQuestionInputPartial
from endsem.graphql.permission import IsTheEndSemFaculty
from endsem.models import EndSemQuestion, EndSemSubject
from endsem.graphql.types import EndSemQuestionType
from questions.generate import Generate
from questions.models import Regulation, Subject
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

    @mutations.input_mutation(extensions=[IsAuthenticated()], handle_django_errors=True)
    def create_end_sem_subject(
        self,
        info: Info,
        regulation: int,
        subject: int,
        password: str,
        semester: int,
        marks: List[int],
        counts: List[int],
        choices: List[bool],
        is_internal: bool,
        is_external: bool,
    ) -> UserType:
        if not info.context.request.user.is_superuser:
            raise ValidationError('No permission available')
        sub = Subject.objects.get(id=subject)
        reg = Regulation.objects.get(id=regulation)
        email = f'{sub.code.lower()}{reg.year}endsem{semester}@citchennai.net'
        lids = sub.lessons.order_by('id').values_list('id', flat=True)

        if is_external:
            if User.objects.filter(email=email).exists():
                raise ValidationError(f'{email} already exists')

            user = User.objects.create(
                first_name=sub.code,
                email=email,
                password=make_password(password)
            )
        else:
            user = info.context.request.user

        counts[0] = 16
        endsem_subject = EndSemSubject.objects.create(
            regulation=reg,
            semester=semester,
            subject=sub,
            marks=marks,
            counts=counts,
            choices=choices,
            is_internal=is_internal,
            is_external=is_external,
        )

        if is_external:
            endsem_subject.faculties.add(user)

        if is_internal:
            g = Generate(
                1,
                lids,
                marks,
                counts,
                choices,
                3,
                False,
                False,
                [],
                endsem_subject.id
            )
            g.generate_questions()
        if is_external:
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

            EndSemQuestion.objects.bulk_create(questions)

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
