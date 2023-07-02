import uuid
from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.contrib.auth.base_user import BaseUserManager
from django.apps import apps
from django.contrib.auth.hashers import make_password
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.fields import validators
from django.utils.translation import gettext_lazy as _
from django.utils.html import strip_tags
from django.template.loader import render_to_string

from core.models import TimeStampedModel


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """
        Create and save a user with the given email, and password.
        """
        # if not username:
        #     raise ValueError("The given username must be set")
        email = self.normalize_email(email)
        # Lookup the real model class from the global app registry so this
        # manager method can be used in migrations. This is fine because
        # managers are by definition working on the real model.
        GlobalUserModel = apps.get_model(
            self.model._meta.app_label, self.model._meta.object_name
        )
        user = self.model(email=email, **extra_fields)
        user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)

    # objects = UserManager()


class User(AbstractUser):
    email = models.EmailField(_("Email Address"), unique=True)
    username = None
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    objects = UserManager()


def validate_email(email):
    if User.objects.filter(email=email).exists():
        raise ValidationError("User with this email already exists!")
    if email.split("@")[-1] != "citchennai.net":
        raise ValidationError("Not an Valid Email!")


class NewUser(TimeStampedModel):
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.EmailField(max_length=150, validators=[validate_email], unique=True)
    password = models.TextField(max_length=150)
    email_verified = models.BooleanField(default=False)
    email_secret = models.CharField(
        max_length=120, default="", blank=True, editable=False
    )
    approved = models.BooleanField(default=False)

    def verify_email(self):
        if self.email_verified is False:
            secret = uuid.uuid4().hex[:30]
            self.email_secret = secret
            html_message = render_to_string(
                "emails/verify_email.html",
                context={
                    "domain": settings.DOMAIN,
                    "secret": secret,
                    "name": f"{self.first_name} {self.last_name}",
                },
            )
            send_mail(
                "Verify your Account!",
                strip_tags(html_message),
                "CIT COE",
                [self.email],
                fail_silently=False,
                html_message=html_message,
            )
            self.save()
        return

    def save(self, *args, **kwargs):
        self.full_clean()
        if not self.id:
            try:
                validate_password(self.password, self)
            except ValidationError as err:
                raise ValidationError({"password": err})
            self.password = make_password(self.password)
        if self.approved:
            if self.email_verified:
                User.objects.create(
                    first_name=self.first_name,
                    last_name=self.last_name,
                    email=self.email,
                    password=self.password,
                )
                self.delete()
                return
            else:
                self.approved = False
                # raise ValidationError("User didn't yet verifed the Email!")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email
