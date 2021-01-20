import legendItems from "../entities/LegendItems";
import axios from 'axios';

class LoadCovidDataTask {
  constructor(geometries) {
    this.setState = null;
    this.geometries = geometries;
  }

  load = async (setState) => {
    this.setState = setState;
    try {
      const response = await axios.get('http://localhost:8000/api/cases', {});
      this.#processCovidData(response.data);
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  #processCovidData = (covidCountries) => {
    for (let i = 0; i < this.geometries.length; i++) {
      const country = this.geometries[i];
      const covidCountry = covidCountries.find(
        (covidCountry) => country.properties.iso_code === covidCountry.iso_code
      );

      country.properties.confirmed = 0;
      country.properties.confirmedText = 0;

      if (covidCountry != null) {
        let confirmed = (Number(covidCountry.cumulative_cases) / Number(covidCountry.population)) * 1000000;
        country.properties.confirmed = confirmed;
        country.properties.confirmedText = confirmed.toFixed(2).toString();
      }
      this.#setCountryColor(country);
    }

    this.setState(this.geometries);
  };

  #setCountryColor = (country) => {
    const legendItem = legendItems.find((item) =>
      item.isFor(country.properties.confirmed)
    );
    if (legendItem != null) country.properties.color = legendItem.color;
  };
}

export default LoadCovidDataTask;
