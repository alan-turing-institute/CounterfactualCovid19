
"""
Test the functions in simulate_counterfactuals.py
"""
import matplotlib.pyplot as plt
import pandas as pd
import pytest
import os
import pandas as pd
from src.simulate_counterfactuals import simulate_counterfactuals

def test_simulate_counterfactuals():

    url_cases = 'https://raw.githubusercontent.com/alan-turing-institute/CounterfactualCovid19-inputs/develop/Data/Formatted/Cases_deaths_data_europe.csv'
    df_cases = pd.read_csv(url_cases)

    url_best_knot = 'https://raw.githubusercontent.com/alan-turing-institute/CounterfactualCovid19-inputs/develop/Results/Best%20knot%20points.csv'
    df_best_knot = pd.read_csv(url_best_knot)

    url_summaries = 'https://raw.githubusercontent.com/alan-turing-institute/CounterfactualCovid19-inputs/develop/Results/Country%20summaries.csv'
    df_summaries = pd.read_csv(url_summaries)



    ts_daily_cases =  simulate_counterfactuals('United Kingdom',(7,7),df_cases,df_best_knot,df_summaries)
