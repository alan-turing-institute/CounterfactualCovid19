from .serializers import (
    TotalCasesSerializer,
    TimeSeriesCasesSerializer,
    DailyCounterfactualCasesSerializer,
)
from .models import TotalCases, TimeSeriesCases, DailyCounterfactualCases
from rest_framework import mixins, viewsets
from rest_framework.response import Response


class TotalCasesView(viewsets.ModelViewSet):
    """Total number of cases"""

    serializer_class = TotalCasesSerializer
    queryset = TotalCases.objects.all()
    http_method_names = ["get", "head", "list", "options"]


class TimeSeriesCasesView(viewsets.ModelViewSet):
    """Daily and cumulative cases on a date"""

    serializer_class = TimeSeriesCasesSerializer
    queryset = TimeSeriesCases.objects.all()
    http_method_names = ["get", "head", "list", "options"]


class DailyCounterfactualCasesView(viewsets.ViewSet):
    """Counterfactual daily and cumulative cases on a date"""

    serializer_class = DailyCounterfactualCasesSerializer

    def list(self, request):
        """Response to a GET/LIST request"""
        records = DailyCounterfactualCases.simulate_counterfactual_records()
        serializer = DailyCounterfactualCasesSerializer(instance=records, many=True)
        return Response(serializer.data)
