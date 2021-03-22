from rest_framework import serializers
from countries.models import Country
from django.db.models import Sum, F, Window, When, Max
from .models import ModelDateRange, KnotDateSet, PossibleDateSet

class KnotDateSetSerializer(serializers.ModelSerializer):
    iso_code = serializers.PrimaryKeyRelatedField(source="country", read_only=True)

    class Meta:
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
    iso_code = serializers.PrimaryKeyRelatedField(source="country", read_only=True)

    class Meta:
        model = ModelDateRange
        fields = (
            "iso_code",
            "initial_date",
            "maximum_date",
            "first_restrictions_date",
            "lockdown_date",
        )



class PossibleDateSetSerializer(serializers.ModelSerializer):
    iso_code = serializers.PrimaryKeyRelatedField(source="country", read_only=True)

    class Meta:
        model = PossibleDateSet
        fields = (
            "iso_code",
            "n_days_first_restrictions",
            "n_days_lockdown",
            "dates_counterfactual_first_restrictions",
            "dates_counterfactual_lockdown",
        )
