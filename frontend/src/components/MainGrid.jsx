import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import InfoPanel from "./InfoPanel";
import Legend from "./Legend";
import Loading from "./Loading";
import WorldMap from "./WorldMap";
import loadInitialMapItems from "../tasks/LoadInitialMapItemsTask";

export default class MainGrid extends React.Component {
  constructor(props) {
    super(props);

    // Add component-level state
    this.state = {
      countries: [],
      isoCode: null,
      summedAvgCases: null,
      sizeMapComponent: "90vh",
      sizeHistogramComponent: "10vh",
    };

    // Bind the `handleCountryChange` function to allow it to be used by other objects
    this.handleCountryChange = this.handleCountryChange.bind(this);
  }

  // This runs when the component is first loaded
  async componentDidMount() {
    try {
      const initialMapItems = await loadInitialMapItems();
      this.setState({ countries: initialMapItems });
    } catch (error) {
      console.log(error);
    }
  }

  // Update the state for a new country
  handleCountryChange(iso_code, summed_avg_cases) {
    console.log(`Setting country of interest to ${iso_code}`);
    if (iso_code === this.state.currentIsoCode) {
      this.setState({
        isoCode: null,
        summedAvgCases: null,
        sizeMapComponent: "90vh",
        sizeHistogramComponent: "10vh",
      });
    } else {
      this.setState({
        isoCode: iso_code,
        summedAvgCases: summed_avg_cases,
        sizeMapComponent: "65vh",
        sizeHistogramComponent: "35vh",
      });
    }
  }

  // This is evaluated whenever the component is rendered
  render() {
    return (
      <div>
        {this.state.countries.length === 0 ? (
          <Loading />
        ) : (
          <Container fluid>
            <Row style={{ height: this.state.sizeMapComponent }}>
              <Col xs={10} style={{ padding: "0px" }}>
                <WorldMap
                  countries={this.state.countries}
                  onCountrySelect={this.handleCountryChange}
                />
              </Col>
              <Col xs={2} style={{ padding: "0px" }}>
                <Legend />
              </Col>
            </Row>
            <Row>
              <Col xs={12} style={{ padding: "0px" }}>
                <InfoPanel
                  isoCode={this.state.isoCode}
                  summedAvgCases={this.state.summedAvgCases}
                  height={this.state.sizeHistogramComponent}
                />
              </Col>
            </Row>
          </Container>
        )}
      </div>
    );
  }
}
