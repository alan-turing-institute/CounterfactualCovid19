"""Load COVID cases data into the database"""
import csv
import pandas as pd
import pycountry
from time import monotonic
from knotpoints.models import KnotPoints
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
    url_best_knot = "https://raw.githubusercontent.com/alan-turing-institute/CounterfactualCovid19-inputs/develop/Results/knots_best.csv"

    # Load Dates dataframe and parse them allowing for NAT
    df_best_knot = pd.read_csv(url_best_knot, parse_dates=["Knot_date_1", "Knot_date_2"])

    # replace all NaT with None needed for django
    df_best_knot.Knot_date_2 = df_best_knot.Knot_date_2.astype(str).replace({"NaT": None, "Nan": None, "null": None,"nan": None})
    df_best_knot.Min_n_unequal = df_best_knot.Min_n_unequal.astype(str).replace({"NaT": None, "Nan": None, "null": None,"nan": None})
    df_best_knot.Growth_factor_2 = df_best_knot.Growth_factor_2.astype(str).replace({"NaT": None, "NaN": None, "null": None,"nan": None})
    df_best_knot.Growth_factor_3 = df_best_knot.Growth_factor_3.astype(str).replace({"NaT": None, "NaN": None, "null": None,"nan": None})

    # Delete all existing Dates data and regenerate the table
    KnotPoints.objects.all().delete()

    # Add an ISO code column lookup table
    code_lookup = {
        country: get_country_code(country) for country in df_best_knot["Country"].unique()
    }
    df_best_knot["iso_code"] = df_best_knot.apply(lambda row: code_lookup[row.Country], axis=1)

    # Create a lookup table from ISO code to Country model
    country_lookup = {
        iso_code: get_country_model(iso_code)
        for iso_code in df_best_knot["iso_code"].unique()
    }

    for entry in df_best_knot.itertuples():
        try:
            country = country_lookup[entry.iso_code]
            if country:
                m = KnotPoints(
                    country=country,
                    knot_date_1=entry.Knot_date_1,
                    knot_date_2=entry.Knot_date_2,
                    n_knots=entry.N_knots,
                    growth_factor_1=entry.Growth_factor_1,
                    growth_factor_2=entry.Growth_factor_2,
                    growth_factor_3=entry.Growth_factor_3,
                    min_n_unequal=entry.Min_n_unequal,

                )
                m.save()

        except AttributeError:
            continue

    print(f"Finished loading cases data after {monotonic() - start:.2f} seconds")
