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

    KnotPoints = models.ForeignKey(
        KnotPoints,
        related_name="counterfactual_knotPoints_records",
        on_delete=models.CASCADE,
    )
    Dates = models.ForeignKey(
        Dates, related_name="conterfactual_dates_records", on_delete=models.CASCADE
    )

    @staticmethod
    def simulate_counterfactual_dataframes(iso_codes, start_date, end_date):
        """List of dicts containing counterfactual simulations for one or more countries"""
        # Load data from database
        df_data = pd.DataFrame.from_records(
            CasesRecord.objects.all().values(
                "country__iso_code", "country__population", "date", "weekly_avg_cases"
            )
        ).rename(
            columns={
                "country__iso_code": "iso_code",
                "country__population": "population",
            }
        )
        df_data["date"] = pd.to_datetime(df_data.date, format="%Y-%m-%d")

        df_data_knotpoints = pd.DataFrame.from_records(
            KnotPoints.objects.all().values(
                "country",
                "knot_date_1",
                "knot_date_2",
                "n_knots",
                "growth_factor_1",
                "growth_factor_2",
                "growth_factor_3",
                "weight",
            )
        ).rename(columns={"country": "iso_code"})
        df_data_knotpoints["knot_date_1"] = pd.to_datetime(
            df_data_knotpoints.knot_date_1, format="%Y-%m-%d"
        )
        df_data_knotpoints["knot_date_2"] = pd.to_datetime(
            df_data_knotpoints.knot_date_2, format="%Y-%m-%d"
        )

        df_dates = pd.DataFrame.from_records(
            Dates.objects.all().values("country", "initial_date", "maximum_date")
        ).rename(columns={"country": "iso_code"})
        df_dates["initial_date"] = pd.to_datetime(
            df_dates.initial_date, format="%Y-%m-%d"
        )
        df_dates["maximum_date"] = pd.to_datetime(
            df_dates.maximum_date, format="%Y-%m-%d"
        )

        # Filter by date if requested
        if start_date:
            df_data = df_data[df_data["date"] >= start_date]
        if end_date:
            df_data = df_data[df_data["date"] < end_date]
        # Use all countries if none are provided

        if not iso_codes:
            iso_codes = df_data.iso_code.unique()

        counterfactual_shift = (0, 0)
        # Simulate each requested country

        df_counterfactuals = []
        for iso_code in sorted(iso_codes):
            df_country_data = df_data[df_data["iso_code"] == iso_code]
            df_country_dates = df_dates[df_dates["iso_code"] == iso_code]
            df_country_knotpoints = df_data_knotpoints[df_data_knotpoints["iso_code"] == iso_code]

            single_country = CounterfactualCasesRecord.simulate_single_country(counterfactual_shift, df_country_data,
                                                                               df_country_dates, df_country_knotpoints)

            initial_date = pd.to_datetime(df_country_dates.initial_date.values[0], format="%Y-%m-%d")
            intial_cum_cases = \
            df_country_data[df_country_data["date"] < initial_date]["weekly_avg_cases"].cumsum().iloc[-1]

            df_counterfactuals.append(
                CounterfactualCasesRecord.add_cumulative_sum(single_country, initial_date, intial_cum_cases))

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
    def add_cumulative_sum(df_country_data, initial_date, intial_cum_cases=0):
        """Counterfactual simulation for a single country"""
        df_out = df_country_data.copy().sort_values(by=["date"])

        #
        df_out.loc[df_out["date"] == initial_date, ['weekly_avg_cases']] = \
        df_out[df_out["date"] == initial_date]['weekly_avg_cases'] + intial_cum_cases

        df_out["summed_avg_cases"] = df_out["weekly_avg_cases"].cumsum()

        return df_out

    @staticmethod
    def simulate_single_country(counterfactual_shift, df_country_data, df_dates_data, df_knots):

        """Counterfactual simulation for a single country"""

        # dates for the simulation
        initial_date = df_dates_data["initial_date"].values[0]
        maximum_date = df_dates_data["maximum_date"].values[0]


        # starting number of cases
        initial_case_number = \
            df_country_data[df_country_data["date"] == initial_date]["weekly_avg_cases"].values[0]


        # counterfactual shift for restrictions and lockdown
        n_days_counterfactual_first_restriction = counterfactual_shift[0]
        n_days_counterfactual_lockdown = counterfactual_shift[1]

        df_knots["counterfactual_knot_date_1"] = df_knots["knot_date_1"] - pd.Timedelta(
            days=n_days_counterfactual_first_restriction)
        df_knots["counterfactual_knot_date_2"] = df_knots["knot_date_2"] - pd.Timedelta(
            days=n_days_counterfactual_lockdown)

        # Set dates to simulate
        dates_range = pd.date_range(start=initial_date, end=maximum_date, freq="D").tolist()

        daily_cases_sim = pd.DataFrame()

        for knots in df_knots.itertuples():

            # create an empty dataframe with dates of the simulation as columns and rows as the weight of this knot point
            daily_cases_sim_i = pd.DataFrame(
                index=[i for i in range(knots.weight)],
                columns=pd.date_range(
                    start=initial_date, end=maximum_date, freq="D"
                ).tolist(),
            )

            # the first day is the actual number of cases as  initial seed for the simulation
            daily_cases_sim_i.iloc[:, 0] = [
                initial_case_number for _ in range(knots.weight)
            ]

            for d in dates_range[1:]:
                inc_tminus1 = daily_cases_sim_i[(d - pd.Timedelta(days=1))]

                # Depending on number of knots
                if knots.n_knots == 1:
                    if d <= knots.counterfactual_knot_date_1:
                        growth = knots.growth_factor_1
                    else:
                        growth = knots.growth_factor_2
                else:  # TWO knot points
                    if d <= knots.counterfactual_knot_date_1:
                        growth = knots.growth_factor_1
                    elif d <= knots.counterfactual_knot_date_2:
                        growth = knots.growth_factor_2
                    else:
                        growth = knots.growth_factor_3

                # Calculate daily cases at time t given the number of cases in t -1 and the growth factor.
                inc_t = growth * inc_tminus1
                daily_cases_sim_i.loc[:, d] = inc_t

            # Bind knot-specific dataframes to full scenario dataframe
            daily_cases_sim = pd.concat([daily_cases_sim, daily_cases_sim_i])

        # the counterfactual cases are the mean value of all scenarios
        counterfactual_cases = daily_cases_sim.mean(axis=0)

        counterfactual_cases_df = pd.DataFrame(
            {'date': pd.to_datetime(counterfactual_cases.index, format='%Y-%m-%d'),
             'weekly_avg_cases': counterfactual_cases.values})

        df_out = df_country_data.copy()
        # remove columns of weekly_avg_cases because it will be replaced with counterfactual cases
        df_out.drop(columns=["weekly_avg_cases"], inplace=True)

        # merge dataframes adding new counterfactual cases
        df_out_final = pd.merge(df_out, counterfactual_cases_df, on="date", how="outer")
        df_out_final.fillna(0, inplace=True)

        # make sure type is the expected one.
        df_out_final["date"] = df_out_final["date"].dt.date

        return df_out_final

    def __str__(self):
        return f"({self.iso_code}) [{self.date}] => {self.weekly_avg_cases} ({self.summed_avg_cases})"
