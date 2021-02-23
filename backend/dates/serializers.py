from rest_framework import serializers
from countries.models import Country
from .models import Dates
from django.db.models import Sum, F, Window, When, Max


class DatesSerializer(serializers.ModelSerializer):
    iso_code = serializers.PrimaryKeyRelatedField(source="country", read_only=True)

    class Meta:
        model = Dates
        fields = (
            "initial_date",
            "maximum_date",
            "first_restrictions_date",
            "lockdown_date",
        )
