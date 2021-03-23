"""Concrete models for Django cases app"""
from django.db import models
from countries.models import Country


class CasesRecord(models.Model):
    """Rolling weekly average cases numbers on a daily basis"""

    class Meta:
        """Metaclass for imposing constraints"""

        # As Django does not support compount keys we explicitly require uniqueness
        unique_together = (("country", "date"),)

    country = models.ForeignKey(
        Country, related_name="cases_records", on_delete=models.CASCADE
    )
    date = models.DateField()
    weekly_avg_cases = models.FloatField()

    def __str__(self):
        return f"{self.country.name} had {self.weekly_avg_cases} on {self.date}"
