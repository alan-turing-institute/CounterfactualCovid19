import axios from "axios";

class LoadDailyCasesTask {
  getCounterfactualCovidCases = async (
    iso_code,
    start_date,
    end_date,
    first_restriction_date,
    lockdown_date
  ) => {
    try {
      var target = `http://localhost:8000/api/cases/counterfactual/daily/normalised/?iso_code=${iso_code}&start_date=${start_date}&end_date=${end_date}`;
      if (first_restriction_date != null) {
        target = `${target}&first_restriction_date=${first_restriction_date}`;
      }
      if (lockdown_date != null) {
        target = `${target}&lockdown_date=${lockdown_date}`;
      }
      console.debug(`Backend ${target}`);
      const response = await axios.get(target, {});
      return response.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  getRealCovidCases = async (iso_code, start_date, end_date) => {
    try {
      const target = `http://localhost:8000/api/cases/real/daily/normalised/?iso_code=${iso_code}&start_date=${start_date}&end_date=${end_date}`;
      console.debug(`Backend ${target}`);
      const response = await axios.get(target, {});
      return response.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };
}

export default LoadDailyCasesTask;
