from .concrete import CasesRecord
import pandas as pd
from datetime import date


class CounterfactualCasesRecord:
    def __init__(self, iso_code, date, cases, cumulative_cases):
        self.iso_code = iso_code
        self.date = date
        self.cases = cases
        self.cumulative_cases = cumulative_cases

    @staticmethod
    def simulate_counterfactual_records(iso_codes, start_date, end_date):
        """List of dicts containing counterfactual simulations for one or more countries"""
        # Load data from database
        df_data = pd.DataFrame.from_records(
            CasesRecord.objects.all().values(
                "country__iso_code",
                "country__population",
                "date",
                "cases",
            )
        ).rename(
            columns={
                "country__iso_code": "iso_code",
                "country__population": "population",
            }
        )
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
            CounterfactualCasesRecord.add_cumulative(
                CounterfactualCasesRecord.simulate_single_country(
                    df_data[df_data["iso_code"] == iso_code]
                )
            )
            for iso_code in iso_codes
        ]
        # Convert to records, flatten/combine and return
        return sum([df.to_dict("records") for df in df_counterfactuals], [])

    @staticmethod
    def add_cumulative(df_country_data):
        """Counterfactual simulation for a single country"""
        df_out = df_country_data.sort_values(by=["date"])
        df_out["cumulative_cases"] = df_out["cases"].cumsum()
        return df_out

    @staticmethod
    def simulate_single_country(df_country_data):
        """Counterfactual simulation for a single country"""
        return df_country_data

    def __str__(self):
        return (
            f"({self.iso_code}) [{self.date}] => {self.cases} ({self.cumulative_cases})"
        )
