from rest_framework import serializers
from ..models import CounterfactualCasesRecord
from countries.models import Country


class CasesCounterfactualDailyAbsoluteSerializer(serializers.Serializer):
    iso_code = serializers.CharField(max_length=3)
    date = serializers.DateField()
    weekly_avg_cases = serializers.FloatField()
    summed_avg_cases = serializers.FloatField()


class CasesCounterfactualDailyNormalisedSerializer(serializers.Serializer):
    iso_code = serializers.CharField(max_length=3)
    date = serializers.DateField()
    weekly_avg_cases_per_million = serializers.SerializerMethodField()
    summed_avg_cases_per_million = serializers.SerializerMethodField()

    def get_weekly_avg_cases_per_million(self, entry):
        if entry["population"] and entry["population"] != 0:
            return 1e6 * entry["weekly_avg_cases"] / entry["population"]
        return 0

    def get_summed_avg_cases_per_million(self, entry):
        if entry["population"] and entry["population"] != 0:
            return 1e6 * entry["summed_avg_cases"] / entry["population"]
        return 0


class CasesCounterfactualIntegratedSerializer(serializers.Serializer):
    iso_code = serializers.CharField(max_length=3)
    date = serializers.DateField()
    summed_avg_cases = serializers.SerializerMethodField()
    summed_avg_cases_per_million = serializers.SerializerMethodField()

    def get_summed_avg_cases(self, entry):
        return entry["summed_avg_cases"]

    def get_summed_avg_cases_per_million(self, entry):
        if entry["population"] and entry["population"] != 0:
            return 1e6 * entry["summed_avg_cases"] / entry["population"]
        return 0
