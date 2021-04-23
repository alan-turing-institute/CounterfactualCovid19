import axios from "axios";

class LoadDailyCasesTask {
  #getDailyCovidCases = async (
    datatype,
    iso_code,
    start_date = null,
    end_date = null
  ) => {
    try {
      console.log(
        `http://localhost:8000/api/cases/${datatype}/daily/normalised/?iso_code=${iso_code}&start_date=${start_date}&end_date=${end_date}`
      );
      const res_dates = await axios.get(
        `http://localhost:8000/api/cases/${datatype}/daily/normalised/?iso_code=${iso_code}&start_date=${start_date}&end_date=${end_date}`,
        {}
      );
      return res_dates.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  #getDailyCounterfactualCovidCases = async (
    datatype,
    iso_code,
    start_date = null,
    end_date = null,
    first_restriction_date = null,
    lockdown_date = null
  ) => {
    try {
      if ((lockdown_date != null) & (first_restriction_date != null)) {
        console.log(
          `http://localhost:8000/api/cases/${datatype}/daily/normalised/?iso_code=${iso_code}&start_date=${start_date}&end_date=${end_date}&first_restriction_date=${first_restriction_date}&lockdown_date=${lockdown_date}`
        );
        const res_counterfactual_dates = await axios.get(
          `http://localhost:8000/api/cases/${datatype}/daily/normalised/?iso_code=${iso_code}&start_date=${start_date}&end_date=${end_date}&first_restriction_date=${first_restriction_date}&lockdown_date=${lockdown_date}`,
          {}
        );
        return res_counterfactual_dates.data;
      } else {
        if (first_restriction_date != null) {
          const res_counterfactual = await axios.get(
            `http://localhost:8000/api/cases/${datatype}/daily/normalised/?iso_code=${iso_code}&start_date=${start_date}&end_date=${end_date}&first_restriction_date=${first_restriction_date}`,
            {}
          );
          return res_counterfactual.data;
        } else {
          const res_counterfactual_default = await axios.get(
            `http://localhost:8000/api/cases/${datatype}/daily/normalised/?iso_code=${iso_code}&start_date=${start_date}&end_date=${end_date}`,
            {}
          );
          return res_counterfactual_default.data;
        }
      }
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
