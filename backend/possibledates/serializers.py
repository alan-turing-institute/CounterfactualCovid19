from rest_framework import serializers
from countries.models import Country
from .models import PossibleDates


class PossibleDatesSerializer(serializers.ModelSerializer):
    iso_code = serializers.PrimaryKeyRelatedField(source="country", read_only=True)

    class Meta:
        model = PossibleDates
        fields = (
            "iso_code",
            "n_days_first_restrictions",
            "n_days_lockdown",
            "dates_counterfactual_first_restrictions",
            "dates_counterfactual_lockdown",
        )

