import React, { useState } from "react";
import PageNav from "../Compnents/PageNav";
import { Container, Row, Col, Button } from "react-bootstrap";
import { TextInputForm, DropDown, DropDownUI } from "../Compnents/Forms";
import { useLocation } from "react-router-dom";
const DropList = [
  {
    value: "TN",
    label: "Tamil Nadu",
  },
  {
    value: "PY",
    label: "Pondycheri",
  },
  {
    value: "KL",
    label: "Kerala",
  },
  {
    value: "TL",
    label: "Telugana",
  },
];

const SiteCreation = () => {
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const initialState =
    type === "edit"
      ? { ...rowData }
      : {
          state_id: "",
          site_name: "",
          short_code: "",
        };
  const [formData, setFormData] = useState(initialState);
  const handleChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;

    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };
  return (
    <div>
      <Container>
        <Row className="justify-content-center">
          <Col lg="12" md="12" xs="12" className="py-3">
            <PageNav pagetitle={"SiteCreation"}></PageNav>
          </Col>
          <Col lg="3" md="6" xs="12" className="py-2">
            <DropDownUI
              optionlist={[]}
              placeholder="choose State"
              labelname="State"
              name="state_id"
              value={formData}
              onChange={(updatedFormData) =>
                setFormData({ ...formData, state_id: updatedFormData.state_id })
              }
            ></DropDownUI>
          </Col>
          <Col lg="3" md="6" xs="12" className="py-2">
            <TextInputForm
              placeholder={"Site Name"}
              labelname={"Site Name"}
              name="site_name"
              value={formData.site_name}
              onChange={(e) => handleChange(e, "site_name")}
            ></TextInputForm>
          </Col>
          <Col lg="3" md="6" xs="12" className="py-2">
            <TextInputForm
              placeholder={"Short Code"}
              labelname={"Short Code"}
              name="short_code"
              value={formData.short_code}
              onChange={(e) => handleChange(e, "short_code")}
            ></TextInputForm>
          </Col>
          <Col lg="12" md="12" xs="12">
            <div className="page-nav text-center py-3">
              <Button className="create-btn mx-3 "> Submit</Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SiteCreation;
