from django.shortcuts import render
from rest_framework import viewsets
from .serializers import ModelDateRangeSerializer
from .models import ModelDateRange

# Create your views here.
class ModelDateRangeView(viewsets.ModelViewSet):
    serializer_class = ModelDateRangeSerializer
    queryset = ModelDateRange.objects.all()
    http_method_names = ["get", "list"]
