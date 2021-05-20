"""Countries model"""
from django.contrib.gis.db.models import MultiPolygonField
from django.db import models


class Country(models.Model):
    """A single country with its geometry"""

    iso_code = models.CharField(max_length=3, primary_key=True)
    name = models.CharField(max_length=255)
    area = models.PositiveIntegerField(null=False)
    population = models.PositiveIntegerField(null=False)
    geometry = MultiPolygonField()

    @property
    def population_density(self):
        """Calculate population density from population and area"""
        if not self.population:
            return 0
        if self.area and self.area != 0:
            return self.population / self.area
        return None

    def __str__(self):
        return f"{self.name} ({self.iso_code}): {self.area} {self.population} {self.geometry}"
