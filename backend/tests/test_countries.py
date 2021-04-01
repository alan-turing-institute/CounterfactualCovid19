from django.test import TestCase
from countries.models import Country


class CountryTestCase(TestCase):
    def setUp(self):
        Country.objects.create(
            name="France",
            iso_code="FRA",
            population=67059887,
            geometry="MULTIPOLYGON(((-4.642 48.468,-1.544 48.638,-2.036 49.789,0.295 49.264,1.782 50.877,2.348 51.028,8.141 48.889,7.686 47.651,5.984 46.235,7.187 45.830,7.490 43.819,6.381 43.082,3.839 43.436,3.089 42.457,-1.730 43.252,-0.979 45.885,-4.642 48.468)))",
        )
        Country.objects.create(
            name="United Kingdom",
            iso_code="GBR",
            population=66834405,
            geometry="MULTIPOLYGON(((-5.533 50.041,-2.623 51.543,-5.228 51.690,-4.030 52.494,-4.636 53.388,-3.066 53.297,-3.297 54.841,-4.980 54.730,-4.727 55.773,-6.407 55.714,-5.128 58.581,-3.068 58.598,-4.169 57.652,-1.630 57.610,-3.255 56.013,0.441 52.913,1.746 52.774,0.601 51.451,1.374 51.186,-5.533 50.041)),((-8.152 54.323,-6.136 53.935,-5.292 54.499,-6.329 55.284,-8.152 54.323)),((-7.516 57.628,-7.361 56.940,-6.057 58.468,-7.516 57.628)))",
        )

    def test_countries_are_loaded(self):
        """Test countries have been loaded"""
        c_fra = Country.objects.get(name="France")
        c_gbr = Country.objects.get(name="United Kingdom")
        self.assertEqual(c_fra.iso_code, "FRA")
        self.assertEqual(c_gbr.iso_code, "GBR")
