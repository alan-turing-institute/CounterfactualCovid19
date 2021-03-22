from django.urls import path
from . import views

urlpatterns = [
    path("knotdateset", views.KnotDateSetView.as_view({"get": "list"})),
    path("modeldaterange", views.ModelDateRangeView.as_view({"get": "list"})),
    path("possibledateset", views.PossibleDatesView.as_view({"get": "list"})),
]