"""PossibleDates model"""

from django.db import models
from countries.models import Country


class PossibleDates(models.Model):

    country = models.ForeignKey(
        Country, related_name="PossibleDates", on_delete=models.CASCADE
    )

    n_days_first_restrictions = models.FloatField(null=True)
    n_days_lockdown = models.FloatField(null=True)
    dates_counterfactual_first_restrictions = models.DateField(null=True)
    dates_counterfactual_lockdown = models.DateField(null=True)

    def __str__(self):
        return f"{self.country}: ({self.dates_counterfactual_first_restrictions}), {self.dates_counterfactual_lockdown}"
