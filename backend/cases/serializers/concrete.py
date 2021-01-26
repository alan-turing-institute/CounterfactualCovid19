from rest_framework import serializers
from ..models import CasesRecord, TotalCases, TimeSeriesCases
from countries.models import Country


class TotalCasesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TotalCases
        fields = ("iso_code", "cumulative_cases", "population")


class TimeSeriesCasesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSeriesCases
        fields = ("iso_code", "daily_cases", "daily_cum_cases", "date")


class DailyCasesSerializer(serializers.ModelSerializer):
    iso_code = serializers.PrimaryKeyRelatedField(source="country", read_only=True)
    population = serializers.SlugRelatedField(
        slug_field="population", source="country", read_only=True
    )
    cumulative_cases = serializers.FloatField()
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
        fields = ("iso_code", "date", "cases", "population", "cumulative_cases", "cases_per_million", "cumulative_cases_per_million")
