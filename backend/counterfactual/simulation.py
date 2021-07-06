"""Utility functions for simulating counterfactual data"""
from bisect import bisect_left
from contextlib import suppress
import pandas as pd


def simulate_records_on_date(
    df_casesrecord,
    df_knotdateset,
    df_modeldaterange,
    df_possibledateset,
    knot_dates,
):
    """
    Simulate counterfactual records for one or more countries and return the most recent

    Parameters
    ----------
    df_casesrecord: pd.DataFrame
        date                                        datetime.date
        iso_code                                           string
        population                                          int64
        weekly_avg_cases                                  float64
    df_knotdateset: pd.DataFrame
        growth_factor_0_1                                 float64
        growth_factor_1_2                                 float64
        growth_factor_2_3                                 float64
        iso_code                                           string
        knot_date_1                                 datetime.date
        knot_date_2                                 datetime.date
        weight                                              int64
    df_modeldaterange: pd.DataFrame
        initial_date                                datetime.date
        iso_code                                           string
        maximum_date                                datetime.date
    df_possibledateset: pd.DataFrame
        dates_counterfactual_first_restrictions     datetime.date
        dates_counterfactual_lockdown               datetime.date
        iso_code                                           string
        n_days_first_restrictions                           int64
        n_days_lockdown                                     int64
    knot_dates: (datetime.date, datetime.date)
        Dates of first lockdown and first restrictions (if any)

    Returns
    -------
    list(dict)
        One entry for each date. Each dictionary has the following keys:
        iso_code                                           string
        population                                            int
        date                                        datetime.date
        weekly_avg_cases                                    float
        summed_avg_cases                                    float
    """
    # Get the total number of cases on the final day of simulation
    df_counterfactuals = [
        df[df["date"] == df["date"].max()]
        for df in simulate_dataframes(
            df_casesrecord,
            df_knotdateset,
            df_modeldaterange,
            df_possibledateset,
            knot_dates,
        )
    ]
    # Convert to records, flatten/combine and return
    return sum([df.to_dict("records") for df in df_counterfactuals], [])


def simulate_records(
    df_casesrecord,
    df_knotdateset,
    df_modeldaterange,
    df_possibledateset,
    knot_dates,
):
    """
    Simulate counterfactual records for one or more countries

    Parameters
    ----------
    df_casesrecord: pd.DataFrame
        date                                        datetime.date
        iso_code                                           string
        population                                          int64
        weekly_avg_cases                                  float64
    df_knotdateset: pd.DataFrame
        growth_factor_0_1                                 float64
        growth_factor_1_2                                 float64
        growth_factor_2_3                                 float64
        iso_code                                           string
        knot_date_1                                 datetime.date
        knot_date_2                                 datetime.date
        weight                                              int64
    df_modeldaterange: pd.DataFrame
        initial_date                                datetime.date
        iso_code                                           string
        maximum_date                                datetime.date
    df_possibledateset: pd.DataFrame
        dates_counterfactual_first_restrictions     datetime.date
        dates_counterfactual_lockdown               datetime.date
        iso_code                                           string
        n_days_first_restrictions                           int64
        n_days_lockdown                                     int64
    knot_dates: (datetime.date, datetime.date)
        Dates of first lockdown and first restrictions (if any)

    Returns
    -------
    list(dict)
        One entry for each date. Each dictionary has the following keys:
        iso_code                                           string
        population                                            int
        date                                        datetime.date
        weekly_avg_cases                                    float
        summed_avg_cases                                    float
    """
    df_counterfactuals = simulate_dataframes(
        df_casesrecord,
        df_knotdateset,
        df_modeldaterange,
        df_possibledateset,
        knot_dates,
    )
    # Convert to records, flatten/combine and return
    return sum([df.to_dict("records") for df in df_counterfactuals], [])


