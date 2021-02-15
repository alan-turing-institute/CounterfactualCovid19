/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React, { useState } from "react";
//import Button from "react-bootstrap/Button";
//import Popover from 'react-bootstrap/Popover';
import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";

const HeaderPanel = (props) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggle = () => setPopoverOpen(!popoverOpen);
  return (
    <div>
       <Col xs={10} style={{ padding: "0px" }}>
          <Card bg={"light"} text={"dark"} style={{ width: "100%" }}>
             <Card.Body
                 style={{ display: "flex", justifyContent: "center" }}>
                    <Card.Title>
                      What if?: The counterfactual story of the first wave of
                      Covid19 in Europe.
                    </Card.Title>
                    <Card.Text>
                      {" "}
                      This dashboard contains data and simulations of the growth
                      of Covid19 cases in Europe between X and X.Select a
                      country to start.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
       <Col style={{ display: "flex", justifyContent: "center", marginTop: "1%", marginBottom: "1%" }} >
      <Button id="Popover1" type="button" size="lg" block>
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
    </div>
  );
};

export default HeaderPanel;
