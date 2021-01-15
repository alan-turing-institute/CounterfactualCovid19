"""Load COVID cases data into the database"""
import csv
import pandas as pd
import pycountry
from cases.models import Cases

def run():

    url_cases = 'https://raw.githubusercontent.com/alan-turing-institute/CounterfactualCovid19-inputs/develop/Data/Formatted/Cases_deaths_data_europe.csv'
    df_cases = pd.read_csv(url_cases)

    countries = df_cases.Country.unique()
    date = '2020-06-23'

    Cases.objects.all().delete()

    for country in countries:

        ts_data_country_daily, ts_data_country_cum = get_natural_history_data(country, df_cases)

        total_cases = ts_data_country_daily[ts_data_country_daily.index < date].sum()

        try:
            code_county = pycountry.countries.get(name=country)

            m = Cases(country=country, iso_code=code_county.alpha_3, date=date, cumulative_cases=total_cases)

            m.save()
        except AttributeError:
            continue


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
    data_country_daily = data_country_daily['Daily_cases']
    data_country_cum = data_country_cum['Cumulative_cases_end']

    return data_country_daily, data_country_cum
