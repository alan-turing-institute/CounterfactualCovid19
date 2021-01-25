from rest_framework.serializers import ModelSerializer, Serializer
from .models import TotalCases, TimeSeriesCases


class TotalCasesSerializer(ModelSerializer):
    class Meta:
        model = TotalCases
        fields = ("iso_code", "cumulative_cases", "population")


class TimeSeriesCasesSerializer(Serializer):
    class Meta:
        model = TimeSeriesCases
        fields = ("iso_code", "daily_cases", "daily_cum_cases", "date")
