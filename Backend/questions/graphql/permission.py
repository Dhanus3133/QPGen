from typing import Any
from asgiref.sync import sync_to_async
from strawberry.permission import BasePermission
from strawberry.types import Info

from questions.models import FacultiesHandling, Lesson, Subject


class IsAFaculty(BasePermission):
    message = "User is not a faculty for this Subject"

    @sync_to_async
    def has_permission(self, source: Any, info: Info, **kwargs) -> bool:
        if not info.context.request.user.is_authenticated:
            return False

        s = None

        if "pk" in kwargs:
            s = Lesson.objects.get(questions=kwargs["pk"]).subject
        elif "subjectCode" in kwargs:
            s = Subject.objects.get(code=kwargs["subjectCode"])
        elif "topic" in kwargs:
            s = Subject.objects.get(lessons__topics__id=kwargs["topic"])
        elif "data" in kwargs:
            if "lesson" in kwargs["data"]:
                s = Subject.objects.get(lessons__id=kwargs["data"]["lesson"])
            elif "id" in kwargs["data"]:
                s = Lesson.objects.get(questions=kwargs["data"]["id"]).subject
        elif "input" in kwargs:
            if "lesson" in kwargs["input"]:
                s = Subject.objects.get(lessons__id=kwargs["input"]["lesson"])

        if s is None:
            return False

        user = info.context.request.user

        fh = FacultiesHandling.objects.filter(
            subject=s, course__active=True
        )
        for f in fh:
            if f.faculties.contains(user):
                return True
        return False
