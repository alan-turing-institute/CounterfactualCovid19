from datetime import date
import pandas as pd
from .concrete import CasesRecord
from django.db import models
from knotpoints.models import KnotPoints
from dates.models import Dates

class CounterfactualCasesRecord:
    def __init__(self, iso_code, date, weekly_avg_cases, summed_avg_cases):
        self.iso_code = iso_code
        self.date = date
        self.weekly_avg_cases = weekly_avg_cases
        self.summed_avg_cases = summed_avg_cases

    KnotPoints = models.ForeignKey(KnotPoints, related_name="counterfactual_knotPoints_records", on_delete=models.CASCADE)
    Dates = models.ForeignKey(Dates, related_name="conterfactual_dates_records", on_delete=models.CASCADE)

    @staticmethod
    def simulate_counterfactual_dataframes(iso_codes, start_date, end_date):
        """List of dicts containing counterfactual simulations for one or more countries"""
        # Load data from database
        df_data = pd.DataFrame.from_records(
            CasesRecord.objects.all().values(
                "country__iso_code",
                "country__population",
                "date",
                "weekly_avg_cases",
            )
        ).rename(
            columns={
                "country__iso_code": "iso_code",
                "country__population": "population",
            }
        )
        df_data_knotpoints = pd.DataFrame.from_records(
            KnotPoints.objects.all().values(
                "country","knot_date_1","knot_date_2",
                 "n_knots","growth_factor_1","growth_factor_2",
                  "growth_factor_3","weight")).rename(columns={
                "country": "iso_code"})

        df_dates = pd.DataFrame.from_records(
            Dates.objects.all().values(
                "country", "initial_date", "maximum_date")).rename(columns={
                "country": "iso_code"})

        print (df_data_knotpoints.head())
        print (df_dates.head())

        # Filter by date if requested
        if start_date:
            df_data = df_data[df_data["date"] >= date.fromisoformat(start_date)]
        if end_date:
            df_data = df_data[df_data["date"] < date.fromisoformat(end_date)]
        # Use all countries if none are provided
        if not iso_codes:
            iso_codes = df_data.iso_code.unique()
        # Simulate each requested country
        df_counterfactuals = [
            CounterfactualCasesRecord.add_cumulative_sum(
                CounterfactualCasesRecord.simulate_single_country(
                    df_data[df_data["iso_code"] == iso_code]
                )
            )
            for iso_code in sorted(iso_codes)
        ]
        return df_counterfactuals

    @staticmethod
    def simulate_counterfactual_records(iso_codes, start_date, end_date, summary=False):
        df_counterfactuals = (
            CounterfactualCasesRecord.simulate_counterfactual_dataframes(
                iso_codes, start_date, end_date
            )
        )
        if summary:
            df_counterfactuals = [
                df[df["date"] == df["date"].max()] for df in df_counterfactuals
            ]
        # Convert to records, flatten/combine and return
        return sum([df.to_dict("records") for df in df_counterfactuals], [])

    @staticmethod
    def add_cumulative_sum(df_country_data):
        """Counterfactual simulation for a single country"""
        df_out = df_country_data.copy().sort_values(by=["date"])
        df_out["summed_avg_cases"] = df_out["weekly_avg_cases"].cumsum()
        return df_out

    @staticmethod
    def simulate_single_country(df_country_data):
        """Counterfactual simulation for a single country"""
        df_out = df_country_data.copy()
        df_out["weekly_avg_cases"] = (
            df_out["weekly_avg_cases"]
            .rolling(10, center=True, closed=None)
            .mean()
            .fillna(0)
        )
        return df_out

    def __str__(self):
        return f"({self.iso_code}) [{self.date}] => {self.weekly_avg_cases} ({self.summed_avg_cases})"
