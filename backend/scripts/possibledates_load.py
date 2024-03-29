"""Load possible counterfactual dates data into the database"""
from time import monotonic
import pandas as pd
from dates.models import PossibleDateSet
from .utils import create_code_lookup, create_country_lookup


def run():
    """Load possible counterfactual dates data into the database"""
    print("Starting to load possible counterfactual dates data...")
    start = monotonic()

    # Source data processed by @KFArnold which serves at source to the counterfactual simulation and the total datasets
    url_possible_counterfactuals = "https://raw.githubusercontent.com/KFArnold/covid-lockdown/dashboard/Output/possible_days_counterfactual.csv"

    # Load possible dates dataframe and parse them allowing for NAT
    df_possible_dates = pd.DataFrame(
        pd.read_csv(
            url_possible_counterfactuals,
            parse_dates=["Date_first_restriction", "Date_lockdown"],
        )
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
    PossibleDateSet.objects.all().delete()  # pylint: disable=no-member

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
                record = PossibleDateSet(
                    country=country,
                    n_days_first_restrictions=entry.N_days_first_restriction,
                    n_days_lockdown=entry.N_days_lockdown,
                    dates_counterfactual_first_restrictions=entry.Date_first_restriction,
                    dates_counterfactual_lockdown=entry.Date_lockdown,
                )
                record.save()

        except AttributeError:
            continue

    print(
        f"Finished loading possible counterfactual dates data after {monotonic() - start:.2f} seconds"
    )
