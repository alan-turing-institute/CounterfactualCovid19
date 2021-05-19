"""Views for Django countries module"""
from rest_framework import viewsets
from .serializers import CountryGeometrySerializer, CountryDemographicSerializer
from .models import Country


class CountryGeometryView(viewsets.ModelViewSet):
    """View for Country geometries"""

    serializer_class = CountryGeometrySerializer
    queryset = Country.objects.all()  # pylint: disable=no-member
    http_method_names = ["get", "list"]


class CountryDemographicView(viewsets.ModelViewSet):
    """View for Country demographics"""

    serializer_class = CountryDemographicSerializer
    http_method_names = ["get", "list"]

    def get_queryset(self):
        """Construct a default queryset with filters"""
        queryset = Country.objects.all()  # pylint: disable=no-member
        iso_code = self.request.query_params.get("iso_code", None)
        if iso_code:
            queryset = queryset.filter(iso_code=iso_code)
        return queryset
