import axios from "axios";

class LoadCounterfactualRestrictionsDatesTask {
  loadLockdownDates = async (isoCode, firstRestrictionsDate) => {
    try {
      const target = `http://localhost:8000/api/dates/possible/lockdown/?iso_code=${isoCode}&restrictions_date=${firstRestrictionsDate}`;
      console.debug(`Backend ${target}`);
      const response = await axios.get(target, {});
      return response.data[0];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  loadFirstRestrictionsDates = async (isoCode, lockdownDate) => {
    try {
      const target = `http://localhost:8000/api/dates/possible/firstrestrictions/?iso_code=${isoCode}&lockdown_date=${lockdownDate}`;
      console.debug(`Backend ${target}`);
      const response = await axios.get(target, {});
      return response.data[0];
    } catch (error) {
      console.log(error);
      return [];
    }
  };
}

export default LoadCounterfactualRestrictionsDatesTask;
