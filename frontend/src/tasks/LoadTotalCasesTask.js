import axios from "axios";
import legendItems from "../entities/LegendItems";

class LoadTotalCasesTask {
  decorateCountries = async (countryGeoms) => {
    try {
      const integratedCasesData = await this.#getIntegratedCasesData();
      return this.#processCovidData(countryGeoms, integratedCasesData);
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  #getIntegratedCasesData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/cases/real/integrated/?end_date=2020-07-06",
        {}
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  #processCovidData = (countryGeoms, integratedCasesData) => {
    for (let i = 0; i < countryGeoms.length; i++) {
      // Find matching country
      const countryGeom = countryGeoms[i];
      const countryData = integratedCasesData.find(
        (countryData) => countryGeom.id === countryData.iso_code
      );
      // Decorate with total cases per million
      countryGeom.properties.summedAvgCasesPerMillion = countryData
        ? Number(countryData.summed_avg_cases_per_million)
        : 0;
      // Set appropriate colour
      this.#setCountryColour(countryGeom);
    }
    return countryGeoms;
  };

  #setCountryColour = (countryGeom) => {
    const legendItem = legendItems.find((item) =>
      item.isFor(countryGeom.properties.summedAvgCasesPerMillion)
    );
    if (legendItem != null) {
      countryGeom.properties.color = legendItem.color;
    }
  };
}

export default LoadTotalCasesTask;
