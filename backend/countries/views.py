from django.shortcuts import render
from rest_framework import viewsets
from .serializers import CountrySerializer
from .models import Country

# Create your views here.
class CountryView(viewsets.ModelViewSet):
    serializer_class = CountrySerializer
    queryset = Country.objects.all()
    http_method_names = ["get", "list"]
