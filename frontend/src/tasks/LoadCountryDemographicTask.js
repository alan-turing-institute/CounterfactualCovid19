import axios from "axios";

class LoadCountryDemographicTask {
  retrieve = async (iso_code) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/country/geometry/?iso_code=${iso_code}`, {});
      return res.data.features;
    } catch (error) {
      console.log(error);
      return [];
    }
  };
}

export default LoadCountryDemographicTask;
