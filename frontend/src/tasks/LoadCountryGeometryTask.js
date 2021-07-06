import axios from "axios";
import axiosRetry from "axios-retry";

// Asynchronously load country demographic data from Django backend
const loadGeometriesTask = async () => {
  try {
    //const baseUrl = "http://localhost:3000";
    const endpoint = "/api/country/geometry/";
    console.debug(`Backend ${endpoint}`);
    const request = axios.create({});
    axiosRetry(request, {
      retries: 10, // number of retries
      retryDelay: (retryCount) => {
        console.log(`Backend retry attempt: ${retryCount}/10`);
        return retryCount * 2000; // time interval between retries
      },
    });
    const response = await request.get(endpoint, {});
    return response.data.features;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default loadGeometriesTask;
