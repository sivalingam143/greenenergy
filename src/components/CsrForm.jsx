import React from "react";
import { Row, Col } from "react-bootstrap";
import {
  TextInputForm,
  DropDown,
  DatePick,
  CheckBox,
} from "../components/Forms";

export const CsrForm = ({
  formData,
  turbineOptions,
  CSR_TYPE_SHORT_CODES,
  viewMode,
  isEdit,
  isMailChecked,
  checkboxLabel,
  handleInputChange,
  handleCheckBoxChange,
}) => {
  return (
    <Row>
      <Col lg="4" xs="12" className="py-3">
        <DropDown
          textlabel={<>Weg No.</>}
          options={turbineOptions}
          value={formData.weg_no}
          onChange={handleInputChange("weg_no")}
          disabled={viewMode}
        />
      </Col>

      <Col lg="4" xs="12" className="py-3">
        <DropDown
          textlabel={<>CSR Type</>}
          options={CSR_TYPE_SHORT_CODES.map((item) => ({
            value: item.type,
            label: item.type,
          }))}
          value={formData.csr_type}
          onChange={handleInputChange("csr_type")}
          disabled={viewMode || isEdit}
        />
      </Col>

      <Col lg="4" md="3" xs="12" className="py-3">
        <CheckBox
          textlabel={<>System Down</>}
          boxlabel={<>{checkboxLabel}</>}
          checked={isMailChecked}
          OnChange={handleCheckBoxChange}
          disabled={viewMode}
        />
      </Col>

      <Col lg="4" xs="12" className="py-3">
        <TextInputForm
          textlabel={<>CSR No.</>}
          value={formData.csr_no}
          onChange={handleInputChange("csr_no")}
          disabled
        />
      </Col>

      <Col lg="4" xs="12" className="py-3 align-self-center">
        <DatePick
          textlabel={<>Date</>}
          value={formData.csr_date}
          onChange={handleInputChange("csr_date")}
          disabled={viewMode}
          placeholder="Select Date"
        />
      </Col>

      <Col lg="4" xs="12" className="py-3">
        <TextInputForm
          textlabel={<>CSR Reported By</>}
          value={formData.csr_booked_by}
          onChange={handleInputChange("csr_booked_by")}
          disabled
        />
      </Col>

      <Col lg="4" xs="12" className="py-3">
        <TextInputForm
          textlabel={<>Customer Name</>}
          value={formData.customer_name}
          onChange={handleInputChange("customer_name")}
          disabled
        />
      </Col>

      <Col lg="4" xs="12" className="py-3">
        <TextInputForm
          textlabel={<>Location No</>}
          value={formData.loc_no}
          onChange={handleInputChange("loc_no")}
          disabled
        />
      </Col>

      <Col lg="4" xs="12" className="py-3">
        <TextInputForm
          textlabel={<>Site Name</>}
          value={formData.site_name}
          onChange={handleInputChange("site_name")}
          disabled
        />
      </Col>
    </Row>
  );
};

export default CsrForm;
