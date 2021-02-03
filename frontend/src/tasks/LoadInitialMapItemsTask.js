import LoadGeometriesTask from "./LoadGeometriesTask";
import LoadTotalCasesTask from "./LoadTotalCasesTask";

// Asynchronously load geometry and cases data from Django backend
const loadInitialMapItems = async () => {
  console.log("Loading geometries from Django backend...");
  const loadGeometriesTask = new LoadGeometriesTask();
  const countries = await loadGeometriesTask.getCountries();
  console.log("Preparing map using COVID data...");
  const loadTotalCasesTask = new LoadTotalCasesTask();
  const mapItems = await loadTotalCasesTask.decorateCountries(countries);
  console.log(`Loaded map data for ${mapItems.length} countries`);
  return mapItems;
};

export default loadInitialMapItems;
