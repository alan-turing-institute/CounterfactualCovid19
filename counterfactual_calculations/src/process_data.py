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
    data_country_daily = df_cases[df_cases["Country"] == country]
    data_country_cum = df_cases[df_cases["Country"] == country]

    # reindex with date
    data_country_daily.set_index("Date", inplace=True)
    data_country_cum.set_index("Date", inplace=True)

    # get time series
    data_country_daily = data_country_daily["Daily_cases_MA7"]
    data_country_cum = data_country_cum["Cumulative_cases_end_MA7"]

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
    Dictionary with datetime objects of the main restriction dates for a country

    """
    summary_eur_country = df_summaries[df_summaries["Country"] == country]

    dates_dict = {}

    # Record important dates
    # date for which cumulative cases first exceeded this percent (Date_pop_pct)
    dates_dict["initial_date"] = pd.to_datetime(
        summary_eur_country.Date_pop_pct.values[0], format="%Y-%m-%d"
    )

    # lastdate to include data
    # Date_max, Date_restrictions_eased + 28, or Date_lockdown_eased + 28, whichever comes first
    dates_dict["maximum_date"] = pd.to_datetime(
        summary_eur_country.Date_T.values[0], format="%Y-%m-%d"
    )
    dates_dict["date_first_restriction"] = pd.to_datetime(
        summary_eur_country.Date_first_restriction.values[0], format="%Y-%m-%d"
    )

    dates_dict["date_lockdown"] = pd.to_datetime(
        summary_eur_country.Date_lockdown.values[0], format="%Y-%m-%d"
    )

    return dates_dict


def get_number_of_cases(country, df_cases, date):
    """
    Get initial number of cases for a given country and a given date

    Parameters
    ----------
    country: str
        Country for data to be fetched
    df_cases: dataframe
        Historical case data.
    date: datetime object
        Date to extract case numbers

    Returns
    -------
    Initial case number for that date and initial cumulative case number

    """

    data_eur_country = df_cases[df_cases["Country"] == country]
    data_eur_country["Date"] = pd.to_datetime(data_eur_country["Date"])

    # get initial number of cases for the first day of the simulation
    initial_case_number = data_eur_country[
        data_eur_country["Date"] == (date - pd.Timedelta(days=1))
    ]["Daily_cases_MA7"].values[0]

    # get initial cumulative number of cases for the first day of the simulation
    initial_cumulative_case_number = data_eur_country[
        data_eur_country["Date"] == (date - pd.Timedelta(days=1))
    ]["Cumulative_cases_end_MA7"].values[0]

    return initial_case_number, initial_cumulative_case_number
