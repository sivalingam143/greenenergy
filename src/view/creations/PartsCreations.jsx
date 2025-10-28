import React from "react";
import { Container, Row, Col, Form, Image } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import { IoMdImages } from "react-icons/io";
import DropDown, { TextArea, TextInputForm } from "../../components/Forms";
import Footer from "../../components/Footer";
import { BiMailSend } from "react-icons/bi";
import { HiOutlineDownload } from "react-icons/hi";
import Dialog from "../../components/Dialog";
import { Buttons } from "../../components/Buttons";
import usePartForm from "../../hooks/creationhooks/usePartForm";

const PartsCreations = () => {
  const location = useLocation();
  const {
    formData,
    viewMode,
    userRole,
    editPartId,
    showConfirmDialog,
    fileInputRef,
    typeAndClassOptions,
    handleInputChange,
    handleFileChange,
    handleDeleteImages,
    handleSubmit,
    openFileDialog,
    handleCloseForm,
    handleConfirmClose,
  } = usePartForm();

  const pageTitle = viewMode
    ? "View Part"
    : editPartId
    ? "Edit Part"
    : "Create Part";

  return (
    <div id="main">
      <Container fluid>
        <Row>
          <Col lg="12">
            <PageTitle PageTitle={pageTitle} showButton={true} OnClick={handleCloseForm} />
          </Col>

          <Col lg="12" className="py-3">
            <div className="content-box">
              <Row>
                <Col lg="6" md="6" xs="12" className="py-3">
                  <DropDown
                    textlabel={<>Type/Classification</>}
                    name="type_and_classification"
                    value={formData.type_and_classification}
                    onChange={handleInputChange}
                    options={typeAndClassOptions}
                    disabled={viewMode || !!editPartId}
                  />
                </Col>

                <Col lg="6" md="6" xs="12" className="py-3">
                  <TextInputForm
                    textlabel={<>Part No.</>}
                    name="part_no"
                    value={formData.part_no}
                    onChange={handleInputChange}
                    disabled={true}
                  />
                </Col>

                <Col lg="6" xs="12" className="py-3">
                  <TextArea
                    textlabel={<>Description</>}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter description"
                    rows={4}
                    disabled={viewMode}
                  />
                </Col>

                <Col lg="6" xs="12" className="py-3">
                  <TextArea
                    textlabel={<>Technical Description</>}
                    name="technical_description"
                    value={formData.technical_description}
                    onChange={handleInputChange}
                    placeholder="Enter technical description"
                    rows={4}
                    disabled={viewMode}
                  />
                </Col>

                <Col lg="6" md="6" xs="12" className="py-3">
                  <DropDown
                    textlabel={<>UOM</>}
                    name="uom"
                    value={formData.uom}
                    onChange={handleInputChange}
                    options={[
                      { value: "LTR", label: "LTR" },
                      { value: "KG", label: "KG" },
                      { value: "EA", label: "EA" },
                      { value: "SET", label: "SET" },
                    ]}
                    disabled={viewMode}
                  />
                </Col>

                <Col lg="6" md="6" xs="12" className="py-3">
                  <div
                    className="dropzone-box"
                    onClick={openFileDialog}
                    style={{ cursor: viewMode ? "not-allowed" : "pointer" }}
                  >
                    <Form.Group controlId="upload-input">
                      <IoMdImages className="upload-icon" />
                      <p>
                        <strong>Drop your images here</strong>, or{" "}
                        <span className="browse-text">browse</span>
                      </p>
                      <p className="subtext">Supports PNG, JPG & WEBP up to any size</p>
                      <Form.Control
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="d-none"
                        onChange={handleFileChange}
                        disabled={viewMode}
                      />
                    </Form.Group>
                  </div>
                </Col>
                <Col lg="6" md="6" xs="12" className="py-3">
                </Col>
                <Col lg="4" md="6" xs="12" className="py-3 align-self-end text-center">
                  <Buttons
                    label="Delete Images"
                    classname="delete-small"
                    OnClick={handleDeleteImages}
                    disabled={viewMode}
                  />
                </Col>

                {userRole === "Admin" && (
                  <>
                    <Col lg="4" md="6" xs="12" className="py-3">
                      <TextInputForm
                        textlabel={<>AMC</>}
                        name="amc"
                        value={formData.amc}
                        onChange={handleInputChange}
                        type="number"
                        disabled={viewMode}
                      />
                    </Col>

                    <Col lg="4" md="6" xs="12" className="py-3">
                      <TextInputForm
                        textlabel={<>Non AMC</>}
                        name="non_amc"
                        value={formData.non_amc}
                        onChange={handleInputChange}
                        type="number"
                        disabled={viewMode}
                      />
                    </Col>
                  </>
                )}

                <Col lg="12" className="py-3">
                  <h6>Uploaded Images:</h6>
                  {formData.part_img.length > 0 ? (
                    <Row>
                      {formData.part_img.map((img, index) => (
                        <Col key={index} xs="6" sm="4" md="3" lg="2" className="mb-3">
                          <Image
                            src={typeof img === "string" ? img : img?.data}
                            alt={`Uploaded part ${index + 1}`}
                            thumbnail
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                          />
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <p>No images uploaded.</p>
                  )}
                </Col>
              </Row>
            </div>
          </Col>

          <Col lg="12">
            <Footer
              LabelOne={
                <>
                  <span className="mx-1">
                    <HiOutlineDownload size="20" />
                  </span>
                  {editPartId ? "Update" : "Save"}
                </>
              }
              LabelOneClick={(e) => handleSubmit(e, false)}
              LabelOneDisabled={viewMode}
              LabelTwo={
                <>
                  <span className="mx-1">
                    <BiMailSend size="20" />
                  </span>
                  Save & Next
                </>
              }
              LabelTwoClick={(e) => handleSubmit(e, true)}
              LabelTwoDisabled={viewMode}
            />
          </Col>
        </Row>
      </Container>

      <Dialog
        DialogTitle="Do You Want to Close the Form?"
        isVisible={showConfirmDialog}
        onConfirm={handleConfirmClose}
        onCancel={() => handleConfirmClose(false)}
      />
    </div>
  );
};

export default PartsCreations;
