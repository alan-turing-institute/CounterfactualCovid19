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
    data_eur_country['Date'] = pd.to_datetime(data_eur_country['Date'])
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


    daily_cases_sim =  pd.DataFrame()#columns=pd.date_range(start=date_pop_pct.values[0]-pd.Timedelta(days=1), end=date_T.values[0],freq='D').date.tolist())

    start = pd.datetime.now()

    for i in range(n_knots_best):
        knots_best_country_counterfactual_i = knots_best_country_counterfactual.iloc[i]

        # Record number of knots
        n_knots = knots_best_country_counterfactual_i['N_knots']

        # Define number of simulation runs for specified knot dates
        n_runs_i= knots_best_country_counterfactual_i['N_unequal']

        # Set knot dates
        knot_date_1_i = knots_best_country_counterfactual_i['Knot_date_1']
        knot_date_2_i = knots_best_country_counterfactual_i['Knot_date_2']

        # Define mean growth parameters
        growth_factor_1_i = knots_best_country_counterfactual_i['Growth_factor_1']
        growth_factor_2_i = knots_best_country_counterfactual_i['Growth_factor_2']
        growth_factor_3_i = knots_best_country_counterfactual_i['Growth_factor_3']

        # Define number of simulation runs for specified knot dates
        n_runs_i = knots_best_country_counterfactual_i['N_unequal']

        daily_cases_sim_i = pd.DataFrame(index=[i for i in range(n_runs_i)],
            columns=pd.date_range(start=date_pop_pct.values[0] - pd.Timedelta(days=1), end=date_T.values[0],
                                  freq='D').strftime("%m-%d-%Y").tolist())

        daily_cases_sim_i.iloc[:, 0] = \
        data_eur_country[data_eur_country['Date'] == (date_pop_pct.values[0] - pd.Timedelta(days=1))][
            'Daily_cases_MA7'].values.repeat(n_runs_i)

        for date in dates:
            inc_tminus1 = daily_cases_sim_i[(date - pd.Timedelta(days=1)).strftime("%m-%d-%Y")]

            # Define growth parameters
            if (n_knots == 0) :  # NO knot points
                growth = growth_factor_1_i

            elif (n_knots == 1) :  # ONE knot point
                if date <= knot_date_1_i :
                    growth = growth_factor_1_i
                else:
                    growth = growth_factor_2_i
            else:  # TWO knot points
                if (date <= knot_date_1_i):
                    growth = growth_factor_1_i
                elif (date <= knot_date_2_i):
                    growth = growth_factor_2_i
                else:
                    growth = growth_factor_3_i

            # Calculate daily cases at time t and record
            inc_t = growth * inc_tminus1
            daily_cases_sim_i.loc[:,date.strftime("%m-%d-%Y")] = inc_t

            # Bind knot-specific dataframes to full scenario dataframe

        daily_cases_sim = pd.concat([daily_cases_sim, daily_cases_sim_i])

    daily_cases_sim_mean = daily_cases_sim.mean(axis=0)

    cum_init = data_eur_country[data_eur_country['Date'] == (date_pop_pct.values[0] - pd.Timedelta(days=1))][
        'Cumulative_cases_end_MA7'].values

    daily_cases_sim_cum = daily_cases_sim.copy()
    daily_cases_sim_cum.loc[:, (date_pop_pct.values[0] - pd.Timedelta(days=1)).strftime("%m-%d-%Y")] = cum_init.repeat(\
        daily_cases_sim_cum.shape[0])
    daily_cases_sim_cum = daily_cases_sim_cum.reindex(sorted(daily_cases_sim_cum.columns), axis=1)
    daily_cases_sim_cum_sum = daily_cases_sim_cum.cumsum(axis=1)

    daily_cases_sim_cum_sum_mean = daily_cases_sim_cum_sum.mean(axis=0)


    return daily_cases_sim_mean