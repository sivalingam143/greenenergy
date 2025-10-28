import React, { useState } from "react";
import PageNav from "../Compnents/PageNav";
import { Container, Row, Col } from "react-bootstrap";
import { ClickButton } from "../Compnents/ClickButton";
import { TextInputForm, DropDown, Calender } from "../components/Forms";
import { useLocation } from "react-router-dom";
import { VscEyeClosed, VscEye } from "react-icons/vsc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Navigate } from "react-router-dom";
import moment from "moment/moment";
const DropList = [
  {
    value: "8777hhhghhjkhsdfkj87587857",
    label: "Admin",
  },
];
const UserCreation = () => {
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const initialState =
    type === "edit"
      ? { ...rowData }
      : {
          user_id: "",
          date_of_joining: "",
          user_name: "",
          mobile_number: "",
          role_id: "",
          address: "",
          date_of_birth: "",
          login_id: "",
          password: "",
        };
  const [formData, setFormData] = useState(initialState);
  console.log("formData", formData);
  const handleChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;

    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };
  const setLabel = (value, field) => {
    setFormData({
      ...formData,
      [field]: moment(value).format("YYYY-MM-DD"), // Update the specified field in formData with the provided value
    });
  };
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);
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
      if (formData.user_name === "" || formData.mobile_number === "") {
        if (formData.user_name === "") {
          errorAlert("Name is Must");
        } else if (formData.mobile_number === "") {
          errorAlert("Mobile Number is Must");
        }
      } else {
        const response = await fetch(
          "https://greenenergy.zentexus.in/api/user/create.php",
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
            date_of_joining: "",
            user_name: "",
            mobile_number: "",
            role_id: "",
            address: "",
            date_of_birth: "",
            login_id: "",
            password: "",
          });
          successAlert(responseData.msg);
          setTimeout(() => {
            navigate("/console/user");
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
      var data = {
        user_id: formData.user_id,
        date_of_joining: formData.date_of_joining,
        user_name: formData.user_name,
        mobile_number: formData.mobile_number,
        role_id: formData.role_id,
        address: formData.address,
        date_of_birth: formData.date_of_birth,
        login_id: formData.login_id,
        password: formData.password,
      };
      console.log("ji", data);
      const response = await fetch(
        "https://greenenergy.zentexus.in/api/user/update.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Include the company ID in the request
            user_id: formData.user_id,
            date_of_joining: formData.date_of_joining,
            user_name: formData.user_name,
            mobile_number: formData.mobile_number,
            role_id: formData.role_id,
            address: formData.address,
            date_of_birth: formData.date_of_birth,
            login_id: formData.login_id,
            password: formData.password,
          }),
        }
      );
      console.log(
        "post",
        JSON.stringify({
          // Include the company ID in the request
          user_id: formData.user_id,
          date_of_joining: formData.date_of_joining,
          user_name: formData.user_name,
          mobile_number: formData.mobile_number,
          role_id: formData.role_id,
          address: formData.address,
          date_of_birth: formData.date_of_birth,
          login_id: formData.login_id,
          password: formData.password,
        })
      );

      if (!response.ok) {
        throw new Error("Failed to update company");
      }

      const responseData = await response.json();
      console.log(responseData);

      if (responseData.status === 200) {
        toast.success("User updated successfully!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setTimeout(() => {
          navigate("/console/user");
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
    <>
      <div id="main">
        <Container fluid>
          <Row>
            <Col lg="12" md="12" xs="12">
              <div className="page-nav text-end py-3">
                <PageNav
                  pagetitle={`User ${
                    type === "view" ? "View" : type === "edit" ? "Edit" : ""
                  }Creation`}
                ></PageNav>
              </div>
            </Col>
            <Col lg="3" className="py-3">
              <div className="w-100">
                {type === "edit" ? (
                  <Calender
                    setLabel={(date) => setLabel(date, "date_of_joining")}
                    selectedDate={formData.date_of_joining}
                    calenderlabel="Date Of Joining"
                  />
                ) : (
                  ""
                )}
              </div>
            </Col>
            <Col lg="3" md="4" xs="12" className="py-3">
              {type === "edit" ? (
                <TextInputForm
                  placeholder={"Name"}
                  labelname={"Name"}
                  name="user_name"
                  value={formData.user_name}
                  onChange={(e) => handleChange(e, "user_name")}
                ></TextInputForm>
              ) : (
                ""
              )}
            </Col>
            <Col lg="3" md="4" xs="12" className="py-3">
              {type === "edit" ? (
                <TextInputForm
                  placeholder={"Mobile Number"}
                  labelname={" Mobile No."}
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={(e) => handleChange(e, "mobile_number")}
                ></TextInputForm>
              ) : (
                ""
              )}
            </Col>

            <Col lg="3" md="4" xs="12" className="py-3">
              {type === "edit" ? (
                <DropDown
                  optionlist={DropList}
                  placeholder="Role"
                  labelname="Role"
                  name="role_id"
                  value={formData.role_id}
                  onChange={(updatedFormData) => {
                    setFormData({
                      ...formData,
                      role_id: updatedFormData.role_id,
                    });
                  }}
                ></DropDown>
              ) : (
                ""
              )}
            </Col>
            <Col lg="3" className="py-3">
              <div>
                <label>Address</label>
              </div>
              {type === "edit" ? (
                <div>
                  <textarea
                    className="form-cntrl w-100"
                    placeholder={"Address"}
                    name="address"
                    value={formData.address}
                    onChange={(e) => handleChange(e, "address")}
                  />
                </div>
              ) : (
                ""
              )}
            </Col>
            <Col lg="3" className="py-3">
              <div className="w-100">
                {type === "edit" ? (
                  <Calender
                    setLabel={(date) => setLabel(date, "date_of_birth")}
                    selectedDate={formData.date_of_birth}
                    calenderlabel="Date Of Birth"
                  />
                ) : (
                  ""
                )}
              </div>
            </Col>
            <Col lg="3" md="4" xs="12" className="py-3">
              {type === "edit" ? (
                <TextInputForm
                  placeholder={"Login Id"}
                  labelname={"Login Id"}
                  name="login_id"
                  value={formData.login_id}
                  onChange={(e) => handleChange(e, "login_id")}
                ></TextInputForm>
              ) : (
                ""
              )}
            </Col>
            <Col lg="3" md="4" xs="12" className="py-3">
              {type === "edit" ? (
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
                  value={formData.password}
                  onChange={(e) => handleChange(e, "password")}
                />
              ) : (
                ""
              )}
            </Col>
            <Col lg="12" className="py-5 align-self-center">
              <div className="text-center">
                {type === "edit" ? (
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
                          onClick={() => navigate("/console/user")}
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
                          onClick={() => navigate("/console/user")}
                        ></ClickButton>
                      </span>
                    </div>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};
export default UserCreation;
