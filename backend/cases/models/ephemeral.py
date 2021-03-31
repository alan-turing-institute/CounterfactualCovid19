"""Ephemeral models for Django cases app"""
from bisect import bisect_left
from contextlib import suppress
import datetime
import pandas as pd
from dates.models import KnotDateSet, ModelDateRange, PossibleDateSet
from .concrete import CasesRecord


class CounterfactualCasesRecord:
    """Counterfactual rolling weekly average cases numbers on a daily basis"""

    def __init__(self, iso_code, date, weekly_avg_cases, summed_avg_cases):
        self.iso_code = iso_code
        self.date = date
        self.weekly_avg_cases = weekly_avg_cases
        self.summed_avg_cases = summed_avg_cases

    @staticmethod
    def to_date(input_string):
        """Convert a string to a datetime date"""
        return datetime.datetime.strptime(input_string, r"%Y-%m-%d").date()

    @staticmethod
    def simulate_counterfactual_dataframes(
        iso_codes, boundary_dates, knot_dates
    ):  # pylint: disable=too-many-locals
        """List of dicts containing counterfactual simulations for one or more countries"""
        # Load cases data from database
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

        # Load knotpoints from database
        df_knotdateset = pd.DataFrame.from_records(
            KnotDateSet.objects.all().values(  # pylint: disable=no-member
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
        df_knotdateset["knot_date_1"] = pd.to_datetime(
            df_knotdateset.knot_date_1, format=r"%Y-%m-%d"
        )
        df_knotdateset["knot_date_2"] = pd.to_datetime(
            df_knotdateset.knot_date_2, format=r"%Y-%m-%d"
        )

        # Filter real cases by date if requested
        start_date, end_date = boundary_dates
        if start_date:
            df_casesrecord = df_casesrecord[df_casesrecord["date"] >= start_date]
        if end_date:
            df_casesrecord = df_casesrecord[df_casesrecord["date"] < end_date]

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

        # Use all countries if none are provided
        if not iso_codes:
            iso_codes = df_casesrecord.iso_code.unique()

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
        first_restriction_date, lockdown_date = knot_dates

        # Simulate each requested country
        df_counterfactuals = []
        for iso_code in sorted(iso_codes):
            # Select the rows of each dataframe corresponding to the country we are working on
            df_country_casesrecord = df_casesrecord[
                df_casesrecord["iso_code"] == iso_code
            ]
            df_country_modeldaterange = df_modeldaterange[
                df_modeldaterange["iso_code"] == iso_code
            ]
            df_country_knotdateset = df_knotdateset[
                df_knotdateset["iso_code"] == iso_code
            ].copy()
            df_country_possibledateset = df_possibledateset[
                df_possibledateset["iso_code"] == iso_code
            ]

            try:
                # If a first restriction date is provided then use it to calculate the number of days to vary first restrictions by
                if first_restriction_date:
                    n_days_first_restrictions = int(
                        df_country_possibledateset[
                            df_country_possibledateset[
                                "dates_counterfactual_first_restrictions"
                            ]
                            == CounterfactualCasesRecord.to_date(first_restriction_date)
                        ]["n_days_first_restrictions"].unique()[0]
                    )
                else:
                    n_days_first_restrictions = 0

                # If a lockdown date is provided then use it to calculate the number of days to vary lockdown by, while requiring that this is compatible with the first restrictions shift
                if lockdown_date:
                    n_days_lockdown = int(
                        df_country_possibledateset[
                            (
                                df_country_possibledateset[
                                    "dates_counterfactual_lockdown"
                                ]
                                == CounterfactualCasesRecord.to_date(lockdown_date)
                            )
                            & (
                                df_country_possibledateset["n_days_first_restrictions"]
                                == n_days_first_restrictions
                            )
                        ]["n_days_lockdown"].unique()[0]
                    )
                else:
                    n_days_lockdown = 0

                # Simulate a single country using cases data, model dates and knotpoints
                single_country = CounterfactualCasesRecord.simulate_single_country(
                    df_country_casesrecord,
                    df_country_modeldaterange,
                    df_country_knotdateset,
                    n_days_first_restrictions,
                    n_days_lockdown,
                )
            except IndexError:
                # If we cannot extract a number of days offset for first restrictions or lockdown then we return an empty dataframe
                single_country = pd.DataFrame({"date": [], "weekly_avg_cases": []})

            # Calculate the number of cumulative cases that occurred before the simulation start date
            initial_date = pd.to_datetime(
                df_country_modeldaterange.initial_date.values[0], format=r"%Y-%m-%d"
            )
            initial_cum_cases = (
                df_country_casesrecord[df_country_casesrecord["date"] < initial_date][
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
    def simulate_counterfactual_records(
        iso_codes,
        boundary_dates,
        knot_dates,
        summary=False,
    ):
        """Simulate counterfactual records for one or more countries"""
        df_counterfactuals = (
            CounterfactualCasesRecord.simulate_counterfactual_dataframes(
                iso_codes, boundary_dates, knot_dates
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
    def add_cumulative_sum(df_country_casesrecord, initial_date, initial_cum_cases=0):
        """Add the cumulative sum to a set of counterfactual records"""
        # Make a copy of the input dataframe and sort it by date
        df_out = df_country_casesrecord.copy().sort_values(by=["date"])
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
        df_country_casesrecord,
        df_country_modeldaterange,
        df_country_knotdateset,
        counterfactual_first_restriction_shift_days,
        counterfactual_lockdown_shift_days,
    ):  # pylint: disable=too-many-locals
        """Simulate counterfactual records for a single country"""
        # Date range for the simulation
        initial_date = df_country_modeldaterange["initial_date"].iloc[0]
        maximum_date = df_country_modeldaterange["maximum_date"].iloc[0]

        # Starting number of cases
        initial_case_number = df_country_casesrecord[
            df_country_casesrecord["date"] == initial_date
        ]["weekly_avg_cases"].values[0]

        # Add a column for the counterfactual knot dates
        df_country_knotdateset["counterfactual_knot_date_1"] = df_country_knotdateset[
            "knot_date_1"
        ] - pd.Timedelta(days=counterfactual_first_restriction_shift_days)
        df_country_knotdateset["counterfactual_knot_date_2"] = df_country_knotdateset[
            "knot_date_2"
        ] - pd.Timedelta(days=counterfactual_lockdown_shift_days)

        # Set dates to simulate
        dates_range = pd.date_range(
            start=initial_date, end=maximum_date, freq="D"
        ).tolist()

        # Simulated number of cases on each day
        simulated_daily_cases = []
        for knots in df_country_knotdateset.itertuples():
            # Add an empty dataframe to the list of simulations
            # The columns are the dates to simulate and there are as many rows as the weight of this knot point
            simulated_daily_cases.append(
                pd.DataFrame(
                    index=list(range(knots.weight)),
                    columns=pd.date_range(
                        start=initial_date, end=maximum_date, freq="D"
                    ).tolist(),
                )
            )

            # Set the first day to the actual number of cases as initial seed for the simulation
            simulated_daily_cases[-1].iloc[:, 0] = [
                initial_case_number for _ in range(knots.weight)
            ]
            n_cases_series_tminus1 = simulated_daily_cases[-1][dates_range[0]]

            # Construct a list of time-period boundaries and associated growth factors
            # There is always one more time period to simulate than the number of knot points
            # As the growth factors correspond to the time in between the time-period boundaries
            time_period_boundaries = [pd.Timestamp.min, pd.Timestamp.max]
            growth_factors = [knots.growth_factor_0_1]
            with suppress(AttributeError):
                # If knot_date_1 exists then we know that growth_factor_1_2 exists
                time_period_boundaries.append(knots.counterfactual_knot_date_1)
                growth_factors.append(knots.growth_factor_1_2)
            with suppress(AttributeError):
                # If knot_date_2 exists then we know that growth_factor_2_3 exists
                time_period_boundaries.append(knots.counterfactual_knot_date_2)
                growth_factors.append(knots.growth_factor_2_3)
            time_period_boundaries = sorted(time_period_boundaries)

            # Simulate all days from the second onwards
            for day_t in dates_range[1:]:
                # Get the growth factor by finding the insertion point in the time-period boundaries list
                # Using bisect_left means that we choose the left-hand side when day_t equals the boundary day
                # Subtracting 1 translates from bisection point into index in the growth factor list
                growth = growth_factors[bisect_left(time_period_boundaries, day_t) - 1]

                # Calculate daily cases at time t given the number of cases in t -1 and the growth factor.
                n_cases_series_t = growth * n_cases_series_tminus1

                # Store number of cases in the dataframe
                simulated_daily_cases[-1].loc[:, day_t] = n_cases_series_t
                n_cases_series_tminus1 = n_cases_series_t

        # Combine all the simulations and take the mean
        counterfactual_cases_series = pd.concat(simulated_daily_cases).mean(axis=0)
        df_counterfactual_cases = pd.DataFrame(
            {
                "date": pd.to_datetime(
                    counterfactual_cases_series.index, format=r"%Y-%m-%d"
                ),
                "weekly_avg_cases": counterfactual_cases_series.values,
            }
        )

        # Remove columns of weekly_avg_cases because it will be replaced with counterfactual cases
        df_real_cases = df_country_casesrecord.copy()
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
