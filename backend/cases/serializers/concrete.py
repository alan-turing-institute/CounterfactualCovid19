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

    class Meta:
        model = CasesRecord
        fields = ("iso_code", "date", "cases", "population")
