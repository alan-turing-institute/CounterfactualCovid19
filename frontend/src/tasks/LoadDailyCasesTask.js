import axios from "axios";

class LoadDailyCasesTask {
  // function to get real cases for a period of time,
  #getDailyCovidCases = async (datatype, iso_code, start_date, end_date) => {
    try {
      const target = `http://localhost:8000/api/cases/${datatype}/daily/normalised/?iso_code=${iso_code}&start_date=${start_date}&end_date=${end_date}`;
      console.debug(`Backend ${target}`);
      const response = await axios.get(target, {});
      return response.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  // function to get counterfactual cases for given restriction dates for a period of time
  #getDailyCounterfactualCovidCases = async (
    datatype,
    iso_code,
    start_date,
    end_date,
    first_restriction_date,
    lockdown_date
  ) => {
    try {
      var target = `http://localhost:8000/api/cases/${datatype}/daily/normalised/?iso_code=${iso_code}&start_date=${start_date}&end_date=${end_date}`;
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

  getCounterfactualCovidCases = async (
    iso_code,
    start_date,
    end_date,
    first_restriction,
    lockdown_date
  ) => {
    const data = await this.#getDailyCounterfactualCovidCases(
      "counterfactual",
      iso_code,
      start_date,
      end_date,
      first_restriction,
      lockdown_date
    );
    return data;
  };

  getRealCovidCases = async (iso_code, start_date, end_date) => {
    const data = await this.#getDailyCovidCases(
      "real",
      iso_code,
      start_date,
      end_date
    );
    return data;
  };
}

export default LoadDailyCasesTask;
