from django.core.management.base import BaseCommand
from django.utils import timezone
from questions.models import (
    Department,
    FacultiesHandling,
    Lesson,
    Programme,
    Question,
    Syllabus,
)


class Command(BaseCommand):
    help = "Generate lesson Scenario Questions"

    def add_arguments(self, parser):
        parser.add_argument(
            "--programme",
            default='UG',
            type=str,
            help="Programme eg: UG / PG",
            required=True
        )
        parser.add_argument(
            "--min-count",
            default=2,
            type=int,
            help="Programme eg: UG / PG",
            required=True
        )
        parser.add_argument(
            "--units",
            default=2,
            type=str,
            help="Units seperated by comma eg: 1,2,3",
            required=True
        )

    def handle(self, *args, **options):
        data = {}
        depts = Department.objects.filter(
            programme=Programme.objects.get(name=options.get("programme"))
        )
        # depts = [depts[0]]
        print("Report for Scenario Questions")
        for dept in depts:
            print()
            print(f"## Department: {dept.branch_code} | {dept.branch}")
            syllabuses = Syllabus.objects.filter(
                course__active=True,
                unit__in=options.get("units").split(","),
                course__department=dept
            ).select_related("course", "lessons")
            semesters = syllabuses.values_list(
                "course__semester", flat=True
            ).distinct('course__semester')
            for semester in semesters:
                print()
                print(f"### Semester: {semester}")
                print()
                print()
                lessons = Lesson.objects.filter(
                    syllabuses__in=syllabuses.filter(
                        course__semester=semester
                    )
                ).distinct('id')
                for lesson in lessons:
                    count = Question.objects.filter(
                        lesson=lesson,
                        scenario_based=True,
                        start_mark__gte=14,
                        end_mark__lte=16
                    ).count()

                    if count < options.get("min_count"):
                        print(
                            f"{lesson.subject.code} | {lesson.subject.subject_name} | {lesson.name.strip()} | Count: {count}"
                        )

                        try:
                            fh = FacultiesHandling.objects.get(
                                course__active=True, course__department=dept, course__semester=semester, subject=lesson.subject
                            )

                            for faculty in fh.faculties.all():
                                print(
                                    f"Faculty: {faculty.first_name} {faculty.last_name} | {faculty.email}"
                                )

                            if fh.faculties.count() == 0:
                                print("No Faculty")

                            print()
                        except:
                            print("No Faculty")
                            print()
