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

    KnotPoints = models.ForeignKey(KnotPoints, related_name="counterfactual_knotPoints_records",
                                   on_delete=models.CASCADE)
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
                "weekly_avg_cases"
            )
        ).rename(
            columns={
                "country__iso_code": "iso_code",
                "country__population": "population",
            }
        )
        df_data_knotpoints = pd.DataFrame.from_records(
            KnotPoints.objects.all().values(
                "country", "knot_date_1", "knot_date_2",
                "n_knots", "growth_factor_1", "growth_factor_2",
                "growth_factor_3", "weight")).rename(columns={
            "country": "iso_code"})

        df_dates = pd.DataFrame.from_records(
            Dates.objects.all().values(
                "country", "initial_date", "maximum_date")).rename(columns={
            "country": "iso_code"})

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
                    df_data[df_data["iso_code"] == iso_code], df_dates[df_dates["iso_code"] == iso_code],
                    df_data_knotpoints[df_data_knotpoints["iso_code"] == iso_code]
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
    def simulate_single_country(df_country_data, df_dates_data, df_knots):


        """Counterfactual simulation for a single country"""

        counterfactual_shift = (0, 0)

        initial_date = df_dates_data['initial_date'].values[0]
        maximum_date = df_dates_data['maximum_date'].values[0]

        initial_case_number = \
        df_country_data[df_country_data["date"] <= initial_date]["weekly_avg_cases"].cumsum().iloc[-1]

        n_days_counterfactual_first_restriction = counterfactual_shift[0]
        n_days_counterfactual_lockdown = counterfactual_shift[1]

        df_knots["counterfactual_knot_date_1"] = df_knots["knot_date_1"]  # - pd.Timedelta(
        #     days=n_days_counterfactual_first_restriction)
        df_knots["counterfactual_knot_date_2"] = df_knots["knot_date_2"]  # - pd.Timedelta(
        #  days=n_days_counterfactual_lockdown)

        # Set dates to simulate
        dates_range = pd.date_range(start=initial_date, end=maximum_date, freq="D").tolist()

        daily_cases_sim = pd.DataFrame()

        for i in range(df_knots.shape[0]):
            knots_best_country_counterfactual_i = df_knots.iloc[i]

            # Record number of knots
            n_knots = knots_best_country_counterfactual_i["n_knots"]

            # Set knot dates
            knot_date_1_i = knots_best_country_counterfactual_i["counterfactual_knot_date_1"]
            knot_date_2_i = knots_best_country_counterfactual_i["counterfactual_knot_date_2"]

            # Define mean growth parameters
            growth_factor_1_i = knots_best_country_counterfactual_i["growth_factor_1"]
            growth_factor_2_i = knots_best_country_counterfactual_i["growth_factor_2"]
            growth_factor_3_i = knots_best_country_counterfactual_i["growth_factor_3"]

            # Define number of simulation runs for specified knot dates
            n_runs_i = knots_best_country_counterfactual_i["weight"]

            daily_cases_sim_i = pd.DataFrame(
                index=[i for i in range(n_runs_i)],
                columns=pd.date_range(
                    start=initial_date, end=maximum_date, freq="D"
                ).tolist(),
            )

            daily_cases_sim_i.iloc[:, 0] = [initial_case_number for _ in range(n_runs_i)]

            for d in dates_range[1:]:
                inc_tminus1 = daily_cases_sim_i[
                    (d - pd.Timedelta(days=1))
                ]

                # Define growth parameters
                if n_knots == 0:  # NO knot points
                    growth = growth_factor_1_i

                elif n_knots == 1:  # ONE knot point
                    if d <= knot_date_1_i:
                        growth = growth_factor_1_i
                    else:
                        growth = growth_factor_2_i
                else:  # TWO knot points
                    if d <= knot_date_1_i:
                        growth = growth_factor_1_i
                    elif d <= knot_date_2_i:
                        growth = growth_factor_2_i
                    else:
                        growth = growth_factor_3_i

                # Calculate daily cases at time t and record
                inc_t = growth * inc_tminus1
                daily_cases_sim_i.loc[:, d] = inc_t

                # Bind knot-specific dataframes to full scenario dataframe

            daily_cases_sim = pd.concat([daily_cases_sim, daily_cases_sim_i])

        counterfactual_cases = daily_cases_sim.mean(axis=0)

        counterfactual_cases_df = pd.DataFrame(
            {'date': counterfactual_cases.index, 'weekly_avg_cases': counterfactual_cases.values})
        print('CONTERFACTUAL DATAFRAME')
        print(counterfactual_cases_df.head())

        df_out = df_country_data.copy()
        df_out.drop(columns=['weekly_avg_cases'], inplace=True)

        counterfactual_cases_df['date'] = counterfactual_cases_df['date'].astype(object)

        counterfactual_cases_df.info()
        df_out.info()

        df_out_final = pd.merge(df_out, counterfactual_cases_df, on='date', how="outer")
        df_out_final.fillna(0, inplace=True)

        # df_out = df_country_data.copy()
        # df_out["weekly_avg_cases"] = (
        #     df_out["weekly_avg_cases"]
        #         .rolling(10, center=True, closed=None)
        #         .mean()
        #         .fillna(0)
        # )

        # print (test)
        print(df_out_final)
        #df_out_final['date'] = pd.to_datetime(df_out_final['date'],format="%Y-%m-%d")

        return df_out_final

    def __str__(self):
        return f"({self.iso_code}) [{self.date}] => {self.weekly_avg_cases} ({self.summed_avg_cases})"
