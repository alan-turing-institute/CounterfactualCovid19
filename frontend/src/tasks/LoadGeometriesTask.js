import axios from 'axios';

class LoadGeometriesTask {
  getCountries = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/countries', {});
      return response.data.features;
    } catch (error) {
      console.log(error);
      return [];
    }
  };
}

export default LoadGeometriesTask;
