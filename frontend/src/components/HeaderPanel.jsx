import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import exact from "prop-types-exact";
import React from "react";
import Row from "react-bootstrap/Row";

const propTypes = exact({});

const defaultProps = {};

class HeaderPanel extends React.Component {
  constructor(props) {
    super(props);

    // Add component-level state
    this.state = {
      popoverOpen: false,
    };

    // Bind the toggle function to allow it to use state
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState((prevState) => ({ popoverOpen: !prevState.popoverOpen }));
  }

  render() {
    return (
      <div>
        <Container fluid>
          <Row>
            <Col xs={10} md={10} lg={10} style={{ padding: "0px" }}>
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
                padding: "0px",
              }}
            >
              <Button id="about" type="button" size="md" block>
                About this project
              </Button>
              <Popover
                placement="bottom"
                isOpen={this.state.popoverOpen}
                target="about"
                toggle={this.toggle}
              >
                <PopoverHeader>About this project</PopoverHeader>
                <PopoverBody>
                  Sed posuere consectetur est at lobortis. Aenean eu leo quam.
                  Pellentesque ornare sem lacinia quam venenatis vestibulum.
                </PopoverBody>
              </Popover>
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
