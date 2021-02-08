import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import InfoPanel from "./InfoPanel";
import Legend from "./Legend";
import Loading from "./Loading";
import WorldMap from "./WorldMap";
import loadInitialMapItems from "../tasks/LoadInitialMapItemsTask";
import Card from "react-bootstrap/Card";

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
    if (iso_code === this.state.isoCode) {
      this.setState({
        isoCode: null,
        summedAvgCases: null,
        sizeMapComponent: "90",
        sizeHistogramComponent: "0vh",
      });
    } else {
      this.setState({
        isoCode: iso_code,
        summedAvgCases: summed_avg_cases,
        sizeMapComponent: "50vh",
        sizeHistogramComponent: "40vh",
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
            <Row style={{ height: "10vh" }}>
              <Col xs={12} style={{ padding: "0px" }}>
                <Card bg={"light"} text={"dark"} style={{ width: "100%" }}>
                  <Card.Body
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Card.Title>
                      What if?: The counterfactual story of the first wave of
                      Covid19 in Europe.
                    </Card.Title>
                    <Card.Text>
                      {" "}
                      This dashboard contains data and simulations of the growth
                      of Covid19 cases in Europe between X and X.Select a
                      country to start.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
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
            <Row style={{ height: this.state.sizeHistogramComponent }}>
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
