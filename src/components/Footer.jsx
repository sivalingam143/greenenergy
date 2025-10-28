import React from "react";
import { Buttons } from "./Buttons";

const Footer = ({
  LabelOne,
  LabelTwo,
  LabelOneClick,
  LabelTwoClick,
  LabelOneDisabled,
  LabelTwoDisabled,
}) => {
  return (
    <>
      <div className="d-flex">
        <div className="mx-2">
          <Buttons
            label={LabelOne}
            OnClick={LabelOneClick}
            classname="crud-btn"
            disabled={LabelOneDisabled}
          />
        </div>
        <div className="mx-2">
          <Buttons
            label={LabelTwo}
            OnClick={LabelTwoClick}
            classname="crud-btn"
            disabled={LabelTwoDisabled}
          />
        </div>
      </div>
    </>
  );
};

export default Footer;
