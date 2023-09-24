from django.contrib import admin
from .models import *


@admin.register(EndSemSubject)
class EndSemSubjectModelAdmin(admin.ModelAdmin):
    list_filter = ("subject",)
    list_display = (
        "subject",
    )
    search_fields = (
        "subject",
    )
    filter_horizontal = ('faculties',)
    raw_id_fields = ('subject',)


@admin.register(EndSemQuestion)
class EndSemQuestionModelAdmin(admin.ModelAdmin):
    list_filter = ("subject",)
    list_display = (
        "question",
        "subject",
        "mark",
    )
    search_fields = (
        "subject",
        "question",
    )
    raw_id_fields = ('subject',)
