from django.shortcuts import render
from rest_framework import viewsets
from .serializers import DatesSerializer
from .models import Dates

# Create your views here.
class DatesView(viewsets.ModelViewSet):
    serializer_class = DatesSerializer
    queryset = Dates.objects.all()
    http_method_names = ["get", "list"]
