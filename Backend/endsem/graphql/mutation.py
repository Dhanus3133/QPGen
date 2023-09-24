from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
import strawberry
from strawberry.types import Info
from strawberry_django import mutations

from coe.graphql.permission import IsACOE
from endsem.models import EndSemSubject
from questions.models import Subject
from users.graphql.types import UserType
from users.models import User


@strawberry.type
class Mutation:
    @mutations.input_mutation(extensions=[IsACOE()], handle_django_errors=True)
    async def create_user_for_subject(
        self,
        info: Info,
        subject: int,
        password: str
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

        return user
