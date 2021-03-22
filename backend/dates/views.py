from django.shortcuts import render
from rest_framework import viewsets
from .serializers import ModelDateRangeSerializer, KnotPointSetSerializer, PossibleDateSetSerializer
from .models import ModelDateRange, KnotPointSet, PossibleDateSet

class ModelDateRangeView(viewsets.ModelViewSet):
    serializer_class = ModelDateRangeSerializer
    queryset = ModelDateRange.objects.all()
    http_method_names = ["get", "list"]

class KnotPointSetView(viewsets.ModelViewSet):
    serializer_class = KnotPointSetSerializer
    queryset = KnotPointSet.objects.all()
    http_method_names = ["get", "list"]

class PossibleDateSetView(viewsets.ModelViewSet):
    serializer_class = PossibleDateSetSerializer
    queryset = PossibleDateSet.objects.all()
    http_method_names = ["get", "list"]