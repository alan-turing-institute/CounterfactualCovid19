# from django.db import models
from rest_framework import serializers
from ..models import DailyCounterfactualCases


class DailyCounterfactualCasesSerializer(serializers.Serializer):
    iso_code = serializers.CharField(max_length=3)
    date = serializers.DateField()
    cases = serializers.FloatField()
    cumulative_cases = serializers.FloatField()

    def create(self, validated_data):
        print("calling create:", validated_data)
        return DailyCounterfactualCases(**validated_data)

    def update(self, instance, validated_data):
        print("calling update:", instance, validated_data)
        for field, value in validated_data.items():
            setattr(instance, field, value)
        return instance
