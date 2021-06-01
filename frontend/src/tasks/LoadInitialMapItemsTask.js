import applyCountryColours from "./LoadCountryColoursTask";
import loadGeometriesTask from "./LoadCountryGeometryTask";
import LoadPerCountryStatisticsTask from "../tasks/LoadPerCountryStatisticsTask.js";

// Asynchronously load geometry and cases data from Django backend
const loadInitialMapItems = async (endDate) => {
  console.log("Loading map data from Django backend...");
  const countries = await loadGeometriesTask();
  console.log("Loading cases data from Django backend...");
  const task = new LoadPerCountryStatisticsTask();
  const casesData = await task.loadIntegratedCasesAllCountries(endDate);
  const mapItems = await applyCountryColours(countries, casesData);
  console.log(`Loaded data for ${mapItems.length} countries`);
  return mapItems;
};

export default loadInitialMapItems;
