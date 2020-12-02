import pandas as pd


def get_natural_history_data(country, df_cases):
    """

    Parameters
    ----------
    country: str
        Country for data to be fetched
    df_cases: dataframe
        Historical case data.

    Returns
    -------
     Two time series with the data from daily and cumulative cases.


    """

    # select country
    data_country_daily = df_cases[df_cases['Country'] == country]
    data_country_cum = df_cases[df_cases['Country'] == country]

    # reindex with date
    data_country_daily.set_index('Date', inplace=True)
    data_country_cum.set_index('Date', inplace=True)

    # get time series
    data_country_daily = data_country_daily['Daily_cases_MA7']
    data_country_cum = data_country_cum['Cumulative_cases_end_MA7']

    return data_country_daily, data_country_cum


def get_important_dates(country, df_summaries):
    """
    For a given country get important dates for the simulation and data visualisation

    Parameters
    ----------
    country: str
        Country for data to be fetched
    df_summaries: dataframe
        Dates and restrictions applied for each country

    Returns
    -------

    """
    summary_eur_country = df_summaries[df_summaries["Country"] == country]

    dates_dict = {}

    # Record important dates
    # date for which cumulative cases first exceeded this percent (Date_pop_pct)
    dates_dict['initial_date'] = pd.to_datetime(summary_eur_country.Date_pop_pct, format="%Y-%m-%d")



    # lastdate to include data
    # Date_max, Date_restrictions_eased + 28, or Date_lockdown_eased + 28, whichever comes first
    dates_dict['maximum_date'] = pd.to_datetime(summary_eur_country.Date_T, format="%Y-%m-%d")
    dates_dict['date_first_restriction'] = summary_eur_country.Date_first_restriction

    dates_dict['date_lockdown'] = summary_eur_country.Date_lockdown

    return dates_dict





