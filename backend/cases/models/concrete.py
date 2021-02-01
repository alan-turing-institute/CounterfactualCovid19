"""Countries model"""
from django.db import models
from countries.models import Country


class CasesRecord(models.Model):
    class Meta:
        # As Django does not support compount keys we explicitly require uniqueness
        unique_together = (("country", "date"),)

    country = models.ForeignKey(
        Country, related_name="cases_records", on_delete=models.CASCADE
    )
    date = models.DateField()
    cases = models.FloatField()

    def __str__(self):
        return f"{self.country.name} had {self.cases} on {self.date}"
