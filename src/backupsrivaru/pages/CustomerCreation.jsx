import React, { useState, useEffect } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import PageNav from "../components/PageNav";
import { DropDown, DropDownUI, TextInputForm } from "../components/Forms";
import { VscEyeClosed } from "react-icons/vsc";
import { ClickButton, Delete } from "../components/ClickButton";
import { BiPlus } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Navigate } from "react-router-dom";
const DropList = [
  {
    value: "tamilnadu",
    label: "tamilnadu",
  },
  {
    value: "kerala",
    label: "kerala",
  },
];
const CustomerCreation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const initialState =
    type === "edit"
      ? { ...rowData, customergroupname_id: rowData.customergroupname_id }
      : {
          customer_unique_id: "",
          customer_name: "",
          customer_id: "",
          customergroupname_id: "",
          pan_no: "",
          gst_no: "",
          customer_user_id: "",
          password: "",
          street: "",
          city: "",
          state: "",
          postal_code: "",
          country: "",
          contact: [
            {
              contact_person: "",
              job_role: "",
              phone_no: "",
              email: "",
            },
          ],
          ship_address: [
            {
              ship_street: "",
              ship_city: "",
              ship_state: "",
              ship_pincode: "",
              ship_country: "",
            },
          ],
        };
  const [formData, setFormData] = useState(initialState);
  console.log("formData", formData);
  const handleChange = (e, fieldName, index = null) => {
    const value = e.target ? e.target.value : e.value;

    if (index !== null) {
      const updatedship_address = formData.ship_address.map((address, i) =>
        i === index ? { ...address, [fieldName]: value } : address
      );
      setFormData({
        ...formData,
        ship_address: updatedship_address,
      });
    } else {
      setFormData({
        ...formData,
        [fieldName]: value,
      });
    }
  };
  const handleChanges = (e, fieldName, index = null) => {
    const value = e.target ? e.target.value : e.value;

    if (index !== null) {
      const updatedcontact = formData.contact.map((address, i) =>
        i === index ? { ...address, [fieldName]: value } : address
      );
      setFormData({
        ...formData,
        contact: updatedcontact,
      });
    } else {
      setFormData({
        ...formData,
        [fieldName]: value,
      });
    }
  };
  const addNewShipAddress = () => {
    setFormData({
      ...formData,
      ship_address: [
        ...formData.ship_address,
        {
          ship_street: "",
          ship_city: "",
          ship_state: "",
          ship_pincode: "",
          ship_country: "",
        },
      ],
    });
  };
  const addNewContact = () => {
    setFormData({
      ...formData,
      contact: [
        ...formData.contact,
        {
          contact_person: "",
          job_role: "",
          phone_no: "",
          email: "",
        },
      ],
    });
  };
  const deleteShipAddress = (index) => {
    const resetAddress = {
      ship_street: "",
      ship_city: "",
      ship_state: "",
      ship_pincode: "",
      ship_country: "",
    };

    if (formData.ship_address.length > 1) {
      const updatedship_address = formData.ship_address.filter(
        (_, i) => i !== index
      );
      setFormData({
        ...formData,
        ship_address: updatedship_address,
      });
    } else {
      setFormData({
        ...formData,
        ship_address: formData.ship_address.map((address, i) =>
          i === index ? resetAddress : address
        ),
      });
      toast.info("Resetting the last shipping address");
    }
  };
  const deleteContact = (index) => {
    const resetAddress = {
      contact_person: "",
      job_role: "",
      phone_no: "",
      email: "",
    };

    if (formData.contact.length > 1) {
      const updatedcontact = formData.contact.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        contact: updatedcontact,
      });
    } else {
      setFormData({
        ...formData,
        contact: formData.contact.map((address, i) =>
          i === index ? resetAddress : address
        ),
      });
      toast.info("Resetting the last shipping address");
    }
  };
  const handleKeyPress = (e, index) => {
    if (e.key === "Enter") {
      if (
        formData.ship_address[index].ship_street &&
        formData.ship_address[index].ship_city
      ) {
        // Only add a new row if both JewelName and weight are filled
        addNewShipAddress();
      } else {
        // Optionally, you can display a toast or alert indicating that both fields are required
        toast.error(
          "Please fill in both JewelName and weight before adding a new row"
        );
      }
    }
  };
  const handleKeyPres = (e, index) => {
    if (e.key === "Enter") {
      if (
        formData.contact[index].contact_person &&
        formData.contact[index].job_role
      ) {
        // Only add a new row if both JewelName and weight are filled
        addNewContact();
      } else {
        // Optionally, you can display a toast or alert indicating that both fields are required
        toast.error(
          "Please fill in both JewelName and weight before adding a new row"
        );
      }
    }
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
      const response = await fetch(
        "https://api.demos.srivarugreenenergy.com/customer/create.php",
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

      console.log("responseData", responseData);

      if (responseData.status === 200) {
        successAlert(responseData.msg);
        setTimeout(() => {
          navigate("/console/master/customer");
        }, 2000);
      } else if (responseData.status === 400) {
        errorAlert(responseData.msg);
        // toast.error('Missing required fields!', {
        //     position: "top-center",
        //     autoClose: 2000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     progress: undefined,
        //     theme: "colored",
        // });
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
        "https://api.demos.srivarugreenenergy.com/customer/update.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Include the company ID in the request
            customer_unique_id: formData.customer_unique_id,
            customer_name: formData.customer_name,
            customer_id: formData.customer_id,
            pan_no: formData.pan_no,
            gst_no: formData.gst_no,
            customer_user_id: formData.customer_user_id,
            customergroupname_id: formData.customergroupname_id,
            password: formData.password,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            country: formData.country,
            contact: formData.contact,
            ship_address: formData.ship_address,
          }),
        }
      );
      console.log(
        "kannaupdate",
        JSON.stringify({
          // Include the company ID in the request
          customer_unique_id: formData.customer_unique_id,
          customer_name: formData.customer_name,
          customer_id: formData.customer_id,
          pan_no: formData.pan_no,
          gst_no: formData.gst_no,
          customer_user_id: formData.customer_user_id,
          customergroupname_id: formData.customergroupname_id,
          password: formData.password,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          contact: formData.contact,
          ship_address: formData.ship_address,
        })
      );
      if (!response.ok) {
        throw new Error("Failed to update company");
      }

      const responseData = await response.json();
      console.log("UpdateresponseData", responseData);

      if (responseData.status === 200) {
        successAlert(responseData.msg);
        setTimeout(() => {
          navigate("/console/master/customer");
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
  const [customerGroup, setCustomerGroup] = useState([]);
  console.log("customerGroup", customerGroup);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://api.demos.srivarugreenenergy.com/customergroup/list.php",
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
        setCustomerGroup(responseData.data.customer_group);
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
  }, []);
  return (
    <div id="main">
      <Container fluid>
        <Row className="regular">
          <Col lg="12" md="12" xs="12" className="py-3">
            <PageNav
              pagetitle={
                type === "edit" ? "Edit Customer" : "Customer Creation"
              }
            ></PageNav>
          </Col>
          <Col lg="4" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Customer Name"}
              labelname={"Customer Name"}
              name="customer_name"
              value={formData.customer_name}
              onChange={(e) => handleChange(e, "customer_name")}
            ></TextInputForm>
          </Col>
          <Col lg="4" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Customer ID"}
              labelname={"Customer ID"}
              name="customer_id"
              value={formData.customer_id}
              onChange={(e) => handleChange(e, "customer_id")}
            ></TextInputForm>
          </Col>

          <Col lg="4" md="4" xs="12" className="py-3">
            <DropDownUI
              optionlist={customerGroup.map((user) => ({
                value: user.customergroup_uniq_id,
                label: user.customergroup_name,
              }))}
              placeholder="CustomerGroup Name"
              labelname="CustomerGroup Name"
              name="customergroupname_id"
              value={formData}
              onChange={(updatedFormData) =>
                setFormData({
                  ...formData,
                  customergroupname_id: updatedFormData.customergroupname_id,
                })
              }
            />
            {/* <DropDown
                             optionlist={customerGroup.map(user => ({
                                value: user.customergroup_uniq_id,
                                label: user.customergroup_name
                            }))}
                            placeholder=' Contract Type'
                            labelname='Contract Type'
                            name='customergroupname_id'
                            value={formData.customergroupname_id}
                            onChange={(updatedFormData) => setFormData({ ...formData, customergroupname_id: updatedFormData.customergroupname_id })}
                           
                        ></DropDown> */}
          </Col>
          <Col lg="4" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"PAN No"}
              labelname={"PAN NO"}
              name="pan_no"
              value={formData.pan_no}
              onChange={(e) => handleChange(e, "pan_no")}
            ></TextInputForm>
          </Col>
          <Col lg="4" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"GST No."}
              labelname={"GST No."}
              name="gst_no"
              value={formData.gst_no}
              onChange={(e) => handleChange(e, "gst_no")}
            ></TextInputForm>
          </Col>
          <Col lg="4" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Customer User ID"}
              labelname={"Customer User ID"}
              name="customer_user_id"
              value={formData.customer_user_id}
              onChange={(e) => handleChange(e, "customer_user_id")}
            ></TextInputForm>
          </Col>
          <Col lg="4" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Password"}
              suffix_icon={<VscEyeClosed />}
              labelname={"Password"}
              name="password"
              value={formData.password}
              onChange={(e) => handleChange(e, "password")}
            ></TextInputForm>
          </Col>
          <Col lg="12" md="12" xs="12" className="py-3 align-self-center">
            <div className=""> Address Details</div>
          </Col>
          {/* <Col lg='6' md='6' xs='6' className='py-3 align-self-center '>
                        <div className='text-end'>
                            <ClickButton label={<BiPlus />}></ClickButton>
                        </div>
                    </Col> */}
          <Col lg="6" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Street"}
              labelname={"Street"}
              name="street"
              value={formData.street}
              onChange={(e) => handleChange(e, "street")}
            ></TextInputForm>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"City"}
              labelname={"City"}
              name="city"
              value={formData.city}
              onChange={(e) => handleChange(e, "city")}
            ></TextInputForm>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"State"}
              labelname={"State"}
              name="state"
              value={formData.state}
              onChange={(e) => handleChange(e, "state")}
            ></TextInputForm>
          </Col>
          <Col lg="4" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"postal code"}
              labelname={"Postal Code"}
              name="postal_code"
              value={formData.postal_code}
              onChange={(e) => handleChange(e, "postal_code")}
            ></TextInputForm>
          </Col>
          <Col lg="4" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"country"}
              labelname={"country"}
              name="country"
              value={formData.country}
              onChange={(e) => handleChange(e, "country")}
            ></TextInputForm>
          </Col>
          <Col lg="4" className="py-3"></Col>
          <Col lg="6" md="6" xs="6" className="py-4 align-self-center">
            <div>Contact Person Details </div>
          </Col>
          <Col lg="12">
            <Table>
              <thead>
                <tr>
                  <th>S.no</th>
                  <th>Name</th>
                  <th>Job Role</th>
                  <th>phone No.</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {formData.contact.map((address, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <TextInputForm
                        placeholder={"Contact Person"}
                        labelname={"Contact Person"}
                        name="contact_person"
                        value={address.contact_person}
                        onChange={(e) =>
                          handleChanges(e, "contact_person", index)
                        }
                        onKeyPress={(e) => handleKeyPres(e, index)}
                      ></TextInputForm>
                    </td>
                    <td>
                      <TextInputForm
                        placeholder={"Job Role"}
                        labelname={" Job Role"}
                        name="job_role"
                        value={address.job_role}
                        onChange={(e) => handleChanges(e, "job_role", index)}
                        onKeyPress={(e) => handleKeyPres(e, index)}
                      ></TextInputForm>
                    </td>
                    <td>
                      <TextInputForm
                        placeholder={"Phone No."}
                        labelname={"Phone No."}
                        name="phone_no"
                        value={address.phone_no}
                        onChange={(e) => handleChanges(e, "phone_no", index)}
                      ></TextInputForm>
                    </td>
                    <td>
                      <TextInputForm
                        placeholder={"email"}
                        labelname={"Email"}
                        name="email"
                        value={address.email}
                        onChange={(e) => handleChanges(e, "email", index)}
                      ></TextInputForm>
                    </td>
                    <td>
                      <div className="">
                        <ClickButton
                          label={<>AddMore</>}
                          onClick={addNewContact}
                        ></ClickButton>
                      </div>
                    </td>
                    <td>
                      <div className="">
                        <Delete
                          label={<MdDeleteForever />}
                          onClick={() => deleteContact(index)}
                        >
                          Delete
                        </Delete>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
          <Col lg="12" md="12" xs="12" className="py-3 align-self-center">
            <div> Ship Address Details</div>
          </Col>
          <Col lg="12">
            {/* ship address Table start */}
            <Table>
              <thead>
                <tr>
                  <th>S.NO</th>
                  <th>Street</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Postal Code</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                {formData.ship_address.map((address, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <TextInputForm
                        name="ship_street"
                        value={address.ship_street}
                        onChange={(e) => handleChange(e, "ship_street", index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                      ></TextInputForm>
                    </td>
                    <td>
                      <TextInputForm
                        name="ship_city"
                        value={address.ship_city}
                        onChange={(e) => handleChange(e, "ship_city", index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                      ></TextInputForm>
                    </td>
                    <td className="tw-25">
                      <DropDownUI
                        optionlist={DropList}
                        placeholder="ShipState"
                        name="ship_state"
                        value={address}
                        onChange={(updatedFormData) =>
                          setFormData({
                            ...formData,
                            ship_address: formData.ship_address.map((r, i) =>
                              i === index
                                ? {
                                    ...r,
                                    ship_state: updatedFormData.ship_state,
                                  }
                                : r
                            ),
                          })
                        }
                      />
                    </td>
                    <td>
                      <TextInputForm
                        name="ship_pincode"
                        value={address.ship_pincode}
                        onChange={(e) => handleChange(e, "ship_pincode", index)}
                      ></TextInputForm>
                    </td>
                    <td>
                      <TextInputForm
                        name="ship_country"
                        value={address.ship_country}
                        onChange={(e) => handleChange(e, "ship_country", index)}
                      ></TextInputForm>
                    </td>
                    <td>
                      <div className="">
                        <ClickButton
                          label={<>AddMore</>}
                          onClick={addNewShipAddress}
                        ></ClickButton>
                      </div>
                    </td>
                    <td>
                      <div className="">
                        <Delete
                          label={<MdDeleteForever />}
                          onClick={() => deleteShipAddress(index)}
                        >
                          Delete
                        </Delete>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {/* ship address Table end*/}
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
                        onClick={() => navigate("/console/master/customer")}
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
                        onClick={() => navigate("/console/master/customer")}
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
  );
};

export default CustomerCreation;
