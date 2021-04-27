"""Views for Django dates module"""
from rest_framework import viewsets
from django.contrib.postgres.aggregates import ArrayAgg
from .serializers import (
    KnotDateSetSerializer,
    ModelDateRangeSerializer,
    PossibleLockdownDateSetSerializer,
    PossibleRestrictionsDateSetSerializer,
)
from .models import KnotDateSet, ModelDateRange, PossibleDateSet


class KnotDateSetView(viewsets.ReadOnlyModelViewSet):
    """View for KnotDateSet"""

    serializer_class = KnotDateSetSerializer
    queryset = KnotDateSet.objects.all()  # pylint: disable=no-member
    http_method_names = ["get", "list"]


class ModelDateRangeView(viewsets.ReadOnlyModelViewSet):
    """View for ModelDateRange"""

    serializer_class = ModelDateRangeSerializer
    queryset = ModelDateRange.objects.all()  # pylint: disable=no-member
    http_method_names = ["get", "list"]

    def get_queryset(self):
        """Construct a default queryset with filters"""
        queryset = ModelDateRange.objects.all()  # pylint: disable=no-member
        # Apply filter on ISO code
        iso_code = self.request.query_params.get("iso_code", None)
        if iso_code:
            queryset = queryset.filter(country__iso_code=iso_code)
        return queryset


class PossibleLockdownDateSetView(viewsets.ReadOnlyModelViewSet):
    """View of PossibleDateSet which gives the possible lockdown dates for a given first-restrictions date"""

    serializer_class = PossibleLockdownDateSetSerializer
    http_method_names = ["get", "list"]

    def get_queryset(self):
        """Construct a default queryset with filters"""
        queryset = PossibleDateSet.objects.all()  # pylint: disable=no-member
        # Apply filters on ISO code and date of first restrictions
        iso_code = self.request.query_params.get("iso_code", None)
        restrictions_date = self.request.query_params.get("restrictions_date", None)
        if iso_code:
            queryset = queryset.filter(country__iso_code=iso_code)
        if restrictions_date:
            queryset = queryset.filter(
                dates_counterfactual_first_restrictions=restrictions_date
            )
        return queryset.values("country__iso_code").annotate(
            lockdown_dates=ArrayAgg("dates_counterfactual_lockdown")
        )

class PossibleRestrictionsDateSetView(viewsets.ReadOnlyModelViewSet):
    """View of PossibleDateSet which gives the possible first-restrictions dates for a given lockdown date"""

    serializer_class = PossibleRestrictionsDateSetSerializer
    http_method_names = ["get", "list"]

    def get_queryset(self):
        """Construct a default queryset with filters"""
        queryset = PossibleDateSet.objects.all()  # pylint: disable=no-member
        # Apply filters on ISO code and date of first restrictions
        iso_code = self.request.query_params.get("iso_code", None)
        lockdown_date = self.request.query_params.get("lockdown_date", None)
        if iso_code:
            queryset = queryset.filter(country__iso_code=iso_code)
        if lockdown_date:
            queryset = queryset.filter(
                dates_counterfactual_lockdown=lockdown_date
            )
        return queryset.values("country__iso_code").annotate(
            restrictions_dates=ArrayAgg("dates_counterfactual_first_restrictions")
        )

