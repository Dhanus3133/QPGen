from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import *


@admin.register(EndSemSubject)
class EndSemSubjectModelAdmin(admin.ModelAdmin):
    list_filter = ("subject",)
    list_display = (
        "subject",
        "semester",
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
    list_display_links = (
        "question",
        "subject",
    )
    raw_id_fields = ('subject',)


@admin.register(EndSemImage)
class EndSemImageModelAdmin(admin.ModelAdmin):
    list_display = (
        "__str__",
        "uploaded_at",
        "get_thumbnail",
    )

    def get_thumbnail(self, obj):
        return mark_safe(f'<img width="50px" src="{obj.photo.url}"')

    get_thumbnail.short_description = "Thumbnail"
