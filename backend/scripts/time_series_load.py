"""Load COVID time series cases data into the database"""
import pandas as pd
import pycountry
from cases.models import TimeSeriesCases


def run():

    # Source data processed by @KFArnold which serves at source to the counterfactual simulation and the total datasets
    url_cases = "https://raw.githubusercontent.com/alan-turing-institute/CounterfactualCovid19-inputs/develop/Data/Formatted/Cases_deaths_data_europe.csv"

    # Dummy date for begining and end of the first wave in Europe
    begin_date = "2020-02-01"
    end_date = "2020-06-23"

    # Load all cases then filter by date
    df_cases = pd.read_csv(url_cases, parse_dates=["Date"])
    df_cases_begin_date = df_cases[df_cases["Date"] > begin_date]

    df_cases_end_date = df_cases_begin_date[df_cases_begin_date["Date"] < end_date]


    # Delete all existing TimeSeriesCases data and regenerate the table
    TimeSeriesCases.objects.all().delete()
    for entry in df_cases_end_date.itertuples():
        try:
            code_country = pycountry.countries.get(name=entry.Country)
            if not code_country:
                code_country = pycountry.countries.search_fuzzy(entry.Country)[0]

            m = TimeSeriesCases(
                iso_code=code_country.alpha_3,
                daily_cases=entry.Daily_cases_MA7,
                daily_cum_cases=entry.Cumulative_cases_end_MA7,
                date=entry.Date,

            )
            m.save()
        except AttributeError:
            continue
