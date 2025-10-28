import React, { useState, useEffect } from "react";
import { Container, Col, Row, Modal } from "react-bootstrap";
import { FaAngleRight } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import TableUI from "../components/Table";
import { TextInputForm } from "../components/Forms";
import Pagnation from "../components/Pagnation";
import { Buttons, ClickButton } from "../components/ClickButton";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Navigate } from "react-router-dom";
import { MdOutlineClose } from "react-icons/md";
import { PageTitle } from "../components/PageTitle";
const UserTablehead = ["No", "Error Code", "Error Describtion"];
const Error = ({ modeltitle = "create", labelname = "Upload Excel" }) => {
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const [addError, setaddError] = useState(false);

  const closeErrorModal = () => {
    setaddError(false);
    setCrtError(null);
  };
  const openErrorModal = () => setaddError(true);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleLoad = () => {
    window.location.reload();
  };
  const initialState =
    type === "edit"
      ? { ...rowData }
      : {
        error_code: "",
        error_describtion: "",
      };
  const [formData, setFormData] = useState(initialState);
  console.log("formData", formData);
  const [crtError, setCrtError] = useState(null);
  console.log("crtError", crtError);
  const handleEditClick = (rowdata) => {
    setCrtError(rowdata);
    setaddError(true);
  };
  const handleChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;
    if (crtError != null) {
      setCrtError({
        ...crtError,
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
        "https://greenenergy.zentexus.in/api/error/list.php",
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
        setUserData(responseData.data.error);
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
      const response = await fetch(
        "https://greenenergy.zentexus.in/api/error/create.php",
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
          error_code: "",
          error_describtion: "",
        });
        fetchData();
        successAlert(responseData.msg);
        setTimeout(() => {
          closeErrorModal();
        }, 2000);
      } else if (responseData.status === 400) {
        errorAlert(responseData.msg);
      } else {
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleUpdateSubmit = async () => {
    try {
      const response = await fetch(
        "https://greenenergy.zentexus.in/api/error/update.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Include the company ID in the request
            error_id: crtError.error_id,
            error_code: crtError.error_code,
            error_describtion: crtError.error_describtion,
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

  const handleSort = (key, direction) => {
    const sortedData = [...userData].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setUserData(sortedData);
  };
  return (
    <>
      <div id="main">
        <Container fluid>
          <Row>
            <Col lg="7" md="6" xs="3" className="align-self-center">
              <div className="page-nav py-3">
                <span class="nav-list">Error</span>
              </div>
            </Col>
            <Col lg="5" md="6" xs="9" className="align-self-center py-3">
              <div className="d-flex justify-content-end">
                <div className="px-2">
                  <ClickButton
                    label={<>Add New</>}
                    className="create-btn "
                    onClick={openErrorModal}
                  ></ClickButton>
                </div>
                {/* <div className="px-2">
                <ClickButton
                  label={<>Upload Excel</>}
                  className="create-btn "
                  onClick={handleShowModal}
                ></ClickButton>
              </div> */}
              </div>
              <Modal show={showModal} onHide={handleCloseModal}>
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
            </Col>
            <Col lg="3" md="5" xs="12" className="py-1">
              <TextInputForm
                placeholder={"Error "}
                onChange={(e) => handleSearch(e.target.value)}
                prefix_icon={<FaMagnifyingGlass />}
                labelname={"Search Error"}
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
                      <PageTitle PageTitle={<>Error</>} />
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
                          placeholder="Error code"
                          labelname="Error code"
                          name="error_code"
                          value={formData.error_code}
                          onChange={(e) => handleChange(e, "error_code")}
                        ></TextInputForm>
                      </Col>
                      <Col lg="12" md="12" xs="12" className="py-3">
                        <TextInputForm
                          placeholder="Error Description"
                          labelname="Error Description"
                          name="error_describtion"
                          value={formData.error_describtion}
                          onChange={(e) => handleChange(e, "error_describtion")}
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
                  body={userData}
                  type="error"
                  pageview={"yes"}
                  handleEditClick={handleEditClick}
                  onDelete={fetchData}
                  style={{ borderRadius: "5px" }}
                  onSort={handleSort}
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
              <Modal.Title> {crtError ? 'Edit Error' : 'Error Create'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container fluid>
                <Row>
                  <Col lg="12" className="py-3">
                    <TextInputForm
                      placeholder="Error code"
                      labelname="Error code"
                      name="error_code"
                      value={
                        crtError != null
                          ? crtError.error_code
                          : formData.error_code
                      }
                      onChange={(e) => handleChange(e, "error_code")}
                    ></TextInputForm>
                  </Col>
                  <Col lg="12" className="py-3">
                    <TextInputForm
                      placeholder="Error Description"
                      labelname="Error Description"
                      name="error_describtion"
                      value={
                        crtError != null
                          ? crtError.error_describtion
                          : formData.error_describtion
                      }
                      onChange={(e) => handleChange(e, "error_describtion")}
                    ></TextInputForm>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Col lg="12" className="align-self-center">
                <div className="text-center">
                  {crtError != null ? (
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
      </div>
    </>

  );
};

export default Error;
