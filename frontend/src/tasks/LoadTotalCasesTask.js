import axios from "axios";
import legendItems from "../entities/LegendItems";

class LoadTotalCasesTask {
  decorateCountries = async (countries) => {
    try {
      const totalCovidCases = await this.#getTotalCovidCases();
      return this.#processCovidData(countries, totalCovidCases);
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  #getTotalCovidCases = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/cases/real/integrated/?end_date=2020-06-23",
        {}
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  #processCovidData = (countries, totalCovidCases) => {
    for (let i = 0; i < countries.length; i++) {
      // Find matching country
      const country = countries[i];
      const covidCountry = totalCovidCases.find(
        (covidCountry) => country.id === covidCountry.iso_code
      );
      // Decorate with total cases per million
      const casesPerMillion = covidCountry
        ? Number(covidCountry.total_cases_per_million)
        : 0;
      country.properties.confirmed = casesPerMillion;
      country.properties.confirmedText = casesPerMillion.toFixed(2).toString();
      // Set appropriate colour
      this.#setCountryColour(country);
    }
    return countries;
  };

  #setCountryColour = (country) => {
    const legendItem = legendItems.find((item) =>
      item.isFor(country.properties.confirmed)
    );
    if (legendItem != null) {
      country.properties.color = legendItem.color;
    }
  };
}

export default LoadTotalCasesTask;
