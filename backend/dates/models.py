"""Dates model"""

from django.db import models
from countries.models import Country


class Dates(models.Model):

    country = models.ForeignKey(
        Country, related_name="Dates", on_delete=models.CASCADE
    )

    initial_date = models.DateField()
    maximum_date = models.DateField()
    first_restrictions_date = models.DateField()
    lockdown_date = models.DateField()

    def __str__(self):
        return f"{self.country}: ({self.first_restrictions_date}), {self.lockdown_date}"
