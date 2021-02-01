from rest_framework import serializers
from countries.models import Country
from ..models import CasesRecord
from django.db.models import Sum, F, Window, When, Max


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

    def get_cases_per_million(self, record):
        if record.country.population and record.country.population != 0:
            return 1e6 * record.cases / record.country.population
        return 0

    def get_cumulative_cases_per_million(self, record):
        if record.country.population and record.country.population != 0:
            return 1e6 * record.cumulative_cases / record.country.population
        return 0

    class Meta:
        model = CasesRecord
        fields = (
            "iso_code",
            "date",
            "cases_per_million",
            "cumulative_cases_per_million",
        )


class CasesRealIntegratedSerializer(serializers.ModelSerializer):
    iso_code = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()
    total_cases = serializers.SerializerMethodField()
    total_cases_per_million = serializers.SerializerMethodField()

    class Meta:
        model = CasesRecord
        fields = ("iso_code", "date", "total_cases", "total_cases_per_million")

    def get_iso_code(self, datadict):
        return datadict["country"]

    def get_date(self, datadict):
        return datadict["date"]

    def get_total_cases(self, datadict):
        return datadict["total_cases"]

    def get_total_cases_per_million(self, datadict):
        return datadict["total_cases_per_million"]
