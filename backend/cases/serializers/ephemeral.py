from rest_framework import serializers
from ..models import CounterfactualCasesRecord
from countries.models import Country


class CasesCounterfactualDailyAbsoluteSerializer(serializers.Serializer):
    iso_code = serializers.CharField(max_length=3)
    date = serializers.DateField()
    cases = serializers.FloatField()
    cumulative_cases = serializers.FloatField()


class CasesCounterfactualDailyNormalisedSerializer(serializers.Serializer):
    iso_code = serializers.CharField(max_length=3)
    date = serializers.DateField()
    cases_per_million = serializers.SerializerMethodField()
    cumulative_cases_per_million = serializers.SerializerMethodField()

    def get_cases_per_million(self, entry):
        if entry["population"] and entry["population"] != 0:
            return 1e6 * entry["cases"] / entry["population"]
        return 0

    def get_cumulative_cases_per_million(self, entry):
        if entry["population"] and entry["population"] != 0:
            return 1e6 * entry["cumulative_cases"] / entry["population"]
        return 0
