import axios from "axios";

// Asynchronously load country demographic data from Django backend
const loadCountryDemographicsTask = async (iso_code) => {
  try {
    const target = `/api/country/demographic/?iso_code=${iso_code}`;
    console.debug(`Backend ${target}`);
    const response = await axios.get(target, {});
    return response.data[0];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default loadCountryDemographicsTask;
