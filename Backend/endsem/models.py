from django.db import models
from core.models import TimeStampedModel
from questions.models import BloomsTaxonomyLevel, Regulation, Subject
from users.models import User


class EndSemSubject(TimeStampedModel):
    regulation = models.ForeignKey(
        Regulation, on_delete=models.CASCADE, related_name="endsem_regulations"
    )
    semester = models.PositiveIntegerField()
    subject = models.ForeignKey(
        Subject, on_delete=models.CASCADE, related_name="endsem_subjects"
    )
    faculties = models.ManyToManyField(
        User, related_name="endsem_faculties", blank=True
    )
    marks = models.JSONField(default=list)
    counts = models.JSONField(default=list)
    choices = models.JSONField(default=list)
    is_internal = models.BooleanField(default=False)
    is_external = models.BooleanField(default=False)

    class Meta:
        unique_together = ["regulation", "semester", "subject"]
        verbose_name_plural = "End Sem Subjects"
        verbose_name = "End Sem Subject"

    def __str__(self):
        return f'{self.semester} {self.subject.code}'


class EndSemQuestion(TimeStampedModel):
    subject = models.ForeignKey(
        EndSemSubject, on_delete=models.CASCADE, related_name="endsem_questions"
    )
    part = models.PositiveIntegerField()
    number = models.PositiveIntegerField()
    roman = models.PositiveIntegerField(null=True, blank=True)
    option = models.PositiveIntegerField(null=True, blank=True)
    question = models.TextField()
    answer = models.TextField(null=True, blank=True)
    mark = models.PositiveIntegerField()
    co = models.PositiveIntegerField()
    btl = models.ForeignKey(BloomsTaxonomyLevel, on_delete=models.PROTECT)

    class Meta:
        ordering = ["subject", "part", "number", "roman", "option"]

    def __str__(self) -> str:
        return f"{self.question} | {self.subject.subject.code}"


class EndSemImage(models.Model):
    photo = models.ImageField(upload_to="endsem", null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.photo.name
