import React, { useState, useEffect } from "react";
import { Container, Col, Row, Button, Modal } from "react-bootstrap";
import { FaMagnifyingGlass } from "react-icons/fa6";
import TableUI from "../components/Table";
import Pagnation from "../components/Pagnation";
import { Buttons, ClickButton } from "../components/ClickButton";
import { TextInputForm } from "../components/Forms";
import MobileView from "../components/MobileView";
import { useNavigate } from "react-router-dom";
import Offcanvas from "react-bootstrap/Offcanvas";
import { IoMdCloseCircle } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import { MdOutlineClose } from "react-icons/md";
import { PageTitle } from "../components/PageTitle";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const UserTablehead = ["No", "Role"];
const Role = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [modal, setModal] = useState(false);
  const closeModal = () => {
    setModal(false);
    setCrtRole(null);
  };
  const showModal = () => setModal(true);
  const handleLoad = () => {
    window.location.reload();
  };
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const initialState =
    type === "edit"
      ? { ...rowData }
      : {
        role_name: "",
      };
  const [formData, setFormData] = useState(initialState);
  const [crtRole, setCrtRole] = useState(null);
  const handleEditClick = (rowdata) => {
    setCrtRole(rowdata);
    setModal(true);
  };
  const handleChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;
    if (crtRole != null) {
      setCrtRole({
        ...crtRole,
        [fieldName]: value,
      });
    }
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

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
        "https://api.demos.srivarugreenenergy.com/role/list.php",
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
        setUserData(responseData.data.role);
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
      if (formData.role_name === "") {
        if (formData.role_name === "") {
          errorAlert("Role is Must");
        }
      } else {
        const response = await fetch(
          "https://api.demos.srivarugreenenergy.com/role/create.php",
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
            role_name: "",
          });
          fetchData();
          successAlert(responseData.msg);
          setTimeout(() => {
            closeModal();
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
        "https://api.demos.srivarugreenenergy.com/role/update.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Include the company ID in the request
            role_id: crtRole.role_id,
            role_name: crtRole.role_name,
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
          closeModal();
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
  return (
    <div id ="main">
      <Container fluid>
        <Row>
          <Col lg="7" md="4" xs="6">
            <div className="page-nav py-3">
              <span class="nav-list"> Role</span>
            </div>
          </Col>
          <Col lg="5" md="3" xs="6" className="align-self-center text-end">
            <ClickButton label={<>Add New</>} onClick={showModal}></ClickButton>
          </Col>
          <Col lg="3" md="5" xs="12" className="py-1">
            <TextInputForm
              placeholder={"Role"}
              onChange={(e) => handleSearch(e.target.value)}
              prefix_icon={<FaMagnifyingGlass />}
              labelname={" Search Type"}
            >
              {" "}
            </TextInputForm>
          </Col>
          <Col lg={6} md={12} xs={12} className="py-2 text-end">
            <Offcanvas
              show={show}
              onHide={handleClose}
              placement="end"
              backdrop={true}
            >
              <Offcanvas.Body>
                <Row>
                  <Col lg="6">
                    <PageTitle PageTitle={<>Role</>} />
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
                        placeholder={"Role Name"}
                        labelname={" Role Name"}
                        name="role_name"
                        value={formData.role_name}
                        onChange={(e) => handleChange(e, "role_name")}
                      ></TextInputForm>
                    </Col>
                  </Row>
                </div>
                <Col lg="12" className="align-self-center">
                  <div className="my-5 text-center">
                    <ClickButton label={<>Clear</>}></ClickButton>
                  </div>
                </Col>
              </Offcanvas.Body>
            </Offcanvas>
          </Col>
          <Col lg="12" md="12" xs="12" className="px-0">
            <div className="py-1">
              <TableUI
                headers={UserTablehead}
                body={userData}
                type="role"
                pageview={"yes"}
                handleEditClick={handleEditClick}
                onDelete={fetchData}
                style={{ borderRadius: "5px" }}
              />
              
            </div>
          </Col>
          {/* <Col lg={12} md={12} xs={12}>
            <Pagnation></Pagnation>
          </Col> */}
        </Row>
      </Container>

      <>
        <Modal show={modal} onHide={closeModal} size="md" centered>
          <Modal.Header closeButton>
            <Modal.Title>{crtRole?'Edit Role':'Create Role'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col lg="12" md="12" xs="12" className="py-3">
                  <TextInputForm
                    placeholder={"Role"}
                    labelname={" Role"}
                    name="role"
                    value={
                      crtRole != null ? crtRole.role_name : formData.role_name
                    }
                    onChange={(e) => handleChange(e, "role_name")}
                  ></TextInputForm>
                </Col>

              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Col lg="12" className="align-self-center">
              <div className="text-center">
                {crtRole != null ? (
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
                          onClick={closeModal}
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
                          onClick={closeModal}
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
  );
};

export default Role;
