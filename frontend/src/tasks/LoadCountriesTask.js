import papa from "papaparse";
import legendItems from "../entities/LegendItems";

class LoadCountryTask {
  constructor(geometries) {
    this.covidUrl = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/web-data/data/cases_country.csv";
    this.setState = null;
    this.geometries = geometries;
  }

  load = (setState) => {
    this.setState = setState;

    papa.parse(this.covidUrl, {
      download: true,
      header: true,
      complete: (result) => this.#processCovidData(result.data),
    });
  };

  #processCovidData = (covidCountries) => {
    console.log("countryGeometries");
    console.log(this.geometries);
    for (let i = 0; i < this.geometries.length; i++) {
      const country = this.geometries[i];
      const covidCountry = covidCountries.find(
        (covidCountry) => country.properties.iso_code === covidCountry.ISO3
      );

      country.properties.confirmed = 0;
      country.properties.confirmedText = 0;

      if (covidCountry != null) {
        let confirmed = Number(covidCountry.Confirmed);
        country.properties.confirmed = confirmed;
        country.properties.confirmedText = this.#formatNumberWithCommas(
          confirmed
        );
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

  #formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
}

export default LoadCountryTask;
