from django.core.exceptions import ValidationError
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils import timezone
from django_choices_field import TextChoicesField
from core.models import TimeStampedModel
from users.models import User


class Image(models.Model):
    photo = models.ImageField(upload_to="questions", null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.photo.name


class BloomsTaxonomyLevel(models.Model):

    """Blooms Taxonomy Level Model"""

    name = models.CharField(max_length=3, unique=True)
    description = models.CharField(max_length=70)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} | {self.description}"


class PreviousYearsQP(models.Model):

    """Previous Years QP Model"""

    class MonthEnum(models.TextChoices):
        MONTH_AM = "A/M", "A/M"
        MONTH_ND = "N/D", "N/D"

    month = TextChoicesField(choices_enum=MonthEnum)
    year = models.IntegerField(
        validators=[MinValueValidator(
            1990), MaxValueValidator(timezone.now().year)]
    )

    class Meta:
        unique_together = ["month", "year"]

    def __str__(self):
        return f"{self.month} | {self.year}"


class AbstractNameModel(models.Model):

    """AbstractNameModel Model"""

    name = models.CharField(max_length=20, unique=True)

    def clean(self, *args, **kwargs):
        self.name = self.name.upper()
        super().clean(*args, **kwargs)

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.name}"


class Programme(AbstractNameModel):

    """Programme Model"""

    pass


class Degree(AbstractNameModel):

    """Degree Model"""

    full_form = models.CharField(max_length=100)


class Regulation(models.Model):

    """Regulation Model"""

    year = models.IntegerField(
        unique=True,
        validators=[
            MinValueValidator(2010), MaxValueValidator(timezone.now().year)
        ],
    )

    def __str__(self):
        return f"{self.year}"


class Department(models.Model):

    """Department Model"""

    programme = models.ForeignKey(
        Programme, on_delete=models.PROTECT, related_name="departments"
    )
    degree = models.ForeignKey(
        Degree, on_delete=models.PROTECT, related_name="departments"
    )
    branch = models.CharField(max_length=80)
    branch_code = models.CharField(max_length=10)
    hod = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="departments",
        blank=True,
        null=True,
    )

    class Meta:
        unique_together = ["programme", "degree", "branch_code"]

    def __str__(self):
        return f"{self.programme} | {self.degree} | {self.branch_code}"


class Subject(models.Model):

    """Subject Model"""

    code = models.CharField(max_length=15)
    subject_name = models.CharField(max_length=70)
    co = models.CharField(max_length=7)
    # co_description = models.CharField(max_length=200)
    # course_outcome = models.TextField()
    # coe = models.ManyToManyField(
    #     User, related_name='subjects', blank=True
    # )

    class Meta:
        unique_together = ["code", "co"]

    def __str__(self):
        return f"{self.code} | {self.subject_name} | {self.co}"


class Lesson(models.Model):

    """Lesson Model"""

    name = models.CharField(max_length=200)
    subject = models.ForeignKey(
        Subject, on_delete=models.PROTECT, related_name="lessons"
    )
    objective = models.TextField()
    outcome = models.TextField()
    outcome_btl = models.ManyToManyField(
        BloomsTaxonomyLevel, related_name="lessons")

    class Meta:
        unique_together = ["name", "subject"]

    def __str__(self) -> str:
        return f"{self.name} | {self.subject}"


class Topic(models.Model):

    """Topic Model"""

    name = models.CharField(max_length=200)
    lesson = models.ForeignKey(
        Lesson, on_delete=models.PROTECT, related_name="topics"
    )
    active = models.BooleanField(default=True)

    class Meta:
        unique_together = ["name", "lesson"]

    def __str__(self) -> str:
        return f"{self.name} | {self.lesson}"


class Course(models.Model):

    """Course Model"""

    regulation = models.ForeignKey(
        Regulation, on_delete=models.PROTECT, related_name="courses"
    )
    semester = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)]
    )
    department = models.ForeignKey(
        Department, on_delete=models.PROTECT, related_name="courses"
    )
    active = models.BooleanField(default=True)

    class Meta:
        unique_together = ["regulation", "semester", "department"]

    def __str__(self):
        return f"{self.regulation} | {self.semester} | {self.department}"


class Syllabus(models.Model):

    """Syllabus Model"""

    course = models.ForeignKey(
        Course, on_delete=models.PROTECT, related_name="syllabuses"
    )
    unit = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(25)])
    lesson = models.ForeignKey(
        Lesson, on_delete=models.PROTECT, related_name="syllabuses"
    )

    class Meta:
        unique_together = ["course", "lesson"]

    def __str__(self):
        return f"{self.course} | {self.unit} | {self.lesson}"


