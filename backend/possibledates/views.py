from django.shortcuts import render
from rest_framework import viewsets
from .serializers import PossibleDatesSerializer
from .models import PossibleDates

# Create your views here.
class PossibleDatesView(viewsets.ModelViewSet):
    serializer_class = PossibleDatesSerializer
    queryset = PossibleDates.objects.all()
    http_method_names = ["get", "list"]
