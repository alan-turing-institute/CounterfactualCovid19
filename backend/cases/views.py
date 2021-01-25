from .serializers import TotalCasesSerializer, TimeSeriesCasesSerializer
from .models import TotalCases, TimeSeriesCases
from rest_framework import viewsets

# Create your views here.
class TotalCasesView(viewsets.ModelViewSet):
    serializer_class = TotalCasesSerializer
    queryset = TotalCases.objects.all()
    http_method_names = ["get", "list"]


# Create your views here.
class TimeSeriesCasesView(viewsets.ModelViewSet):
    serializer_class = TimeSeriesCasesSerializer
    queryset = TimeSeriesCases.objects.all()
    http_method_names = ["get", "list"]
