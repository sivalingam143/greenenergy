import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import PageTitle from "../../components/PageTitle";
import { DropDown } from "../../components/Forms";
import TableUI from "../../components/TableUI";
import { MdOutlineDeleteOutline, MdEdit } from "react-icons/md";
import { Buttons } from "../../components/Buttons";
import Footer from "../../components/Footer";
import { BiMailSend } from "react-icons/bi";
import { HiOutlineDownload } from "react-icons/hi";
import Dialog from "../../components/Dialog";
import useCsrMapForm from "../../hooks/creationhooks/csrMapForm";

const CsrmapCreation = () => {
  const {
    csrNoOptions,
    technicianOptions,
    selectedCsrNo,
    selectedTechnician,
    mappings,
    csrStatus,
    mappingStatus,
    InvoiceHead,
    InvoiceData,
    pageTitle,
    viewMode,
    showConfirmDialog,
    editIndex,
    handleCsrNoChange,
    handleTechnicianChange,
    handleAddMapping,
    handleEditMapping,
    handleDeleteMapping,
    handleSave,
    handleSaveAndNext,
    handleCloseForm,
    handleConfirmClose,
  } = useCsrMapForm();

  const tableData = InvoiceData.map((item, index) => ({
    values: [
      item.values[0],
      item.values[1],
      <div className="d-flex">
        <Buttons
          label={<MdEdit />}
          classname="icon-only edit"
          OnClick={() => handleEditMapping(item.values[2])}
          disabled={viewMode}
        />
        <Buttons
          label={<MdOutlineDeleteOutline />}
          classname="icon-only delete"
          OnClick={() => handleDeleteMapping(item.values[2])}
          disabled={viewMode}
        />
      </div>,
    ],
  }));

  return (
    <div id="main">
      <Container fluid>
        <Row>
          <Col lg="12">
            <PageTitle
              PageTitle={pageTitle}
              showButton={true}
              OnClick={handleCloseForm}
            />
          </Col>
          <Col lg="12" className="py-3">
            <div className="content-box">
              <Row>
                <Col lg="4" xs="12" className="py-3">
                  <DropDown
                    textlabel="CSR No."
                    options={csrNoOptions}
                    value={selectedCsrNo}
                    onChange={handleCsrNoChange}
                    PlaceHolder="Select CSR No."
                    disabled={viewMode || mappings.length > 0}
                  />
                </Col>
                <Col lg="4" xs="12" className="py-3">
                  <DropDown
                    textlabel="Technician Name"
                    options={technicianOptions}
                    value={selectedTechnician}
                    onChange={handleTechnicianChange}
                    PlaceHolder="Select Technician"
                    disabled={viewMode}
                  />
                </Col>
                <Col lg="4" xs="12" className="py-5 align-self-center">
                  <Buttons
                    label={editIndex !== null ? "Update" : "Add"}
                    classname="crud-btn"
                    OnClick={handleAddMapping}
                    disabled={viewMode}
                  />
                </Col>
                <Col xs="12" className="py-3">
                  {(csrStatus === "loading" || mappingStatus === "loading") && <p>Loading...</p>}
                  {tableData.length === 0 && mappingStatus === "succeeded" && <p>No mappings added</p>}
                  {tableData.length > 0 && <TableUI headers={InvoiceHead} body={tableData} />}
                </Col>
              </Row>
            </div>
          </Col>
          <Col lg="12">
            <Footer
              LabelOne={
                <>
                  <HiOutlineDownload size="20" className="mx-1" />
                  Save
                </>
              }
              LabelOneClick={handleSave}
              LabelOneDisabled={viewMode}
              LabelTwo={
                <>
                  <BiMailSend size="20" className="mx-1" />
                  Save & Next
                </>
              }
              LabelTwoClick={handleSaveAndNext}
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

export default CsrmapCreation;
