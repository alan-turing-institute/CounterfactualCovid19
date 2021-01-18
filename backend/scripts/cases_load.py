"""Load COVID cases data into the database"""
import csv
import pandas as pd
import pycountry
from cases.models import Cases


def run():

    # source data processed by @KFArnold which serves at source to the counterfactual simulation and the total datasets
    url_cases = "https://raw.githubusercontent.com/alan-turing-institute/CounterfactualCovid19-inputs/develop/Data/Formatted/Cases_deaths_data_europe.csv"

    #dummy date for end of the first wave in Europe
    end_date = "2020-06-23"

    # Load all cases then filter by date
    df_cases = pd.read_csv(url_cases, parse_dates=["Date"])
    df_cases_end_date = df_cases[df_cases["Date"] == end_date]

    # Delete all existing Cases data and regenerate the table
    Cases.objects.all().delete()
    for entry in df_cases_end_date.itertuples():
        try:
            code_county = pycountry.countries.get(name=entry.Country)
            if not code_county:
                code_county = pycountry.countries.search_fuzzy(entry.Country)[0]
            m = Cases(
                country=code_county.name,
                iso_code=code_county.alpha_3,
                date=end_date,
                cumulative_cases=entry.Cumulative_cases_end,
            )
            m.save()
        except AttributeError:
            continue