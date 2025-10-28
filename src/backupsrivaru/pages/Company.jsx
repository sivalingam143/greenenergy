import React, { useState, useEffect } from "react";
import { Container, Col, Row, Modal } from "react-bootstrap";
import TableUI from "../components/Table";
import { TextInputForm } from "../components/Forms";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { ClickButton } from "../components/ClickButton";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Title from "../../components/Title";
const UserTablehead = ["No", "Company Name", " Mobile Number", " City"];
const Company = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [crtCompany, setCompany] = useState(null);
  const handleEditClick = (rowData) => {
    setCompany(rowData);
    setShow(true);
  };
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const initialState =
    type === "edit"
      ? { ...rowData }
      : {
          company_id: "",
          company_name: "",
          mobile_number: "",
          email: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          gst_no: "",
          pan_no: "",
        };
  const [formData, setFormData] = useState(initialState);
  const handleChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;
    if (crtCompany != null) {
      setCompany({
        ...crtCompany,
        [fieldName]: value,
      });
    }
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://greenenergy.zentexus.in/api/company/list.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            search_text: "",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const responseData = await response.json();
      setLoading(false);

      if (responseData.status === 200) {
        setUserData(responseData.data.company);
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData(); // Call fetchData directly in useEffect
  }, []);
  const [showAlert, setShowAlert] = useState(false);
  const errorAlert = (input) => {
    toast.error(input, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };
  const successAlert = (success) => {
    toast.success(success, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };
  const handleUpdateSubmit = async () => {
    try {
      const response = await fetch(
        "https://greenenergy.zentexus.in/api/company/update.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Include the company ID in the request
            company_id: crtCompany.company_id,
            company_name: crtCompany.company_name,
            mobile_number: crtCompany.mobile_number,
            email: crtCompany.email,
            address: crtCompany.address,
            city: crtCompany.city,
            pincode: crtCompany.pincode,
            state: crtCompany.state,
            gst_no: crtCompany.gst_no,
            pan_no: crtCompany.pan_no,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update company");
      }

      const responseData = await response.json();
      if (responseData.status === 200) {
        fetchData();
        successAlert(responseData.msg);
        setTimeout(() => {
          handleClose();
        }, 2000);

        // Navigate to the user list page after a delay
      } else {
       
      }
    } catch (error) {
     
    }

    setLoading(false);
  };
  return (
    <>
    <Title title="Company" />
      <div id="main">
        <Container fluid>
          <Row>
            <Col lg="6" md="12" xs="6">
              <div className="page-nav py-3">
                <span class="nav-list"> Company Details</span>
              </div>
            </Col>
            <Col lg="12" md="12" xs="12">
              <div className="py-4">
                <TableUI
                  headers={UserTablehead}
                  body={userData}
                  type="company"
                  handleEditClick={handleEditClick}
                  style={{ borderRadius: "5px" }}
                />
              </div>
            </Col>
          </Row>
        </Container>
        <>
          <Modal show={show} onHide={handleClose} size="xl" centered>
            <Modal.Header closeButton>
              <Modal.Title>Company Creation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row>
                  <Col lg="4" md="12" xs="12" className="py-3">
                    <TextInputForm
                      placeholder={"Company Name"}
                      labelname={"Company Name"}
                      name="company_name"
                      value={
                        crtCompany != null
                          ? crtCompany.company_name
                          : formData.company_name
                      }
                      onChange={(e) => handleChange(e, "company_name")}
                    ></TextInputForm>
                  </Col>
                  <Col lg="4" md="12" xs="12" className="py-3">
                    <TextInputForm
                      placeholder={"Mobile Number"}
                      labelname={"Mobile Number"}
                      name="mobile_number"
                      value={
                        crtCompany != null
                          ? crtCompany.mobile_number
                          : formData.mobile_number
                      }
                      onChange={(e) => handleChange(e, "mobile_number")}
                    ></TextInputForm>
                  </Col>
                  <Col lg="4" md="12" xs="12" className="py-3">
                    <TextInputForm
                      placeholder={"Email"}
                      labelname={"Email"}
                      name="email"
                      value={
                        crtCompany != null ? crtCompany.email : formData.email
                      }
                      onChange={(e) => handleChange(e, "email")}
                    ></TextInputForm>
                  </Col>
                  <Col lg="4" md="12" xs="12" className="py-3">
                    <TextInputForm
                      placeholder={"Address"}
                      labelname={"Address"}
                      name="address"
                      value={
                        crtCompany != null
                          ? crtCompany.address
                          : formData.address
                      }
                      onChange={(e) => handleChange(e, "address")}
                    ></TextInputForm>
                  </Col>
                  <Col lg="4" md="12" xs="12" className="py-3">
                    <TextInputForm
                      placeholder={"City"}
                      labelname={"City"}
                      name="city"
                      value={
                        crtCompany != null ? crtCompany.city : formData.city
                      }
                      onChange={(e) => handleChange(e, "city")}
                    ></TextInputForm>
                  </Col>
                  <Col lg="4" md="12" xs="12" className="py-3">
                    <TextInputForm
                      placeholder={"State"}
                      labelname={"State"}
                      name="state"
                      value={
                        crtCompany != null ? crtCompany.state : formData.state
                      }
                      onChange={(e) => handleChange(e, "state")}
                    ></TextInputForm>
                  </Col>
                  <Col lg="4" md="12" xs="12" className="py-3">
                    <TextInputForm
                      placeholder={"Pincode"}
                      labelname={"Pincode"}
                      name="pincode"
                      value={
                        crtCompany != null
                          ? crtCompany.pincode
                          : formData.pincode
                      }
                      onChange={(e) => handleChange(e, "pincode")}
                    ></TextInputForm>
                  </Col>
                  <Col lg="4" md="12" xs="12" className="py-3">
                    <TextInputForm
                      placeholder={"GST Number"}
                      labelname={"GST Number"}
                      name="gst_no"
                      value={
                        crtCompany != null ? crtCompany.gst_no : formData.gst_no
                      }
                      onChange={(e) => handleChange(e, "gst_no")}
                    ></TextInputForm>
                  </Col>
                  <Col lg="4" md="12" xs="12" className="py-3">
                    <TextInputForm
                      placeholder={"PAN Number"}
                      labelname={"PAN Number"}
                      name="pan_no"
                      value={
                        crtCompany != null ? crtCompany.pan_no : formData.pan_no
                      }
                      onChange={(e) => handleChange(e, "pan_no")}
                    ></TextInputForm>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Col lg="12" className="align-self-center">
                <div className="text-center">
                  {crtCompany != null ? (
                    <>
                      <ToastContainer
                        position="top-center"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                      />
                      <div className="d-flex justify-content-center">
                        <span className="mx-2">
                          <ClickButton
                            label={<>Update</>}
                            onClick={handleUpdateSubmit}
                          ></ClickButton>
                        </span>
                        <span className="mx-2">
                          <ClickButton
                            label={<>Cancel</>}
                            onClick={handleClose}
                          ></ClickButton>
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <ToastContainer
                        position="top-center"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                      />
                      <div className="d-flex justify-content-center">
                        <span className="mx-2">
                          <ClickButton
                            label={<> Submit</>}
                            onClick={[]}
                          ></ClickButton>
                        </span>
                        <span className="mx-2">
                          <ClickButton
                            label={<>Cancel</>}
                            onClick={handleClose}
                          ></ClickButton>
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </Col>
            </Modal.Footer>
          </Modal>
        </>
      </div>
    </>
  );
};

export default Company;
