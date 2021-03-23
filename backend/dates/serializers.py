"""Serializers for Django dates app"""
from rest_framework import serializers
from .models import ModelDateRange, KnotDateSet, PossibleDateSet


class KnotDateSetSerializer(serializers.ModelSerializer):
    """Serializer for KnotDateSet"""

    iso_code = serializers.PrimaryKeyRelatedField(source="country", read_only=True)

    class Meta:
        """Metaclass for output fields"""

        model = KnotDateSet
        fields = (
            "iso_code",
            "knot_date_1",
            "knot_date_2",
            "n_knots",
            "growth_factor_0_1",
            "growth_factor_1_2",
            "growth_factor_2_3",
            "weight",
        )


class ModelDateRangeSerializer(serializers.ModelSerializer):
    """Serializer for ModelDateRange"""

    iso_code = serializers.PrimaryKeyRelatedField(source="country", read_only=True)

    class Meta:
        """Metaclass for output fields"""

        model = ModelDateRange
        fields = (
            "iso_code",
            "initial_date",
            "maximum_date",
            "first_restrictions_date",
            "lockdown_date",
        )


class PossibleDateSetSerializer(serializers.ModelSerializer):
    """Serializer for PossibleDateSet"""

    iso_code = serializers.PrimaryKeyRelatedField(source="country", read_only=True)

    class Meta:
        """Metaclass for output fields"""

        model = PossibleDateSet
        fields = (
            "iso_code",
            "n_days_first_restrictions",
            "n_days_lockdown",
            "dates_counterfactual_first_restrictions",
            "dates_counterfactual_lockdown",
        )
