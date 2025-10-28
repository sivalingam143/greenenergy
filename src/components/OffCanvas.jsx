import React from "react";
import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Buttons } from "./Buttons";

function OffCanvas({
  OffCanvasBody,
  openFilter,
  OffCanvasTitle,
  OffCanvasLabel,
  Size,
}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const enhancedBody = React.cloneElement(OffCanvasBody, {
    onClose: handleClose,
  });

  return (
    <>
      {openFilter && (
        <Buttons
          label={OffCanvasLabel}
          OnClick={handleShow}
          classname={"filter-btn"}
        />
      )}
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        scroll
        className={Size}
        id="offcanvas"
        backdrop={true}
      >
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title>{OffCanvasTitle}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="offcanvas-body">
          {enhancedBody}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default OffCanvas;
