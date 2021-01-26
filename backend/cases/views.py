from .serializers import (
    TotalCasesSerializer,
    TimeSeriesCasesSerializer,
    DailyCounterfactualCasesSerializer,
    DailyCasesSerializer,
)
from .models import CasesRecord, TotalCases, TimeSeriesCases, DailyCounterfactualCases
from rest_framework import mixins, viewsets
from rest_framework.response import Response
from django.db.models import Sum, F, Window, When


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


class DailyCasesView(viewsets.ModelViewSet):
    """Daily numbers of cases"""

    serializer_class = DailyCasesSerializer

    # Annotate the queryset with cumulative cases information
    # We run a window function over all entries, summing `cases` over all previous entries
    # We finish by returning the query ordered by date
    queryset = CasesRecord.objects.annotate(
        cumulative_cases=Window(expression=Sum("cases"), order_by=F("date").asc())
    ).order_by("date")

    http_method_names = ["get", "head", "list", "options"]
