from .serializers import (
    DailyCounterfactualCasesSerializer,
    DailyCasesSerializer,
)
from .models import CasesRecord, CounterfactualCasesRecord
from rest_framework import mixins, viewsets
from rest_framework.response import Response
from django.db.models import Sum, F, Window, When


class DailyCounterfactualCasesView(viewsets.ViewSet):
    """Counterfactual daily and cumulative cases on a date"""

    serializer_class = DailyCounterfactualCasesSerializer

    def list(self, request):
        """Response to a GET/LIST request"""
        records = CounterfactualCasesRecord.simulate_counterfactual_records()
        serializer = DailyCounterfactualCasesSerializer(instance=records, many=True)
        return Response(serializer.data)


class DailyCasesView(viewsets.ModelViewSet):
    """Daily numbers of cases"""

    serializer_class = DailyCasesSerializer

    # Annotate the queryset with cumulative cases information
    # We run a window function over all entries, summing `cases` over all previous entries
    # We finish by returning the query ordered by date
    queryset = CasesRecord.objects.annotate(
        cumulative_cases=Window(
            expression=Sum("cases"),
            partition_by=[F("country")],
            order_by=F("date").asc(),
        )
    ).order_by("date")

    http_method_names = ["get", "head", "list", "options"]
