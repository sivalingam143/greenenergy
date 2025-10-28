import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Table } from 'react-bootstrap'
import { FaFan } from "react-icons/fa";
import { MdOutlineSolarPower } from "react-icons/md";
import Analytic from '../Compnents/Analytic'
import moment from 'moment';
import fan from '../assest/fan.png'
import tower from '../assest/tower.png'
import screen from '../assest/resized-unscreen.gif'
const DashBoard = () => {
  const [loading, setLoading] = useState(true);
  const [totalCapacity, setTotalCapacity] = useState(0);
  const [dgrdaily, setDgrdaily] = useState([]);
  console.log("dgrdaily", dgrdaily)
  const fetchData = async () => {
    try {
      const response = await fetch("https://api.demos.srivarugreenenergy.com/adminapi/turbine.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({

          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const responseData = await response.json();
      setLoading(false);
      if (responseData.status === 200) {
        setDgrdaily(responseData);

      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  const [dgrdailyAll, setDgrdailyAll] = useState([]);
  console.log("dgrdailyAll", dgrdailyAll)
  const fetchDataAll = async () => {
    try {
      const response = await fetch("https://api.demos.srivarugreenenergy.com/adminapi/dailygen.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({

          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const responseData = await response.json();
      setLoading(false);
      if (responseData.status === 200) {
        setDgrdailyAll(responseData);

      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };

  const [dgrYes, setDgrYes] = useState([]);
  console.log("dgrYes", dgrYes)
  const fetchDataYes = async () => {
    try {
      const response = await fetch("https://api.demos.srivarugreenenergy.com/adminapi/tur.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({

          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const responseData = await response.json();
      setLoading(false);
      if (responseData.status === 200) {
        setDgrYes(responseData);

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
    fetchDataAll();
    fetchDataYes();
  }, []);
  const formatNumber = (number) => {
    return number != null ? number.toLocaleString() : 'No Data';
  };

  const formatDate = (date) => {
    return date ? moment(date).format('DD-MM-YYYY') : 'N/A';
  };
  useEffect(() => {
    // Calculate total capacity whenever dgrdaily updates
    if (dgrdaily.capacity_count && dgrdaily.capacity_count.length > 0) {
      const total = dgrdaily.capacity_count.reduce((accumulator, current) => {
        return accumulator + (current.capacity * current.count); // Calculate total capacity
      }, 0);
      setTotalCapacity(total / 1000); // Store total capacity divided by 1000
    }
  }, [dgrdaily]);
  return (
    <>
      <div>
        <Container fluid>
          <Row>
            <Col lg={12}>
              <h4 className='mt-4'>Generation Under SVGE : {dgrYes.count_wtg_no}</h4>
            </Col>
            <Col lg='4' md='6' xs='12' className='py-3 '>
              <div className='dashboardwind'>
                <div className='text-end'>
                  <span className='m-4 fs-5 ' style={{ color: "#FFFFFF" }}> {dgrdailyAll.today ? formatDate(dgrdailyAll.today.date) : 'Date not available'}</span>
                </div>
                <div className='d-flex align-items-center m-2'>
                  <div className=''>
                    <img src={screen} alt="Animated Icon" className='gif-image' />
                  </div>
                  <div className='m-4'>
                    <span className='fs-5' style={{ color: "#FFFFFF" }}>Total Production : {dgrdailyAll.today ? formatNumber(dgrdailyAll.today.total_production) : ' not available'}</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg='4' md='6' xs='12' className='py-3'>
              <div className='dashboardwind'>
                <div className='text-end'>
                  <span className='m-4  fs-5' style={{ color: "#FFFFFF" }}>{dgrdailyAll.month ? dgrdailyAll.month.month : 'Month not available'}</span>
                </div>
                <div className='d-flex align-items-center m-2'>
           
                <div className=''>
                    <img src={screen} alt="Animated Icon" className='gif-image' />
                  </div>
                  <div className='m-4'>
                    <span className='fs-5' style={{ color: "#FFFFFF" }}> Total Production : {dgrdailyAll.month ? formatNumber(dgrdailyAll.month.total_production) : ' not available'}</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg='4' md='6' xs='12' className='py-3'>
              <div className='dashboardwind'>
                <div className='text-end'>
                  <span className='m-4 fs-5' style={{ color: "#FFFFFF" }}>{dgrdailyAll.year ? dgrdailyAll.year.year : 'Year not available'}</span>
                </div>
                <div className='d-flex align-items-center m-2'>
                <div className=''>
                    <img src={screen} alt="Animated Icon" className='gif-image' />
                  </div>
                  <div className='m-4'>
                    <span className='fs-5' style={{ color: "#FFFFFF" }}>Total Production : {dgrdailyAll.year ? formatNumber(dgrdailyAll.year.total_production) : ' not available'}</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg='12' md='12' xs='12'> <h4 className=''>Total Count</h4></Col>
            <Col lg='4' md='6' xs='12' className='py-3 '>
              <div className='dashboardwind'>
                <div className='text-end'>
                  <span className='m-4 fs-5 '></span>
                </div>
                <div className='d-flex align-items-center m-2'>
                <div className=''>
                    <img src={screen} alt="Animated Icon" className='gif-image' />
                  </div>
                  <div className='m-4'>
                    <span className='fs-5' style={{ color: "#FFFFFF" }}>Total Number Of Customer <span className='h3' style={{ color: "#E6E6FA", fontWeight: "bold" }}> {dgrdaily.count_customer}</span> </span>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg='4' md='6' xs='12' className='py-3'>
              <div className='dashboardwind'>
                <div className='text-end'>
                  <span className='m-4  fs-5'></span>
                </div>
                <div className='d-flex align-items-center m-2'>
                <div className=''>
                    <img src={screen} alt="Animated Icon" className='gif-image' />
                  </div>
                  <div className='m-4'>
                    <span className='fs-5' style={{ color: "#FFFFFF" }}>Total Number Of Turbine <span className='h3' style={{ color: "#E6E6FA", fontWeight: "bold" }}>{dgrdaily.count_wtg_no}</span></span>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg='4' md='6' xs='12' className='py-3'>
              <div className='dashboardwind'>
                <div className='text-end'>
                  <span className='m-4  fs-5'></span>
                </div>
                <div className='d-flex align-items-center m-2'>
                <div className=''>
                    <img src={screen} alt="Animated Icon" className='gif-image' />
                  </div>
                  <div className='m-4'>
                    <span className='fs-5' style={{ color: "#FFFFFF" }}><br></br>Turbine Capacity <span className='h3' style={{ color: "#E6E6FA", fontWeight: "bold" }}>{totalCapacity}</span><span>MW</span></span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <div>
        <Container fluid>
          <Row>
            <Col lg='4' md='6' xs='12' className='mt-4'>
              <h5 className=''>Turbine In Contract</h5>
              <div style={{ overflow: "auto", maxWidth: "380px" }}>
                <Table striped bordered hover>
                  <thead>
                    <tr>

                      <th className='tables-heads'>Contract Type</th>
                      <th>Count</th>

                    </tr>
                  </thead>
                  <tbody>
                    {dgrdaily.contract_type && dgrdaily.contract_type.length > 0 ? (
                      dgrdaily.contract_type.map((contract, index) => (
                        <tr key={index}>

                          <td>{contract.contract_code}</td>
                          <td>{contract.count}</td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">No contract type data available</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Col>
            <Col lg='4' md='12' xs='12' className='mt-4'>
              <h5 className='fs-bold'>Turbine In Model</h5>
              <div style={{ overflow: "auto", maxWidth: "380px" }}>
                <Table striped bordered hover>
                  <thead>
                    <tr>

                      <th>Model Type</th>
                      <th>Count</th>

                    </tr>
                  </thead>
                  <tbody>
                    {dgrdaily.model_type && dgrdaily.model_type.length > 0 ? (
                      dgrdaily.model_type.map((model, index) => (
                        <tr key={index}>

                          <td>{model.model_type}</td>
                          <td>{model.count}</td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">No contract type data available</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Col>
            <Col lg='4' md='12' xs='12' className='mt-4'>
              <h5 className='fs-bold'>Turbine In Capacity</h5>
              <div style={{ overflow: "auto", maxWidth: "380px" }}>
                <Table striped bordered hover>
                  <thead>
                    <tr>

                      <th>capacity</th>
                      <th>Count</th>

                    </tr>
                  </thead>
                  <tbody>
                    {dgrdaily.capacity_count && dgrdaily.capacity_count.length > 0 ? (
                      dgrdaily.capacity_count.map((capacity, index) => (
                        <tr key={index}>
                          <td>{capacity.capacity}</td>
                          <td>{capacity.count}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">No capacity data available</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </Container>
      </div >

      < div >
        {/* <Analytic/> */}
      </div >
    </>

  )
}

export default DashBoard