from django.core.management.base import BaseCommand
from django.utils import timezone
from questions.models import (
    BloomsTaxonomyLevel,
    Degree,
    Department,
    Exam,
    ExamMark,
    MarkRange,
    PreviousYearsQP,
    Programme,
    Regulation,
)


class Command(BaseCommand):
    help = "Initilize Basic data"

    def handle(self, *args, **options):
        try:
            Programme.objects.bulk_create(
                [
                    Programme(name="UG"),
                    Programme(name="PG"),
                ]
            )
        except:
            pass

        try:
            Degree.objects.bulk_create(
                [
                    Degree(name="BE", full_form="Bachelor of Engineering"),
                    Degree(name="ME", full_form="Master of Engineering"),
                    Degree(name="BTECH", full_form="Bachelor of Technology"),
                    Degree(name="MTECH", full_form="Master of Technology"),
                ]
            )
        except:
            pass

        try:
            MarkRange.objects.bulk_create(
                [
                    MarkRange(start=2, end=2),
                    MarkRange(start=3, end=4),
                    MarkRange(start=5, end=7),
                    MarkRange(start=8, end=9),
                    MarkRange(start=10, end=11),
                    MarkRange(start=12, end=13),
                    MarkRange(start=14, end=16),
                    MarkRange(start=20, end=25),
                ]
            )
        except:
            pass

        try:
            Regulation.objects.bulk_create(
                [
                    Regulation(year=2017),
                    Regulation(year=2021),
                ]
            )
        except:
            pass

        try:
            ug = Programme.objects.get(name="UG")
            pg = Programme.objects.get(name="PG")
            be = Degree.objects.get(name="BE")
            me = Degree.objects.get(name="ME")
            btech = Degree.objects.get(name="BTECH")
            Department.objects.bulk_create([
                Department(
                    programme=ug,
                    degree=be,
                    branch="Computer Science Engineering",
                    branch_code="CSE"
                ),
                Department(
                    programme=ug,
                    degree=btech,
                    branch="Artificial Intelligence and Data Science",
                    branch_code="AIDS"
                ),
                Department(
                    programme=ug,
                    degree=be,
                    branch="CSE Artificial Intelligence and Machine Learning",
                    branch_code="AM"
                ),
                Department(
                    programme=ug,
                    degree=be,
                    branch="Biomedical Engineering",
                    branch_code="BME"
                ),
                Department(
                    programme=ug,
                    degree=be,
                    branch="Civil Engineering",
                    branch_code="CIVIL"
                ),
                Department(
                    programme=ug,
                    degree=btech,
                    branch="Computer Science and Business Systems",
                    branch_code="CSBS"
                ),
                Department(
                    programme=ug,
                    degree=be,
                    branch="CSE Cybersecurity",
                    branch_code="CZ"
                ),
                Department(
                    programme=ug,
                    degree=be,
                    branch="Electronics and Communication Engineering ",
                    branch_code="ECE"
                ),
                Department(
                    programme=ug,
                    degree=be,
                    branch="Electrical and Electronics Engineering",
                    branch_code="EEE"
                ),
                Department(
                    programme=ug,
                    degree=btech,
                    branch="Information Technology",
                    branch_code="IT"
                ),
                Department(
                    programme=ug,
                    degree=be,
                    branch="Mechatronics Engineering",
                    branch_code="MCT"
                ),
                Department(
                    programme=ug,
                    degree=be,
                    branch="Mechanical Engineering",
                    branch_code="MECH"
                ),

                # PG

                Department(
                    programme=pg,
                    degree=me,
                    branch="Applied Electronics",
                    branch_code="AE"
                ),
                Department(
                    programme=pg,
                    degree=me,
                    branch="CAD/CAM",
                    branch_code="CC"
                ),
                Department(
                    programme=pg,
                    degree=me,
                    branch="Computer Science Engineering",
                    branch_code="CSE"
                ),
            ])
        except:
            pass

        try:
            BloomsTaxonomyLevel.objects.bulk_create(
                [
                    BloomsTaxonomyLevel(name="L1", description="Remembering"),
                    BloomsTaxonomyLevel(
                        name="L2", description="Understanding"
                    ),
                    BloomsTaxonomyLevel(name="L3", description="Applying"),
                    BloomsTaxonomyLevel(name="L4", description="Analysing"),
                    BloomsTaxonomyLevel(name="L5", description="Evaluating"),
                    BloomsTaxonomyLevel(name="L6", description="Creating"),
                ]
            )
        except:
            pass

        for year in range(2016, timezone.now().year):
            try:
                PreviousYearsQP.objects.bulk_create(
                    [
                        PreviousYearsQP(month="A/M", year=year),
                        PreviousYearsQP(month="N/D", year=year),
                    ]
                )
            except:
                pass

        try:
            Exam.objects.bulk_create(
                [
                    Exam(name="Internal Assessment 1"),
                    Exam(name="Internal Assessment 2"),
                    Exam(name="Model Exam"),
                ]
            )
        except:
            pass

        try:
            exams = Exam.objects.all()
            ExamMark.objects.bulk_create(
                [
                    ExamMark(
                        label="Internal Assessment 1",
                        exam=exams.get(name="Internal Assessment 1"),
                        total=50,
                        marks=[2, 12, 16],
                        counts=[5, 2, 1],
                        choices=[False, True, True],
                        units=[1],
                        order=1,
                        time="1.30",
                    ),
                    ExamMark(
                        label="Internal Assessment 2",
                        exam=exams.get(name="Internal Assessment 2"),
                        total=50,
                        marks=[2, 12, 16],
                        counts=[5, 2, 1],
                        choices=[False, True, True],
                        units=[2, 3],
                        order=2,
                        time="1.30",
                    ),
                    ExamMark(
                        label="Model Exam",
                        exam=exams.get(name="Model Exam"),
                        total=100,
                        marks=[2, 16],
                        counts=[10, 5],
                        choices=[False, True],
                        units=[1, 2, 3, 4, 5],
                        order=3,
                        time="3",
                    ),
                ]
            )
        except:
            pass

        self.stdout.write(self.style.SUCCESS(f"Basic Details Created!"))
