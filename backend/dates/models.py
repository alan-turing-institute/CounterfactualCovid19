"""ModelDateRange model"""

from django.db import models
from countries.models import Country


class ModelDateRange(models.Model):

    country = models.ForeignKey(
        Country, related_name="modeldaterange", on_delete=models.CASCADE
    )

    initial_date = models.DateField()
    maximum_date = models.DateField()
    first_restrictions_date = models.DateField(null=True)
    lockdown_date = models.DateField(null=True)

    def __str__(self):
        return f"{self.country}: ({self.first_restrictions_date}), {self.lockdown_date}"