def simulate_dataframes(
    df_casesrecord, df_knotdateset, df_modeldaterange, df_possibledateset, knot_dates
):  # pylint: disable=too-many-locals
    """
    Simulate counterfactual dataframes for one or more countries

    Parameters
    ----------
    df_casesrecord: pd.DataFrame
        date                                        datetime.date
        iso_code                                           string
        population                                          int64
        weekly_avg_cases                                  float64
    df_knotdateset: pd.DataFrame
        growth_factor_0_1                                 float64
        growth_factor_1_2                                 float64
        growth_factor_2_3                                 float64
        iso_code                                           string
        knot_date_1                                 datetime.date
        knot_date_2                                 datetime.date
        weight                                              int64
    df_modeldaterange: pd.DataFrame
        initial_date                                datetime.date
        iso_code                                           string
        maximum_date                                datetime.date
    df_possibledateset: pd.DataFrame
        dates_counterfactual_first_restrictions     datetime.date
        dates_counterfactual_lockdown               datetime.date
        iso_code                                           string
        n_days_first_restrictions                           int64
        n_days_lockdown                                     int64
    knot_dates: (datetime.date, datetime.date)
        Dates of first lockdown and first restrictions (if any)

    Returns
    -------
    list(pd.DataFrame)
        One entry for each country. Each dataframe has the following columns:
        iso_code                                           string
        population                                          int64
        date                                        datetime.date
        weekly_avg_cases                                  float64
        summed_avg_cases                                  float64
    """
    first_restriction_date, lockdown_date = knot_dates

    # Simulate each requested country
    df_counterfactuals = []
    for iso_code in sorted(df_casesrecord.iso_code.unique()):
        # Select the rows of each dataframe corresponding to the country we are working on
        df_country_casesrecord = df_casesrecord[df_casesrecord["iso_code"] == iso_code]
        df_country_modeldaterange = df_modeldaterange[
            df_modeldaterange["iso_code"] == iso_code
        ]
        df_country_knotdateset = df_knotdateset[df_knotdateset["iso_code"] == iso_code]
        df_country_possibledateset = df_possibledateset[
            df_possibledateset["iso_code"] == iso_code
        ]

        # Get date range for this simulation noting that the user of this API may have used "start_date" and "end_date" to restrict the range
        # The start date is whichever is later of the model's "initial_date" and the first date for which there is real data
        # The end date is whichever is earlier of the model's "maximum_date" and the last date for which there is real data
        simulation_start_date = max(
            df_country_modeldaterange["initial_date"].iloc[0],
            min(df_country_casesrecord["date"]),
        )
        simulation_end_date = min(
            df_country_modeldaterange["maximum_date"].iloc[0],
            max(df_country_casesrecord["date"]),
        )

        try:
            # If a first restriction date is provided then use it to calculate the number of days to vary first restrictions by
            if first_restriction_date:
                n_days_first_restrictions = int(
                    df_country_possibledateset[
                        df_country_possibledateset[
                            "dates_counterfactual_first_restrictions"
                        ]
                        == first_restriction_date
                    ]["n_days_first_restrictions"].unique()[0]
                )
            else:
                n_days_first_restrictions = 0

            # If a lockdown date is provided then use it to calculate the number of days to vary lockdown by, while requiring that this is compatible with the first restrictions shift
            if lockdown_date:
                n_days_lockdown = int(
                    df_country_possibledateset[
                        (
                            df_country_possibledateset["dates_counterfactual_lockdown"]
                            == lockdown_date
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
            df_counterfactual_country = simulate_single_country(
                df_country_casesrecord,
                df_country_knotdateset.copy(),
                (simulation_start_date, simulation_end_date),
                (n_days_first_restrictions, n_days_lockdown),
            )
        except IndexError:
            # If we cannot extract a number of days offset for first restrictions or lockdown then we return an empty dataframe
            df_counterfactual_country = pd.DataFrame(
                {"date": [], "weekly_avg_cases": []}
            )

        # Calculate the number of cumulative cases that occurred before the simulation start date
        # If there are no caserecords before the simulation start date we catch the IndexError and set initial_cum_cases to 0
        try:
            initial_cum_cases = (
                df_country_casesrecord[
                    df_country_casesrecord["date"] < simulation_start_date
                ]["weekly_avg_cases"]
                .cumsum()
                .iloc[-1]
            )
        except IndexError:
            initial_cum_cases = 0

        # Add cumulative cases that occurred before the simulation start date
        df_counterfactuals.append(
            add_cumulative_sum(
                df_counterfactual_country, initial_cum_cases, simulation_start_date
            )
        )

    return df_counterfactuals


def simulate_single_country(
    df_country_casesrecord,
    df_country_knotdateset,
    simulation_date_range,
    counterfactual_shifts,
):  # pylint: disable=too-many-locals
    """
    Simulate counterfactual records for a single country

    Parameters
    ----------
    df_casesrecord: pd.DataFrame
        date                                        datetime.date
        iso_code                                           string
        population                                          int64
        weekly_avg_cases                                  float64
    df_knotdateset: pd.DataFrame
        growth_factor_0_1                                 float64
        growth_factor_1_2                                 float64
        growth_factor_2_3                                 float64
        iso_code                                           string
        knot_date_1                                 datetime.date
        knot_date_2                                 datetime.date
        weight                                              int64
    simulation_dates: (datetime.date, datetime.date)
        Start and end dates for the simulation
    counterfactual_shifts: (int, int)
        Counterfactual shift (in days) to apply to the first lockdown and first restrictions

    Returns
    -------
    pd.DataFrame
        iso_code                                           string
        population                                          int64
        date                                        datetime.date
        weekly_avg_cases                                  float64
    """
    simulation_start_date, simulation_end_date = simulation_date_range
    first_restriction_shift_days, lockdown_shift_days = counterfactual_shifts
    # Starting number of cases
    initial_case_number = df_country_casesrecord[
        df_country_casesrecord["date"] == simulation_start_date
    ]["weekly_avg_cases"].values[0]

    # Add a column for the counterfactual knot dates
    df_country_knotdateset["counterfactual_knot_date_1"] = df_country_knotdateset[
        "knot_date_1"
    ] - pd.Timedelta(days=first_restriction_shift_days)
    df_country_knotdateset["counterfactual_knot_date_2"] = df_country_knotdateset[
        "knot_date_2"
    ] - pd.Timedelta(days=lockdown_shift_days)

    # Construct a list of datetime.date to simulate
    simulation_dates = pd.date_range(  # pylint: disable=no-member
        start=simulation_start_date, end=simulation_end_date, freq="D"
    ).date.tolist()

    # Simulated number of cases on each day
    simulated_daily_cases = []
    for knots in df_country_knotdateset.itertuples():
        # Add an empty dataframe to the list of simulations
        # The columns are the dates to simulate and there are as many rows as the weight of this knot point
        simulated_daily_cases.append(
            pd.DataFrame(index=list(range(knots.weight)), columns=simulation_dates)
        )

        # Set the first day to the actual number of cases as initial seed for the simulation
        simulated_daily_cases[-1].iloc[:, 0] = [
            initial_case_number for _ in range(knots.weight)
        ]
        n_cases_series_tminus1 = simulated_daily_cases[-1][simulation_dates[0]]

        # if counterfactual_knot_date_1 happens after counterfactual_knot_date_2
        # make a flag for skipping knot date 1 from the simulation
        skip_knot_date_1 = False
        if not pd.isnull(knots.counterfactual_knot_date_1) and not pd.isnull(
            knots.counterfactual_knot_date_2
        ):
            if knots.counterfactual_knot_date_1 > knots.counterfactual_knot_date_2:
                skip_knot_date_1 = True

        # Construct a list of time-period boundaries and associated growth factors
        # There is always one more time period to simulate than the number of knot points
        # As the growth factors correspond to the time in between the time-period boundaries
        time_period_boundaries = [pd.Timestamp.min, pd.Timestamp.max]
        growth_factors = [knots.growth_factor_0_1]
        with suppress(AttributeError):
            # Check counterfactual_knot_date_1 for NaT before adding it and
            # only use this growth factor if counterfactual_knot_date_1 is before counterfactual_knot_date_2
            if not pd.isnull(knots.counterfactual_knot_date_1) and not skip_knot_date_1:
                # If knot_date_1 exists then we know that growth_factor_1_2 exists
                time_period_boundaries.append(knots.counterfactual_knot_date_1)
                growth_factors.append(knots.growth_factor_1_2)
        with suppress(AttributeError):
            # Check counterfactual_knot_date_2 for NaT before adding it
            if not pd.isnull(knots.counterfactual_knot_date_2):
                # If knot_date_2 exists then we know that growth_factor_2_3 exists
                time_period_boundaries.append(knots.counterfactual_knot_date_2)
                growth_factors.append(knots.growth_factor_2_3)
        time_period_boundaries = sorted(time_period_boundaries)

        # Simulate all days from the second onwards
        for day_t in simulation_dates[1:]:
            # Get the growth factor by finding the insertion point in the time-period boundaries list
            # Using bisect_left means that we choose the left-hand side when day_t equals the boundary day
            # Subtracting 1 translates from bisection point into index in the growth factor list
            growth = growth_factors[bisect_left(time_period_boundaries, day_t) - 1]

            # Calculate daily cases on day t given the number of cases on t-1 and the growth factor.
            n_cases_series_t = growth * n_cases_series_tminus1

            # Store number of cases in the dataframe
            simulated_daily_cases[-1].loc[:, day_t] = n_cases_series_t
            n_cases_series_tminus1 = n_cases_series_t

    # Combine all the simulations and take the mean
    counterfactual_cases_series = pd.concat(simulated_daily_cases).mean(axis=0)
    df_counterfactual_cases = pd.DataFrame(
        {
            "date": counterfactual_cases_series.index,
            "weekly_avg_cases": counterfactual_cases_series.values,
        }
    )

    # Remove columns of weekly_avg_cases because it will be replaced with counterfactual cases
    df_real_cases = df_country_casesrecord.drop(columns=["weekly_avg_cases"])

    # Merge real and counterfactual dataframes and fill missing values
    return pd.merge(
        df_real_cases, df_counterfactual_cases, on="date", how="outer"
    ).fillna(0)


def add_cumulative_sum(df_casesrecord, initial_cum_cases, initial_simulation_date):
    """
    Add the cumulative sum to a set of counterfactual records

    Parameters
    ----------
    df_casesrecord: pd.DataFrame
        date                                        datetime.date
        iso_code                                           string
        population                                            int
        weekly_avg_cases                                    float
    initial_cum_cases: int
        Offset to apply to the initial number of cases before calculating the cumulative sum
    initial_simulation_date: datetime.date
        Start dates for the simulation


    Returns
    -------
    pd.DataFrame
        date                                        datetime.date
        iso_code                                           string
        population                                          int64
        weekly_avg_cases                                  float64
        summed_avg_cases                                  float64
    """
    # Make a copy of the input dataframe and sort it by date
    df_out = df_casesrecord.copy().sort_values(by=["date"])
    # Add an offset number of cases to the first entry

    df_out.loc[
        df_out["date"] == initial_simulation_date, ["weekly_avg_cases"]
    ] += initial_cum_cases

    # df_out.at[0, "weekly_avg_cases"] += initial_cum_cases
    # Calculate the cumulative sum
    df_out["summed_avg_cases"] = df_out["weekly_avg_cases"].cumsum()
    return df_out
