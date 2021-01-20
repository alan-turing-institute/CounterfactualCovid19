from rest_framework import viewsets
from .serializers import CasesSerializer
from .models import Cases

# Create your views here.
class CasesView(viewsets.ModelViewSet):
    serializer_class = CasesSerializer
    queryset = Cases.objects.all()
    http_method_names = ["get", "list"]
