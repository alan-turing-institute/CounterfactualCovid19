import axios from "axios";

class LoadRestrictionsDatesTask {
  #getRestrictionDates = async (iso_code) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/modeldaterange/?iso_code=${iso_code}`,
        {}
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  getCountryRestrictionDates = async (iso_code) => {
    const data = await this.#getRestrictionDates(iso_code);
    return data;
  };


}

export default LoadRestrictionsDatesTask;
