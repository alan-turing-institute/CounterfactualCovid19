"""Load COVID cases data into the database"""
import csv
import pandas as pd
import pycountry
from cases.models import CasesRecord
from countries.models import Country
from django.core.exceptions import ObjectDoesNotExist


def run():

    # Source data processed by @KFArnold which serves at source to the counterfactual simulation and the total datasets
    url_cases = "https://raw.githubusercontent.com/alan-turing-institute/CounterfactualCovid19-inputs/develop/Data/Formatted/Cases_deaths_data_europe.csv"

    # Load all cases then filter by date
    df_cases = pd.read_csv(url_cases, parse_dates=["Date"])

    # Delete all existing CasesRecord data and regenerate the table
    CasesRecord.objects.all().delete()
    for entry in df_cases.itertuples():
        try:
            code_country = pycountry.countries.get(name=entry.Country)
            if not code_country:
                code_country = pycountry.countries.search_fuzzy(entry.Country)[0]

            try:
                country = Country.objects.get(iso_code=code_country.alpha_3)
            except ObjectDoesNotExist:
                print(f"Could not find a matching country for {code_country.alpha_3}")

            m = CasesRecord(
                country=country,
                date=entry.Date,
                cases=entry.Daily_cases_MA7,
            )
            m.save()

        except AttributeError:
            continue
