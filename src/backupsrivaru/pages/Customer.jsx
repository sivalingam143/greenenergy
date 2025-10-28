import React, { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { FaMagnifyingGlass } from "react-icons/fa6";
import TableUI from "../components/Table";
import Pagnation from "../components/Pagnation";
import { Buttons, ClickButton } from "../components/ClickButton";
import { TextInputForm } from "../components/Forms";
import { useNavigate } from "react-router-dom";
import MobileView from "../components/MobileView";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { IoMdCloseCircle } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { MdOutlineClose } from "react-icons/md";
import { PageTitle } from "../components/PageTitle";
const UserTablehead = [
  "No",
  "Customer ID",
  "Customer Name",
  "Customer Group Name",
  "User Name",
  "Password",
];
const Customer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const initialState =
    type === "edit"
      ? { ...rowData }
      : {
        customer_unique_id: "",
        customer_name: "",
        city: "",
      };
  const [formData, setFormData] = useState(initialState);
  const handleChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;
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
  const [userData, setUserData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState({
    search_text: "",
    customer_name: "",
    city: "",
  });

  const handleChanges = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;
    setFilterData({
      ...filterData,
      [fieldName]: value,
    });
  };
  const [searchText, setSearchText] = useState("");
  const handleSearch = (value) => {
    setSearchText(value);

  };
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://api.demos.srivarugreenenergy.com/customer/list.php",
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
        setUserData(responseData.data.customer);
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData(); // Call fetchData directly in useEffect
  }, [searchText]);

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
            <Col lg="7" md="4" xs="6">
              <div className="page-nav py-3">
                <span class="nav-list">Customer</span>
              </div>
            </Col>
            <Col lg="5" md="3" xs="6" className="align-self-center text-end">
              <ClickButton
                label={<>Add New</>}
                onClick={() => navigate("/master/customer/create")}
              ></ClickButton>
            </Col>
            <Col lg="3" md="5" xs="12" className="py-1">
              <TextInputForm
                placeholder={"Customer Name"}
                onChange={(e) => handleSearch(e.target.value)}
                prefix_icon={<FaMagnifyingGlass />}
                labelname={" Search Customer Name"}
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
                      <PageTitle PageTitle={<>Customer</>} />
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
                          placeholder={"Customer Name"}
                          labelname={"Customer Name"}
                          name="customer_name"
                          value={filterData.search_text}
                          onChange={(e) => handleChanges(e, "search_text")}
                        ></TextInputForm>
                      </Col>
                      <Col lg="12" md="12" xs="12" className="py-3">
                        <TextInputForm
                          placeholder={"City"}
                          labelname={"City"}
                          name="city"
                          value={filterData.city}
                          onChange={(e) => handleChanges(e, "city")}
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
                  type="customer"
                  pageview={"yes"}
                  onDelete={fetchData}
                  style={{ borderRadius: "5px" }}
                  onSort={handleSort}
                />
                {/* <MobileView sno={"01"} FactoryName={"Anand Fireworks"} Place={"Vettrilaiyurani"}></MobileView> */}
              </div>
            </Col>
            {/* <Col lg={12} md={12} xs={12}>
                        <Pagnation></Pagnation>
                    </Col> */}
          </Row>
        </Container>
      </div>
    </>

  );
};

export default Customer;
