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
    DeathsRealIntegratedView,
)
from countries.views import CountryGeometryView, CountryDemographicView
from dates.views import (
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
router.register(
    "deaths/real/integrated",
    DeathsRealIntegratedView,
    basename="deaths_real_integrated",
)
# Countries
router.register("country/geometry", CountryGeometryView, basename="country_geometry")
router.register(
    "country/demographic", CountryDemographicView, basename="country_demographic"
)
router.register(
    "country/importantdates", ModelDateRangeView, basename="country_importantdates"
)
# Dates
router.register(
    "dates/possible/lockdown",
    PossibleLockdownDateSetView,
    basename="dates_possible_lockdown",
)
router.register(
    "dates/possible/firstrestrictions",
    PossibleRestrictionsDateSetView,
    basename="dates_possible_firstrestrictions",
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
]
