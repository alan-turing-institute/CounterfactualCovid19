import axios from "axios";

class LoadCountryDemographicTask {
  retrieve = async (iso_code) => {
    try {
      const target = `http://localhost:8000/api/country/demographic/?iso_code=${iso_code}`;
      console.debug(`Backend ${target}`);
      const response = await axios.get(target, {});
      return response.data[0];
    } catch (error) {
      console.log(error);
      return [];
    }
  };
}

export default LoadCountryDemographicTask;
