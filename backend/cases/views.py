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
        iso_code = self.request.query_params.get("iso_code", None)
        iso_codes = [iso_code] if iso_code else []
        start_date = self.request.query_params.get("start_date", None)
        end_date = self.request.query_params.get("end_date", None)
        records = CounterfactualCasesRecord.simulate_counterfactual_records(
            iso_codes=iso_codes, start_date=start_date, end_date=end_date
        )
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

    def get_queryset(self):
        """Apply filters to the default queryset"""
        queryset = self.queryset
        iso_code = self.request.query_params.get("iso_code", None)
        start_date = self.request.query_params.get("start_date", None)
        end_date = self.request.query_params.get("end_date", None)
        if iso_code:
            queryset = queryset.filter(country__iso_code=iso_code)
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lt=end_date)
        return queryset
