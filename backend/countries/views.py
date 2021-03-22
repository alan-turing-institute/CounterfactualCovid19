"""Views for Django countries module"""
from rest_framework import viewsets
from .serializers import CountrySerializer
from .models import Country


class CountryView(viewsets.ModelViewSet):
    """View for Country"""

    serializer_class = CountrySerializer
    queryset = Country.objects.all()  # pylint: disable=no-member
    http_method_names = ["get", "list"]
