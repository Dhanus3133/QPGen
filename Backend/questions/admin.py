from django.contrib import admin
from django.db import models
from django.db.models.aggregates import Count
from django.utils.safestring import mark_safe
from import_export.admin import ImportExportModelAdmin
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
    list_display = (
        "name",
        "description",
    )


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
    list_display = (
        "branch",
        "branch_code",
        "programme",
        "degree",
    )
    list_filter = (
        "programme",
        "degree",
    )


@admin.register(Subject)
class SubjectModelAdmin(admin.ModelAdmin):
    list_display = (
        "subject_name",
        "code",
        "co",
        'courses_count',
        'users_count'
    )
    search_fields = ("subject_name", "code",)
    list_filter = ("co",)

    def users_count(self, obj):
        return FacultiesHandling.objects.filter(
            subject=obj, course__active=True
        ).aggregate(faculty_count=Count('faculties'))['faculty_count']

    def courses_count(self, obj):
        return Syllabus.objects.filter(lesson__subject=obj, course__active=True).distinct('course').count()


@admin.register(Lesson)
class LessonModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'subject', 'topics_count',)
    list_filter = ('subject',)
    filter_horizontal = ('outcome_btl',)
    search_fields = (
        'name',
        'subject__subject_name',
        'subject__code',
        'topics__name',
    )

    def topics_count(self, obj):
        return Topic.objects.filter(lesson=obj).count()


@admin.register(Topic)
class TopicModelAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "lesson",
        "questions_count",
        "active",
    )
    list_filter = (
        "lesson",
        "active",
    )
    search_fields = ("name",)

    def questions_count(self, obj):
        return Question.objects.filter(topics=obj).count()


@admin.register(Course)
class CourseModelAdmin(admin.ModelAdmin):
    list_display = (
        "semester",
        "regulation",
        "department",
        "active",
    )
    list_filter = (
        "active",
        "regulation",
        "semester",
        "department__programme",
        "department__degree",
        "department__branch",
    )
    list_display_links = (
        "semester",
        "department",
    )
    list_select_related = (
        "department__programme",
        "department__degree",
        "regulation"
    )


@admin.register(Syllabus)
class SyllabusModelAdmin(admin.ModelAdmin):
    list_filter = (
        "course",
        "lesson__subject",
    )
    list_display = (
        "course",
        "unit",
        "lesson",
    )
    raw_id_fields = ('course', 'lesson',)


@admin.register(MarkRange)
class MarkRangeModelAdmin(admin.ModelAdmin):
    list_display = (
        "__str__",
        "start",
        "end",
    )


@admin.register(FacultiesHandling)
class FacultiesHandlingModelAdmin(admin.ModelAdmin):
    filter_horizontal = ('faculties',)
    list_filter = ('course', 'subject',)
    list_display = ('course', 'subject', 'faculties_count')

    def faculties_count(self, obj):
        if obj.course.active:
            return obj.faculties.count()
        return 0


@admin.register(Question)
class QuestionModelAdmin(ImportExportModelAdmin):
    list_display = (
        'question',
        'subject_name',
        'subject_code',
        'start_mark',
        'end_mark',
        'priority',
    )
    list_filter = (
        "start_mark",
        "end_mark",
        "lesson__subject",
        ("lesson", admin.RelatedOnlyFieldListFilter),
        "priority",
        "scenario_based",
    )
    search_fields = (
        'question',
        'lesson__name',
        'lesson__subject__subject_name',
        'lesson__subject__code',
    )
    raw_id_fields = ("lesson",)
    filter_horizontal = ('topics', 'previous_years',)
    list_select_related = ('lesson__subject',)

    def subject_name(self, obj):
        return obj.lesson.subject.subject_name if obj.lesson else None

    def subject_code(self, obj):
        return obj.lesson.subject.code if obj.lesson else None


@admin.register(CreateSyllabus)
class CreateSyllabusModelAdmin(admin.ModelAdmin):
    list_display = (
        "faculty",
        "is_completed",
    )
    list_filter = ("is_completed",)
    filter_horizontal = ('syllabus',)


@admin.register(AnalysisBTL)
class AnalysisBTLModelAdmin(admin.ModelAdmin):
    list_display = ('analysis', 'btl', 'percentage',)
    list_filter = (
        'analysis__exam',
        'analysis__courses',
        'analysis__subject',
    )


class AnalysisBTLInline(admin.TabularInline):
    model = AnalysisBTL
    extra = 0


@admin.register(Analysis)
class AnalysisModelAdmin(admin.ModelAdmin):
    filter_horizontal = ('courses',)
    list_display = (
        'exam',
        'subject',
    )
    inlines = (AnalysisBTLInline,)


@admin.register(ExamMark)
class ExamMarkModelAdmin(admin.ModelAdmin):
    list_display = (
        'label',
        'exam',
        'active'
    )
    list_filter = ('active',)
    list_editable = ("active",)


class ExamMarkInline(admin.StackedInline):
    model = ExamMark
    extra = 0


@admin.register(Exam)
class ExamModelAdmin(admin.ModelAdmin):
    inlines = (ExamMarkInline,)
