import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import HeaderPanel from "./HeaderPanel";
import InfoPanel from "./InfoPanel";
import Legend from "./Legend";
import Loading from "./Loading";
import loadInitialMapItems from "../tasks/LoadInitialMapItemsTask";
import React from "react";
import Row from "react-bootstrap/Row";
import WorldMap from "./WorldMap";

export default class MainGrid extends React.Component {
  constructor(props) {
    super(props);

    // Add component-level state
    this.state = {
      countries: [],
      isoCode: null,
      summedAvgCases: null,
      sizeMapComponent: "88vh",
      sizeHistogramComponent: "0vh",
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
    if (iso_code === this.state.isoCode) {
      console.log(`Setting currently selected country to none`);
      this.setState({
        isoCode: null,
        summedAvgCases: null,
        sizeMapComponent: "88vh",
        sizeHistogramComponent: "0vh",
      });
    } else {
      console.log(`Setting currently selected country to ${iso_code}`);
      this.setState({
        isoCode: iso_code,
        summedAvgCases: summed_avg_cases,
        sizeMapComponent: "40vh",
        sizeHistogramComponent: "48vh",
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
            <Row style={{ height: "12vh" }}>
              <HeaderPanel />
            </Row>
            <Row style={{ height: this.state.sizeMapComponent }}>
              <Col md={11} style={{ padding: "0px" }}>
                <WorldMap
                  countries={this.state.countries}
                  onCountrySelect={this.handleCountryChange}
                />
              </Col>
              <Col xs={1} style={{ padding: "0px" }}>
                <Legend />
              </Col>
            </Row>
            {this.state.isoCode == null ? (
              <Loading />
            ) : (
              <Row style={{ height: this.state.sizeHistogramComponent }}>
                <Col xs={12} style={{ padding: "0px" }}>
                  <InfoPanel
                    isoCode={this.state.isoCode}
                    summedAvgCases={this.state.summedAvgCases}
                    height={this.state.sizeHistogramComponent}
                  />
                </Col>
              </Row>
            )}
          </Container>
        )}
      </div>
    );
  }
}
