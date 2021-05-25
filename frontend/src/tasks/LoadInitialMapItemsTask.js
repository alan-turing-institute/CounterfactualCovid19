import loadGeometriesTask from "./LoadCountryGeometryTask";
import LoadTotalCasesTask from "./LoadTotalCasesTask";

// Asynchronously load geometry and cases data from Django backend
const loadInitialMapItems = async () => {
  console.log("Loading map data from Django backend...");
  const countries = await loadGeometriesTask();
  const loadTotalCasesTask = new LoadTotalCasesTask();
  const mapItems = await loadTotalCasesTask.decorateCountries(
    countries,
    "2020-07-06"
  );
  console.log(`Loaded map data for ${mapItems.length} countries`);
  return mapItems;
};

export default loadInitialMapItems;
