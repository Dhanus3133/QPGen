from django.contrib import admin
from django.db import models
from django.utils.safestring import mark_safe
from .models import *


@admin.register(Image)
class ImageModelAdmin(admin.ModelAdmin):
    list_display = (
        "__str__",
        "uploaded_at",
        "get_thumbnail",
    )

    def get_thumbnail(self, obj):
        return mark_safe(f'<img width="50px" src="{obj.photo.url}"')

    get_thumbnail.short_description = "Thumbnail"


@admin.register(BloomsTaxonomyLevel)
class BloomsTaxonomyLevelModelAdmin(admin.ModelAdmin):
    pass


@admin.register(PreviousYearsQP)
class PreviousYearsQPModelAdmin(admin.ModelAdmin):
    pass


@admin.register(Programme)
class ProgrammeModelAdmin(admin.ModelAdmin):
    pass


@admin.register(Degree)
class DegreeModelAdmin(admin.ModelAdmin):
    pass


@admin.register(Regulation)
class RegulationModelAdmin(admin.ModelAdmin):
    pass


@admin.register(Department)
class DepartmentModelAdmin(admin.ModelAdmin):
    pass


@admin.register(Subject)
class SubjectModelAdmin(admin.ModelAdmin):
    pass


@admin.register(Lesson)
class LessonModelAdmin(admin.ModelAdmin):
    pass


@admin.register(Topic)
class TopicModelAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "lesson",
        "active",
    )
    list_filter = (
        "lesson",
        "active",
    )
    search_fields = ("name",)


@admin.register(Course)
class CourseModelAdmin(admin.ModelAdmin):
    pass


@admin.register(Syllabus)
class SyllabusModelAdmin(admin.ModelAdmin):
    pass


@admin.register(MarkRange)
class MarkRangeModelAdmin(admin.ModelAdmin):
    pass


@admin.register(FacultiesHandling)
class FacultiesHandlingModelAdmin(admin.ModelAdmin):
    pass


@admin.register(Question)
class QuestionModelAdmin(admin.ModelAdmin):
    # formfield_overrides = {
    #     models.TextField: {'widget': VditorWidget}
    # }
    list_filter = (
        "start_mark",
        "end_mark",
        "lesson",
    )
    search_fields = ("question",)
    raw_id_fields = ("lesson",)
    # pass

    def save_model(self, request, obj, form, change):
        obj.created_by = request.user
        obj.save()


@admin.register(CreateSyllabus)
class CreateSyllabusModelAdmin(admin.ModelAdmin):
    list_display = (
        "faculty",
        "is_completed",
    )
    list_filter = ("is_completed",)
