from django.urls import path
from . import views

urlpatterns = [
    path("modeldaterange", views.ModelDateRangeView.as_view({"get": "list"})),
    path("knotpointset", views.DatesView.as_view({"get": "list"})),
    path("possibledateset", views.PossibleDatesView.as_view({"get": "list"})),
]