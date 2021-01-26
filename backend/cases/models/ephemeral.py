class DailyCounterfactualCases:
    def __init__(self, iso_code, date, cases, cumulative_cases):
        self.iso_code = iso_code
        self.date = date
        self.cases = cases
        self.cumulative_cases = cumulative_cases

    def __str__(self):
        return (
            f"({self.iso_code}) [{self.date}] => {self.cases} ({self.cumulative_cases})"
        )
