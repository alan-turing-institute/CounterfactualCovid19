from rest_framework import serializers
from countries.models import Country
from ..models import CasesRecord
from django.db.models import Sum, F, Window, When, Max


class CasesRealDailyAbsoluteSerializer(serializers.ModelSerializer):
    iso_code = serializers.PrimaryKeyRelatedField(source="country", read_only=True)
    summed_avg_cases = serializers.FloatField()

    class Meta:
        model = CasesRecord
        fields = (
            "iso_code",
            "date",
            "weekly_avg_cases",
            "summed_avg_cases",
        )


class CasesRealDailyNormalisedSerializer(serializers.ModelSerializer):
    iso_code = serializers.PrimaryKeyRelatedField(source="country", read_only=True)
    weekly_avg_cases_per_million = serializers.SerializerMethodField()
    summed_avg_cases_per_million = serializers.SerializerMethodField()

    def get_weekly_avg_cases_per_million(self, record):
        if record.country.population and record.country.population != 0:
            return 1e6 * record.weekly_avg_cases / record.country.population
        return 0

    def get_summed_avg_cases_per_million(self, record):
        if record.country.population and record.country.population != 0:
            return 1e6 * record.summed_avg_cases / record.country.population
        return 0

    class Meta:
        model = CasesRecord
        fields = (
            "iso_code",
            "date",
            "weekly_avg_cases_per_million",
            "summed_avg_cases_per_million",
        )


class CasesRealIntegratedSerializer(serializers.ModelSerializer):
    iso_code = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()
    summed_avg_cases = serializers.SerializerMethodField()
    summed_avg_cases_per_million = serializers.SerializerMethodField()

    class Meta:
        model = CasesRecord
        fields = ("iso_code", "date", "summed_avg_cases", "summed_avg_cases_per_million")

    def get_iso_code(self, datadict):
        return datadict["country"]

    def get_date(self, datadict):
        return datadict["date"]

    def get_summed_avg_cases(self, datadict):
        return datadict["summed_avg_cases"]

    def get_summed_avg_cases_per_million(self, datadict):
        return datadict["summed_avg_cases_per_million"]
