"""Models for Django cases app"""
from .concrete import CasesRecord
from .ephemeral import CounterfactualCasesRecord

__all__ = [
    CasesRecord,
    CounterfactualCasesRecord,
]
