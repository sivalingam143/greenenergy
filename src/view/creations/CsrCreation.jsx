import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { HiOutlineDownload } from "react-icons/hi";
import { BiMailSend } from "react-icons/bi";
import PageTitle from "../../components/PageTitle";
import Footer from "../../components/Footer";
import Dialog from "../../components/Dialog";
import { useCsrCreation } from "../../hooks/creationhooks/useCsrCreation";
import CsrForm from "../../components/CsrForm";

const CsrCreationPage = () => {
  const {
    formData,
    isEdit,
    isMailChecked,
    checkboxLabel,
    showConfirmDialog,
    turbineOptions,
    pageTitle,
    viewMode,
    CSR_TYPE_SHORT_CODES,
    handleInputChange,
    handleCheckBoxChange,
    handleSubmit,
    handleCloseForm,
    handleConfirmClose,
  } = useCsrCreation();

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
              {/* CsrForm is reused for creation/edit/view */}
              <CsrForm
                formData={formData}
                turbineOptions={turbineOptions}
                CSR_TYPE_SHORT_CODES={CSR_TYPE_SHORT_CODES}
                viewMode={viewMode}  
                isEdit={isEdit}
                isMailChecked={isMailChecked}
                checkboxLabel={checkboxLabel}
                handleInputChange={handleInputChange}
                handleCheckBoxChange={handleCheckBoxChange}
              />
            </div>
          </Col>

          {!viewMode && (
            <Col lg="12">
              <Footer
                LabelOne={
                  <>
                    <span className="mx-1">
                      <HiOutlineDownload size="20" />
                    </span>
                    Save
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
          )}
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

export default CsrCreationPage;
