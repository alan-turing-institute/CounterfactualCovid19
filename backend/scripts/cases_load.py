"""Load COVID cases data into the database"""
import csv
import pandas as pd
import pycountry
from time import monotonic
from cases.models import CasesRecord
from countries.models import Country
from django.core.exceptions import ObjectDoesNotExist


def get_country_code(country_name):
    country_code = pycountry.countries.get(name=country_name)
    if not country_code:
        country_code = pycountry.countries.search_fuzzy(country_name)[0]
    return country_code.alpha_3


def get_country_model(iso_code):
    try:
        return Country.objects.get(iso_code=iso_code)
    except ObjectDoesNotExist:
        print(f"Could not find a matching country for {iso_code}")
    return None


def run():
    print("Starting to load cases data...")
    start = monotonic()

    # Source data processed by @KFArnold which serves at source to the counterfactual simulation and the total datasets
    url_cases = "https://raw.githubusercontent.com/alan-turing-institute/CounterfactualCovid19-inputs/develop/Data/Formatted/Cases_deaths_data_europe.csv"

    # Load all cases then filter by date
    df_cases = pd.read_csv(url_cases, parse_dates=["Date"])

    # Delete all existing CasesRecord data and regenerate the table
    CasesRecord.objects.all().delete()

    # Add an ISO code column lookup table
    code_lookup = {
        country: get_country_code(country) for country in df_cases["Country"].unique()
    }
    df_cases["iso_code"] = df_cases.apply(lambda row: code_lookup[row.Country], axis=1)

    # Create a lookup table from ISO code to Country model
    country_lookup = {
        iso_code: get_country_model(iso_code)
        for iso_code in df_cases["iso_code"].unique()
    }

    for entry in df_cases.itertuples():
        try:
            country = country_lookup[entry.iso_code]
            if country:
                m = CasesRecord(
                    country=country,
                    date=entry.Date,
                    weekly_avg_cases=entry.Daily_cases_MA7,
                )
                m.save()

        except AttributeError:
            continue

    print(f"Finished loading cases data after {monotonic() - start:.2f} seconds")
