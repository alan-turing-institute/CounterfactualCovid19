"""
Test the functions in process_data.py
"""
import matplotlib.pyplot as plt
import pandas as pd
import pytest
import os
import pandas as pd
from counterfactual_calculations.src.process_data import (
    get_natural_history_data,
    get_important_dates,
    get_number_of_cases,
)


def test_get_natural_history_data():
    url_cases = "https://raw.githubusercontent.com/alan-turing-institute/CounterfactualCovid19-inputs/develop/Data/Formatted/Cases_deaths_data_europe.csv"
    df_cases = pd.read_csv(url_cases)

    ts_data_country_daily, ts_data_country_cum = get_natural_history_data(
        "United Kingdom", df_cases
    )

    assert ts_data_country_daily.shape[0] != 0
    assert ts_data_country_cum.shape[0] != 0


def test_get_important_dates():

    url_summaries = "https://raw.githubusercontent.com/alan-turing-institute/CounterfactualCovid19-inputs/develop/Results/Country%20summaries.csv"
    df_summaries = pd.read_csv(url_summaries)

    country = "United Kingdom"

    dates = get_important_dates(country, df_summaries)

    assert len(dates.keys()) != 0


def test_get_initial_number_of_cases():
    url_cases = "https://raw.githubusercontent.com/alan-turing-institute/CounterfactualCovid19-inputs/develop/Data/Formatted/Cases_deaths_data_europe.csv"
    df_cases = pd.read_csv(url_cases)

    country = "United Kingdom"
    date = pd.to_datetime("2020-05-21", format="%Y-%m-%d")

    cases, cum_cases = get_number_of_cases(country, df_cases, date)

    assert cases == 2318.0
    assert cum_cases == 237741.431
