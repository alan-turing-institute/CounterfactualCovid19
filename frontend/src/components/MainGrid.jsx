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
import styles from "../css/Common.module.css";
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
      heightHeader: "12vh",
      heightMap: "87vh",
      heightHistogram: "0vh",
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
    var isoCode, heightHistogram;
    if (iso_code === this.state.isoCode || !clickable) {
      console.log(`Setting currently selected country to none`);
      isoCode = null;
      heightHistogram = 0;
    } else {
      console.log(`Setting currently selected country to ${iso_code}`);
      isoCode = iso_code;
      heightHistogram = 35;
    }
    const heightMap =
      100 - heightHistogram - Number(this.state.heightHeader.replace("vh", ""));
    this.setState({
      isoCode: isoCode,
      heightMap: `${heightMap}vh`,
      heightHistogram: `${heightHistogram}vh`,
    });
  }

  render() {
    if (this.state.countries.length === 0) {
      return (
        <Container fluid className={styles.full_screen}>
          <Loading />
        </Container>
      );
    }
    return (
      <Container fluid className={styles.full_screen} id="bootstrap-overrides">
        <Row style={{ height: this.state.heightHeader }}>
          <HeaderPanel />
        </Row>
        <Row style={{ height: this.state.heightMap }} className="g-0">
          <Col xs={11}>
            <WorldMap
              countries={this.state.countries}
              onCountrySelect={this.handleCountryChange}
            />
          </Col>
          <Col xs={1}>
            <Legend />
          </Col>
        </Row>
        <Row style={{ height: this.state.heightHistogram }}>
          {!this.state.isoCode ? (
            <Loading />
          ) : (
            <InfoPanel
              isoCode={this.state.isoCode}
              height={this.state.heightHistogram}
            />
          )}
        </Row>
      </Container>
    );
  }
}

MainGrid.propTypes = propTypes;
MainGrid.defaultProps = defaultProps;

export default MainGrid;
