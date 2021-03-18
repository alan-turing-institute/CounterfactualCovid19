from django.urls import path
from . import views

urlpatterns = [
    path("knotpoints", views.DatesView.as_view({"get": "list"})),
]
