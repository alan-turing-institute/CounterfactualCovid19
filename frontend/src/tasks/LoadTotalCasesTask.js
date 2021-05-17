import axios from "axios";
import legendItems from "../entities/LegendItems";

class LoadTotalCasesTask {
  decorateCountries = async (countryGeoms) => {
    try {
      const integratedCasesData = await this.#getIntegratedCasesData("2020-07-06");
      return this.#processCovidData(countryGeoms, integratedCasesData);
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  #getIntegratedCasesData = async (end_date) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/cases/real/integrated/?end_date=${end_date}`,
        {}
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  getIntegratedCasesCountryData = async (iso_code,end_date) => {
    try {
      console.log(`http://localhost:8000/api/cases/real/integrated/?iso_code=${iso_code}&end_date=${end_date}`)
      const res = await axios.get(
        `http://localhost:8000/api/cases/real/integrated/?iso_code=${iso_code}&end_date=${end_date}`,
        {}
      );
      return res.data[0];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

   getIntegratedCounterfactualCountryData  = async (
    iso_code,
    start_date,
    end_date,
    first_restriction_date,
    lockdown_date
  ) => {
    try {
      // in case there is both restriction and lockdown dates
      if ((lockdown_date != null) & (first_restriction_date != null)) {
        const res_counterfactual_dates = await axios.get(
          `http://localhost:8000/api/cases/counterfactual/integrated/?iso_code=${iso_code}&start_date=${start_date}&end_date=${end_date}&first_restriction_date=${first_restriction_date}&lockdown_date=${lockdown_date}`,
          {}
        );
        const size = (res_counterfactual_dates.data).length
        // return the last date on the model
        return res_counterfactual_dates.data.last();
      } else {
        // some cases there is only first_restriction_date
        if (first_restriction_date != null) {
          const res_counterfactual = await axios.get(
            `http://localhost:8000/api/cases/counterfactual/integrated/?iso_code=${iso_code}&start_date=${start_date}&end_date=${end_date}&first_restriction_date=${first_restriction_date}`,
            {}
          );
          // return the last date on the model
          return res_counterfactual.data.last();
        } else {
          const res_counterfactual_default = await axios.get(
            `http://localhost:8000/api/cases/counterfactual/integrated/?iso_code=${iso_code}&start_date=${start_date}&end_date=${end_date}`,
            {}
          );

          const size = (res_counterfactual_default.data).length
         // return the last date on the model
          return res_counterfactual_default.data.last();
        }
      }
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
