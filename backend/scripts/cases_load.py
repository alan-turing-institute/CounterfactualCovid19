"""Load COVID cases data into the database"""
from time import monotonic
import pandas as pd
from cases.models import CasesRecord
from .utils import create_code_lookup, create_country_lookup


def run():
    """Load COVID cases data into the database"""
    print("Starting to load cases data...")
    start = monotonic()

    # Source data processed by @KFArnold which serves at source to the counterfactual simulation and the total datasets
    url_cases = "https://raw.githubusercontent.com/alan-turing-institute/CounterfactualCovid19-inputs/develop/Data/Formatted/Cases_deaths_data_europe.csv"

    # Load all cases then filter by date
    df_cases = pd.read_csv(url_cases, parse_dates=["Date"])

    # Delete all existing CasesRecord data and regenerate the table
    CasesRecord.objects.all().delete()  # pylint: disable=no-member

    # Add an ISO code column lookup table
    code_lookup = create_code_lookup(df_cases["Country"].unique())
    df_cases["iso_code"] = df_cases.apply(lambda row: code_lookup[row.Country], axis=1)

    # Create a lookup table from ISO code to Country model
    country_lookup = create_country_lookup(df_cases["iso_code"].unique())

    for entry in df_cases.itertuples():
        try:
            # Skip Russia and Monaco
            if entry.iso_code in ("RUS", "MCO"):
                continue
            # ... but for other countries use the lookup table
            country = country_lookup[entry.iso_code]
            if country:
                record = CasesRecord(
                    country=country,
                    date=entry.Date,
                    weekly_avg_cases=entry.Daily_cases_MA7,
                    weekly_avg_deaths=entry.Daily_deaths_MA7,
                )
                record.save()

        except AttributeError:
            continue

    print(f"Finished loading cases data after {monotonic() - start:.2f} seconds")
