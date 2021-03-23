"""Countries model"""
from django.contrib.gis.db.models import MultiPolygonField
from django.db import models


class Country(models.Model):
    """A single country with its geometry"""

    iso_code = models.CharField(max_length=3, primary_key=True)
    name = models.CharField(max_length=255)
    population = models.PositiveIntegerField(null=True)
    geometry = MultiPolygonField()

    def __str__(self):
        return f"{self.name} ({self.iso_code}): {self.geometry}"
