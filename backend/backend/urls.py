"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from cases.views import (
    CasesCounterfactualDailyAbsoluteView,
    CasesCounterfactualDailyNormalisedView,
    CasesCounterfactualIntegratedView,
    CasesRealDailyAbsoluteView,
    CasesRealDailyNormalisedView,
    CasesRealIntegratedView,
    DeathsRealDailyNormalisedView,
)
from countries.views import CountryGeometryView, CountryDemographicView
from dates.views import (
    KnotDateSetView,
    ModelDateRangeView,
    PossibleLockdownDateSetView,
    PossibleRestrictionsDateSetView,
)

router = routers.DefaultRouter()

# Cases
router.register(
    "cases/counterfactual/daily/absolute",
    CasesCounterfactualDailyAbsoluteView,
    basename="counterfactual_daily_absolute",
)
router.register(
    "cases/counterfactual/daily/normalised",
    CasesCounterfactualDailyNormalisedView,
    basename="counterfactual_daily_normalised",
)
router.register(
    "cases/counterfactual/integrated",
    CasesCounterfactualIntegratedView,
    basename="counterfactual_integrated",
)
router.register(
    "cases/real/daily/absolute",
    CasesRealDailyAbsoluteView,
    basename="real_daily_absolute",
)
router.register(
    "cases/real/daily/normalised",
    CasesRealDailyNormalisedView,
    basename="real_daily_normalised",
)
router.register(
    "cases/real/integrated",
    CasesRealIntegratedView,
    basename="real_integrated",
)
# Deaths
router.register(
    "deaths/real/daily/normalised",
    DeathsRealDailyNormalisedView,
    basename="deaths_real_daily_normalised",
)
# Countries
router.register("country/geometry", CountryGeometryView, basename="country_geometry")
router.register(
    "country/demographic", CountryDemographicView, basename="country_demographic"
)
# Dates
router.register("knotpoints", KnotDateSetView, basename="knotpoints")
router.register("modeldaterange", ModelDateRangeView, basename="modeldaterange")
router.register("lockdowndates", PossibleLockdownDateSetView, basename="lockdowndates")
router.register(
    "restrictionsdates", PossibleRestrictionsDateSetView, basename="restrictiondates"
)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
]
