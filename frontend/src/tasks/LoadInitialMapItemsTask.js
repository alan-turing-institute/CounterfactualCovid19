import LoadGeometriesTask from "./LoadCountryGeometryTask";
import LoadTotalCasesTask from "./LoadTotalCasesTask";

// Asynchronously load geometry and cases data from Django backend
const loadInitialMapItems = async () => {
  console.log("Loading map data from Django backend...");
  const loadGeometriesTask = new LoadGeometriesTask();
  const countries = await loadGeometriesTask.retrieve();
  const loadTotalCasesTask = new LoadTotalCasesTask();
  const mapItems = await loadTotalCasesTask.decorateCountries(countries);
  console.log(`Loaded map data for ${mapItems.length} countries`);
  return mapItems;
};

export default loadInitialMapItems;
