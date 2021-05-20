"""Tests for the countries module"""
from django.test import TestCase
from countries.models import Country


class CountryTestCase(TestCase):
    """Class for testing the Country model"""

    def setUp(self):
        """Initialise the object with some test data"""
        Country.objects.create(  # pylint: disable=no-member
            name="France",
            iso_code="FRA",
            area=547557,
            population=67059887,
            geometry="MULTIPOLYGON(((-4.642 48.468,-1.544 48.638,-2.036 49.789,0.295 49.264,1.782 50.877,2.348 51.028,8.141 48.889,7.686 47.651,5.984 46.235,7.187 45.830,7.490 43.819,6.381 43.082,3.839 43.436,3.089 42.457,-1.730 43.252,-0.979 45.885,-4.642 48.468)))",
        )
        Country.objects.create(  # pylint: disable=no-member
            name="United Kingdom",
            iso_code="GBR",
            area=241930,
            population=66834405,
            geometry="MULTIPOLYGON(((-5.533 50.041,-2.623 51.543,-5.228 51.690,-4.030 52.494,-4.636 53.388,-3.066 53.297,-3.297 54.841,-4.980 54.730,-4.727 55.773,-6.407 55.714,-5.128 58.581,-3.068 58.598,-4.169 57.652,-1.630 57.610,-3.255 56.013,0.441 52.913,1.746 52.774,0.601 51.451,1.374 51.186,-5.533 50.041)),((-8.152 54.323,-6.136 53.935,-5.292 54.499,-6.329 55.284,-8.152 54.323)),((-7.516 57.628,-7.361 56.940,-6.057 58.468,-7.516 57.628)))",
        )

    @property
    def fra(self):
        """Get the 'France' country object"""
        return Country.objects.get(name="France")  # pylint: disable=no-member

    @property
    def gbr(self):
        """Get the 'United Kingdom' country object"""
        return Country.objects.get(name="United Kingdom")  # pylint: disable=no-member

    def test_countries_are_loaded(self):
        """Test countries have been loaded"""
        self.assertEqual(self.fra.iso_code, "FRA")
        self.assertEqual(self.gbr.iso_code, "GBR")

    def test_country_areas(self):
        """Test countries areas"""
        self.assertEqual(self.fra.area, 547557)
        self.assertEqual(self.gbr.area, 241930)

    def test_country_populations(self):
        """Test countries populations"""
        self.assertEqual(self.fra.population, 67059887)
        self.assertEqual(self.gbr.population, 66834405)

    def test_country_population_densities(self):
        """Test countries population density"""
        self.assertEqual(int(self.fra.population_density), 122)
        self.assertEqual(int(self.gbr.population_density), 276)
