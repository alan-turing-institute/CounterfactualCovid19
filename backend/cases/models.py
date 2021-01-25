"""Countries model"""
from django.db import models


class TotalCases(models.Model):
    iso_code = models.CharField(max_length=3)
    cumulative_cases = models.PositiveIntegerField()
    population = models.PositiveIntegerField()

    def __str__(self):
        return f"({self.iso_code}) => {self.cumulative_cases} ({self.population})"


class TimeSeriesCases(models.Model):
    iso_code = models.CharField(max_length=3)
    date = models.DateField()
    daily_cases = models.FloatField()
    daily_cum_cases = models.FloatField()

    def __str__(self):
        return f"({self.iso_code}) [{self.date}] => {self.daily_cases} ({self.daily_cum_cases})"
