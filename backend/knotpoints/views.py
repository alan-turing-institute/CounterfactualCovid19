from django.shortcuts import render
from rest_framework import viewsets
from .serializers import KnotPointsSerializer
from .models import KnotPoints

# Create your views here.
class KnotPointsView(viewsets.ModelViewSet):
    serializer_class = KnotPointsSerializer
    queryset = KnotPoints.objects.all()
    http_method_names = ["get", "list"]
