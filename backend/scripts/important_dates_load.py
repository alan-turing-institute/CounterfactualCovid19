"""Load important lockdown dates country data into the database"""
import csv
import pandas as pd
from time import monotonic
from dates.models import ModelDateRange
from utils import (
    get_country_model,
    get_country_code,
    create_code_lookup,
    create_country_lookup,
)


def run():
    print("Starting to load important dates data...")
    start = monotonic()

    # Source data processed by @KFArnold which serves at source to the counterfactual simulation and the total datasets
    url_dates = "https://raw.githubusercontent.com/alan-turing-institute/CounterfactualCovid19-inputs/develop/Results/summary_eur.csv"

    # Load important dates dataframe and parse them allowing for NAT
    df_dates = pd.read_csv(
        url_dates,
        parse_dates=["Date_start", "Date_T", "Date_first_restriction", "Date_lockdown"],
    )

    # replace all NaT with None needed for django
    df_dates.Date_lockdown = df_dates.Date_lockdown.replace({float("nan"): None})

    # Delete all existing ModelDateRange data and regenerate the table
    ModelDateRange.objects.all().delete()

    # Add an ISO code column lookup table
    code_lookup = create_code_lookup(df_dates["Country"].unique())

    df_dates["iso_code"] = df_dates.apply(lambda row: code_lookup[row.Country], axis=1)

    # Create a lookup table from ISO code to Country model
    country_lookup = create_country_lookup(df_dates["iso_code"].unique())

    for entry in df_dates.itertuples():
        try:
            country = country_lookup[entry.iso_code]
            if country:
                m = ModelDateRange(
                    country=country,
                    initial_date=entry.Date_start,
                    maximum_date=entry.Date_T,
                    first_restrictions_date=entry.Date_first_restriction,
                    lockdown_date=entry.Date_lockdown,
                )
                m.save()

        except AttributeError:
            continue

    print(
        f"Finished loading important dates data after {monotonic() - start:.2f} seconds"
    )
