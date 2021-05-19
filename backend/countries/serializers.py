"""Serializers for Django countries app"""
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework.serializers import ModelSerializer
from .models import Country


class CountryGeometrySerializer(GeoFeatureModelSerializer):
    """Serializer for Country geometries"""

    class Meta:
        """Metaclass for output fields"""

        model = Country
        geo_field = "geometry"
        fields = ("iso_code",)


class CountryDemographicSerializer(ModelSerializer):
    """Serializer for Country demographics"""

    class Meta:
        """Metaclass for output fields"""

        model = Country
        fields = ("iso_code", "name", "area", "population")
