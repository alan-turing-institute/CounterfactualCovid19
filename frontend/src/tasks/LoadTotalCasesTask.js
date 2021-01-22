import axios from "axios";
import legendItems from "../entities/LegendItems";

class LoadTotalCasesTask {
  decorateCountries = async (countries) => {
    try {
      const totalCases = await this.#getTotalCases();
      return this.#processCovidData(countries, totalCases);
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  #getTotalCases = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/cases", {});
      return res.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  #processCovidData = (countries, casesData) => {
    for (let i = 0; i < countries.length; i++) {
      const country = countries[i];
      const covidCountry = casesData.find(
        (covidCountry) => country.properties.iso_code === covidCountry.iso_code
      );

      const casesPerMillion = covidCountry
        ? (Number(covidCountry.cumulative_cases) /
            Number(covidCountry.population)) *
          1e6
        : 0;
      country.properties.confirmed = casesPerMillion;
      country.properties.confirmedText = casesPerMillion.toFixed(2).toString();

      this.#setCountryColor(country);
    }
    return countries;
  };

  #setCountryColor = (country) => {
    const legendItem = legendItems.find((item) =>
      item.isFor(country.properties.confirmed)
    );
    if (legendItem != null) {
      country.properties.color = legendItem.color;
    }
  };
}

export default LoadTotalCasesTask;
