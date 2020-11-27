import pandas as pd


def simulate_counterfactuals(country, restrictions_shifts, df_cases , best_knots_points, df_summaries):
    """
    Function that simulates the evolution of Covi19 cases for a country, given a shift in the time
    the restrictions where applied.

    Parameters
    ----------
    country: str
        Country to be simulated
    restrictions_shifts: int
        Number of days earlier to implement FIRST RESTRICTION and LOCKDOWN
    df_cases: dataframe
        Historical case data.
    best_knots_points: dataframe
        Different growth periods for each country
    df_summaries: dataframe
        Dates and restrictions applied for each country

    Returns
    -------
    A time series with the simulated daily cases.

    """

    # Filter datasets by country
    knots_best_country = best_knots_points[best_knots_points["Country"] == country]  # best knots
    data_eur_country = df_cases[df_cases['Country'] == country]
    summary_eur_country = df_summaries[df_summaries["Country"] == country]

    # Record important dates
    date_pop_pct = pd.to_datetime(summary_eur_country.Date_pop_pct, format="%Y-%m-%d")
    date_T = summary_eur_country.Date_T
    date_first_restriction = summary_eur_country.Date_first_restriction
    date_lockdown = summary_eur_country.Date_lockdown

    # Calculate total number of simulation runs
    n_runs = knots_best_country['N_unequal'].sum()

    knots_best_country['Knot_date_1'] = pd.to_datetime(knots_best_country['Knot_date_1'], format="%Y-%m-%d")
    knots_best_country['Knot_date_2'] = pd.to_datetime(knots_best_country['Knot_date_2'], format="%Y-%m-%d")

    # Calculate maximum number of days earlier we can estimate FIRST RESTRICTION
    # (minimum value of knot_date_1 greater than or equal to date_pop_pct)
    max_days_counterfactual_first_restriction = min(knots_best_country.Knot_date_1 - date_pop_pct.repeat(knots_best_country.shape[0]).values)
    max_days_counterfactual_lockdown = min(knots_best_country.Knot_date_2 - (date_pop_pct+pd.DateOffset(1)).repeat(knots_best_country.shape[0]).values)
    return 0