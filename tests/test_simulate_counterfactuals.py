"""
Test the functions in simulate_counterfactuals.py
"""
import matplotlib.pyplot as plt
import pandas as pd
import pytest
import os
import pandas as pd
from src.simulate_counterfactuals import simulate_country_counterfactuals


def test_simulate_counterfactuals():
    url_cases = 'https://raw.githubusercontent.com/alan-turing-institute/CounterfactualCovid19-inputs/develop/Data/Formatted/Cases_deaths_data_europe.csv'
    df_cases = pd.read_csv(url_cases)

    url_best_knot = 'https://raw.githubusercontent.com/alan-turing-institute/CounterfactualCovid19-inputs/develop/Results/Best%20knot%20points.csv'
    df_best_knot = pd.read_csv(url_best_knot)

    url_summaries = 'https://raw.githubusercontent.com/alan-turing-institute/CounterfactualCovid19-inputs/develop/Results/Country%20summaries.csv'
    df_summaries = pd.read_csv(url_summaries)

    country = 'United Kingdom'

    ts_daily_cases, ts_cum_daily_cases = simulate_country_counterfactuals(country, (7, 7), df_cases, df_best_knot, \
                                                                  df_summaries)

    data_eur_country_daily = df_cases[df_cases['Country'] == country].reindex('Date')['Daily_cases_MA7']
    data_eur_country_cum = df_cases[df_cases['Country'] == country].reindex('Date')['Cumulative_cases_end_MA7']


    assert (ts_daily_cases.shape[0] != 0)
    assert (ts_cum_daily_cases.shape[0] != 0)
