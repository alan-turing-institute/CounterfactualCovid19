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
      heightHeader: "10vh",
      heightInfoPanel: "0vh",
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

  // Convert between height in 'vh' units and the numerical value
  toNum(value) {
    return Number(value.replace("vh", ""));
  }
  toStr(value) {
    return `${value}vh`;
  }

  // Update the state for a new country
  handleCountryChange(iso_code, clickable) {
    if (iso_code === this.state.isoCode || !clickable) {
      console.log(`Setting currently selected country to none`);
      this.setState({
        isoCode: null,
        heightInfoPanel: `0vh`,
      });
    } else {
      console.log(`Setting currently selected country to ${iso_code}`);
      this.setState({
        isoCode: iso_code,
        heightInfoPanel: `35vh`,
      });
    }
  }

  render() {
    if (this.state.countries.length === 0) {
      return (
        <Container fluid className={styles.full_screen}>
          <Loading />
        </Container>
      );
    }
    const heightWorldMap = this.toStr(100 - this.toNum(this.state.heightHeader) - this.toNum(this.state.heightInfoPanel));
    return (
      <Container fluid className={styles.full_screen} id="bootstrap-overrides">
        <Row style={{ height: this.state.heightHeader }} className="g-0">
          <HeaderPanel />
        </Row>
        <Row style={{ height: heightWorldMap }} className="g-0">
          <Col xs={9} md={11}>
            <WorldMap
              countries={this.state.countries}
              onCountrySelect={this.handleCountryChange}
            />
          </Col>
          <Col xs={3} md={1}>
            <Legend />
          </Col>
        </Row>
        <Row style={{ height: this.state.heightInfoPanel }} className="g-0">
          <InfoPanel isoCode={this.state.isoCode}/>
        </Row>
      </Container>
    );
  }
}

MainGrid.propTypes = propTypes;
MainGrid.defaultProps = defaultProps;

export default MainGrid;
