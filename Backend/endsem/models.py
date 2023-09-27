from django.db import models
from core.models import TimeStampedModel
from questions.models import Subject
from users.models import User


class EndSemSubject(TimeStampedModel):
    subject = models.ForeignKey(
        Subject, on_delete=models.CASCADE, related_name="endsem_faculties"
    )
    faculties = models.ManyToManyField(
        User, related_name="endsem_faculties", blank=True
    )

    class Meta:
        unique_together = ["subject"]
        verbose_name_plural = "End Sem Subjects"
        verbose_name = "End Sem Subject"

    def __str__(self):
        return self.subject.code


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

    class Meta:
        ordering = ["subject", "part", "number", "roman", "option"]

    def __str__(self) -> str:
        return f"{self.question} | {self.subject.subject.code}"
