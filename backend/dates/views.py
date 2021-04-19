"""Views for Django dates module"""
from rest_framework import viewsets
from .serializers import (
    KnotDateSetSerializer,
    ModelDateRangeSerializer,
    PossibleDateSetSerializer,
)
from .models import KnotDateSet, ModelDateRange, PossibleDateSet


class KnotDateSetView(viewsets.ModelViewSet):
    """View for KnotDateSet"""

    serializer_class = KnotDateSetSerializer
    queryset = KnotDateSet.objects.all()  # pylint: disable=no-member
    http_method_names = ["get", "list"]


class ModelDateRangeView(viewsets.ModelViewSet):
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


class PossibleDateSetView(viewsets.ModelViewSet):
    """View for PossibleDateSet"""

    serializer_class = PossibleDateSetSerializer
    http_method_names = ["get", "list"]

    def get_queryset(self):
        """Construct a default queryset with filters"""
        queryset = PossibleDateSet.objects.all()  # pylint: disable=no-member
        # Apply filter on ISO code
        iso_code = self.request.query_params.get("iso_code", None)
        if iso_code:
            queryset = queryset.filter(country__iso_code=iso_code)
        return queryset
