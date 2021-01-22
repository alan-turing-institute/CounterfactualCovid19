import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import CovidMap from "./CovidMap";
import Histogram from "./Histogram";
import Legend from "./Legend";
import Loading from "./Loading";
import loadInitialMapItems from "../tasks/LoadInitialMapItemsTask";

export default class Covid19 extends React.Component {
  constructor(props) {
    super(props);

    // Initialize state first
    this.state = { countries: [], selectedCountry: null };

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
  handleCountryChange(iso_code) {
    console.log(`Selected country is ${iso_code}`);
    this.setState({ selectedCountry: iso_code });
  }

  // This is evaluated whenever the component is rendered
  render() {
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
                <Legend />
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
