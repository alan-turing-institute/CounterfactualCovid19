"""
Test the functions in process_data.py
"""
import matplotlib.pyplot as plt
import pandas as pd
import pytest
import os
import pandas as pd
from src.process_data import get_natural_history_data



def test_get_natural_history_data():
    url_cases = 'https://raw.githubusercontent.com/alan-turing-institute/CounterfactualCovid19-inputs/develop/Data/Formatted/Cases_deaths_data_europe.csv'
    df_cases = pd.read_csv(url_cases)



    ts_data_country_daily, ts_data_country_cum = get_natural_history_data('United Kingdom',df_cases)

    assert (ts_data_country_daily.shape[0] != 0)
    assert (ts_data_country_cum.shape[0] != 0)


