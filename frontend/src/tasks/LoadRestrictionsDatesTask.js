import axios from "axios";

class LoadRestrictionsDatesTask {
  #getRestrictionDates = async (iso_code) => {
    try {
      const target = `http://localhost:8000/api/modeldaterange/?iso_code=${iso_code}`;
      console.debug(`Backend ${target}`);
      const response = await axios.get(target, {});
      return response.data[0];
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
