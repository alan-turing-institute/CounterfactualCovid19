"""Countries model"""

from django.contrib.gis.db.models import MultiPolygonField
from django.db import models


class Country(models.Model):
    name = models.CharField(max_length=255)
    iso_code = models.CharField(max_length=3)
    geometry = MultiPolygonField()

    def _str_(self):
        return f"{self.name} ({self.iso_code}): {self.geometry}"
