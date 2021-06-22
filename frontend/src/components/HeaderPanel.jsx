import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import exact from "prop-types-exact";
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
          <br />
          Analytical code and documentation relating to this project can be
          found at https://github.com/KFArnold/covid-lockdown/; source code and
          documentation for this dashboard can be found at
          https://github.com/alan-turing-institute/CounterfactualCovid19.
          <br />
          <br />
          Note that countries are coloured on the map according to the number of
          COVID-19 cases per million recorded as of 6 July 2020.
          <br />
        </Popover.Content>
      </Popover>
    );

    return (
      <div>
        <Container fluid>
          <Row style={{ padding: "0px",  justifyContent: "center", display: "flex"}}>
            <Col xs={1} md={1} lg={1} >
            <Row style={{ padding: "2px",  justifyContent: "center", display: "flex"}}>
            <img className="lida_logo" src={process.env.PUBLIC_URL +'/LidaLogo.jpeg'}   />
            </Row>
          <Row style={{ padding: "10px",  justifyContent: "center", display: "flex"}}>
            <img className="turing_logo" src={process.env.PUBLIC_URL +'/ATI_logo_black_W500px.jpg'}   />
          </Row>
            </Col>
            <Col xs={10} md={10} lg={10} style={{ padding: "2px",  justifyContent: "center", display: "flex"}}>
              <Card bg={"light"} text={"dark"} style={{ width: "100%" }}>
                <Card.Body
                  style={{ display: "flex", justifyContent: "center" }}
                >
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
                display: "flex",
                justifyContent: "center",
                padding: "2px",
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
