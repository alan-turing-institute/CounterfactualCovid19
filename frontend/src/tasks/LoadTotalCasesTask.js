import axios from "axios";
import legendItems from "../entities/LegendItems";

class LoadTotalCasesTask {
  decorateCountries = async (countryGeoms, endDate) => {
    console.log("Loading cases data from Django backend...");
    try {
      const integratedCasesData = await this.#getIntegratedCasesData(endDate);
      return this.#processCovidData(countryGeoms, integratedCasesData);
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  #getIntegratedCasesData = async (end_date) => {
    try {
      const target = `http://localhost:8000/api/cases/real/integrated/?end_date=${end_date}`;
      console.debug(`Backend ${target}`);
      const response = await axios.get(target, {});
      return response.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  getIntegratedCasesCountryData = async (iso_code, end_date) => {
    try {
      const target = `http://localhost:8000/api/cases/real/integrated/?iso_code=${iso_code}&end_date=${end_date}`;
      console.debug(`Backend ${target}`);
      const response = await axios.get(target, {});
      return response.data[0];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  getIntegratedCounterfactualCountryData = async (
    iso_code,
    start_date,
    end_date,
    first_restriction_date,
    lockdown_date
  ) => {
    try {
      var target = `http://localhost:8000/api/cases/counterfactual/integrated/?iso_code=${iso_code}&start_date=${start_date}&end_date=${end_date}`;
      if (first_restriction_date) {
        target = `${target}&first_restriction_date=${first_restriction_date}`;
      }
      if (lockdown_date) {
        target = `${target}&lockdown_date=${lockdown_date}`;
      }
      console.debug(`Backend ${target}`);
      const response = await axios.get(target, {});
      // Use data from the latest date in the response
      if (response.data.length) {
        return response.data[response.data.length - 1];
      }
      // Return null values if there is no counterfactual data
      console.warn(
        `No counterfactual data returned for ${iso_code}. First restriction date ${first_restriction_date}; lockdown date ${lockdown_date}.`
      );
      return {
        summed_avg_cases: null,
        summed_avg_cases_per_million: null,
      };
    } catch (error) {
      console.log(error);
      return {};
    }
  };

  #processCovidData = (countryGeoms, integratedCasesData) => {
    console.log(
      `Determining colour scheme for ${countryGeoms.length} geometries...`
    );
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
