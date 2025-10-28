import React, { useState, useEffect } from "react";
import { Container, Col, Row, Modal } from "react-bootstrap";
import { FaAngleRight } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import TableUI from "../components/Table";
import { TextInputForm } from "../components/Forms";
import Pagnation from "../components/Pagnation";
import { Buttons, ClickButton } from "../components/ClickButton";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { IoMdCloseCircle } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Navigate } from "react-router-dom";
import { MdOutlineClose } from "react-icons/md";
import { PageTitle } from "../components/PageTitle";
const UserTablehead = [
  "No",
  "Maintenance Code",
  "Maintenance Description",
];

const UserData = [
  {
    id: "1",
    maintenance_code: "TamilNadu",
    maintenance_describtion: "Palladam",
  },
];
const Maintenance = ({ modeltitle = "Create", labelname = "Upload Excel" }) => {
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const [addError, setaddError] = useState(false);

  const closeErrorModal = () => {
    setaddError(false);
    setCrtMaintenance(null);
  };

  const openErrorModal = () => setaddError(true);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleLoad = () => {
    window.location.reload();
  };
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const navigate = useNavigate();
  const initialState =
    type === "edit"
      ? { ...rowData }
      : {
        maintenance_code: "",
        maintenance_describtion: "",
      };
  const [formData, setFormData] = useState(initialState);
  console.log("formData", formData);
  const [crtMaintenance, setCrtMaintenance] = useState(null);
  const handleEditClick = (rowdata) => {
    setCrtMaintenance(rowdata);
    setaddError(true);
  };
  const handleChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;
    if (crtMaintenance != null) {
      setCrtMaintenance({
        ...crtMaintenance,
        [fieldName]: value,
      });
    } else {
      setFormData({
        ...formData,
        [fieldName]: value,
      });
    }
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
        "https://greenenergy.zentexus.in/api/maintenance/list.php",
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
      setLoading(false);
      if (responseData.status === 200) {
        setUserData(responseData.data.maintenance);
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
      if (
        formData.maintenance_code === "" ||
        formData.maintenance_describtion === ""
      ) {
        if (formData.maintenance_code === "") {
          errorAlert("Name is Must");
        } else if (formData.maintenance_describtion === "") {
          errorAlert("Mobile Number is Must");
        }
      } else {
        const response = await fetch(
          "https://greenenergy.zentexus.in/api/maintenance/create.php",
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
            grid_fault_code: "",
            grid_fault_describtion: "",
          });
          fetchData();
          successAlert(responseData.msg);
          setTimeout(() => {
            closeErrorModal();
          }, 2000);
        } else if (responseData.status === 400) {
          toast.error("Missing required fields!", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
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
        "https://greenenergy.zentexus.in/api/maintenance/update.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Include the company ID in the request
            maintenance_id: crtMaintenance.maintenance_id,
            maintenance_code: crtMaintenance.maintenance_code,
            maintenance_describtion: crtMaintenance.maintenance_describtion,
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
          closeErrorModal();
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
  const [sortOrder, setSortOrder] = useState("asc");
  const handleSort = () => {
    const sortedData = [...userData].sort((a, b) => {
      if (sortOrder === "asc") {
        return String(a.maintenance_code).localeCompare(
          String(b.maintenance_code)
        );
      } else {
        return String(b.maintenance_code).localeCompare(
          String(a.maintenance_code)
        );
      }
    });
    setUserData(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  return (
    <>
      <div id="main">
        <Container fluid>
          <Row>
            <Col lg="7" md="6" xs="3" className="align-self-center">
              <div className="page-nav py-3">
                <span class="nav-list">Maintenance</span>
              </div>
            </Col>
            <Col lg="5" md="6" xs="9" className="align-self-center py-3">
              <div className="d-flex justify-content-end">
                {/* <div className="px-2">
                <ClickButton
                  label={<>Upload Excel</>}
                  className="create-btn "
                  onClick={handleShowModal}
                ></ClickButton>
              </div> */}
                <div className="px-2">
                  <ClickButton
                    label={<>Add New</>}
                    className="create-btn "
                    onClick={openErrorModal}
                  ></ClickButton>
                </div>
              </div>
            </Col>
            <Col lg="3" md="5" xs="12" className="py-1">
              <TextInputForm
                placeholder={"Maintenance "}
                onChange={(e) => handleSearch(e.target.value)}
                prefix_icon={<FaMagnifyingGlass />}
                labelname={"Search Maintenance"}
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
                      <PageTitle PageTitle={<>Maintenance</>} />
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
                          placeholder="Maintenance code"
                          labelname="Maintenance code"
                          name="maintenance_code"
                          value={formData.maintenance_code}
                          onChange={(e) => handleChange(e, "maintenance_code")}
                        ></TextInputForm>
                      </Col>
                      <Col lg="12" md="12" xs="12" className="py-3">
                        <TextInputForm
                          placeholder="Maintenance Description"
                          labelname="Maintenance Description"
                          name="maintenance_describtion"
                          value={formData.maintenance_describtion}
                          onChange={(e) =>
                            handleChange(e, "maintenance_describtion")
                          }
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
                  headers={UserTablehead}
                  onSort={handleSort}
                  sortOrder={sortOrder}
                  body={userData}
                  type="maintenance"
                  handleEditClick={handleEditClick}
                  pageview={"yes"}
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
          <Modal show={addError} onHide={closeErrorModal} size="lg" centered>
            <Modal.Header>
              <Modal.Title> {crtMaintenance ? 'Edit Maintenance' : 'Maintenance Creation'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container fluid>
                <Row>
                  <Col lg="12" className="py-3">
                    <TextInputForm
                      placeholder="Maintenance code"
                      labelname="Maintenance code"
                      name="maintenance_code"
                      value={
                        crtMaintenance != null
                          ? crtMaintenance.maintenance_code
                          : formData.maintenance_code
                      }
                      onChange={(e) => handleChange(e, "maintenance_code")}
                    ></TextInputForm>
                  </Col>
                  <Col lg="12" className="py-3">
                    <TextInputForm
                      placeholder="Maintenance Description"
                      labelname="Maintenance Description"
                      name="maintenance_describtion"
                      value={
                        crtMaintenance != null
                          ? crtMaintenance.maintenance_describtion
                          : formData.maintenance_describtion
                      }
                      onChange={(e) => handleChange(e, "maintenance_describtion")}
                    ></TextInputForm>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Col lg="12" className="align-self-center">
                <div className="text-center">
                  {crtMaintenance != null ? (
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
                            onClick={closeErrorModal}
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
                            onClick={closeErrorModal}
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
        <>
          <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header>
              <Modal.Title>
                {modeltitle} {labelname ? labelname : "Model"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <TextInputForm labelname={labelname} />
            </Modal.Body>
            <Modal.Footer>
              <ClickButton label={<>Cancel</>} onClick={handleCloseModal} />
              <ClickButton label={<>Submit</>} onClick={handleCloseModal} />
            </Modal.Footer>
          </Modal>
        </>
      </div>
    </>

  );
};

export default Maintenance;
