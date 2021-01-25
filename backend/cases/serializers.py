from rest_framework import serializers
from .models import TotalCases, TimeSeriesCases
from .generators import TaskGenerator

class TotalCasesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TotalCases
        fields = ("iso_code", "cumulative_cases", "population")


class TimeSeriesCasesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSeriesCases
        fields = ("iso_code", "daily_cases", "daily_cum_cases", "date")


STATUSES = (
    'New',
    'Ongoing',
    'Done',
)

class TaskSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=256)
    owner = serializers.CharField(max_length=256)
    status = serializers.ChoiceField(choices=STATUSES, default='New')

    def create(self, validated_data):
        return TaskGenerator(id=None, **validated_data)

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        return instance