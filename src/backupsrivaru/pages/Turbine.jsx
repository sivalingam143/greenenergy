import React, { useState, useEffect, useRef } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { FaMagnifyingGlass } from "react-icons/fa6";
import TableUI from "../components/Table";
import { Buttons, ClickButton } from "../components/ClickButton";
import { TextInputForm } from "../components/Forms";
import { useNavigate, useLocation } from "react-router-dom";
import MobileView from "../components/MobileView";
import Offcanvas from "react-bootstrap/Offcanvas";
import { MdOutlineClose } from "react-icons/md";
import { PageTitle } from "../components/PageTitle";

// Table header
const UserTablehead = ["No", "Customer Name", "WTG NO", " LOC.No"];

const Turbine = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const initialState =
    type === "edit"
      ? { ...rowData }
      : {
          turbine_id: "",
          date: "",
          customer_id: "",
          customername_id: "",
          wtg_no: "",
          loc_no: "",
        };

  const [formData, setFormData] = useState(initialState);
  const [show, setShow] = useState(false);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const searchDebounce = useRef(null);

  // ----------- Event Handlers -------------

  const handleChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const handleClose = () => setShow(false);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  // ----------- Data Fetch Function ---------------

  const fetchData = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://greenenergy.zentexus.in/api/turbine/list.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // if this doesn't work, try removing or changing as per backend
          },
          body: JSON.stringify({ search_text: query }),
        }
      );
      const text = await response.text();
      // Debugging raw server response:
      console.log("Status:", response.status);
      console.log("Raw server response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        // If not JSON, show the HTML as an error
        setLoading(false);
        setUserData([]);
        console.error('Server response is not JSON. Raw:', text);
        alert("Server did not return valid data. Raw: " + text.slice(0, 200));
        return;
      }
      setLoading(false);
      if (data.status === 200) {
        setUserData(data.data.turbine);
      } else {
        setUserData([]);
        throw new Error(data.msg);
      }
    } catch (error) {
      setLoading(false);
      setUserData([]);
      console.error("Error fetching data:", error.message);
    }
  };

  // ----------- Debounced Search ---------------------
  useEffect(() => {
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      fetchData(searchText);
    }, 400);
    return () => clearTimeout(searchDebounce.current);
    // eslint-disable-next-line
  }, [searchText]);

  // --------- Initial fetch ----------------------
  useEffect(() => {
    fetchData("");
    // eslint-disable-next-line
  }, []);

  // ---------- Table sorting ------------------
  const handleSort = (key, direction) => {
    const sortedData = [...userData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
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
                <span className="nav-list">Turbine</span>
              </div>
            </Col>
            <Col lg="5" md="3" xs="6" className="align-self-center text-end">
              <ClickButton
                label={<>Add New</>}
                onClick={() => navigate("/master/turbine/create")}
              />
            </Col>
            <Col lg="3" md="5" xs="12" className="py-1">
              <TextInputForm
                placeholder={"Turbine"}
                onChange={(e) => handleSearch(e.target.value)}
                prefix_icon={<FaMagnifyingGlass />}
                labelname={"Search Turbine "}
              />
            </Col>
            <Col lg={6} md={12} xs={12} className="py-2 text-end">
              <Col lg="12" md="12" xs="6" className="py-1" />
              <Offcanvas show={show} onHide={handleClose} placement="end" backdrop={true}>
                <Offcanvas.Body>
                  <Row>
                    <Col lg="6">
                      <PageTitle PageTitle={<>Turbine</>} />
                    </Col>
                    <Col lg="6" className="align-self-center">
                      <div className="text-end">
                        <Buttons
                          onClick={handleClose}
                          lable={<MdOutlineClose />}
                        />
                      </div>
                    </Col>
                  </Row>
                  <div className="mt-3">
                    <Row>
                      <Col lg="12" md="12" xs="12" className="py-3">
                        <TextInputForm
                          labelname={"Customer Name"}
                          name="Customer Name"
                          placeholder={"Customer Name"}
                          value={formData.customername_id}
                          onChange={(e) => handleChange(e, "customername_id")}
                        />
                      </Col>
                      <Col lg="12" md="12" xs="12" className="py-3">
                        <TextInputForm
                          labelname={"WTG No"}
                          placeholder={"WTG No"}
                          name="WTG No"
                          value={formData.wtg_no}
                          onChange={(e) => handleChange(e, "wtg_no")}
                        />
                      </Col>
                      <Col lg="12" className="align-self-center">
                        <div className="my-5 text-center">
                          <ClickButton label={<>Clear</>} />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Offcanvas.Body>
              </Offcanvas>
            </Col>
            <Col lg="12" md="12" xs="12" className="px-0">
              <div className="py-1">
                {loading && (
                  <div className="text-center py-3">Loading...</div>
                )}
                <TableUI
                  headers={UserTablehead}
                  body={userData}
                  type="turbine"
                  pageview={"yes"}
                  onDelete={() => fetchData(searchText)}
                  style={{ borderRadius: "5px" }}
                  onSort={handleSort}
                />
                <MobileView
                  sno={"01"}
                  FactoryName={"Anand Fireworks"}
                  Place={"Vettrilaiyurani"}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Turbine;
