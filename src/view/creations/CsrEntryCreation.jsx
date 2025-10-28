import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import PageTitle from "../../components/PageTitle";
import { Buttons } from "../../components/Buttons";
import Footer from "../../components/Footer";
import Dialog from "../../components/Dialog";
import CSRPreviews from "../CSRPreviews";
import useCsrEntryForm from "../../hooks/creationhooks/useCsrEntryForm";
import {
  TextInputForm,
  DropDown,
  DatePick,
  DropDownUI,
  TextArea,
  CheckBox,
} from "../../components/Forms";
import SignatureCanvas from "react-signature-canvas";
import TableUI from "../../components/TableUI";
import { MdOutlineDeleteOutline, MdEdit } from "react-icons/md";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import moment from "moment";

const CsrEntryCreation = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = user?.role_name.trim() || "";

  const {
    formData,
    setFormData,
    step,
    setStep,
    employeeSignatureUrl,
    setEmployeeSignatureUrl,
    csrNoOptions,
    partNoOptions,
    descriptionOptions,
    errorOptions,
    statusOptions,
    workStatusOptions,
    showConfirmDialog,
    setShowConfirmDialog,
    isSystemDown,
    setIsSystemDown,
    checkboxLabel,
    setCheckboxLabel,
    isMachineStatus,
    setIsMachineStatus,
    machineCheckboxLabel,
    setMachineCheckboxLabel,
    viewMode,
    editCsrEntryId,
    inchargeSignatureRef,
    parts,
    partsStatus,
    turbineStatus,
    csrMappingStatus,
    handleCsrNoChange,
    handleInputChange,
    handleTimeChange,
    handleErrorChange,
    handleErrorValueChange,
    handleAddError,
    handleEditError,
    handleDeleteError,
    handleMachineStatusChange,
    handleCheckBoxChange,
    handlePartsDataChange,
    handlePartNoChange,
    addPartRow,
    deletePartRow,
    handleSaveEmployeeSignature,
    handleClearSignature,
    handleSaveSignature,
    handleNext,
    handleBack,
    handleSubmit,
    handleCloseForm,
    handleConfirmClose,
    getSignMode,
  } = useCsrEntryForm();

  const InvoiceHead = [
    "#",
    "Item No.",
    "Description",
    "UOM",
    "Qty",
    "Serial Number",
    "Status",
  ];
  const InvoiceData = formData.parts_data.map((part, index) => {
    return {
      values: [
        index + 1,
        <DropDownUI
          value={part.part_no}
          onChange={(e) => handlePartNoChange(index, e)}
          options={partNoOptions}
          disabled={viewMode || partsStatus === "loading" || step === 2}
          placeholder="Select Part No"
          name={`part_no_${index}`}
          width="150px"
        />,
        <DropDownUI
          value={part.description}
          onChange={(e) =>
            handlePartsDataChange(index, "description", e.target.value)
          }
          options={descriptionOptions}
          disabled={viewMode || partsStatus === "loading" || step === 2}
          placeholder="Select Description"
          name={`description_${index}`}
          width="250px"
        />,
        <TextInputForm
          value={part.uom}
          disabled={true}
          name={`uom_${index}`}
          width="100px"
        />,
        <TextInputForm
          value={part.qty}
          onChange={(e) => handlePartsDataChange(index, "qty", e.target.value)}
          disabled={viewMode || step === 2}
          type="text"
          name={`qty_${index}`}
          width="100px"
        />,
        <TextInputForm
          value={part.serial_no}
          onChange={(e) =>
            handlePartsDataChange(index, "serial_no", e.target.value)
          }
          disabled={viewMode || step === 2}
          type="text"
          name={`serial_no_${index}`}
        />,
        <DropDownUI
          value={part.status}
          onChange={(e) =>
            handlePartsDataChange(index, "status", e.target.value)
          }
          options={statusOptions}
          disabled={viewMode || step === 2}
          placeholder="Select Status"
          name={`status_${index}`}
          width="250px"
        />,
        <Buttons
          label={<MdOutlineDeleteOutline />}
          classname="icon-only delete"
          OnClick={() => deletePartRow(index)}
          disabled={viewMode || step === 2}
        />,
      ],
    };
  });

  const ErrorTableHead = ["S No", "Error Description", "Error Value"];
  const ErrorTableData = formData.error_details.map((error, index) => {
    return {
      values: [
        index + 1,
        error.error_description,
        error.error_value,
        <div className="d-flex gap-2">
          <Buttons
            label={<MdEdit />}
            classname="icon-only edit"
            OnClick={() => handleEditError(index)}
            disabled={viewMode || step === 2}
          />
          <Buttons
            label={<MdOutlineDeleteOutline />}
            classname="icon-only delete"
            OnClick={() => handleDeleteError(index)}
            disabled={viewMode || step === 2}
          />
        </div>,
      ],
    };
  });

  const pageTitle = getSignMode
    ? "Get Incharge Signature"
    : viewMode
    ? "View CSR Entry"
    : editCsrEntryId
    ? "Edit CSR Entry"
    : "Create CSR Entry";

  const renderFormFields = () => (
    <>
      <Col lg="6" xs="12" className="py-3">
        <DropDown
          textlabel={<>Csr No</>}
          value={formData.csr_no}
          onChange={handleCsrNoChange}
          options={csrNoOptions}
          disabled={
            viewMode ||
            csrMappingStatus === "loading" ||
            editCsrEntryId ||
            step === 2
          }
          placeholder="Select CSR Number"
          name="csr_no"
        />
      </Col>
      <Col lg="6" xs="12" className="py-3 align-self-center">
        <DatePick
          textlabel={<>Date</>}
          value={formData.csr_entry_date}
          onChange={(date) => {
            setFormData((prev) => ({
              ...prev,
              csr_entry_date: date,
            }));
          }}
          disabled
        />
      </Col>
      <Col lg="6" xs="12" className="py-3">
        <TextInputForm
          textlabel={<>Customer Name</>}
          name="customer_name"
          value={formData.customer_name}
          onChange={handleInputChange}
          disabled
        />
      </Col>
      <Col lg="6" xs="12" className="py-3">
        <TextInputForm
          textlabel={<>Contract Type</>}
          name="contract_type"
          value={formData.contract_type}
          onChange={handleInputChange}
          disabled
        />
      </Col>
      <Col xs="12" className="py-3">
        <PageTitle PageTitle="Turbine Details" showButton={false} />
      </Col>
      <Col lg="4" xs="12" className="py-3">
        <TextInputForm
          textlabel={<>Wtg No.</>}
          name="wtg_no"
          value={formData.wtg_no}
          onChange={handleInputChange}
          disabled
        />
      </Col>
      <Col lg="4" xs="12" className="py-3">
        <TextInputForm
          textlabel={<>Loc No.</>}
          name="loc_no"
          value={formData.loc_no}
          onChange={handleInputChange}
          disabled
        />
      </Col>
      <Col lg="4" xs="12" className="py-3">
        <TextInputForm
          textlabel={<>Model</>}
          name="model_type"
          value={formData.model_type}
          onChange={handleInputChange}
          disabled
        />
      </Col>
      <Col lg="4" xs="12" className="py-3">
        <TextInputForm
          textlabel={<>HTSC No</>}
          name="htsc_no"
          value={formData.htsc_no}
          onChange={handleInputChange}
          disabled
        />
      </Col>
      <Col lg="4" xs="12" className="py-3">
        <TextInputForm
          textlabel={<>Capacity</>}
          name="capacity"
          value={formData.capacity}
          onChange={handleInputChange}
          disabled
        />
      </Col>
      <Col lg="4" xs="12" className="py-3">
        <TextInputForm
          textlabel={<>Make</>}
          name="make"
          value={formData.make}
          onChange={handleInputChange}
          disabled
        />
      </Col>
      <Col xs="12" className="py-3">
        <PageTitle PageTitle="Machine Stop" showButton={false} />
      </Col>
      <Col lg="4" xs="12" className="py-3">
        <CheckBox
          textlabel={<>System Down</>}
          boxlabel={<> {checkboxLabel} </>}
          checked={isSystemDown}
          OnChange={handleCheckBoxChange}
          disabled
        />
      </Col>
      <Col lg="4" xs="12" className="py-3 align-self-center">
        <DatePick
          textlabel={<>Date</>}
          value={formData.system_down_date}
          onChange={(date) => {
            setFormData((prev) => ({
              ...prev,
              system_down_date: date,
            }));
          }}
          disabled={viewMode || step === 2}
        />
      </Col>
      <Col lg="4" md="3" xs="12" className="py-3">
        <label htmlFor="system_down_time" className="form-label">
          Time
        </label>
        <TimePicker
          id="system_down_time"
          onChange={(value) => handleTimeChange(value, "system_down_time")}
          value={
            formData.system_down_time
              ? moment(formData.system_down_time, "hh:mm A").format("HH:mm")
              : ""
          }
          disableClock={true}
          format="hh:mm a"
          clearIcon={null}
          disabled={viewMode || step === 2}
          className="form-control"
        />
      </Col>
      <Col xs="12" className="py-3">
        <PageTitle PageTitle="CSR Book" showButton={false} />
      </Col>
      <Col lg="4" xs="12" className="py-3">
        <TextInputForm
          textlabel={<>CSR Reported By</>}
          name="csr_booked_by"
          value={formData.csr_booked_by}
          onChange={handleInputChange}
          disabled
        />
      </Col>
      <Col lg="4" xs="12" className="py-3 align-self-center">
        <DatePick
          textlabel={<>Date</>}
          value={formData.csr_booked_by_date}
          onChange={(date) => {
            setFormData((prev) => ({
              ...prev,
              csr_booked_by_date: date,
            }));
          }}
          disabled
        />
      </Col>
      <Col lg="4" md="3" xs="12" className="py-3">
        <label htmlFor="csr_booked_by_time" className="form-label">
          Time
        </label>
        <TimePicker
          id="csr_booked_by_time"
          onChange={(value) => handleTimeChange(value, "csr_booked_by_time")}
          value={
            formData.csr_booked_by_time
              ? moment(formData.csr_booked_by_time, "hh:mm A").format("HH:mm")
              : ""
          }
          disableClock={true}
          format="hh:mm a"
          clearIcon={null}
          disabled={viewMode || step === 2}
          className="form-control"
        />
      </Col>
      <Col xs="12" className="py-3">
        <PageTitle PageTitle="Error Details" showButton={false} />
      </Col>

      <Col lg="5" xs="12" className="py-3">
        <DropDown
          textlabel={<>Error</>}
          name="error_id"
          value={formData.error_id}
          onChange={handleErrorChange}
          options={errorOptions}
          disabled={viewMode || turbineStatus === "loading" || step === 2}
          placeholder="Select Error"
        />
      </Col>
      <Col lg="5" xs="12" className="py-3">
        <TextInputForm
          textlabel={<>Error Value</>}
          name="error_value_temp"
          value={formData.error_value_temp || ""}
          onChange={handleErrorValueChange}
          disabled={viewMode || step === 2}
        />
      </Col>
      <Col lg="2" xs="12" className="py-3 align-self-end text-center">
        <Buttons
          label={<>Add</>}
          classname="crud-btn"
          OnClick={handleAddError}
          disabled={viewMode || step === 2 || !formData.error_id}
        />
      </Col>
      <Col xs="12" className="py-3">
        <TableUI headers={ErrorTableHead} body={ErrorTableData} />
      </Col>
      <Col xs="12" className="py-3">
        <TextArea
          textlabel={<>Nature Of Work</>}
          name="nature_of_work"
          value={formData.nature_of_work}
          onChange={handleInputChange}
          disabled={viewMode || step === 2}
        />
      </Col>

      <Col xs="12" className="py-3">
        <Buttons
          label={<>Add Part</>}
          classname="crud-btn"
          OnClick={addPartRow}
          disabled={viewMode || step === 2}
        />
      </Col>
      <Col xs="12" className="py-3">
        <div className="part-table">
          <TableUI headers={InvoiceHead} body={InvoiceData} />
        </div>
      </Col>
      <Col xs="12" className="py-3">
        <PageTitle PageTitle="Machine Status" showButton={false} />
      </Col>
      <Col lg="4" md="3" xs="12" className="py-3">
        <CheckBox
          textlabel={<>Machine Status</>}
          boxlabel={<> {machineCheckboxLabel} </>}
          checked={isMachineStatus}
          OnChange={handleMachineStatusChange}
          disabled={viewMode || step === 2}
        />
      </Col>
      <Col xs="12" className="py-3">
        <PageTitle PageTitle="Work Time Status" showButton={false} />
      </Col>
      <Col lg="3" xs="12" className="py-3 align-self-center">
        <DatePick
          textlabel={<>Start Date</>}
          value={formData.work_st_date}
          onChange={(date) => {
            setFormData((prev) => ({
              ...prev,
              work_st_date: date,
            }));
          }}
          disabled={viewMode || step === 2}
        />
      </Col>
      <Col lg="3" md="3" xs="12" className="py-3">
        <label htmlFor="work_st_time" className="form-label">
          Start Time
        </label>
        <TimePicker
          id="work_st_time"
          onChange={(value) => handleTimeChange(value, "work_st_time")}
          value={
            formData.work_st_time
              ? moment(formData.work_st_time, "hh:mm A").format("HH:mm")
              : ""
          }
          disableClock={true}
          format="hh:mm a"
          clearIcon={null}
          disabled={viewMode || step === 2}
          className="form-control"
        />
      </Col>
      <Col lg="3" xs="12" className="py-3 align-self-center">
        <DatePick
          textlabel={<>End Date</>}
          value={formData.work_end_date}
          onChange={(date) => {
            setFormData((prev) => ({
              ...prev,
              work_end_date: date,
            }));
          }}
          disabled={viewMode || step === 2}
        />
      </Col>
      <Col lg="3" md="3" xs="12" className="py-3">
        <label htmlFor="work_end_time" className="form-label">
          End Time
        </label>
        <TimePicker
          id="work_end_time"
          onChange={(value) => handleTimeChange(value, "work_end_time")}
          value={
            formData.work_end_time
              ? moment(formData.work_end_time, "hh:mm A").format("HH:mm")
              : ""
          }
          disableClock={true}
          format="hh:mm a"
          clearIcon={null}
          disabled={viewMode || step === 2}
          className="form-control"
        />
      </Col>
      <Col xs="12" className="py-3">
        <PageTitle PageTitle="Work Status" showButton={false} />
      </Col>
      <Col lg="4" xs="12" className="py-3">
        <DropDown
          textlabel={<>Work Status</>}
          name="work_status"
          value={formData.work_status}
          onChange={handleInputChange}
          options={workStatusOptions}
          disabled={viewMode || step === 2}
          placeholder="Select Work Status"
        />
      </Col>
      <Col lg="12" xs="12" className="py-3"></Col>
      <Col lg="6" xs="12" className="py-3">
        <TextInputForm
          textlabel={<>Employee Name</>}
          name="employee_name"
          value={formData.employee_name}
          onChange={handleInputChange}
          disabled
        />
      </Col>
      <Col lg="6" xs="12" className="py-3">
        <div className="bg-white p-3">
          {employeeSignatureUrl ? (
            <img
              src={employeeSignatureUrl}
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
        {employeeSignatureUrl && !editCsrEntryId && !step === 2 && (
          <div className="p-3">
            <Buttons
              label={<>Save Sign</>}
              classname="crud-btn"
              OnClick={handleSaveEmployeeSignature}
              disabled={viewMode}
            />
          </div>
        )}
      </Col>
    </>
  );

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
                {step === 1 && renderFormFields()}
                {step === 2 && (
                  <CSRPreviews
                    formData={formData}
                    inchargeSignatureRef={inchargeSignatureRef}
                    handleInputChange={handleInputChange}
                    handleSaveSignature={handleSaveSignature}
                    handleClearSignature={handleClearSignature}
                    viewMode={viewMode}
                    getSignMode={getSignMode}
                  />
                )}
              </Row>
            </div>
          </Col>
          <Col lg="12">
            {step === 1 ? (
              <Footer
                LabelOne={<>Next</>}
                LabelTwo={<>Cancel</>}
                LabelOneClick={handleNext}
                LabelTwoClick={handleCloseForm}
                LabelOneDisabled={viewMode}
              />
            ) : (
              <Footer
                LabelOne={<>Save</>}
                LabelTwo={<>Back</>}
                LabelOneClick={handleSubmit}
                LabelTwoClick={handleBack}
                LabelOneDisabled={viewMode && !getSignMode}
                LabelTwoDisabled={role === "Engineer" && !!editCsrEntryId}
              />
            )}
          </Col>
        </Row>
      </Container>
      <Dialog
        isVisible={showConfirmDialog}
        onConfirm={handleConfirmClose}
        onCancel={() => handleConfirmClose(false)}
      />
    </div>
  );
};

export default CsrEntryCreation;
