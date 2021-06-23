import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import exact from "prop-types-exact";
import logoLeeds from "../images/logo_leeds.jpg";
import logoTuring from "../images/logo_turing.jpg";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import React from "react";
import Row from "react-bootstrap/Row";
import "../css/HeaderPanel.css";

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
          This is a joint project between the Leeds Institute for Data Analytics
          at the University of Leeds and the Alan Turing Institute (grant number
          EP/N510129/1).
          <br />
          This project aims to assess the effects of lockdown timing on the
          growth of COVID-19 cases across Europe during the first wave.
          <br />
          Analytical code and documentation relating to this project can be
          found in{" "}
          <a
            href="https://github.com/KFArnold/covid-lockdown/"
            rel="noreferrer"
          >
            https://github.com/KFArnold/covid-lockdown/;
          </a>{" "}
          source code and documentation for this dashboard can be found at{" "}
          <a
            href="https://github.com/alan-turing-institute/CounterfactualCovid19"
            rel="noreferrer"
          >
            https://github.com/alan-turing-institute/CounterfactualCovid19.
          </a>
          <br />
          Note that countries are coloured on the map according to the number of
          COVID-19 cases per million recorded as of 6 July 2020.
          <br />
        </Popover.Content>
      </Popover>
    );

    const style = { justifyContent: "center", display: "flex" };

    return (
      <div>
        <Container fluid>
          <Row style={{ padding: "0px", style }}>
            <Col xs={1} md={1} lg={1}>
              <Row style={{ padding: "2px", style }}>
                <img
                  className="logo"
                  src={logoLeeds}
                  alt="Lida Logo"
                />
              </Row>
              <Row style={{ padding: "10px", style }}>
                <img
                  className="logo"
                  src={logoTuring}
                  alt="Turing Logo"
                />
              </Row>
            </Col>
            <Col xs={10} md={10} lg={10} style={{ padding: "2px", style }}>
              <Card bg={"light"} text={"dark"} style={{ width: "100%" }}>
                <Card.Body style={{ style }}>
                  <Card.Title>
                    What if?: The counterfactual story of the first wave of
                    COVID-19 in Europe.
                  </Card.Title>
                  <Card.Text>
                    This dashboard contains data and counterfactual simulations
                    of the growth of COVID-19 cases during Europe's first wave.
                    Click on a country to start.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col
              style={{
                padding: "15px",
                style,
              }}
            >
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
        </Container>
      </div>
    );
  }
}

HeaderPanel.propTypes = propTypes;
HeaderPanel.defaultProps = defaultProps;

export default HeaderPanel;
