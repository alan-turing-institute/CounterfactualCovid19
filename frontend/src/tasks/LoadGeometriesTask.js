import axios from "axios";

class LoadGeometriesTask {
  getCountries = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/country/geometry/", {});
      return res.data.features;
    } catch (error) {
      console.log(error);
      return [];
    }
  };
}

export default LoadGeometriesTask;
