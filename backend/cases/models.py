"""Countries model"""
from django.db import models


class Cases(models.Model):
    country = models.CharField(max_length=255)
    iso_code = models.CharField(max_length=3)
    date = models.DateField()
    cumulative_cases_beg = models.PositiveIntegerField()

    def _str_(self):
        return f""