"""Serializers for Django dates app"""
from rest_framework import serializers
from .models import CountryDateSet, PossibleDateSet


class CountryDateSetSerializer(serializers.ModelSerializer):
    """Serializer for CountryDateSetView"""

    iso_code = serializers.PrimaryKeyRelatedField(source="country", read_only=True)

    class Meta:
        """Metaclass for output fields"""

        model = CountryDateSet
        fields = (
            "iso_code",
            "initial_date",
            "maximum_date",
            "first_restrictions_date",
            "lockdown_date",
            "first_case_date",
        )


class PossibleLockdownDateSetSerializer(serializers.ModelSerializer):
    """Serializer for PossibleLockdownDateSetView"""

    iso_code = serializers.SerializerMethodField()
    possible_dates = serializers.SerializerMethodField()

    class Meta:
        """Metaclass for output fields"""

        model = PossibleDateSet
        fields = (
            "iso_code",
            "possible_dates",
        )

    def get_iso_code(self, datadict):  # pylint: disable=no-self-use
        """Getter for iso_code field"""
        return datadict["country__iso_code"]

    def get_possible_dates(self, datadict):  # pylint: disable=no-self-use
        """Getter for possible_dates field"""
        return sorted(list(set(datadict["lockdown_dates"])))


class PossibleRestrictionsDateSetSerializer(serializers.ModelSerializer):
    """Serializer for PossibleRestrictionsDateSetView"""

    iso_code = serializers.SerializerMethodField()
    possible_dates = serializers.SerializerMethodField()

    class Meta:
        """Metaclass for output fields"""

        model = PossibleDateSet
        fields = (
            "iso_code",
            "possible_dates",
        )

    def get_iso_code(self, datadict):  # pylint: disable=no-self-use
        """Getter for iso_code field"""
        return datadict["country__iso_code"]

    def get_possible_dates(self, datadict):  # pylint: disable=no-self-use
        """Getter for possible_dates field"""
        return sorted(list(set(datadict["restrictions_dates"])))
