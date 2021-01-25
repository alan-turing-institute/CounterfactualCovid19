from .serializers import TotalCasesSerializer, TimeSeriesCasesSerializer, TaskSerializer
from .models import TotalCases, TimeSeriesCases
from rest_framework import viewsets
from .generators import TaskGenerator
from rest_framework.response import Response

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


tasks = {
    1: TaskGenerator(id=1, name='Demo', owner='xordoquy', status='Done'),
    2: TaskGenerator(id=2, name='Model less demo', owner='xordoquy', status='Ongoing'),
    3: TaskGenerator(id=3, name='Sleep more', owner='xordoquy', status='New'),
}


class TaskViewSet(viewsets.ViewSet):
    # Required for the Browsable API renderer to have a nice form.
    serializer_class = TaskSerializer

    def list(self, request):
        serializer = TaskSerializer(instance=tasks.values(), many=True)
        return Response(serializer.data)