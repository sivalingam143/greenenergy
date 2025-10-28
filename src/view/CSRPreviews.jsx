import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import PageTitle from "../components/PageTitle";
import { Buttons } from "../components/Buttons";
import SignatureCanvas from "react-signature-canvas";
import TableUI from "../components/TableUI";
import { TextInputForm, TextArea, formatDateDDMMYY } from "../components/Forms";

const CSRPreviews = ({
  formData,
  inchargeSignatureRef,
  handleInputChange,
  handleSaveSignature,
  handleClearSignature,
  viewMode,
  getSignMode,
}) => {
  // State to store canvas dimensions
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 400,
    height: 150,
  });

  // Function to update canvas dimensions based on screen size
  const updateCanvasDimensions = () => {
    const isMobile = window.innerWidth <= 576; // Bootstrap's 'sm' breakpoint
    setCanvasDimensions({
      width: isMobile ? 500 : 400,
      height: isMobile ? 500 : 150,
    });
  };

  // Update dimensions on mount and window resize
  useEffect(() => {
    updateCanvasDimensions(); // Set initial dimensions
    window.addEventListener("resize", updateCanvasDimensions); // Update on resize

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", updateCanvasDimensions);
  }, []);

  const InvoiceHead = [
    "S No",
    "Item No.",
    "Description",
    "UOM",
    "Qty",
    "Serial Number",
    "Status",
  ];
  const InvoiceData = formData.parts_data.map((part, index) => ({
    values: [
      index + 1,
      part.part_no,
      part.description,
      part.uom,
      part.qty,
      part.serial_no,
      part.status,
    ],
  }));

  const ErrorTableHead = ["S No", "Error Description", "Error Value"];
  const ErrorTableData = formData.error_details.map((error, index) => ({
    values: [index + 1, error.error_description, error.error_value],
  }));

  const isSignaturePresent = !!formData.incharge_operator_sign;
  const isButtonDisabled = viewMode && (!getSignMode || isSignaturePresent);

  return (
    <div>
      <Container fluid className="csr-preview">
        <Row>
          <Col lg="12" className="py-3">
            <h2 className="text-center">CSR Preview</h2>
          </Col>
          <Col lg="6" className="py-3">
            <strong>CSR No:</strong> {formData.csr_no || " "}
          </Col>
          <Col lg="6" className="py-3">
            <strong>Customer Name:</strong> {formData.customer_name || " "}
          </Col>
          <Col lg="6" className="py-3">
            <strong>Date:</strong>
            {formData.csr_entry_date
              ? formatDateDDMMYY(formData.csr_entry_date)
              : " "}
          </Col>
          <Col lg="6" className="py-3">
            <strong>Contract Type:</strong> {formData.contract_type || " "}
          </Col>
          <Col lg="12" className="py-3">
            <PageTitle PageTitle="Turbine Details" showButton={false} />
          </Col>
          <Col lg="4" className="py-3">
            <strong>Wtg No.:</strong> {formData.wtg_no || " "}
          </Col>
          <Col lg="4" className="py-3">
            <strong>Loc No.:</strong> {formData.loc_no || " "}
          </Col>
          <Col lg="4" className="py-3">
            <strong>Model:</strong> {formData.model_type || " "}
          </Col>
          <Col lg="4" className="py-3">
            <strong>HTSC No:</strong> {formData.htsc_no || " "}
          </Col>
          <Col lg="4" className="py-3">
            <strong>Capacity:</strong> {formData.capacity || " "}
          </Col>
          <Col lg="4" className="py-3">
            <strong>Make:</strong> {formData.make || " "}
          </Col>
          <Col lg="12" className="py-3">
            <PageTitle PageTitle="Machine Stop" showButton={false} />
          </Col>
          <Col lg="4" className="py-3">
            <strong>System Down:</strong>{" "}
            {formData.system_down === 1 ? "Yes" : "No"}
          </Col>
          <Col lg="4" className="py-3">
            <strong>Date:</strong>{" "}
            {formData.system_down_date
              ? formatDateDDMMYY(formData.system_down_date)
              : " "}
          </Col>
          <Col lg="4" className="py-3">
            <strong>Time:</strong> {formData.system_down_time || " "}
          </Col>
          <Col lg="12" className="py-3">
            <PageTitle PageTitle="CSR Book" showButton={false} />
          </Col>
          <Col lg="4" className="py-3">
            <strong>CSR Reported By:</strong> {formData.csr_booked_by || " "}
          </Col>
          <Col lg="4" className="py-3">
            <strong>Date:</strong>
            {formData.csr_booked_by_date
              ? formatDateDDMMYY(formData.csr_booked_by_date)
              : " "}
          </Col>
          <Col lg="4" className="py-3">
            <strong>Time:</strong> {formData.csr_booked_by_time || " "}
          </Col>
          <Col lg="12" className="py-3">
            <PageTitle PageTitle="Error Details" showButton={false} />
          </Col>
          <Col xs="12" className="py-3">
            <TableUI headers={ErrorTableHead} body={ErrorTableData} />
          </Col>
          <Col lg="12" className="py-3">
            <strong>Nature Of Work:</strong>{" "}
            <span
              style={{
                wordBreak: "break-word",
                whiteSpace: "normal",
                display: "inline-block",
                maxWidth: "100%",
              }}
            >
              {formData.nature_of_work || " "}
            </span>
          </Col>
          <Col lg="12" className="py-3">
            <PageTitle PageTitle="Parts Details" showButton={false} />
          </Col>
          <Col xs="12" className="py-3">
            <TableUI headers={InvoiceHead} body={InvoiceData} />
          </Col>
          <Col lg="12" className="py-3">
            <PageTitle PageTitle="Machine Status" showButton={false} />
          </Col>
          <Col lg="4" className="py-3">
            <strong> Machine Status:</strong>{" "}
            {formData.machine_status === 1 ? "Run" : "Stop"}
          </Col>
          <Col lg="12" className="py-3">
            <PageTitle PageTitle="Work Time Status" showButton={false} />
          </Col>
          <Col lg="3" className="py-3">
            <strong>Start Date:</strong>
            {formData.csr_booked_by_date
              ? formatDateDDMMYY(formData.work_st_date)
              : " "}
          </Col>
          <Col lg="3" className="py-3">
            <strong>Start Time:</strong> {formData.work_st_time || " "}
          </Col>
          <Col lg="3" className="py-3">
            <strong>End Date:</strong>
            {formData.csr_booked_by_date
              ? formatDateDDMMYY(formData.work_end_date)
              : " "}
          </Col>
          <Col lg="3" className="py-3">
            <strong>End Time:</strong> {formData.work_end_time || " "}
          </Col>
          <Col lg="12" className="py-3">
            <PageTitle PageTitle="Work Status" showButton={false} />
          </Col>
          <Col lg="12" className="py-3">
            <strong>Work Status:</strong> {formData.work_status || " "}
          </Col>
          <Col lg="6" xs="12" className="py-3">
            <strong>Employee Name:</strong> {formData.employee_name || " "}
          </Col>
          <Col lg="6" xs="12" className="py-3">
            <div className="bg-white p-3">
              {formData.employee_sign ? (
                <img
                  src={formData.employee_sign}
                  alt="Employee Signature"
                  style={{
                    width: "100%",
                    height: 150,
                    className: "border w-100",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: 150,
                    border: "1px solid #000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  No Signature Available
                </div>
              )}
            </div>
          </Col>
          <Col xs="12" className="py-3">
            <PageTitle PageTitle="Incharge Operator" showButton={false} />
          </Col>
          <Col lg="6" xs="12" className="py-3">
            <TextInputForm
              textlabel={<>Incharge Operator Name</>}
              name="incharge_operator_name"
              value={formData.incharge_operator_name}
              onChange={handleInputChange}
              disabled={viewMode && !getSignMode}
            />
          </Col>
          <Col lg="6" xs="12" className="py-3">
            <div className="bg-white p-3">
              {formData.incharge_operator_sign ? (
                <img
                  src={formData.incharge_operator_sign}
                  alt="Incharge Operator Signature"
                  style={{
                    width: "100%",
                    height: 150,
                    className: "border w-100",
                  }}
                />
              ) : (
                <SignatureCanvas
                  ref={inchargeSignatureRef}
                  canvasProps={{
                    width: canvasDimensions.width,
                    height: canvasDimensions.height,
                    className: "border w-100",
                    crossOrigin: "anonymous",
                  }}
                  disabled={viewMode}
                />
              )}
            </div>
            <div className="p-3 d-flex gap-2">
              <Buttons
                label={<>Save Signature</>}
                classname="crud-btn"
                OnClick={() => handleSaveSignature(inchargeSignatureRef)}
                disabled={isButtonDisabled}
              />
              <Buttons
                label={<>Clear Signature</>}
                classname="crud-btn"
                OnClick={() => handleClearSignature(inchargeSignatureRef)}
                disabled={viewMode && !getSignMode}
              />
            </div>
          </Col>
          <Col xs="12" className="py-3">
            <TextArea
              textlabel={<>Customer Feedback</>}
              name="customer_feedback"
              value={formData.customer_feedback}
              onChange={handleInputChange}
              disabled={viewMode && !getSignMode}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CSRPreviews;
