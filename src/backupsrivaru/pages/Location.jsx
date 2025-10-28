import React, { useState, useEffect } from "react";
import { Container, Col, Row, Modal } from "react-bootstrap";
import { FaMagnifyingGlass } from "react-icons/fa6";
import TableUI from "../components/Table";
import Pagnation from "../components/Pagnation";
import { Buttons, ClickButton } from "../components/ClickButton";
import { DropDownUI, TextInputForm } from "../components/Forms";
import MobileView from "../components/MobileView";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineClose } from "react-icons/md";
import { PageTitle } from "../components/PageTitle";
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";
import { IoFilter } from "react-icons/io5";
const LocationTablehead = ["No", "State", "Location"];

const Statename = [
  {
    value: "Tamilnadu",
    label: "Tamilnadu",
  },
];
const Location = () => {
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const initialState =
    type === "edit"
      ? { ...rowData }
      : {
          state_id: "",
          site_id: "",
          location_name: "",
        };
  const [formData, setFormData] = useState(initialState);
  const [crtLocation, setCrtLocation] = useState(null);
  const handleEditClick = (rowdata) => {
    setCrtLocation(rowdata);
    setShowModal(true);
  };
  const handleChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;
    if (crtLocation != null) {
      setCrtLocation({
        ...crtLocation,
        [fieldName]: value,
      });
    }
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleLoad = () => {
    window.location.reload();
  };

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
    setCrtLocation(null);
  };
  const handleShowModal = () => setShowModal(true);
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  console.log("userData", userData);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const handleSearch = (value) => {
    setSearchText(value);
    //console.log(value);
  };
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://greenenergy.zentexus.in/api/location/list.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            search_text: searchText,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const responseData = await response.json();
      console.log("responseData", responseData);
      setLoading(false);
      if (responseData.status === 200) {
        setUserData(responseData.data.location);
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  useEffect(() => {
    fetchData(); // Call fetchData directly in useEffect
  }, [searchText]);
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
  const handleSubmit = async () => {
    try {
      if (formData.location_name === "") {
        if (formData.location_name === "") {
          errorAlert("Name is Must");
        }
      } else {
        const response = await fetch(
          "https://greenenergy.zentexus.in/api/location/create.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        console.log(formData);
        const responseData = await response.json();

        console.log(responseData);

        if (responseData.status === 200) {
          setFormData({
            state_id: "",
            site_id: "",
            location_name: "",
          });
          fetchData();
          successAlert(responseData.msg);
          setTimeout(() => {
            handleCloseModal();
          }, 2000);
        } else if (responseData.status === 400) {
          errorAlert(responseData.msg);
        } else {
          setShowAlert(true);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleUpdateSubmit = async () => {
    try {
      const response = await fetch(
        "https://greenenergy.zentexus.in/api/location/update.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Include the company ID in the request
            location_id: crtLocation.location_id,
            state_id: crtLocation.state_id,
            site_id: crtLocation.site_id,
            location_name: crtLocation.location_name,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update company");
      }

      const responseData = await response.json();
      console.log(responseData);

      if (responseData.status === 200) {
        fetchData();
        successAlert(responseData.msg);
        setTimeout(() => {
          handleCloseModal();
        }, 2000);

        // Navigate to the user list page after a delay
      } else {
        console.error(
          responseData.msg || "Unknown error occurred during update"
        );
      }
    } catch (error) {
      console.error("Error updating product:", error.msg);
    }

    setLoading(false);
  };
  const [site, setSite] = useState([]);

  const fetchDataSite = async () => {
    try {
      const response = await fetch(
        "https://greenenergy.zentexus.in/api/site/list.php",
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
      console.log("responseData", responseData);
      setLoading(false);
      if (responseData.status === 200) {
        setSite(responseData.data.site);
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  useEffect(() => {
    fetchDataSite(); // Call fetchData directly in useEffect
  }, []);
  return (
    <>
      <div id="main">
        <Container fluid>
          <Row>
            <Col lg="7" md="4" xs="6">
              <div className="page-nav py-3">
                <span class="nav-list"> Location</span>
              </div>
            </Col>
            <Col lg="5" md="3" xs="6" className="align-self-center text-end">
              <ClickButton
                label={<>Add New</>}
                onClick={handleShowModal}
              ></ClickButton>
            </Col>
            <Col lg="3" md="5" xs="12" className="py-1">
              <TextInputForm
                placeholder={"Location"}
                onChange={(e) => handleSearch(e.target.value)}
                prefix_icon={<FaMagnifyingGlass />}
                labelname={"Search Location"}
              >
                {" "}
              </TextInputForm>
            </Col>
            <Col lg={6} md={12} xs={12} className="py-2 text-end">
              {/* <Button onClick={handleShow} className='filter' >
              <span className='me-2'><IoFilter /></span>Filter
            </Button> */}
              <Col lg="12" md="12" xs="6" className="py-1">
                {/* <Button onClick={handleLoad} className='filter' >
                <span className='me-2'><IoFilter /></span>Undo Filter
              </Button> */}
              </Col>
              <Offcanvas
                show={show}
                onHide={handleClose}
                placement="end"
                backdrop={true}
              >
                <Offcanvas.Body>
                  <Row>
                    <Col lg="6">
                      <PageTitle PageTitle={<>Location</>} />
                    </Col>
                    <Col lg="6" className="align-self-center">
                      <div className="text-end">
                        <Buttons
                          onClick={handleClose}
                          lable={
                            <>
                              <MdOutlineClose />
                            </>
                          }
                        ></Buttons>
                      </div>
                    </Col>
                  </Row>
                  <div className="mt-3">
                    <Row>
                      <Col lg="12" md="12" xs="12" className="py-3">
                        <TextInputForm
                          placeholder={"Location Name"}
                          labelname={"Location Name"}
                          name="location_name"
                          value={formData.location_name}
                          onChange={(e) => handleChange(e, "location_name")}
                        ></TextInputForm>
                      </Col>
                      <Col lg="12" className="align-self-center">
                        <div className="my-5 text-center">
                          <ClickButton label={<>Clear</>}></ClickButton>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Offcanvas.Body>
              </Offcanvas>
            </Col>
            {/* <Col lg={3} md={12} xs={12} className='py-2'>
            <Pagnation></Pagnation>
          </Col> */}
            <Col lg="12" md="12" xs="12" className="px-0">
              <div className="py-1">
                <TableUI
                  headers={LocationTablehead}
                  body={userData}
                  type="location"
                  pageview={"yes"}
                  handleEditClick={handleEditClick}
                  onDelete={fetchData}
                  style={{ borderRadius: "5px" }}
                />
                <MobileView
                  sno={"01"}
                  FactoryName={"Anand Fireworks"}
                  Place={"Vettrilaiyurani"}
                ></MobileView>
              </div>
            </Col>
            {/* 
          <Col lg={12} md={12} xs={12}>
            <Pagnation></Pagnation>
          </Col> */}
          </Row>
        </Container>
        <>
          <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
            <Modal.Header>
              <Modal.Title>
                {" "}
                {crtLocation ? "Edit Location" : "Location Creation"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container fluid>
                <Row>
                  <Col lg="4" className="py-3">
                    <DropDownUI
                      optionlist={Statename}
                      placeholder="State name"
                      labelname="Choose State"
                      name="state_id"
                      value={formData}
                      onChange={(updatedFormData) => {
                        if (crtLocation != null) {
                          setCrtLocation({
                            ...crtLocation,
                            state_id: updatedFormData.state_id,
                          });
                        } else {
                          setFormData({
                            ...formData,
                            state_id: updatedFormData.state_id,
                          });
                        }
                      }}
                    ></DropDownUI>
                  </Col>
                  <Col lg="4" className="py-3">
                    <DropDownUI
                      optionlist={site.map((user) => ({
                        value: user.site_id,
                        label: user.site_name,
                      }))}
                      placeholder="Site Name"
                      labelname="Site Name"
                      name="site_id"
                      value={formData}
                      onChange={(updatedFormData) => {
                        if (crtLocation != null) {
                          setCrtLocation({
                            ...formData,
                            site_id: updatedFormData.site_id,
                          });
                        } else {
                          setFormData({
                            ...formData,
                            site_id: updatedFormData.site_id,
                          });
                        }
                      }}
                    ></DropDownUI>
                  </Col>
                  <Col lg="4" className="py-3">
                    <TextInputForm
                      placeholder={"Location Name"}
                      labelname={"Location Name"}
                      name="location_name"
                      value={
                        crtLocation != null
                          ? crtLocation.location_name
                          : formData.location_name
                      }
                      onChange={(e) => handleChange(e, "location_name")}
                    ></TextInputForm>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Col lg="12" className="align-self-center">
                <div className="text-center">
                  {crtLocation != null ? (
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
                            onClick={handleCloseModal}
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
                            onClick={handleSubmit}
                          ></ClickButton>
                        </span>
                        <span className="mx-2">
                          <ClickButton
                            label={<>Cancel</>}
                            onClick={handleCloseModal}
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

export default Location;
