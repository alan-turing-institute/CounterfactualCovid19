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
