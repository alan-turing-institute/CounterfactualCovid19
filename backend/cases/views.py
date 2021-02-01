from abc import ABC, abstractmethod
from django.db.models import ExpressionWrapper, F, FloatField, Max, Sum, Window
from rest_framework import mixins, viewsets
from rest_framework.response import Response
from .models import CasesRecord, CounterfactualCasesRecord
from .serializers import (
    CasesCounterfactualDailyAbsoluteSerializer,
    CasesCounterfactualDailyNormalisedSerializer,
    CasesCounterfactualIntegratedSerializer,
    CasesRealDailyAbsoluteSerializer,
    CasesRealDailyNormalisedSerializer,
    CasesRealIntegratedSerializer,
)


class CasesCounterfactualViewMixin(ABC):
    """Interface for counterfactual cases views"""

    @property
    @classmethod
    @abstractmethod
    def serializer_class(cls):
        return NotImplementedError

    @abstractmethod
    def simulate(self, iso_codes, start_date, end_date):
        return NotImplementedError

    def list(self, request):
        """Response to a GET/LIST request"""
        iso_code = self.request.query_params.get("iso_code", None)
        iso_codes = [iso_code] if iso_code else []
        start_date = self.request.query_params.get("start_date", None)
        end_date = self.request.query_params.get("end_date", None)
        records = self.simulate(iso_codes, start_date, end_date)
        serializer = self.serializer_class(instance=records, many=True)
        return Response(serializer.data)


class CasesCounterfactualDailyAbsoluteView(
    CasesCounterfactualViewMixin, viewsets.ViewSet
):
    """Counterfactual daily new and cumulative cases"""

    serializer_class = CasesCounterfactualDailyAbsoluteSerializer

    def simulate(self, iso_codes, start_date, end_date):
        return CounterfactualCasesRecord.simulate_counterfactual_records(
            iso_codes, start_date, end_date
        )


class CasesCounterfactualDailyNormalisedView(
    CasesCounterfactualViewMixin, viewsets.ViewSet
):
    """Counterfactual daily new and cumulative cases normalised by population"""

    serializer_class = CasesCounterfactualDailyNormalisedSerializer

    def simulate(self, iso_codes, start_date, end_date):
        return CounterfactualCasesRecord.simulate_counterfactual_records(
            iso_codes, start_date, end_date
        )


class CasesCounterfactualIntegratedView(CasesCounterfactualViewMixin, viewsets.ViewSet):
    """Counterfactual integrated number of cases normalised by population"""

    serializer_class = CasesCounterfactualIntegratedSerializer

    def simulate(self, iso_codes, start_date, end_date):
        return CounterfactualCasesRecord.simulate_counterfactual_summary_records(
            iso_codes, start_date, end_date
        )


class CasesRealViewMixin(ABC):
    """Interface for real cases views"""

    @property
    @classmethod
    @abstractmethod
    def serializer_class(cls):
        return NotImplementedError

    http_method_names = ["get", "head", "list", "options"]

    def get_queryset(self):
        """Construct a default queryset with filters"""

        # Annotate the queryset with cumulative cases information
        # We run a window function over all entries, summing `cases` over all previous entries
        # We finish by returning the query ordered by date
        queryset = CasesRecord.objects.annotate(
            summed_avg_cases=Window(
                expression=Sum("weekly_avg_cases"),
                partition_by=[F("country")],
                order_by=F("date").asc(),
            )
        ).order_by("country__iso_code", "date")

        # Apply filters on ISO code, start date and end date
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


class CasesRealDailyAbsoluteView(CasesRealViewMixin, viewsets.ModelViewSet):
    """Daily new and cumulative cases"""

    serializer_class = CasesRealDailyAbsoluteSerializer


class CasesRealDailyNormalisedView(CasesRealViewMixin, viewsets.ModelViewSet):
    """Daily new and cumulative cases normalised by population"""

    serializer_class = CasesRealDailyNormalisedSerializer


class CasesRealIntegratedView(CasesRealViewMixin, viewsets.ModelViewSet):
    """Integrated number of cases normalised by population"""

    serializer_class = CasesRealIntegratedSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        # Aggregate by country, calculating total cases and per-capita total cases
        return queryset.values("country").annotate(
            date=Max("date"),
            summed_avg_cases=Sum("weekly_avg_cases"),
            summed_avg_cases_per_million=ExpressionWrapper(
                1e6 * Sum("weekly_avg_cases") / F("country__population"), output_field=FloatField()
            ),
        )
