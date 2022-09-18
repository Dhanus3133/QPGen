from django.core.management.base import BaseCommand
from django.utils import timezone
from questions.models import BloomsTaxonomyLevel, Course, Degree, Department, Lesson, MarkRange, PreviousYearsQP, Programme, Regulation, Subject, Syllabus
from users.models import User

class Command(BaseCommand):
    help = "Initilize Basic data"

    def handle(self, *args, **options):
        try:
            Programme.objects.bulk_create([
                Programme(name='UG'),
                Programme(name='PG'),
            ])
        except:
            pass

        try:
            Degree.objects.bulk_create([
                Degree(name='BE', full_form='Bachelor of Engineering'),
                Degree(name='BTECH', full_form='Bachelor of Technology'),
            ])
        except:
            pass

        try:
            MarkRange.objects.bulk_create([
                MarkRange(start=2, end=2),
                MarkRange(start=3, end=4),
                MarkRange(start=5, end=7),
                MarkRange(start=8, end=9),
                MarkRange(start=10, end=11),
                MarkRange(start=12, end=13),
                MarkRange(start=14, end=14),
                MarkRange(start=15, end=16),
            ])
        except:
            pass

        try:
            Regulation.objects.bulk_create([
                Regulation(year=2017),
                Regulation(year=2021),
            ])
        except:
            pass

        try:
            Department.objects.create(
                programme=Programme.objects.get(name='UG'),
                degree=Degree.objects.get(name='BE'),
                branch='Computer Science Engineering',
                branch_code='CSE',
                hod=User.objects.first(),
            )
        except:
            pass

        try:
            subject = Subject.objects.create(
                code='CS3351',
                subject_name='Data Structures',
                co='IDK'
            )
        except:
            subject = Subject.objects.get(
                code='CS3351',
                subject_name='Data Structures',
                co='IDK'
            )

        try:
            course = Course.objects.create(
                regulation=Regulation.objects.get(year=2021),
                semester=3,
                department=Department.objects.get(branch_code='CSE')
            )
        except:
            course = Course.objects.get(
                regulation=Regulation.objects.get(year=2021),
                semester=3,
                department=Department.objects.get(branch_code='CSE')
            )

        try:
            Lesson.objects.create(name='Lists', subject=subject)
        except:
            pass

        try:
            BloomsTaxonomyLevel.objects.bulk_create([
                BloomsTaxonomyLevel(name='K1', description='Remembering'),
                BloomsTaxonomyLevel(name='K2', description='Understanding'),
                BloomsTaxonomyLevel(name='K3', description='Applying'),
                BloomsTaxonomyLevel(name='K4', description='Analysing'),
                BloomsTaxonomyLevel(name='K5', description='Evaluating'),
                BloomsTaxonomyLevel(name='K6', description='Creating'),
            ])
        except:
            pass

        for year in range(2000, timezone.now().year):
            try:
                PreviousYearsQP.objects.bulk_create([
                    PreviousYearsQP(month='A/M', year=year),
                    PreviousYearsQP(month='N/D', year=year),
                ])
            except:
                pass

        self.stdout.write(self.style.SUCCESS(f"Basic Details Created!"))
