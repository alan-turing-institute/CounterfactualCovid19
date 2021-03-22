from django.shortcuts import render
from rest_framework import viewsets
from .serializers import KnotDateSetSerializer, ModelDateRangeSerializer, PossibleDateSetSerializer
from .models import KnotDateSet, ModelDateRange, PossibleDateSet

class KnotDateSetView(viewsets.ModelViewSet):
    serializer_class = KnotDateSetSerializer
    queryset = KnotDateSet.objects.all()
    http_method_names = ["get", "list"]

class ModelDateRangeView(viewsets.ModelViewSet):
    serializer_class = ModelDateRangeSerializer
    queryset = ModelDateRange.objects.all()
    http_method_names = ["get", "list"]

class PossibleDateSetView(viewsets.ModelViewSet):
    serializer_class = PossibleDateSetSerializer
    queryset = PossibleDateSet.objects.all()
    http_method_names = ["get", "list"]