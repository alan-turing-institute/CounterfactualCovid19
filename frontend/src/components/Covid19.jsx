import React from "react";
import Loading from "./Loading";
import CovidMap from "./CovidMap";
import LoadGeometriesTask from "../tasks/LoadGeometriesTask";
import LoadCovidDataTask from "../tasks/LoadCovidDataTask";
import Legend from "./Legend";
import Histogram from "./Histogram";
import legendItems from "../entities/LegendItems";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

export default class Covid19 extends React.Component {
  constructor(props) {
    super(props);

    // Initialize state first
    this.state = { countries: [], selectedCountry: null };

    // Bind the `handleCountryChange` reference to allow it to be used by other objects
    this.handleCountryChange = this.handleCountryChange.bind(this);
  }

  // Load geometry and cases data from Django backend
  async loadGeometries() {
    console.log("Loading geometries from Django backend...");
    const loadGeometriesTask = new LoadGeometriesTask();
    const countries = await loadGeometriesTask.getCountries();
    console.log("Preparing map using COVID data...");
    const loadCovidDataTask = new LoadCovidDataTask();
    const decoratedCountries = await loadCovidDataTask.decorateCountries(
      countries
    );
    this.setState({ countries: decoratedCountries });
    console.log(`Loaded data for ${this.state.countries.length} countries`);
  }

  // This runs when the component is loaded
  componentDidMount() {
    this.loadGeometries().catch((error) => {
      console.log(error);
    });
  }

  // Update the state for a new country
  handleCountryChange(iso_code) {
    console.log(`Selected country is ${iso_code}`);
    this.setState({ selectedCountry: iso_code });
  }

  // This runs when the component is rendered
  render() {
    const legendItemsReverse = [...legendItems].reverse();
    return (
      <div>
        {this.state.countries.length === 0 ? (
          <Loading />
        ) : (
          <Container fluid>
            <Row style={{ height: "80vh" }}>
              <Col xs={10} style={{ padding: "0px" }}>
                <CovidMap
                  countries={this.state.countries}
                  onCountrySelect={this.handleCountryChange}
                />
              </Col>
              <Col style={{ padding: "0px" }}>
                <Legend legendItems={legendItemsReverse} />
              </Col>
            </Row>
            <Row>
              <Col>
                <Histogram selectedCountry={this.state.selectedCountry} />
              </Col>
            </Row>
          </Container>
        )}
      </div>
    );
  }
}
