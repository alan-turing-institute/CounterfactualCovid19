import "../css/common.css";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import exact from "prop-types-exact";
import HeaderPanel from "./HeaderPanel";
import InfoPanel from "./InfoPanel";
import Legend from "./Legend";
import Loading from "./Loading";
import loadInitialMapItems from "../tasks/LoadInitialMapItemsTask";
import React from "react";
import Row from "react-bootstrap/Row";
import WorldMap from "./WorldMap";

const propTypes = exact({});

const defaultProps = {};

class MainGrid extends React.PureComponent {
  constructor(props) {
    super(props);

    // Add component-level state
    this.state = {
      countries: [],
      defaultEndDate: "2020-07-06",
      isoCode: null,
      heightHeader: 13,
      heightMap: 85,
      heightHistogram: 0,
    };

    // Bind functions that need to use `this`
    this.handleCountryChange = this.handleCountryChange.bind(this);
  }

  // This runs when the component is first loaded
  async componentDidMount() {
    try {
      const initialMapItems = await loadInitialMapItems(
        this.state.defaultEndDate
      );
      this.setState({ countries: initialMapItems });
    } catch (error) {
      console.log(error);
    }
  }

  // Update the state for a new country
  handleCountryChange(iso_code, clickable) {
    if (iso_code === this.state.isoCode || !clickable) {
      console.log(`Setting currently selected country to none`);
      const isoCode = null;
      const heightHistogram = 0;
    } else {
      console.log(`Setting currently selected country to ${iso_code}`);
      const isoCode = iso_code;
      const heightHistogram = 50;
    }
    const heightMap = 100 - heightHistogram - Number(this.state.heightHeader.replace("vh", ""));
    this.setState({
      isoCode: isoCode,
      heightMap: `${heightMap}vh`,
      heightHistogram: `${heightHistogram}vh`,
    });
  }

  render() {
    return (
      <div>
        {this.state.countries.length === 0 ? (
          <Loading />
        ) : (
          <Container fluid>
            <Row style={{ height: this.state.heightHeader }}>
              <HeaderPanel />
            </Row>
            <Row style={{ height: this.state.heightMap }}>
              <Col md={11} className="common-no-padding">
                <WorldMap
                  countries={this.state.countries}
                  onCountrySelect={this.handleCountryChange}
                />
              </Col>
              <Col xs={1} className="common-no-padding">
                <Legend />
              </Col>
            </Row>
            {!this.state.isoCode ? (
              <Loading />
            ) : (
              <Row style={{ height: this.state.heightHistogram }}>
                <Col xs={12} className="common-no-padding">
                  <InfoPanel
                    isoCode={this.state.isoCode}
                    height={this.state.heightHistogram}
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

MainGrid.propTypes = propTypes;
MainGrid.defaultProps = defaultProps;

export default MainGrid;
