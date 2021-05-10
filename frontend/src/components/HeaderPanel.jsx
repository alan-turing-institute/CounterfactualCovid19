/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React, { useState } from "react";
import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

const HeaderPanel = (props) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggle = () => setPopoverOpen(!popoverOpen);
  return (
    <div>
      <Container fluid>
        <Row>
          <Col xs={10} md={10} lg={10} style={{ padding: "0px" }}>
            <Card bg={"light"} text={"dark"} style={{ width: "100%" }}>
              <Card.Body style={{ display: "flex", justifyContent: "center" }}>
                <Card.Title>
                  What if?: The counterfactual story of the first wave of
                  Covid19 in Europe.
                </Card.Title>
                <Card.Text>
                  {" "}
                  This dashboard contains data and counterfactual simulations of the growth of
                  Covid19 cases during Europe's first wave (until the 6th of July 2020). Click on a country to
                  start.
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
            <Button id="Popover1" type="button" size="md" block>
              About this project
            </Button>
            <Popover
              placement="bottom"
              isOpen={popoverOpen}
              target="Popover1"
              toggle={toggle}
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
};

export default HeaderPanel;
