"""Load COVID cases data into the database"""
import csv
import pandas as pd
import pycountry
from time import monotonic
from possibledates.models import PossibleDates
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
    url_possible_counterfactuals = "https://raw.githubusercontent.com/alan-turing-institute/CounterfactualCovid19-inputs/develop/Results/possible_days_counterfactual.csv"

    # Load Dates dataframe and parse them allowing for NAT
    df_best_knot = pd.read_csv(
        url_possible_counterfactuals,
        parse_dates=["Date_first_restriction", "Date_lockdown"],
    )

    # replace all NaT with None needed for django
    df_best_knot.Date_first_restriction = df_best_knot.Date_first_restriction.astype(
        str
    ).replace({"NaT": None, "Nan": None, "null": None, "nan": None})
    df_best_knot.Date_lockdown = df_best_knot.Date_lockdown.astype(str).replace(
        {"NaT": None, "Nan": None, "null": None, "nan": None}
    )
    # replace all NaT with None needed for django
    df_best_knot.N_days_first_restriction = (
        df_best_knot.N_days_first_restriction.astype(str).replace(
            {"NaT": None, "Nan": None, "null": None, "nan": None}
        )
    )
    df_best_knot.N_days_lockdown = df_best_knot.N_days_lockdown.astype(str).replace(
        {"NaT": None, "Nan": None, "null": None, "nan": None}
    )

    # Delete all existing Dates data and regenerate the table
    PossibleDates.objects.all().delete()

    # Add an ISO code column lookup table
    code_lookup = {
        country: get_country_code(country)
        for country in df_best_knot["Country"].unique()
    }
    df_best_knot["iso_code"] = df_best_knot.apply(
        lambda row: code_lookup[row.Country], axis=1
    )

    # Create a lookup table from ISO code to Country model
    country_lookup = {
        iso_code: get_country_model(iso_code)
        for iso_code in df_best_knot["iso_code"].unique()
    }

    for entry in df_best_knot.itertuples():
        try:
            country = country_lookup[entry.iso_code]
            if country:
                m = PossibleDates(
                    country=country,
                    n_days_first_restrictions=entry.N_days_first_restriction,
                    n_days_lockdown=entry.N_days_lockdown,
                    dates_counterfactual_first_restrictions=entry.Date_first_restriction,
                    dates_counterfactual_lockdown=entry.Date_lockdown,
                )
                m.save()

        except AttributeError:
            continue

    print(f"Finished loading cases data after {monotonic() - start:.2f} seconds")
