import axios from "axios";

class LoadDailyCasesTask {
  #getDailyCovidCases = async (datatype, iso_code) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/cases/${datatype}/daily/normalised/?iso_code=${iso_code}&end_date=2020-06-23`,
        {}
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  getCounterfactualCovidCases = async (iso_code) => {
    const data = await this.#getDailyCovidCases("counterfactual", iso_code);
    return data;
  };

  getRealCovidCases = async (iso_code) => {
    const data = await this.#getDailyCovidCases("real", iso_code);
    return data;
  };
}

export default LoadDailyCasesTask;
