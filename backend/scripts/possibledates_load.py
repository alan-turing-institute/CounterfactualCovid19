"""Load possible counterfactual dates data into the database"""
import pandas as pd
from time import monotonic
from possibledates.models import PossibleDates
from utils import (
    get_country_model,
    get_country_code,
    create_code_lookup,
    create_country_lookup,
)


def run():
    print("Starting to load possible counterfactual dates data...")
    start = monotonic()

    # Source data processed by @KFArnold which serves at source to the counterfactual simulation and the total datasets
    url_possible_counterfactuals = "https://raw.githubusercontent.com/alan-turing-institute/CounterfactualCovid19-inputs/develop/Results/possible_days_counterfactual.csv"

    # Load possible dates dataframe and parse them allowing for NAT
    df_possible_dates = pd.read_csv(
        url_possible_counterfactuals,
        parse_dates=["Date_first_restriction", "Date_lockdown"],
    )

    # replace all NaT with None needed for django
    df_possible_dates.Date_first_restriction = (
        df_possible_dates.Date_first_restriction.replace({float("nan"): None})
    )
    df_possible_dates.Date_lockdown = df_possible_dates.Date_lockdown.replace(
        {float("nan"): None}
    )
    df_possible_dates.N_days_first_restriction = (
        df_possible_dates.N_days_first_restriction.replace({float("nan"): None})
    )
    df_possible_dates.N_days_lockdown = df_possible_dates.N_days_lockdown.replace(
        {float("nan"): None}
    )

    # Delete all existing Dates data and regenerate the table
    PossibleDates.objects.all().delete()

    # Add an ISO code column lookup table
    code_lookup = create_code_lookup(df_possible_dates["Country"].unique())

    df_possible_dates["iso_code"] = df_possible_dates.apply(
        lambda row: code_lookup[row.Country], axis=1
    )

    # Create a lookup table from ISO code to Country model
    country_lookup = create_country_lookup(df_possible_dates["iso_code"].unique())

    for entry in df_possible_dates.itertuples():
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

    print(
        f"Finished loading possible counterfactual dates data after {monotonic() - start:.2f} seconds"
    )
