"""ModelDateRange model"""
from django.db import models
from countries.models import Country


class KnotDateSet(models.Model):
    """Dates of knot points"""

    id = models.AutoField(primary_key=True)
    country = models.ForeignKey(
        Country, related_name="KnotDateSet", on_delete=models.CASCADE
    )
    knot_date_1 = models.DateField(null=True)
    knot_date_2 = models.DateField(null=True)
    n_knots = models.IntegerField()
    growth_factor_0_1 = models.FloatField(null=True)
    growth_factor_1_2 = models.FloatField(null=True)
    growth_factor_2_3 = models.FloatField(null=True)
    weight = models.IntegerField(null=True)

    class Meta:  # pylint: disable=too-few-public-methods
        """Meta class"""

        unique_together = ("country", "knot_date_1", "knot_date_2")

    def __str__(self):
        return f"{self.country}: ({self.knot_date_1}), {self.knot_date_2}"


class ModelDateRange(models.Model):
    """Range of dates where restrictions can be simulated"""

    id = models.AutoField(primary_key=True)
    country = models.ForeignKey(
        Country, related_name="ModelDateRange", on_delete=models.CASCADE
    )
    initial_date = models.DateField()
    maximum_date = models.DateField()
    first_restrictions_date = models.DateField(null=True)
    lockdown_date = models.DateField(null=True)

    class Meta:  # pylint: disable=too-few-public-methods
        """Meta class"""

        unique_together = ("country", "first_restrictions_date", "lockdown_date")

    def __str__(self):
        return f"{self.country}: ({self.first_restrictions_date}), {self.lockdown_date}"


class PossibleDateSet(models.Model):
    """A single possible set of allowable restriction dates"""

    id = models.AutoField(primary_key=True)
    country = models.ForeignKey(
        Country, related_name="PossibleDateSet", on_delete=models.CASCADE
    )
    n_days_first_restrictions = models.IntegerField(null=True)
    n_days_lockdown = models.IntegerField(null=True)
    dates_counterfactual_first_restrictions = models.DateField(null=True)
    dates_counterfactual_lockdown = models.DateField(null=True)

    class Meta:  # pylint: disable=too-few-public-methods
        """Meta class"""

        unique_together = (
            "country",
            "dates_counterfactual_first_restrictions",
            "dates_counterfactual_lockdown",
        )

    def __str__(self):
        return f"{self.country}: ({self.dates_counterfactual_first_restrictions}), {self.dates_counterfactual_lockdown}"
