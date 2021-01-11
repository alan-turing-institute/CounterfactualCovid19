from django.urls import path
from . import views

urlpatterns = [
    path("countries", views.CountryView.as_view({"get": "list"})),
]
