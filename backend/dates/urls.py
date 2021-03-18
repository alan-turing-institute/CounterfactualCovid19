from django.urls import path
from . import views

urlpatterns = [
    path("modeldaterange", views.ModelDateRangeView.as_view({"get": "list"})),
]
