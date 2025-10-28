import React, { useState, useEffect } from "react";
import { Container, Col, Row, Spinner, Modal } from "react-bootstrap";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Pagnation from "../components/Pagnation";
import { useNavigate, Navigate } from "react-router-dom";
import {
  TextInputForm,
  DropDown,
  Calender,
  DropDownUI,
} from "../components/Forms";
import TableUI from "../components/Table";
import { ClickButton, Buttons } from "../components/ClickButton";
import Offcanvas from "react-bootstrap/Offcanvas";
import { IoMdCloseCircle } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { MdOutlineClose } from "react-icons/md";
import { PageTitle } from "../components/PageTitle";
import { VscEyeClosed, VscEye } from "react-icons/vsc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment/moment";
import PageNav from "../components/PageNav";
const UserTablehead = ["No", "User Name", " Mobile Number"];
const SiteName = [
  {
    value: "8777hhhghhjkhsdfkj87587857",
    label: "Admin",
  },
];
const User = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
    setCrtUsers(null);
    setSelectedImage(null);
    setSelectedSignImage(null)
  };
  const handleShowModal = () => setShowModal(true);

  const [showModalLocation, setShowModalLocation] = useState(false);
  const handleCloseModalLoaction = () => setShowModalLocation(false);
  const handleShowModalLocation = () => setShowModalLocation(true);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleLoad = () => {
    window.location.reload();
  };
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSignImage, setSelectedSignImage] = useState(null);
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const [formData, setFormData] = useState({
    user_id: "",
    date_of_joining: "",
    user_name: "",
    mobile_number: "",
    role_id: "",
    address: "",
    date_of_birth: "",
    login_id: "",
    password: "",
    profile_image: '',
    sign_image: ''

  });// profile_image,sign_image
  console.log("formData", formData);
  const [siteForm, setSiteForm] = useState({
    role_name: "",
  });
  const handleChangeSite = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;

    setSiteForm({
      ...siteForm,
      [fieldName]: value,
    });
  };
  // const handleFileChangecustomerphoto = (event, inputName) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file);
  //     setSelectedImage(imageUrl);
  //     // Set the file in formData
  //     setFormData(prevState => ({
  //       ...prevState,
  //       profile_image: file,
  //     }));
    
  //     setCrtUsers(prevState => ({
  //       ...prevState,
  //       profile_image: file,
  //     }));
  //   }
  // };
  // const handleFileChangeSignImage = (event, inputName) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file);
  //     setSelectedSignImage(imageUrl);
  //     // Set the file in formData
 
  //     setFormData(prevState => ({
  //       ...prevState,
  //       sign_image: file,
  //     }));
    
  //     setCrtUsers(prevState => ({
  //       ...prevState,
  //       sign_image: file,
  //     }));
  //   }
  // };
  
  
  const handleFileChangecustomerphoto = (event, inputName) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      
      // Set the file in formData
      setFormData(prevState => ({
        ...prevState,
        profile_image: file,
      }));
      
      // Update crtUsers if it's not null
      if (crtUsers !== null) {
        setCrtUsers(prevState => ({
          ...prevState,
          profile_image: file,
        }));
      }
    }
  };
  
  const handleFileChangeSignImage = (event, inputName) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedSignImage(imageUrl);
      
      // Set the file in formData
      setFormData(prevState => ({
        ...prevState,
        sign_image: file,
      }));
      
      // Update crtUsers if it's not null
      if (crtUsers !== null) {
        setCrtUsers(prevState => ({
          ...prevState,
          sign_image: file,
        }));
      }
    }
  };
  const [crtUsers, setCrtUsers] = useState(null);
  console.log("crtUsersssss", crtUsers)
  const handleEditClick = (rowdata) => {
    console.log("rowDatasss", rowData)
    setCrtUsers({
      ...rowdata, 
      profile_image: rowdata.profile_image, 
      sign_image: rowdata.sign_image, 
    });
    setSelectedImage(`https://greenenergy.zentexus.in/api/user/${rowdata.profile_image}`);
    setSelectedSignImage(`https://greenenergy.zentexus.in/api/user/${rowdata.sign_image}`);
    setShowModal(true);
  };
  const handleChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;
    if (crtUsers != null) {
      setCrtUsers({
        ...crtUsers,
        [fieldName]: value,
      });
    }
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };
  const setLabel = (value, field) => {
    if(crtUsers !=null){
      setCrtUsers({
        ...crtUsers,
        [field]: moment(value).format("YYYY-MM-DD"), 
      });
    }
    setFormData({
      ...formData,
      [field]: moment(value).format("YYYY-MM-DD"),
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
    setLoading(true);
    try {
      const response = await fetch(
        "https://greenenergy.zentexus.in/api/user/list.php",
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
        setUserData(responseData.data.user);
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
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
  // const handleSubmit = async () => {
  //   try {
  //     if (formData.user_name === "" || formData.mobile_number === "") {
  //       if (formData.user_name === "") {
  //         errorAlert("Name is Must");
  //       }
  //     } else {
  //       const response = await fetch(
  //         "https://greenenergy.zentexus.in/api/user/create.php",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(formData),
  //         }
  //       );
  //       console.log(formData);
  //       const responseData = await response.json();

  //       console.log("responseData", responseData);

  //       if (responseData.status === 200) {
  //         setFormData({
  //           date_of_joining: "",
  //           user_name: "",
  //           mobile_number: "",
  //           role_id: "",
  //           address: "",
  //           data_of_birth: "",
  //           login_id: "",
  //           password: "",
  //         });
  //         fetchData();
  //         successAlert(responseData.msg);
  //         setTimeout(() => {
  //           handleCloseModal();
  //         }, 2000);
  //       } else if (responseData.status === 400) {
  //         toast.error("Missing required fields!", {
  //           position: "top-center",
  //           autoClose: 2000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           progress: undefined,
  //           theme: "colored",
  //         });
  //       } else {
  //         setShowAlert(true);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  const handleSubmit = async () => {
    try {
      if (formData.user_name === "" || formData.mobile_number === "") {
        if (formData.user_name === "") {
          errorAlert("Name is Must");
        }
      } else {
        // Create a FormData object
        const formDataToSend = new FormData();
        for (const key in formData) {
          if (formData.hasOwnProperty(key)) {
            formDataToSend.append(key, formData[key]);
          }
        }

        const response = await fetch(
          "https://greenenergy.zentexus.in/api/user/create.php",
          {
            method: "POST",
            body: formDataToSend, // Send the FormData object
          }
        );

        console.log(formData);
        const responseData = await response.json();

        console.log("responseData", responseData);

        if (responseData.status === 200) {
          setFormData({
            date_of_joining: "",
            user_name: "",
            mobile_number: "",
            role_id: "",
            address: "",
            data_of_birth: "",
            login_id: "",
            password: "",
          });
          fetchData();
          successAlert(responseData.msg);
          setTimeout(() => {
            handleCloseModal();
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
      // Create a FormData object
      const formDataToSend = new FormData();
      
      // Append each field from formData and crtUsers
      formDataToSend.append("user_id", crtUsers.user_id); // Append user_id from crtUsers
      formDataToSend.append("date_of_joining", crtUsers.date_of_joining);
      formDataToSend.append("user_name", crtUsers.user_name);
      formDataToSend.append("mobile_number", crtUsers.mobile_number);
      formDataToSend.append("role_id", crtUsers.role_id);
      formDataToSend.append("address", crtUsers.address);
      formDataToSend.append("date_of_birth", crtUsers.date_of_birth);
      formDataToSend.append("login_id", crtUsers.login_id);
      formDataToSend.append("password", crtUsers.password);
  
      // Append images if they are updated
      if (crtUsers.profile_image && typeof crtUsers.profile_image === 'object') {
        formDataToSend.append("profile_image", crtUsers.profile_image); // Append profile image
      }
      
      if (crtUsers.sign_image && typeof crtUsers.sign_image === 'object') {
        formDataToSend.append("sign_image", crtUsers.sign_image); // Append sign image
      }
  
      // Send the FormData in the request
      const response = await fetch(
        "https://greenenergy.zentexus.in/api/user/update.php",
        {
          method: "POST",
          body: formDataToSend, // Send the FormData object
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
  
      const responseData = await response.json();
      console.log("responseData", responseData);
  
      if (responseData.status === 200) {
        setCrtUsers(null); // Reset current user data after success
        fetchData(); // Call your fetchData function to refresh the data
        successAlert(responseData.msg); // Display success message
  
        setTimeout(() => {
          handleCloseModal(); // Close the modal after a delay
        }, 2000);
      } else {
        console.error(responseData.msg || "Unknown error occurred during update");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  


  // const handleUpdateSubmit = async () => {
  //   try {
  //     var data = {
  //       user_id: crtUsers.user_id,
  //       date_of_joining: crtUsers.date_of_joining,
  //       user_name: crtUsers.user_name,
  //       mobile_number: crtUsers.mobile_number,
  //       role_id: crtUsers.role_id,
  //       address: crtUsers.address,
  //       date_of_birth: crtUsers.date_of_birth,
  //       login_id: crtUsers.login_id,
  //       profile_image: crtUsers.profile_image,
  //       sign_image: crtUsers.sign_image,
  //     };
  //     console.log("ji", data);
  //     const response = await fetch(
  //       "https://greenenergy.zentexus.in/api/user/update.php",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           // Include the company ID in the request
  //           user_id: crtUsers.user_id,
  //           date_of_joining: crtUsers.date_of_joining,
  //           user_name: crtUsers.user_name,
  //           mobile_number: crtUsers.mobile_number,
  //           role_id: crtUsers.role_id,
  //           address: crtUsers.address,
  //           date_of_birth: crtUsers.date_of_birth,
  //           login_id: crtUsers.login_id,
  //           password: crtUsers.password,
  //           profile_image: crtUsers.profile_image,
  //           sign_image: crtUsers.sign_image,
  //         }),
  //       }
  //     );
  //     console.log(
  //       "post",
  //       JSON.stringify({
  //         // Include the company ID in the request
  //         data,
  //       })
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to update company");
  //     }

  //     const responseData = await response.json();
  //     console.log("responseData", responseData);

  //     if (responseData.status === 200) {
  //       setCrtUsers("");
  //       fetchData();
  //       successAlert(responseData.msg);
  //       setTimeout(() => {
  //         handleCloseModal();
  //       }, 2000);

  //       // Navigate to the user list page after a delay
  //     } else {
  //       console.error(
  //         responseData.msg || "Unknown error occurred during update"
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error updating product:", error.msg);
  //   }

  //   setLoading(false);
  // };
  const [roleData, setRoleData] = useState([]);
  console.log("userData", userData);
  const fetchDataRole = async () => {
    try {
      const response = await fetch(
        "https://greenenergy.zentexus.in/api/role/list.php",
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
        setRoleData(responseData.data.role);
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  useEffect(() => {
    fetchDataRole(); // Call fetchData directly in useEffect
  }, []);

  const handleSubmitRole = async () => {
    try {
      if (formData.role_name === "") {
        if (formData.role_name === "") {
          errorAlert("Name is Must");
        }
      } else {
        const response = await fetch(
          "https://greenenergy.zentexus.in/api/role/create.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(siteForm),
          }
        );
        console.log(siteForm);
        const responseData = await response.json();

        console.log("responseData", responseData);

        if (responseData.status === 200) {
          const newSite = responseData.data;

          console.log("newSite", newSite);

          successAlert(responseData.msg);
          setTimeout(() => {
            handleCloseModalLoaction();
          }, 2000);
          await fetchDataRole();
          setFormData({
            ...formData,
            role_id: newSite.role_id, // Assuming `site_id` is returned in the response
          });
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
  // const [isLoggedIn, setIsLoggedIn] = useState(true);

  // useEffect(() => {
  //   const checkSession = async () => {
  //     try {
  //       // Check session logic here, e.g., fetch from local storage or server
  //       const session = localStorage.getItem("user");
  //       if (!session) {
  //         setIsLoggedIn(false);
  //       }
  //     } catch (error) {
  //       console.error("Error checking session:", error.message);
  //       setIsLoggedIn(false);
  //     }
  //   };
  //   checkSession();
  // }, []);

  // if (!isLoggedIn) {
  //   return <Navigate to="/login" replace />;
  // }

  return (
    <>
    <div id="main">
      <Container fluid>
        <Row>
          <Col lg="7" md="4" xs="6">
            <div className="page-nav py-3">
              <span class="nav-list"> Users</span>
            </div>
          </Col>
          <Col lg="5" md="3" xs="6" className="align-self-center text-end">
            <ClickButton
              label={<>Add New</>}
              onClick={setShowModal}
            ></ClickButton>
          </Col>
          <Col lg="3" md="5" xs="12" className="py-1">
            <TextInputForm
              placeholder={"User"}
              onChange={(e) => handleSearch(e.target.value)}
              prefix_icon={<FaMagnifyingGlass />}
              labelname={"Search User"}
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
                    <PageTitle PageTitle={<>User Filter</>} />
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
                        placeholder={"Name"}
                        labelname={"Name"}
                        name="name"
                        value={formData.name}
                        onChange={(e) => handleChange(e, "name")}
                      ></TextInputForm>
                    </Col>
                    <Col lg="12" md="12" xs="12" className="py-3">
                      <TextInputForm
                        placeholder={"Mobile Number"}
                        labelname={" Mobile No."}
                        name="mobile_no"
                        value={formData.mobile_no}
                        onChange={(e) => handleChange(e, "mobile_no")}
                      ></TextInputForm>
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
                type="USER"
                pageview={"yes"}
                handleEditClick={handleEditClick}
                onDelete={fetchData}
                style={{ borderRadius: "5px" }}
              />
            </div>
          </Col>
        </Row>
      </Container>
      <>
        <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
          <Modal.Header>
            <Modal.Title>{crtUsers?'Edit Creation':'User Creation'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container fluid>
              <Row>
                <Col lg="12" md="12" xs="12">
                  {/* <div className='page-nav text-end py-3'>
                    <PageNav pagetitle={`User ${type === 'view' ? 'View' : type === 'edit' ? 'Edit' : ''}Creation`}></PageNav>
                  </div> */}
                </Col>
                <Col lg="12" md="12" xs="12" className="d-flex justify-content-center">
                  <div style={{ position: "relative", display: "inline-block" }}>ProfileImage
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChangecustomerphoto}
                      style={{
                        display: "none", // Hide the default input
                      }}
                      id="file-upload" // ID for label reference
                    />
                    <label
                      htmlFor="file-upload"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "80px", // Adjust the size as needed
                        height: "80px", // Adjust the size as needed
                        borderRadius: "50%", // Makes the label round
                        border: "2px solid #000", // Optional: border for the round input
                        backgroundColor: "#f0f0f0", // Background color
                        cursor: "pointer",
                      }}
                    >
                      {selectedImage ? (
                        <img
                          src={selectedImage}
                          alt="Selected"
                          style={{
                            width: "100%", // Ensures the image fills the container
                            height: "100%", // Ensures the image fills the container
                            borderRadius: "50%", // Make image round
                            objectFit: "cover", // Ensures the image covers the entire circle
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: "20px" }}>+</span> // Optional: plus icon for uploading
                      )}
                    </label>
                  </div>
                </Col>
                <Col lg="4" md="4" xs="12" className="py-3">
                  <div className="w-100">
                    <Calender
                      setLabel={(date) => setLabel(date, "date_of_joining")}
                      selectedDate={
                        crtUsers != null
                          ? crtUsers.date_of_joining
                          : formData.date_of_joining
                      }
                      calenderlabel="Date Of Joining"
                    />
                  </div>
                </Col>
                <Col lg="4" md="4" xs="12" className="py-3">
                  <TextInputForm
                    placeholder={"Name"}
                    labelname={"Name"}
                    name="user_name"
                    value={
                      crtUsers != null ? crtUsers.user_name : formData.user_name
                    }
                    onChange={(e) => handleChange(e, "user_name")}
                  ></TextInputForm>
                </Col>
                <Col lg="4" md="4" xs="12" className="py-3">
                  <TextInputForm
                    placeholder={"Mobile Number"}
                    labelname={" Mobile No."}
                    name="mobile_number"
                    value={
                      crtUsers != null
                        ? crtUsers.mobile_number
                        : formData.mobile_number
                    }
                    onChange={(e) => handleChange(e, "mobile_number")}
                  ></TextInputForm>
                </Col>

                <Col lg="4" md="4" xs="12" className="py-3">
                  <DropDown
                    optionlist={roleData.map((user) => ({
                      value: user.role_id,
                      label: user.role_name,
                    }))}
                    placeholder="Role Name"
                    labelname="Role Name"
                    name="role_id"
                    value={
                      crtUsers != null ? crtUsers.role_id : formData.role_id
                    }
                    onChange={(updatedFormData) => {
                      if (crtUsers != null) {
                        setFormData({
                          ...formData,
                          role_id: updatedFormData.role_id,
                        });
                      } else {
                        setFormData({
                          ...formData,
                          role_id: updatedFormData.role_id,
                        });
                      }
                    }}
                    onClick={handleShowModalLocation}
                  ></DropDown>
                </Col>
                <Col lg="4" md="4" xs="12" className="py-3">
                  <div>
                    <label>Address</label>
                  </div>
                  <div>
                    <textarea
                      className="form-cntrl w-100"
                      placeholder={"Address"}
                      name="address"
                      value={
                        crtUsers != null ? crtUsers.address : formData.address
                      }
                      onChange={(e) => handleChange(e, "address")}
                    />
                  </div>
                </Col>
                <Col lg="4" md="4" xs="12" className="py-3">
                  <div className="w-100">
                    <Calender
                      setLabel={(date) => setLabel(date, "date_of_birth")}
                      selectedDate={
                        crtUsers != null
                          ? crtUsers.date_of_birth
                          : formData.date_of_birth
                      }
                      calenderlabel="Date Of Birth"
                    />
                  </div>
                </Col>
                <Col lg="4" md="4" xs="12" className="py-3">
                  <TextInputForm
                    placeholder={"Login Id"}
                    labelname={"Login Id"}
                    name="login_id"
                    value={
                      crtUsers != null ? crtUsers.login_id : formData.login_id
                    }
                    onChange={(e) => handleChange(e, "login_id")}
                  ></TextInputForm>
                </Col>
                <Col lg="4" md="4" xs="12" className="py-3">
                  <TextInputForm
                    placeholder={"Password"}
                    suffix_icon={
                      showPassword ? (
                        <VscEye onClick={() => setShowPassword(false)} />
                      ) : (
                        <VscEyeClosed onClick={() => setShowPassword(true)} />
                      )
                    }
                    labelname={"Password"}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={
                      crtUsers != null ? crtUsers.password : formData.password
                    }
                    onChange={(e) => handleChange(e, "password")}
                  />
                </Col>
                <Col lg="4" md="4" xs="12" className="d-flex justify-content-center">
                  <div style={{ position: "relative", display: "inline-block" }}>SignImage
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChangeSignImage}
                      style={{
                        display: "none", // Hide the default input
                      }}
                      id="file-uploads" // ID for label reference
                    />
                    <label
                      htmlFor="file-uploads"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "80px", // Adjust the size as needed
                        height: "80px", // Adjust the size as needed
                        borderRadius: "50%", // Makes the label round
                        border: "2px solid #000", // Optional: border for the round input
                        backgroundColor: "#f0f0f0", // Background color
                        cursor: "pointer",
                      }}
                    >
                      {selectedSignImage ? (
                        <img
                          src={selectedSignImage}
                          alt="Selected"
                          style={{
                            width: "100%", // Ensures the image fills the container
                            height: "100%", // Ensures the image fills the container
                            borderRadius: "50%", // Make image round
                            objectFit: "cover", // Ensures the image covers the entire circle
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: "20px" }}>+</span> // Optional: plus icon for uploading
                      )}
                    </label>
                  </div>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Col lg="12" className="align-self-center">
              <div className="text-center">
                {crtUsers != null ? (
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
      <>
        <Modal
          show={showModalLocation}
          onHide={handleCloseModalLoaction}
          size="md"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Role</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col lg="12" md="12" xs="12" className="py-3">
                  <TextInputForm
                    placeholder={"Role"}
                    labelname={" Role"}
                    name="role"
                    value={siteForm.role_name}
                    onChange={(e) => handleChangeSite(e, "role_name")}
                  ></TextInputForm>
                </Col>
                <h1>kannan</h1>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Col lg="12" className="align-self-center">
              <div className="text-center">
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
                        onClick={handleSubmitRole}
                      ></ClickButton>
                    </span>
                    <span className="mx-2">
                      <ClickButton
                        label={<>Cancel</>}
                        onClick={handleCloseModalLoaction}
                      ></ClickButton>
                    </span>
                  </div>
                </>
              </div>
            </Col>
          </Modal.Footer>
        </Modal>
      </>
      </div>
    </>
  );
};

export default User;
