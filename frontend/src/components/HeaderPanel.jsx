import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import exact from "prop-types-exact";
import Image from "react-bootstrap/Image";
import logoLeeds from "../images/logo_leeds.jpg";
import logoTuring from "../images/logo_turing.jpg";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import React from "react";
import Row from "react-bootstrap/Row";
import styles from "../css/Common.module.css";

const propTypes = exact({});

const defaultProps = {};

class HeaderPanel extends React.PureComponent {
  constructor(props) {
    super(props);

    // Add component-level state
    this.state = {
      popoverOpen: false,
    };

    // Bind functions that need to use `this`
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState((prevState) => ({ popoverOpen: !prevState.popoverOpen }));
  }

  render() {
    const popover = (
      <Popover>
        <Popover.Title>About this project</Popover.Title>
        <Popover.Content>
          <p>
            This is a joint project between the Leeds Institute for Data
            Analytics at the University of Leeds and the Alan Turing Institute
            (grant number EP/N510129/1).
          </p>
          <p>
            This project aims to assess the effects of lockdown timing on the
            growth of COVID-19 cases across Europe during the first wave.
          </p>
          <p>
            Analytical code and documentation relating to this project can be
            found in{" "}
            <a href="https://github.com/KFArnold/covid-lockdown/">
              https://github.com/KFArnold/covid-lockdown/
            </a>
            . Source code and documentation for this dashboard can be found at{" "}
            <a href="https://github.com/alan-turing-institute/CounterfactualCovid19">
              https://github.com/alan-turing-institute/CounterfactualCovid19
            </a>
            .
          </p>
          <p>
            Note that countries are coloured on the map according to the number
            of COVID-19 cases per million recorded as of 6 July 2020.
          </p>
        </Popover.Content>
      </Popover>
    );

    return (
      <Row>
        <Col xs={1} md={1} lg={1} className={styles.flex_column}>
          <Row className="hp-row-logo">
            <Image src={logoLeeds} alt="Lida Logo" />
          </Row>
          <Row className="hp-row-logo">
            <Image src={logoTuring} alt="Turing Logo" />
          </Row>
        </Col>
        <Col xs={10} md={10} lg={10} className={styles.flex_column}>
          <Card bg={"light"} text={"dark"}>
            <Card.Body>
              <Card.Title>
                What if?: The counterfactual story of the first wave of COVID-19
                in Europe.
              </Card.Title>
              <Card.Text>
                This dashboard contains data and counterfactual simulations of
                the growth of COVID-19 cases during Europe's first wave. Click
                on a country to start.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={1} md={1} lg={1} className={styles.flex_column}>
          <OverlayTrigger
            trigger="click"
            placement="bottom"
            transition={false}
            overlay={popover}
          >
            {({ ...overlayTriggerProps }) => (
              <Button variant="secondary" {...overlayTriggerProps}>
                About this project
              </Button>
            )}
          </OverlayTrigger>
        </Col>
      </Row>
    );
  }
}

HeaderPanel.propTypes = propTypes;
HeaderPanel.defaultProps = defaultProps;

export default HeaderPanel;
