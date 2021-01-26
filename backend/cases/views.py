from .serializers import (
    TotalCasesSerializer,
    TimeSeriesCasesSerializer,
    DailyCounterfactualCasesSerializer,
)
from .models import TotalCases, TimeSeriesCases, DailyCounterfactualCases
from rest_framework import mixins, viewsets
from rest_framework.response import Response
import pandas as pd


# Total number of cases
class TotalCasesView(viewsets.ModelViewSet):
    serializer_class = TotalCasesSerializer
    queryset = TotalCases.objects.all()
    http_method_names = ["get", "head", "list", "options"]


# Daily and cumulative cases on a date
class TimeSeriesCasesView(viewsets.ModelViewSet):
    serializer_class = TimeSeriesCasesSerializer
    queryset = TimeSeriesCases.objects.all()
    http_method_names = ["get", "head", "list", "options"]


class DailyCounterfactualCasesViewSet(viewsets.ViewSet):
    # Required for the Browsable API renderer to have a nice form.
    serializer_class = DailyCounterfactualCasesSerializer

    def list(self, request):
        counterfactual_records = []
        df_data = pd.DataFrame(list(TimeSeriesCases.objects.all().values()))
        df_data.rename(
            columns={"daily_cases": "cases", "daily_cum_cases": "cumulative_cases"},
            inplace=True,
        )
        for iso_code in df_data.iso_code.unique():
            df_country = df_data[
                df_data["iso_code"] == iso_code
            ]  # data for a single country
            # Counterfactual simulation is called here
            counterfactual_records += df_country.to_dict("records")
        serializer = DailyCounterfactualCasesSerializer(
            instance=counterfactual_records, many=True
        )
        return Response(serializer.data)
