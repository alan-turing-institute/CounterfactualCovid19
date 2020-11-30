import pandas as pd
import numpy as np

def simulate_counterfactuals(country, restrictions_shifts, df_cases , best_knots_points, df_summaries):
    """
    Function that simulates the evolution of Covi19 cases for a country, given a shift in the time
    the restrictions where applied.

    Parameters
    ----------
    country: str
        Country to be simulated
    restrictions_shifts: tuple
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
    date_T = pd.to_datetime(summary_eur_country.Date_T, format="%Y-%m-%d")
    date_first_restriction = summary_eur_country.Date_first_restriction
    date_lockdown = summary_eur_country.Date_lockdown

    # Calculate total number of simulation runs
    n_runs = knots_best_country['N_unequal'].sum()

    knots_best_country['Knot_date_1'] = pd.to_datetime(knots_best_country['Knot_date_1'], format="%Y-%m-%d")
    knots_best_country['Knot_date_2'] = pd.to_datetime(knots_best_country['Knot_date_2'], format="%Y-%m-%d")

    # Calculate maximum number of days earlier we can estimate FIRST RESTRICTION
    # (minimum value of knot_date_1 greater than or equal to date_pop_pct)
    max_days_counterfactual_first_restriction = min(knots_best_country.Knot_date_1 - date_pop_pct.repeat(knots_best_country.shape[0]).values).days
    max_days_counterfactual_lockdown = min(knots_best_country.Knot_date_2 - (date_pop_pct+pd.DateOffset(1)).repeat(knots_best_country.shape[0]).values).days

    # Determine all possible combinations of counterfactual days
    # (filter so that minimum value of knot_date_2 is always greater than knot_date_1)
    x =  pd.DataFrame(np.array([(x, y) for x in range(max_days_counterfactual_first_restriction+1) for y in range(max_days_counterfactual_lockdown+1)]),columns=['Poss_days_counterfactual_first_restriction', 'Poss_days_counterfactual_lockdown'])
    possible_days_counterfactual = x[(x['Poss_days_counterfactual_lockdown']-x['Poss_days_counterfactual_first_restriction'])<=(max_days_counterfactual_lockdown - max_days_counterfactual_first_restriction - 1) ]

    # Set dates to simulate
    dates = pd.date_range(start=date_pop_pct.values[0], end=date_T.values[0],freq='D').tolist()

    # Define number of best knot point pairs
    n_knots_best = knots_best_country.shape[0]

    n_days_counterfactual_first_restriction = restrictions_shifts[0]
    n_days_counterfactual_lockdown =restrictions_shifts[1]

    match = possible_days_counterfactual[(possible_days_counterfactual['Poss_days_counterfactual_first_restriction']==restrictions_shifts[0]) \
                                 & (possible_days_counterfactual['Poss_days_counterfactual_lockdown']==restrictions_shifts[1])]

    if (match.shape[0] == 0):
        print("Stop - cannot estimate counterfactual")

    knots_best_country_counterfactual = knots_best_country.copy()

    knots_best_country_counterfactual['Knot_date_1'] = knots_best_country_counterfactual['Knot_date_1'] - pd.Timedelta(days=n_days_counterfactual_first_restriction)
    knots_best_country_counterfactual['Knot_date_2'] = knots_best_country_counterfactual['Knot_date_2'] - pd.Timedelta(days=n_days_counterfactual_lockdown)


    daily_cases_sim =  pd.DataFrame(columns=pd.date_range(start=date_pop_pct.values[0]-pd.Timedelta(days=1), end=date_T.values[0],freq='D').date.tolist())

    start = pd.datetime.now()

    return x