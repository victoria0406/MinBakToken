import React, { useState } from "react";

import { Button, Modal } from "react-bootstrap";

import { UploadFile } from "./UploadFile";

export function MainVisual({uploadHandler}) {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  return (
    <div className="main-visual">
    <p>Catch Prise!!!</p>
    <button onClick={handleShow}>
        Add New Reciept
    </button>
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UploadFile uploadHandler={uploadHandler}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
