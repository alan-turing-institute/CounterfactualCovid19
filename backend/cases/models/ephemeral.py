from datetime import date
import pandas as pd
from .concrete import CasesRecord
from django.db import models
from knotpoints.models import KnotPoints
from dates.models import ModelDateRange


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
    ModelDateRange = models.ForeignKey(
        ModelDateRange,
        related_name="conterfactual_dates_records",
        on_delete=models.CASCADE,
    )

    @staticmethod
    def simulate_counterfactual_dataframes(iso_codes, start_date, end_date):
        """List of dicts containing counterfactual simulations for one or more countries"""
        # Load cases data from database
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
        df_data["date"] = pd.to_datetime(df_data.date, format=r"%Y-%m-%d")

        # Load knotpoints from database
        df_data_knotpoints = pd.DataFrame.from_records(
            KnotPoints.objects.all().values(
                "country",
                "knot_date_1",
                "knot_date_2",
                "n_knots",
                "growth_factor_0_1",
                "growth_factor_1_2",
                "growth_factor_2_3",
                "weight",
            )
        ).rename(columns={"country": "iso_code"})
        df_data_knotpoints["knot_date_1"] = pd.to_datetime(
            df_data_knotpoints.knot_date_1, format=r"%Y-%m-%d"
        )
        df_data_knotpoints["knot_date_2"] = pd.to_datetime(
            df_data_knotpoints.knot_date_2, format=r"%Y-%m-%d"
        )

        # Load date range that the simulation can run over
        df_dates = pd.DataFrame.from_records(
            ModelDateRange.objects.all().values(
                "country", "initial_date", "maximum_date"
            )
        ).rename(columns={"country": "iso_code"})
        df_dates["initial_date"] = pd.to_datetime(
            df_dates.initial_date, format=r"%Y-%m-%d"
        )
        df_dates["maximum_date"] = pd.to_datetime(
            df_dates.maximum_date, format=r"%Y-%m-%d"
        )

        # Filter by date if requested
        if start_date:
            df_data = df_data[df_data["date"] >= start_date]
        if end_date:
            df_data = df_data[df_data["date"] < end_date]

        # Use all countries if none are provided
        if not iso_codes:
            iso_codes = df_data.iso_code.unique()

        # Number of days to shift the two knotpoints by
        counterfactual_shift = (0, 0)

        # Simulate each requested country
        df_counterfactuals = []
        for iso_code in sorted(iso_codes):
            df_country_data = df_data[df_data["iso_code"] == iso_code]
            df_country_dates = df_dates[df_dates["iso_code"] == iso_code]
            df_country_knotpoints = df_data_knotpoints[
                df_data_knotpoints["iso_code"] == iso_code
            ]

            # Simulate a single country using cases data, model dates and knotpoints
            single_country = CounterfactualCasesRecord.simulate_single_country(
                counterfactual_shift,
                df_country_data,
                df_country_dates,
                df_country_knotpoints,
            )

            # Calculate the number of cumulative cases that occurred before the simulation start date
            initial_date = pd.to_datetime(
                df_country_dates.initial_date.values[0], format=r"%Y-%m-%d"
            )
            initial_cum_cases = (
                df_country_data[df_country_data["date"] < initial_date][
                    "weekly_avg_cases"
                ]
                .cumsum()
                .iloc[-1]
            )

            # Add cumulative cases that occurred before the simulation start date
            df_counterfactuals.append(
                CounterfactualCasesRecord.add_cumulative_sum(
                    single_country, initial_date, initial_cum_cases
                )
            )

        return df_counterfactuals

    @staticmethod
    def simulate_counterfactual_records(iso_codes, start_date, end_date, summary=False):
        df_counterfactuals = (
            CounterfactualCasesRecord.simulate_counterfactual_dataframes(
                iso_codes, start_date, end_date
            )
        )
        # Get the total number of cases on the final day of simulation
        if summary:
            df_counterfactuals = [
                df[df["date"] == df["date"].max()] for df in df_counterfactuals
            ]
        # Convert to records, flatten/combine and return
        return sum([df.to_dict("records") for df in df_counterfactuals], [])

    @staticmethod
    def add_cumulative_sum(df_country_data, initial_date, initial_cum_cases=0):
        """Counterfactual simulation for a single country"""
        # Make a copy of the input dataframe and sort it by date
        df_out = df_country_data.copy().sort_values(by=["date"])
        # Add an offset number of cases to the first entry
        df_out.loc[df_out["date"] == initial_date, ["weekly_avg_cases"]] = (
            df_out[df_out["date"] == initial_date]["weekly_avg_cases"]
            + initial_cum_cases
        )
        # Calculate the cumulative sum
        df_out["summed_avg_cases"] = df_out["weekly_avg_cases"].cumsum()
        return df_out

    @staticmethod
    def simulate_single_country(
        counterfactual_shift, df_country_data, df_dates_data, df_knots
    ):
        """Counterfactual simulation for a single country"""
        # Date range for the simulation
        initial_date = df_dates_data["initial_date"].iloc[0]
        maximum_date = df_dates_data["maximum_date"].iloc[0]

        # Starting number of cases
        initial_case_number = df_country_data[df_country_data["date"] == initial_date][
            "weekly_avg_cases"
        ].values[0]

        # Counterfactual shift for restrictions and lockdown
        n_days_counterfactual_first_restriction = counterfactual_shift[0]
        n_days_counterfactual_lockdown = counterfactual_shift[1]

        # Add a column for the counterfactual knot dates
        df_knots.loc[:, "counterfactual_knot_date_1"] = df_knots.loc[
            :, "knot_date_1"
        ] - pd.Timedelta(days=n_days_counterfactual_first_restriction)
        df_knots.loc[:, "counterfactual_knot_date_2"] = df_knots.loc[
            :, "knot_date_2"
        ] - pd.Timedelta(days=n_days_counterfactual_lockdown)

        # Set dates to simulate
        dates_range = pd.date_range(
            start=initial_date, end=maximum_date, freq="D"
        ).tolist()

        # Simulated number of cases on each day
        daily_cases_sim = []
        for knots in df_knots.itertuples():
            # Create an empty dataframe with dates of the simulation as columns and rows as the weight of this knot point
            daily_cases_sim_i = pd.DataFrame(
                index=[i for i in range(knots.weight)],
                columns=pd.date_range(
                    start=initial_date, end=maximum_date, freq="D"
                ).tolist(),
            )

            # Set the first day to the actual number of cases as initial seed for the simulation
            daily_cases_sim_i.iloc[:, 0] = [
                initial_case_number for _ in range(knots.weight)
            ]
            n_cases_tminus1 = daily_cases_sim_i[0]

            # Simulate all days from the second onwards
            for day_t in dates_range[1:]:
                # If there is one knot point then there are two possible time periods
                # If there are two knot points then there are three possible time periods
                if day_t <= knots.counterfactual_knot_date_1:
                    growth = knots.growth_factor_0_1
                else:
                    growth = knots.growth_factor_1_2
                    if knots.n_knots == 2 and day_t > knots.counterfactual_knot_date_2:
                        growth = knots.growth_factor_2_3

                # Calculate daily cases at time t given the number of cases in t -1 and the growth factor.
                n_cases_t = growth * n_cases_tminus1

                # Store number of cases in the dataframe
                daily_cases_sim_i.loc[:, day_t] = n_cases_t
                n_cases_tminus1 = n_cases_t

            # Add this simulation to the simulation ensemble
            daily_cases_sim.append(daily_cases_sim_i)

        # Combine all the simulations and take the mean
        counterfactual_cases_series = pd.concat(daily_cases_sim).mean(axis=0)
        df_counterfactual_cases = pd.DataFrame(
            {
                "date": pd.to_datetime(
                    counterfactual_cases_series.index, format=r"%Y-%m-%d"
                ),
                "weekly_avg_cases": counterfactual_cases_series.values,
            }
        )

        # Remove columns of weekly_avg_cases because it will be replaced with counterfactual cases
        df_real_cases = df_country_data.copy()
        df_real_cases.drop(columns=["weekly_avg_cases"], inplace=True)

        # Merge real and counterfactual dataframes and fill missing values
        df_out = pd.merge(
            df_real_cases, df_counterfactual_cases, on="date", how="outer"
        )
        df_out.fillna(0, inplace=True)

        # Make sure type is the expected one.
        df_out["date"] = df_out["date"].dt.date
        return df_out

    def __str__(self):
        return f"({self.iso_code}) [{self.date}] => {self.weekly_avg_cases} ({self.summed_avg_cases})"
