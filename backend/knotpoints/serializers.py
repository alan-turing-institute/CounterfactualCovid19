from rest_framework import serializers
from countries.models import Country
from .models import KnotPoints
from django.db.models import Sum, F, Window, When, Max


class KnotPointsSerializer(serializers.ModelSerializer):
    iso_code = serializers.PrimaryKeyRelatedField(source="country", read_only=True)

    class Meta:
        model = KnotPoints
        fields = (
            "iso_code",
            "knot_date_1",
            "knot_date_2",
            "n_knots",
            "growth_factor_1",
            "growth_factor_2",
            "growth_factor_3",
            "weight",
        )
