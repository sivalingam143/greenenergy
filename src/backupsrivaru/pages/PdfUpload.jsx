import React, { useState } from "react";
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  ClickButton } from "../Compnents/ClickButton";

const PdfUpload = () => {
  const [pdfUploads, setPdfUploads] = useState([{ id: Date.now(), file: null }]);

  // Function to handle file change
  const handleFileChange = (e, index) => {
    const updatedUploads = [...pdfUploads];
    updatedUploads[index].file = e.target.files[0]; // Save the uploaded file
    setPdfUploads(updatedUploads);
  };

  // Add more upload fields
  const handleAddMore = () => {
    setPdfUploads([...pdfUploads, { id: Date.now(), file: null }]); // Add a new field with unique id
  };

  // Remove an upload field
  const handleDelete = (index) => {
    const updatedUploads = pdfUploads.filter((_, i) => i !== index); // Remove the field
    setPdfUploads(updatedUploads);
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col lg="7" md="4" xs="6">
            <div className="page-nav py-3">
              <span className="nav-list">PDF Upload</span>
            </div>
          </Col>
          <Col lg="5" md="3" xs="6" className="align-self-center text-end">
            <ClickButton label={<>Add More</>} onClick={handleAddMore} />
          </Col>
        </Row>

        {/* PDF Upload Fields */}
        {pdfUploads.map((upload, index) => (
          <Row key={upload.id} className="mt-3">
            <Col md={8}>
              <Form.Group controlId={`formFile${index}`}>
                <Form.Control
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e, index)}
                />
              </Form.Group>
            </Col>
            <Col md={4} className="text-end">
              <Button variant="danger" onClick={() => handleDelete(index)}>
                Delete
              </Button>
            </Col>
          </Row>
        ))}

        {/* Toast notifications */}
        <ToastContainer />
      </Container>
    </>
  );
};

export default PdfUpload;
