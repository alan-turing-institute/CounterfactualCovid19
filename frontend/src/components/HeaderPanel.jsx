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
import commonStyles from "../css/Common.module.css";
import localStyles from "../css/HeaderPanel.module.css";

const propTypes = exact({});

const defaultProps = {};

const styles = { ...commonStyles, ...localStyles };

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
            Analytical code and documentation relating to{" "}
            <a href="https://github.com/KFArnold/covid-lockdown/">
              the counterfactual simulation
            </a>
            . Source code and documentation for{" "}
            <a href="https://github.com/alan-turing-institute/CounterfactualCovid19">
              this dashboard
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
        <Col xs={3} md={2} xl={1} className={styles.contents_centered}>
          <Row className={styles.logo}>
            <Image src={logoLeeds} alt="Lida Logo" />
          </Row>
          <Row className={styles.logo}>
            <Image src={logoTuring} alt="Turing Logo" />
          </Row>
        </Col>
        <Col xs={7} md={9} xl={10} className={styles.contents_centered}>
          <Card bg={"light"} text={"dark"}>
            <Card.Body>
              <Card.Title className={styles.responsive_card_title}>
                What if?: The counterfactual story of the first wave of COVID-19
                in Europe.
              </Card.Title>
              <Card.Text className={styles.responsive_card_text}>
                This dashboard contains data and counterfactual simulations of
                the growth of COVID-19 cases during Europe's first wave. Click
                on a country to start.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={2} md={1} xl={1} className={styles.contents_centered}>
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
