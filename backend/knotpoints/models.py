"""Dates model"""

from django.db import models
from countries.models import Country


class KnotPoints(models.Model):

    country = models.ForeignKey(Country, related_name="KnotPoints", on_delete=models.CASCADE)

    knot_date_1 = models.DateField()
    knot_date_2 = models.DateField()
    n_knots = models.IntegerField()
    growth_factor_1 = models.FloatField()
    growth_factor_2 = models.FloatField()
    growth_factor_3 = models.FloatField()
    min_n_unequal = models.IntegerField()


    def __str__(self):
        return f"{self.country}: ({self.knot_date_1}), {self.knot_date_2}"
