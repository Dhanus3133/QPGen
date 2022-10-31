from django.contrib import admin
from django.db import models
from .models import *

from vditor.widgets import VditorWidget


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
    list_filter = ('start_mark', 'end_mark', 'lesson',)
    search_fields = ('question',)
    # pass
