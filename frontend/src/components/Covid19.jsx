import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import CovidMap from "./CovidMap";
import LoadGeometriesTask from "../tasks/LoadGeometriesTask";
import LoadCountriesTask from "../tasks/LoadCountriesTask";
import Legend from "./Legend";
import legendItems from "../entities/LegendItems";

const Covid19 = () => {
  const [countries, setCountries] = useState([]);

  const legendItemsReverse = [...legendItems].reverse();

  // Asynchronously wait until geometries are available then combine with COVID-data
  useEffect(() => {
    async function loadGeometries() {
      console.log("Loading geometries from Django backend...");
      const loadGeometriesTask = new LoadGeometriesTask();
      const geometries = await loadGeometriesTask.getCountries();
      console.log("Preparing map");
      const loadCountriesTask = new LoadCountriesTask(geometries);
      loadCountriesTask.load((countries) => setCountries(countries));
    }
    loadGeometries();
  }, []);

  return (
    <div>
      {countries.length === 0 ? (
        <Loading />
      ) : (
          <div>
            <CovidMap countries={countries} />
            <Legend legendItems={legendItemsReverse} />
          </div>
        )}
    </div>
  );
};

export default Covid19;
