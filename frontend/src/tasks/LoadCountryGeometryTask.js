import axios from "axios";
import axiosRetry from "axios-retry";

// Asynchronously load country demographic data from Django backend
const loadGeometriesTask = async () => {
  try {
    const target = "http://localhost:8000/api/country/geometry/";
    console.debug(`Backend ${target}`);
    axiosRetry(axios, {
      retries: 10, // number of retries
      retryDelay: (retryCount) => {
        console.log(`Backend retry attempt: ${retryCount}/10`);
        return retryCount * 2000; // time interval between retries
      },
    });
    const response = await axios.get(target, {});
    return response.data.features;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default loadGeometriesTask;
