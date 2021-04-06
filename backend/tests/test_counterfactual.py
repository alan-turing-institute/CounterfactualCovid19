"""Tests for the counterfactual module"""
from datetime import date
import unittest
import pandas as pd
from counterfactual import simulate_records


def to_integer(dict_):
    """Convert all float fields in a dictionary to integers"""
    for key in dict_.keys():
        if isinstance(dict_[key], float):
            dict_[key] = int(dict_[key])
    return dict_


def select(iso_code, date_, records):
    """Select the first matching record from a list of records"""
    for record in records:
        if record["iso_code"] == iso_code and record["date"] == date_:
            return record
    return None


class SimulationTestCase(unittest.TestCase):
    """Class for testing counterfactual simulations"""

    def setUp(self):
        """Initialise the object with some test data"""
        self.df_casesrecord = pd.DataFrame(
            {
                "date": [
                    date(2020, 4, 9),
                    date(2020, 4, 9),
                    date(2020, 4, 10),
                    date(2020, 4, 10),
                    date(2020, 4, 11),
                    date(2020, 4, 11),
                ],
                "iso_code": ["FRA", "GBR", "FRA", "GBR", "FRA", "GBR"],
                "population": [
                    67059887,
                    66834405,
                    67059887,
                    66834405,
                    67059887,
                    66834405,
                ],
                "weekly_avg_cases": [7000, 4800, 7130, 4400, 7299, 4250],
            }
        )
        self.df_knotdateset = pd.DataFrame(
            {
                "growth_factor_0_1": [1.28, 1.29, 1.25, 1.25],
                "growth_factor_1_2": [1.1, 1.1, 1.1, 1.05],
                "growth_factor_2_3": [0.9, 0.9, 0.95, 0.95],
                "iso_code": ["FRA", "FRA", "GBR", "GBR"],
                "knot_date_1": [
                    date(2020, 3, 15),
                    date(2020, 3, 15),
                    date(2020, 3, 19),
                    date(2020, 3, 21),
                ],
                "knot_date_2": [
                    date(2020, 4, 4),
                    date(2020, 4, 5),
                    date(2020, 4, 4),
                    date(2020, 4, 18),
                ],
                "weight": [24, 8, 14, 12],
            }
        )
        self.df_modeldaterange = pd.DataFrame(
            {
                "initial_date": [date(2020, 3, 1), date(2020, 3, 2)],
                "maximum_date": [date(2020, 6, 8), date(2020, 6, 10)],
                "first_restrictions_date": [date(2020, 2, 29), date(2020, 3, 13)],
                "lockdown_date": [date(2020, 3, 17), date(2020, 3, 21)],
                "iso_code": ["FRA", "GBR"],
            }
        )
        self.df_possibledateset = pd.DataFrame(
            {
                "n_days_first_restrictions": [0, 0, 1, 1, 0, 0, 1, 1],
                "n_days_lockdown": [15, 16, 0, 1, 6, 7, 0, 1],
                "dates_counterfactual_first_restrictions": [
                    date(2020, 2, 29),
                    date(2020, 2, 29),
                    date(2020, 2, 28),
                    date(2020, 2, 28),
                    date(2020, 3, 13),
                    date(2020, 3, 13),
                    date(2020, 3, 12),
                    date(2020, 3, 12),
                ],
                "dates_counterfactual_lockdown": [
                    date(2020, 3, 2),
                    date(2020, 3, 1),
                    date(2020, 3, 17),
                    date(2020, 3, 16),
                    date(2020, 3, 15),
                    date(2020, 3, 14),
                    date(2020, 3, 21),
                    date(2020, 3, 20),
                ],
                "iso_code": ["FRA", "FRA", "FRA", "FRA", "GBR", "GBR", "GBR", "GBR"],
            }
        )

    def test_shift_nothing(self):
        """Test simulation with no shift"""
        records = map(
            to_integer,
            simulate_records(
                self.df_casesrecord,
                self.df_knotdateset,
                self.df_modeldaterange,
                self.df_possibledateset,
                (None, None),
            ),
        )
        record_fra = select("FRA", date(2020, 4, 11), records)
        self.assertDictEqual(
            {
                "date": date(2020, 4, 11),
                "iso_code": "FRA",
                "population": 67059887,
                "weekly_avg_cases": 5670,
                "summed_avg_cases": 18970,
            },
            record_fra,
        )
        record_gbr = select("GBR", date(2020, 4, 10), records)
        self.assertDictEqual(
            {
                "date": date(2020, 4, 10),
                "iso_code": "GBR",
                "population": 66834405,
                "weekly_avg_cases": 4781,
                "summed_avg_cases": 9581,
            },
            record_gbr,
        )

    def test_shift_lockdown_fra(self):
        """Test simulation after shifting the French lockdown"""
        records = map(
            to_integer,
            simulate_records(
                self.df_casesrecord[self.df_casesrecord["iso_code"] == "FRA"],
                self.df_knotdateset,
                self.df_modeldaterange,
                self.df_possibledateset,
                (date(2020, 2, 28), None),
            ),
        )
        record_fra = select("FRA", date(2020, 4, 10), records)
        self.assertDictEqual(
            {
                "date": date(2020, 4, 10),
                "iso_code": "FRA",
                "population": 67059887,
                "weekly_avg_cases": 6300,
                "summed_avg_cases": 13300,
            },
            record_fra,
        )

    def test_shift_restrictions_gbr(self):
        """Test simulation after shifting the UK restrictions"""
        records = map(
            to_integer,
            simulate_records(
                self.df_casesrecord[self.df_casesrecord["iso_code"] == "GBR"],
                self.df_knotdateset,
                self.df_modeldaterange,
                self.df_possibledateset,
                (None, date(2020, 3, 14)),
            ),
        )
        record_gbr = select("GBR", date(2020, 4, 10), records)
        self.assertDictEqual(
            {
                "date": date(2020, 4, 10),
                "iso_code": "GBR",
                "population": 66834405,
                "weekly_avg_cases": 4781,
                "summed_avg_cases": 9581,
            },
            record_gbr,
        )
