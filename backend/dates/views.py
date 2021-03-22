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


class PossibleDateSetView(viewsets.ModelViewSet):
    """View for PossibleDateSet"""

    serializer_class = PossibleDateSetSerializer
    queryset = PossibleDateSet.objects.all()  # pylint: disable=no-member
    http_method_names = ["get", "list"]
