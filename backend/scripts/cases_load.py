"""Load COVID cases data into the database"""
import csv
import pandas as pd
import pycountry
from cases.models import TotalCases


def run():

    # Source data processed by @KFArnold which serves at source to the counterfactual simulation and the total datasets
    url_cases = "https://raw.githubusercontent.com/alan-turing-institute/CounterfactualCovid19-inputs/develop/Data/Formatted/Cases_deaths_data_europe.csv"
    url_population = "https://raw.githubusercontent.com/alan-turing-institute/CounterfactualCovid19-inputs/develop/Data/Formatted/Worldbank_data_europe.csv"

    # Dummy date for end of the first wave in Europe
    end_date = "2020-06-23"

    # Load all cases then filter by date
    df_cases = pd.read_csv(url_cases, parse_dates=["Date"])
    df_cases_end_date = df_cases[df_cases["Date"] == end_date]

    # Load population data in 2019 from the world bank
    df_pop = pd.read_csv(url_population)

    # Delete all existing TotalCases data and regenerate the table
    TotalCases.objects.all().delete()
    for entry in df_cases_end_date.itertuples():
        try:
            code_country = pycountry.countries.get(name=entry.Country)
            if not code_country:
                code_country = pycountry.countries.search_fuzzy(entry.Country)[0]

            population = df_pop[df_pop["Iso3c"] == code_country.alpha_3][
                "Population"
            ].values[0]

            m = TotalCases(
                iso_code=code_country.alpha_3,
                cumulative_cases=entry.Cumulative_cases_end,
                population=population,
            )
            m.save()
        except AttributeError:
            continue
