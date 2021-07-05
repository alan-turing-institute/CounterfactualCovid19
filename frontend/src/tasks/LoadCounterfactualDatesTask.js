import axios from "axios";

class LoadCounterfactualDatesTask {
  loadLockdownDates = async (isoCode, firstRestrictionsDate) => {
    try {
      var target = `/api/dates/possible/lockdown/?iso_code=${isoCode}`;
      if (firstRestrictionsDate) {
        target = `${target}&restrictions_date=${firstRestrictionsDate}`;
      }
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
      var target = `/api/dates/possible/firstrestrictions/?iso_code=${isoCode}`;
      if (lockdownDate) {
        target = `${target}&lockdown_date=${lockdownDate}`;
      }
      console.debug(`Backend ${target}`);
      const response = await axios.get(target, {});
      return response.data[0];
    } catch (error) {
      console.log(error);
      return [];
    }
  };
}

export default LoadCounterfactualDatesTask;
