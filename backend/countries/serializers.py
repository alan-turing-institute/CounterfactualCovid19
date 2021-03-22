"""Serializers for Django countries app"""
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import Country


class CountrySerializer(GeoFeatureModelSerializer):
    """Serializer for Country"""

    class Meta:
        """Metaclass for output fields"""

        model = Country
        geo_field = "geometry"
        fields = ("iso_code", "name", "population")
