import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import CovidMap from "./CovidMap";
import LoadGeometriesTask from "../tasks/LoadGeometriesTask";
import LoadCovidDataTask from "../tasks/LoadCovidDataTask";
import Legend from "./Legend";
import legendItems from "../entities/LegendItems";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

const Covid19 = () => {
  const [countries, setCountries] = useState([]);

  const legendItemsReverse = [...legendItems].reverse();

  // Asynchronously wait until geometries are available then combine with COVID-data
  useEffect(() => {
    async function loadGeometries() {
      console.log("Loading geometries from Django backend...");
      const loadGeometriesTask = new LoadGeometriesTask();
      const geometries = await loadGeometriesTask.getCountries();
      console.log("Preparing map using COVID data...");
      const loadCovidDataTask = new LoadCovidDataTask(geometries);
      loadCovidDataTask.load((countries) => setCountries(countries));
    }
    loadGeometries();
  }, []);

  return (
    <div>
      {countries.length === 0 ? (
        <Loading />
      ) : (
        <Container fluid>
          <Row style={{ height: "80vh" }}>
            <Col xs={10} style={{ padding: "0px" }}>
              <CovidMap countries={countries} />
            </Col>
            <Col style={{ padding: "0px" }}>
              <Legend legendItems={legendItemsReverse} />
            </Col>
          </Row>
          <Row>
            <Col>Bottom component</Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default Covid19;
