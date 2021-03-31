"""Ephemeral models for Django cases app"""
import pandas as pd
from counterfactual import simulate_records
from dates.models import KnotDateSet, ModelDateRange, PossibleDateSet
from cases.models import CasesRecord


class CounterfactualCasesRecord:
    """Counterfactual rolling weekly average cases numbers on a daily basis"""

    def __init__(self, iso_code, date, weekly_avg_cases, summed_avg_cases):
        self.iso_code = iso_code
        self.date = date
        self.weekly_avg_cases = weekly_avg_cases
        self.summed_avg_cases = summed_avg_cases

    @staticmethod
    def simulate(iso_codes, boundary_dates, knot_dates, summary):
        # Load real cases data from database and filter by date and iso_code if requested
        df_casesrecord = pd.DataFrame.from_records(
            CasesRecord.objects.all().values(  # pylint: disable=no-member
                "country__iso_code", "country__population", "date", "weekly_avg_cases"
            )
        ).rename(
            columns={
                "country__iso_code": "iso_code",
                "country__population": "population",
            }
        )
        df_casesrecord["date"] = pd.to_datetime(df_casesrecord.date, format=r"%Y-%m-%d")
        start_date, end_date = boundary_dates
        if start_date:
            df_casesrecord = df_casesrecord[df_casesrecord["date"] >= start_date]
        if end_date:
            df_casesrecord = df_casesrecord[df_casesrecord["date"] < end_date]
        if iso_codes:
            df_casesrecord = df_casesrecord[df_casesrecord["iso_code"].isin(iso_codes)]

        # Load knotpoints from database
        df_knotdateset = pd.DataFrame.from_records(
            KnotDateSet.objects.all().values(  # pylint: disable=no-member
                "country",
                "knot_date_1",
                "knot_date_2",
                "growth_factor_0_1",
                "growth_factor_1_2",
                "growth_factor_2_3",
                "weight",
            )
        ).rename(columns={"country": "iso_code"})
        df_knotdateset["knot_date_1"] = pd.to_datetime(
            df_knotdateset.knot_date_1, format=r"%Y-%m-%d"
        )
        df_knotdateset["knot_date_2"] = pd.to_datetime(
            df_knotdateset.knot_date_2, format=r"%Y-%m-%d"
        )

        # Load date range that the simulation can run over
        df_modeldaterange = pd.DataFrame.from_records(
            ModelDateRange.objects.all().values(  # pylint: disable=no-member
                "country", "initial_date", "maximum_date"
            )
        ).rename(columns={"country": "iso_code"})
        df_modeldaterange["initial_date"] = pd.to_datetime(
            df_modeldaterange.initial_date, format=r"%Y-%m-%d"
        )
        df_modeldaterange["maximum_date"] = pd.to_datetime(
            df_modeldaterange.maximum_date, format=r"%Y-%m-%d"
        )

        # Load all possibilities for dates of first restrictions and lockdown
        df_possibledateset = pd.DataFrame.from_records(
            PossibleDateSet.objects.all().values(  # pylint: disable=no-member
                "n_days_first_restrictions",
                "n_days_lockdown",
                "dates_counterfactual_first_restrictions",
                "dates_counterfactual_lockdown",
                "country",
            )
        ).rename(columns={"country": "iso_code"})

        return simulate_records(df_casesrecord, df_knotdateset, df_modeldaterange, df_possibledateset, knot_dates, summary)

    def __str__(self):
        return f"({self.iso_code}) [{self.date}] => {self.weekly_avg_cases} ({self.summed_avg_cases})"
