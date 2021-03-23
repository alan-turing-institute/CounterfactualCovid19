"""Settings for running in Docker"""
from .common import *  # pylint: disable=wildcard-import,unused-wildcard-import

DATABASES["default"]["HOST"] = "db"
