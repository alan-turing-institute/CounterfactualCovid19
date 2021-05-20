import pycountry
from django.core.exceptions import ObjectDoesNotExist
from countries.models import Country


def get_country_code(country_name):
    """
    Find ISO code for a given country
    """
    country_code = pycountry.countries.get(name=country_name)
    if not country_code:
        country_code = pycountry.countries.search_fuzzy(country_name)[0]
    return country_code.alpha_3


def get_country_model(iso_code):
    """
    For a given ISO code get the Country Model
    """
    try:
        return Country.objects.get(iso_code=iso_code)  # pylint: disable=no-member
    except ObjectDoesNotExist:
        print(f"Could not find a matching country for {iso_code}")
    return None


def create_code_lookup(unique_countries):
    """
    Create a lookup table from country name to to ISO code

    """
    # Add an ISO code column lookup table
    code_lookup = {country: get_country_code(country) for country in unique_countries}
    return code_lookup


def create_country_lookup(unique_iso_codes):
    """
    Create a lookup table from ISO code to Country model

    """
    country_lookup = {
        iso_code: get_country_model(iso_code) for iso_code in unique_iso_codes
    }

    return country_lookup
