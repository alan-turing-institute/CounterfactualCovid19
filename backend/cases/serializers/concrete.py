"""Serializers for concrete models in Django cases app"""
from rest_framework import serializers
from ..models import CasesRecord


class CasesRealDailyAbsoluteSerializer(serializers.ModelSerializer):
    """Serializer for real daily absolute cases"""

    iso_code = serializers.PrimaryKeyRelatedField(source="country", read_only=True)
    summed_avg_cases = serializers.FloatField()

    class Meta:
        """Metaclass for output fields"""

        model = CasesRecord
        fields = (
            "iso_code",
            "date",
            "weekly_avg_cases",
            "summed_avg_cases",
        )


class CasesRealDailyNormalisedSerializer(serializers.ModelSerializer):
    """Serializer for real daily normalised cases"""

    iso_code = serializers.PrimaryKeyRelatedField(source="country", read_only=True)
    weekly_avg_cases_per_million = serializers.SerializerMethodField()
    summed_avg_cases_per_million = serializers.SerializerMethodField()

    def get_weekly_avg_cases_per_million(self, record):  # pylint: disable=no-self-use
        """Getter for weekly_avg_cases_per_million field"""
        if record.country.population and record.country.population != 0:
            return 1e6 * record.weekly_avg_cases / record.country.population
        return 0

    def get_summed_avg_cases_per_million(self, record):  # pylint: disable=no-self-use
        """Getter for summed_avg_cases_per_million field"""
        if record.country.population and record.country.population != 0:
            return 1e6 * record.summed_avg_cases / record.country.population
        return 0

    class Meta:
        """Metaclass for output fields"""

        model = CasesRecord
        fields = (
            "iso_code",
            "date",
            "weekly_avg_cases_per_million",
            "summed_avg_cases_per_million",
        )


class CasesRealIntegratedSerializer(serializers.ModelSerializer):
    """Serializer for real daily integrated cases"""

    iso_code = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()
    summed_avg_cases = serializers.SerializerMethodField()
    summed_avg_cases_per_million = serializers.SerializerMethodField()

    class Meta:
        """Metaclass for output fields"""

        model = CasesRecord
        fields = (
            "iso_code",
            "date",
            "summed_avg_cases",
            "summed_avg_cases_per_million",
        )

    def get_iso_code(self, datadict):  # pylint: disable=no-self-use
        """Getter for iso_code field"""
        return datadict["country"]

    def get_date(self, datadict):  # pylint: disable=no-self-use
        """Getter for date field"""
        return datadict["date"]

    def get_summed_avg_cases(self, datadict):  # pylint: disable=no-self-use
        """Getter for summed_avg_cases field"""
        return datadict["summed_avg_cases"]

    def get_summed_avg_cases_per_million(self, datadict):  # pylint: disable=no-self-use
        """Getter for summed_avg_cases_per_million field"""
        return datadict["summed_avg_cases_per_million"]
