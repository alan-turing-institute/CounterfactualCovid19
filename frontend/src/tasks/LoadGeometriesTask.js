import axios from 'axios';

class LoadGeometriesTask {
  getCountries = async () => {
    try {
      console.log("about to wait for django response");
      const response = await axios.get('http://localhost:8000/api/countries', {});
      console.log("django response");
      console.log(response);
      return response.data.features;
    } catch (error) {
      console.log(error);
    }
  };
}

export default LoadGeometriesTask;
