from django.contrib import auth
import strawberry_django
import strawberry
from typing import cast
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.utils.translation import gettext_lazy as _
from strawberry.types import Info
from users.graphql.types import UserType
from users.models import NewUser


@strawberry.type
class Mutation:
    @strawberry_django.mutation(handle_django_errors=True)
    def login(
        self,
        info: Info,
        email: str,
        password: str,
    ) -> UserType:
        request = info.context.request

        user = auth.authenticate(request, username=email, password=password)
        if user is None:
            raise ValidationError(_("Wrong credentials provided."))

        auth.login(request, user)
        return cast(UserType, user)

    @strawberry_django.mutation
    def logout(
        self,
        info: Info,
    ) -> bool:
        request = info.context.request
        ret = request.user.is_authenticated
        auth.logout(request)
        return ret

    @strawberry_django.field
    def create_new_user(self, info: Info, first_name: str, last_name: str, email: str, password: str) -> bool:
        user = NewUser(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password,
        )
        user.save()
        user.verify_email()
        return True

    @strawberry_django.field
    def verify_email_signup(self, info: Info, token: str) -> bool:
        try:
            user = NewUser.objects.get(email_secret=token)
        except ObjectDoesNotExist:
            return False
        user.email_secret = ""
        user.email_verified = True
        user.save()
        return True
