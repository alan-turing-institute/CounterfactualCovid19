"""Load COVID cases data into the database"""
import csv
import pandas as pd
import pycountry
from time import monotonic
from dates.models import Dates
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
    print("Starting to load important dates data...")
    start = monotonic()

    # Source data processed by @KFArnold which serves at source to the counterfactual simulation and the total datasets
    url_dates = "https://raw.githubusercontent.com/alan-turing-institute/CounterfactualCovid19-inputs/develop/Results/summary_eur.csv"

    # Load Dates dataframe and parse them allowing for NAT
    df_dates = pd.read_csv(
        url_dates,
        parse_dates=["Date_start", "Date_T", "Date_first_restriction", "Date_lockdown"],
    )

    # replace all NaT with None needed for django
    df_dates.Date_lockdown = df_dates.Date_lockdown.astype(str).replace({"NaT": None})

    # Delete all existing Dates data and regenerate the table
    Dates.objects.all().delete()

    # Add an ISO code column lookup table
    code_lookup = {
        country: get_country_code(country) for country in df_dates["Country"].unique()
    }
    df_dates["iso_code"] = df_dates.apply(lambda row: code_lookup[row.Country], axis=1)

    # Create a lookup table from ISO code to Country model
    country_lookup = {
        iso_code: get_country_model(iso_code)
        for iso_code in df_dates["iso_code"].unique()
    }

    for entry in df_dates.itertuples():
        try:
            country = country_lookup[entry.iso_code]
            if country:
                m = Dates(
                    country=country,
                    initial_date=entry.Date_start,
                    maximum_date=entry.Date_T,
                    first_restrictions_date=entry.Date_first_restriction,
                    lockdown_date=entry.Date_lockdown,
                )
                m.save()

        except AttributeError:
            continue

    print(f"Finished loading cases data after {monotonic() - start:.2f} seconds")
