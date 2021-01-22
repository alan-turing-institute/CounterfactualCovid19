import legendItems from "../entities/LegendItems";
import axios from "axios";

class LoadCovidDataTask {
  decorateCountries = async (countries) => {
    try {
      const casesResponse = await axios.get(
        "http://localhost:8000/api/cases",
        {}
      );
      return this.#processCovidData(countries, casesResponse.data);
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

      country.properties.confirmed = 0;
      country.properties.confirmedText = 0;

      if (covidCountry != null) {
        let confirmed =
          (Number(covidCountry.cumulative_cases) /
            Number(covidCountry.population)) *
          1e6;
        country.properties.confirmed = confirmed;
        country.properties.confirmedText = confirmed.toFixed(2).toString();
      }
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

export default LoadCovidDataTask;
