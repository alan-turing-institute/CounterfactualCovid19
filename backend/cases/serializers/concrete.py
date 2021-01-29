from rest_framework import serializers
from countries.models import Country
from ..models import CasesRecord


class CasesRealDailyAbsoluteSerializer(serializers.ModelSerializer):
    iso_code = serializers.PrimaryKeyRelatedField(source="country", read_only=True)
    cumulative_cases = serializers.FloatField()

    class Meta:
        model = CasesRecord
        fields = (
            "iso_code",
            "date",
            "cases",
            "cumulative_cases",
        )


class CasesRealDailyNormalisedSerializer(serializers.ModelSerializer):
    iso_code = serializers.PrimaryKeyRelatedField(source="country", read_only=True)
    cases_per_million = serializers.SerializerMethodField()
    cumulative_cases_per_million = serializers.SerializerMethodField()

    def get_cases_per_million(self, entry):
        if entry.country.population and entry.country.population != 0:
            return 1e6 * entry.cases / entry.country.population
        return 0

    def get_cumulative_cases_per_million(self, entry):
        if entry.country.population and entry.country.population != 0:
            return 1e6 * entry.cumulative_cases / entry.country.population
        return 0

    class Meta:
        model = CasesRecord
        fields = (
            "iso_code",
            "date",
            "cases_per_million",
            "cumulative_cases_per_million",
        )
