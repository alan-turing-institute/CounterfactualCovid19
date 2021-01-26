from .concrete import TimeSeriesCases
import pandas as pd


class DailyCounterfactualCases:
    def __init__(self, iso_code, date, cases, cumulative_cases):
        self.iso_code = iso_code
        self.date = date
        self.cases = cases
        self.cumulative_cases = cumulative_cases

    @staticmethod
    def simulate_counterfactual_records(iso_codes=[]):
        """List of dicts containing counterfactual simulations for one or more countries"""
        # Load data from database
        df_data = pd.DataFrame(list(TimeSeriesCases.objects.all().values()))
        df_data.rename(
            columns={"daily_cases": "cases", "daily_cum_cases": "cumulative_cases"},
            inplace=True,
        )
        # Use all countries if none are provided
        if not iso_codes:
            iso_codes = df_data.iso_code.unique()
        # Simulate each requested country
        df_counterfactuals = [
            DailyCounterfactualCases.simulate_single_country(
                df_data[df_data["iso_code"] == iso_code]
            )
            for iso_code in iso_codes
        ]
        # Convert to records, flatten/combine and return
        return sum([df.to_dict("records") for df in df_counterfactuals], [])

    @staticmethod
    def simulate_single_country(df_country_data):
        """Counterfactual simulation for a single country"""
        return df_country_data

    def __str__(self):
        return (
            f"({self.iso_code}) [{self.date}] => {self.cases} ({self.cumulative_cases})"
        )
