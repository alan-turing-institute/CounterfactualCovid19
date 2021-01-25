"""Countries model"""
from django.db import models


class Cases(models.Model):
    country = models.CharField(max_length=255)
    iso_code = models.CharField(max_length=3)
    date = models.DateField()
    cumulative_cases = models.PositiveIntegerField()
    population = models.PositiveIntegerField()

    def _str_(self):
        return f"{self.country} ({self.iso_code}) [{self.date}] => {self.cumulative_cases} ({self.population})"
