from django.db import models
from core.models import TimeStampedModel
from users.models import User


class COE(TimeStampedModel):
    coe = models.ForeignKey(User, on_delete=models.CASCADE, related_name="coes")
    active = models.BooleanField(default=True)

    def __str__(self):
        return str(self.coe)
