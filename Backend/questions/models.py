from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator, ValidationError
from django.utils import timezone
from django.utils.text import slugify
from vditor.fields import VditorTextField
from core.models import TimeStampedModel
from users.models import User


class BloomsTaxonomyLevel(models.Model):

    """ Blooms Taxonomy Level Model """

    name = models.CharField(max_length=3, unique=True)
    description = models.CharField(max_length=70)

    def __str__(self):
        return f'{self.name} | {self.description}'


class PreviousYearsQP(models.Model):

    """ Previous Years QP Model """

    MONTH_AM = 'A/M'
    MONTH_ND = 'N/D'

    MONTH_CHOICES = (
        (MONTH_AM, MONTH_AM),
        (MONTH_ND, MONTH_ND)
    )

    month = models.CharField(max_length=3, choices=MONTH_CHOICES)
    year = models.IntegerField(validators=[
        MinValueValidator(1990), MaxValueValidator(timezone.now().year)
    ])

    class Meta:
        unique_together = ['month', 'year']

    def __str__(self):
        return f'{self.month} | {self.year}'


class AbstractNameModel(models.Model):

    """ AbstractNameModel Model """

    name = models.CharField(max_length=20, unique=True)

    def clean(self, *args, **kwargs):
        self.name = self.name.upper()
        super().clean(*args, **kwargs)

    class Meta:
        abstract = True

    def __str__(self):
        return f'{self.name}'


class Programme(AbstractNameModel):

    """ Programme Model """

    pass


class Degree(AbstractNameModel):

    """ Degree Model """

    full_form = models.CharField(max_length=100)


class Regulation(models.Model):

    """ Regulation Model """

    year = models.IntegerField(unique=True, validators=[
        MinValueValidator(2010), MaxValueValidator(timezone.now().year)
    ])

    def __str__(self):
        return f'{self.year}'


class Department(models.Model):

    """ Department Model """

    programme = models.ForeignKey(
        Programme, on_delete=models.CASCADE, related_name='departments'
    )
    degree = models.ForeignKey(
        Degree, on_delete=models.CASCADE, related_name='departments'
    )
    branch = models.CharField(max_length=80)
    branch_code = models.CharField(max_length=10)
    hod = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='departments'
    )

    class Meta:
        unique_together = ['programme', 'degree', 'branch_code']

    def __str__(self):
        return f'{self.programme} | {self.degree} | {self.branch_code}'


class Subject(models.Model):

    """ Subject Model """

    code = models.CharField(max_length=15)
    subject_name = models.CharField(max_length=70)
    co = models.CharField(max_length=7)
    co_description = models.CharField(max_length=200)
    course_outcome = models.TextField()
    coe = models.ManyToManyField(
        User, related_name='subjects', blank=True
    )

    class Meta:
        unique_together = ['code', 'co']

    def __str__(self):
        return f'{self.code} | {self.subject_name} | {self.co}'


class Lesson(models.Model):

    """ Lesson Model """

    name = models.CharField(max_length=200)
    subject = models.ForeignKey(
        Subject, on_delete=models.CASCADE, related_name='lessons'
    )

    class Meta:
        unique_together = ['name', 'subject']

    def __str__(self) -> str:
        return f'{self.name} | {self.subject}'


class Course(models.Model):

    """ Course Model """

    regulation = models.ForeignKey(
        Regulation, on_delete=models.CASCADE, related_name='courses'
    )
    semester = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)]
    )
    department = models.ForeignKey(
        Department, on_delete=models.CASCADE, related_name='courses'
    )
    active = models.BooleanField(default=True)

    class Meta:
        unique_together = ['regulation', 'semester', 'department']

    def __str__(self):
        return f'{self.regulation} | {self.semester} | {self.department}'


class Syllabus(models.Model):

    """ Syllabus Model """

    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name='syllabuses'
    )
    unit = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(25)]
    )
    lesson = models.ForeignKey(
        Lesson, on_delete=models.CASCADE, related_name='syllabuses'
    )

    class Meta:
        unique_together = ['course', 'unit', 'lesson']

    def __str__(self):
        return f'{self.course} | {self.unit} | {self.lesson}'


class MarkRange(models.Model):

    """ Mark Range Model """

    start = models.IntegerField(
        validators=[MinValueValidator(2), MaxValueValidator(20)]
    )
    end = models.IntegerField(
        validators=[MinValueValidator(2), MaxValueValidator(20)]
    )

    def clean(self, *args, **kwargs):
        if self.start > self.end:
            raise ValidationError(
                'Ensure End must be lesser than or equal to Start')
        super().clean(*args, **kwargs)

    def __str__(self):
        return f'{self.start} - {self.end}'

    class Meta:
        unique_together = ['start', 'end']


class FacultiesHandling(models.Model):

    """ Faculties Handling Model """

    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name='faculties'
    )
    subject = models.ForeignKey(
        Subject, on_delete=models.CASCADE, related_name='faculties'
    )
    faculties = models.ManyToManyField(User, related_name='faculties')

    def __str__(self):
        return f'{self.course} | {self.subject}'

    class Meta:
        unique_together = ['course', 'subject']

    # TODO: Check the subject in syllabus before saving


class Question(TimeStampedModel):

    """ Question Paper Model """

    DIFFICULTY_EASY = 'E'
    DIFFICULTY_MEDIUM = 'M'
    DIFFICULTY_HARD = 'H'

    DIFFICULTY_CHOICES = (
        (DIFFICULTY_EASY, 'Easy'),
        (DIFFICULTY_MEDIUM, 'Medium'),
        (DIFFICULTY_HARD, 'Hard'),
    )

    slug = models.SlugField(max_length=250, blank=True)
    lesson = models.ForeignKey(
        Lesson, on_delete=models.CASCADE, related_name='quesions'
    )
    question = models.TextField()
    answer = models.TextField()
    mark = models.ForeignKey(
        MarkRange, on_delete=models.CASCADE, related_name='questions', null=True, blank=False
    )
    start_mark = models.IntegerField(blank=True)
    end_mark = models.IntegerField(blank=True)
    btl = models.ForeignKey(
        BloomsTaxonomyLevel, on_delete=models.CASCADE, related_name='questions'
    )
    difficulty = models.CharField(
        max_length=2, choices=DIFFICULTY_CHOICES
    )
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='questions'
    )
    previous_years = models.ManyToManyField(
        PreviousYearsQP, related_name='questions', blank=True
    )
    # COE -> only one -> Expert for the subject model

    class Meta:
        pass
        # TODO: unique to together for slug and subject code

    def save(self, *args, **kwargs):
        self.start_mark = self.mark.start
        self.end_mark = self.mark.end
        self.slug = slugify(self.question)
        super().save(*args, **kwargs)
        # super().save(*args, **kwargs, saved_slug=False)
        # if not kwargs['saved_slug']:
        #     print("Not found")
        #     self.slug = slugify(self.id, self.question)
        # else:
        #     print('Now found')
        # super().save(*args, **kwargs, saved_slug=True)
        #
        # self.save(update_fields=['slug'])

    def __str__(self):
        return f'{self.question}'
