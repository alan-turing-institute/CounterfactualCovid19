import axios from "axios";

// Asynchronously load integrated cases data from Django backend
class LoadPerCountryStatisticsTask {
  loadIntegratedCasesAllCountries = async (end_date) => {
    try {
      const target = `http://localhost:3000/api/cases/real/integrated/?end_date=${end_date}`;
      console.debug(`Backend ${target}`);
      const response = await axios.get(target, {});
      return response.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  loadIntegratedCases = async (iso_code, start_date, end_date) => {
    try {
      const target = `http://localhost:3000/api/cases/real/integrated/?iso_code=${iso_code}&start_date=${start_date}&end_date=${end_date}`;
      console.debug(`Backend ${target}`);
      const response = await axios.get(target, {});
      return response.data[0];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  // Asynchronously load integrated cases simulation from Django backend
  loadIntegratedCounterfactualCases = async (
    iso_code,
    start_date,
    end_date,
    first_restriction_date,
    lockdown_date
  ) => {
    try {
      var target = `http://localhost:3000/api/cases/counterfactual/integrated/?iso_code=${iso_code}&start_date=${start_date}&end_date=${end_date}`;
      if (first_restriction_date) {
        target = `${target}&first_restriction_date=${first_restriction_date}`;
      }
      if (lockdown_date) {
        target = `${target}&lockdown_date=${lockdown_date}`;
      }
      console.debug(`Backend ${target}`);
      const response = await axios.get(target, {});
      // Return counterfactual data if there is any
      if (response.data.length) {
        return response.data[0];
      }
      // ... otherwise warn and return null values
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

  // Asynchronously load integrated deaths data from Django backend
  loadIntegratedDeaths = async (iso_code, start_date, end_date) => {
    try {
      const target = `http://localhost:3000/api/deaths/real/integrated/?iso_code=${iso_code}&start_date=${start_date}&end_date=${end_date}`;
      console.debug(`Backend ${target}`);
      const response = await axios.get(target, {});
      return response.data[0];
    } catch (error) {
      console.log(error);
      return [];
    }
  };
}
export default LoadPerCountryStatisticsTask;