class MarkRange(models.Model):

    """Mark Range Model"""

    start = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(25)]
    )
    end = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(25)])

    def clean(self, *args, **kwargs):
        if self.start > self.end:
            raise ValidationError(
                "Ensure End must be lesser than or equal to Start"
            )
        super().clean(*args, **kwargs)

    def __str__(self):
        return f"{self.start} - {self.end}"

    class Meta:
        ordering = ["start"]
        unique_together = ["start", "end"]


class FacultiesHandling(models.Model):

    """Faculties Handling Model"""

    course = models.ForeignKey(
        Course, on_delete=models.PROTECT, related_name="faculties"
    )
    subject = models.ForeignKey(
        Subject, on_delete=models.PROTECT, related_name="faculties"
    )
    faculties = models.ManyToManyField(User, related_name="faculties")

    def __str__(self):
        return f"{self.course} | {self.subject}"

    class Meta:
        unique_together = ["course", "subject"]


class Question(TimeStampedModel):

    """Question Paper Model"""

    class DifficultyEnum(models.TextChoices):
        DIFFICULTY_EASY = "E", "Easy"
        DIFFICULTY_MEDIUM = "M", "Medium"
        DIFFICULTY_HARD = "H", "Hard"

    lesson = models.ForeignKey(
        Lesson, on_delete=models.PROTECT, related_name="questions"
    )
    question = models.TextField()
    answer = models.TextField(blank=True, null=True)
    mark = models.ForeignKey(
        MarkRange,
        on_delete=models.PROTECT,
        related_name="questions",
        null=True,
        blank=False,
    )
    start_mark = models.IntegerField(blank=True)
    end_mark = models.IntegerField(blank=True)
    btl = models.ForeignKey(
        BloomsTaxonomyLevel, on_delete=models.PROTECT, related_name="questions"
    )
    difficulty = TextChoicesField(choices_enum=DifficultyEnum)
    created_by = models.ForeignKey(
        User, on_delete=models.PROTECT, related_name="created_questions"
    )
    updated_by = models.ForeignKey(
        User, on_delete=models.PROTECT, related_name="updated_questions", null=True, blank=True
    )
    topics = models.ManyToManyField(
        Topic, related_name="questions", blank=True)
    previous_years = models.ManyToManyField(
        PreviousYearsQP, related_name="questions", blank=True
    )
    priority = models.IntegerField(
        default=0, validators=[MinValueValidator(0), MaxValueValidator(3)]
    )
    scenario_based = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        self.start_mark = self.mark.start
        self.end_mark = self.mark.end
        self.question = self.question.strip()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.question}"


class CreateSyllabus(TimeStampedModel):
    syllabus = models.ManyToManyField(
        Syllabus, related_name="created_syllabus", blank=True
    )
    faculty = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="create_subjects"
    )
    is_completed = models.BooleanField(default=False)


class Exam(models.Model):
    name = models.CharField(
        max_length=200,
        unique=True,
        help_text="Displayed in Question Paper"
    )

    def __str__(self) -> str:
        return self.name


class ExamMark(models.Model):
    label = models.CharField(max_length=200, unique=True)
    exam = models.ForeignKey(
        Exam, on_delete=models.CASCADE, related_name="marks"
    )
    total = models.IntegerField()
    marks = models.JSONField()
    counts = models.JSONField()
    choices = models.JSONField()
    units = models.JSONField()
    time = models.CharField(max_length=25)
    order = models.PositiveIntegerField()
    is_end_sem_format = models.BooleanField(default=False)
    active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return f'{self.label} | {self.exam}'


class AnalysisBTL(models.Model):
    analysis = models.ForeignKey(
        "Analysis", on_delete=models.CASCADE, related_name="analysis_btl"
    )
    btl = models.ForeignKey(
        BloomsTaxonomyLevel, on_delete=models.CASCADE, related_name="analysis_btl"
    )
    percentage = models.FloatField()

    class Meta:
        unique_together = ["analysis", "btl"]
        ordering = ["btl"]

    def __str__(self):
        return f"{self.analysis.exam} | {self.btl} | {self.percentage}"


class Analysis(TimeStampedModel):
    courses = models.ManyToManyField(Course, related_name="analysis")
    subject = models.ForeignKey(
        Subject, on_delete=models.CASCADE, related_name="analysis"
    )
    exam = models.ForeignKey(
        Exam, on_delete=models.CASCADE, related_name="analysis"
    )

    def __str__(self):
        return f"{self.subject} | {self.exam}"
