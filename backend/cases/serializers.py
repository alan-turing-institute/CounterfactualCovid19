from rest_framework.serializers import ModelSerializer
from .models import Cases


class CasesSerializer(ModelSerializer):
    class Meta:
        model = Cases
        fields = ("country", "iso_code","cumulative_cases")
