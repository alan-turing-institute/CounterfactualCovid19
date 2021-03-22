"""Serializers for ephemeral models in Django cases app"""
from rest_framework import serializers


class CasesCounterfactualDailyAbsoluteSerializer(
    serializers.Serializer
):  # pylint: disable=abstract-method
    """Serializer for counterfactual daily absolute cases"""

    iso_code = serializers.CharField(max_length=3)
    date = serializers.DateField()
    weekly_avg_cases = serializers.FloatField()
    summed_avg_cases = serializers.FloatField()


class CasesCounterfactualDailyNormalisedSerializer(
    serializers.Serializer
):  # pylint: disable=abstract-method
    """Serializer for counterfactual daily normalised cases"""

    iso_code = serializers.CharField(max_length=3)
    date = serializers.DateField()
    weekly_avg_cases_per_million = serializers.SerializerMethodField()
    summed_avg_cases_per_million = serializers.SerializerMethodField()

    def get_weekly_avg_cases_per_million(self, entry):  # pylint: disable=no-self-use
        """Getter for weekly_avg_cases_per_million field"""
        if entry["population"] and entry["population"] != 0:
            return 1e6 * entry["weekly_avg_cases"] / entry["population"]
        return 0

    def get_summed_avg_cases_per_million(self, entry):  # pylint: disable=no-self-use
        """Getter for summed_avg_cases_per_million field"""
        if entry["population"] and entry["population"] != 0:
            return 1e6 * entry["summed_avg_cases"] / entry["population"]
        return 0


class CasesCounterfactualIntegratedSerializer(
    serializers.Serializer
):  # pylint: disable=abstract-method
    """Serializer for counterfactual daily integrated cases"""

    iso_code = serializers.CharField(max_length=3)
    date = serializers.DateField()
    summed_avg_cases = serializers.SerializerMethodField()
    summed_avg_cases_per_million = serializers.SerializerMethodField()

    def get_summed_avg_cases(self, entry):  # pylint: disable=no-self-use
        """Getter for summed_avg_cases field"""
        return entry["summed_avg_cases"]

    def get_summed_avg_cases_per_million(self, entry):  # pylint: disable=no-self-use
        """Getter for summed_avg_cases_per_million field"""
        if entry["population"] and entry["population"] != 0:
            return 1e6 * entry["summed_avg_cases"] / entry["population"]
        return 0
