import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { DropDownUI, TextInputForm, Calender } from "../Compnents/Forms";
import { ClickButton } from "../Compnents/ClickButton";
import Multiselect from "multiselect-react-dropdown";
import Select from "react-select";
import moment from "moment/moment";
import * as XLSX from "xlsx";
import { Spinner } from "react-bootstrap";
const types = [
  {
    label: "Daily",
    value: "daily",
  },
];
const verify = [
  {
    label: "DGR",
    value: "dgr",
  },
];
const ErrorReport = () => {
  const [formDatarep, setFormDatarep] = useState({
    customer_name: [],
    wtg_no: [],
    report: "",
    from_date: "",
    to_date: "",
    type: "",
  });
  console.log("formDatarep", formDatarep);
  const setDateOfBirths = (date) => {
    setFormDatarep((prevData) => ({
      ...prevData,
      date: date,
    }));
  };
  const setLabel = (value, field) => {
    setFormDatarep({
      ...formDatarep,
      [field]: moment(value).format("YYYY-MM-DD"),
    });
  };
  const handleChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;
    setFormDatarep({
      ...formDatarep,
      [fieldName]: value,
    });
  };
  const [errorData, setErrorData] = useState([]);
  console.log("errorData", errorData);
  const [dropData, setDropData] = useState([]);
  console.log("dropData", dropData);
  const [maintenData, setMaintenData] = useState([]);
  console.log("maintenData", maintenData);
  const [faultData, setFaultData] = useState([]);
  console.log("faultData", faultData);
  const [modalData, setModalData] = useState([]);
  console.log("modalData", modalData);
  const fetchDataErrorData = async () => {
    try {
      const response = await fetch(
        "https://api.demos.srivarugreenenergy.com/error/list.php",
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
        throw new Error("Failed to fetch error data");
      }

      const responseData = await response.json();
      if (responseData.status === 200) {
        setErrorData(responseData.data.error); // Set error data in state
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      console.error("Error fetching error data:", error.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchDataDropData = async () => {
    try {
      const response = await fetch(
        "https://api.demos.srivarugreenenergy.com/grid_drop/list.php",
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
        setDropData(responseData.data.grid_drop);
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  const fetchDataMaintenData = async () => {
    try {
      const response = await fetch(
        "https://api.demos.srivarugreenenergy.com/maintenance/list.php",
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
        setMaintenData(responseData.data.maintenance);
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  const fetchDataFaultData = async () => {
    try {
      const response = await fetch(
        "https://api.demos.srivarugreenenergy.com/grid_fault/list.php",
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
        setFaultData(responseData.data.grid_fault);
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  const fetchDataModalData = async () => {
    try {
      const response = await fetch(
        "https://api.demos.srivarugreenenergy.com/model/list.php",
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
        setModalData(responseData.data.model);
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  const [userTurbine, setUserTurbine] = useState([]);
  const fetchDataTurbine = async () => {
    try {
      const response = await fetch(
        "https://api.demos.srivarugreenenergy.com/turbine/list.php",
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
        setUserTurbine(responseData.data.turbine);
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  useEffect(() => {
    fetchDataTurbine();
    fetchDataErrorData();
    fetchDataModalData();
    fetchDataDropData();
    fetchDataFaultData();
    fetchDataMaintenData();
  }, []);

  const [userCustomer, setUserCustomer] = useState([]);
  const fetchDataCustomer = async () => {
    try {
      const response = await fetch(
        "https://api.demos.srivarugreenenergy.com/customer/list.php",
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
        setUserCustomer(responseData.data.customer);
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  useEffect(() => {
    fetchDataCustomer();
  }, []);
  const [loading, setLoading] = useState(true);

  const [userError, setUserError] = useState([]);
  console.log("userError", userError);
  const fetchDataTotalError = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.demos.srivarugreenenergy.com/daily_generation/dgrreport.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_unique_id: formDatarep.customer_name,
            wtg_no: formDatarep.wtg_no,
            report: formDatarep.report,
            from_date: formDatarep.from_date,
            to_date: formDatarep.to_date,
            type: formDatarep.type,
          }),
        }
      );

      const responseText = await response.text(); // Get the raw response text
      console.log("Raw API response:", responseText);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const responseData = JSON.parse(responseText); // Now parse it as JSON

      if (responseData.status === 200) {
        setUserError(responseData.data); // Store in dgrData
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      console.error("Error fetching report data:", error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleErrorSubmit = (e) => {
    e.preventDefault();
    fetchDataTotalError();
  };
  const handleSelectChange = (selectedOptions) => {
    setFormDatarep({
      ...formDatarep,
      customer_name: selectedOptions.map((option) => option.value),
    });
  };

  const handleTurbineSelectChange = (selectedOptions) => {
    setFormDatarep((prevData) => ({
      ...prevData,
      wtg_no: selectedOptions.map((option) => option.value),
    }));
  };

  const customerOptions = userCustomer.map((customer) => ({
    value: customer.customer_unique_id,
    label: customer.customer_name,
  }));

  const filteredTurbineOptions = userTurbine
    .filter((turbine) =>
      formDatarep.customer_name.includes(turbine.customername_id)
    )
    .map((turbine) => ({
      value: turbine.wtg_no,
      label: turbine.wtg_no,
    }));
  const handleExportToExcel = () => {
    const ws = XLSX.utils.table_to_sheet(document.getElementById("errorTable"));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DGR Report");
    XLSX.writeFile(wb, "DGR_Report.xlsx");
  };
  return (
    <>
      <Container fluid>
        <Row>
          <Col lg="12" md="12" xs="12" className="align-self-center">
            <div className="page-nav py-3">
              <span class="nav-list">ERROR REPORT</span>
            </div>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <div className="w-100">
              <Calender
                setLabel={(date) => setLabel(date, "from_date")}
                selectedDate={formDatarep.from_date}
                calenderlabel="FromDate"
              />
            </div>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <div className="w-100">
              <Calender
                setLabel={(date) => setLabel(date, "to_date")}
                selectedDate={formDatarep.to_date}
                calenderlabel="ToDate"
              />
            </div>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <span>
              <label className="mb-2">CustomerName</label>
            </span>
            <div>
              <Select
                isMulti
                options={customerOptions}
                value={customerOptions.filter((option) =>
                  formDatarep.customer_name.includes(option.value)
                )}
                onChange={handleSelectChange}
                isLoading={loading}
                placeholder="Select customers"
              />
            </div>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <span>
              <label className="mb-2">Turbine No</label>
            </span>
            <div>
              <Select
                isMulti
                options={filteredTurbineOptions}
                value={filteredTurbineOptions.filter((option) =>
                  formDatarep.wtg_no.includes(option.value)
                )}
                onChange={handleTurbineSelectChange}
                isLoading={loading}
                placeholder="Select turbines"
              />
            </div>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <DropDownUI
              optionlist={types}
              placeholder="Report"
              labelname="Report"
              name="report"
              value={formDatarep}
              onChange={(updatedFormData) =>
                setFormDatarep({
                  ...formDatarep,
                  report: updatedFormData.report,
                })
              }
            ></DropDownUI>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <DropDownUI
              optionlist={verify}
              placeholder="Verify"
              labelname="Verify"
              name="type"
              value={formDatarep}
              onChange={(updatedFormData) =>
                setFormDatarep({
                  ...formDatarep,
                  type: updatedFormData.type,
                })
              }
            ></DropDownUI>
          </Col>
          <Col lg="9" md="12" xs="12" className="py-3 ">
            <div className="mt-3"></div>
            <div className="d-flex justify-content-end">
              <span className="mx-2">
                <ClickButton
                  label={<>ERROR Submit</>}
                  onClick={handleErrorSubmit}
                ></ClickButton>
              </span>
              <span className="mx-2">
                <ClickButton
                  label={<>ERROR PDF DownLoad</>}
                  onClick={handleExportToExcel} // Trigger export to Excel
                ></ClickButton>
              </span>
            </div>
          </Col>

          <div>
            {loading ? (
              // Spinner Loader
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100vh" }}
              >
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              userError.length > 0 && (
                <Col lg="12" md="12" xs="12" className="py-3">
                  <Table id="errorTable" striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Turbine No</th>
                        <th>LocNo</th>
                        <th>Model</th>
                        <th>Capacity</th>
                        <th>SiteName</th>
                        <th>Error ID</th>
                        <th>Error Type</th>
                        <th>Error Description</th>
                        <th>Date</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Dowm Time (Hrs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userError.map((error, index) => {
                        // Check if errorcode or errorgriddrop have valid data
                        const validErrorCodes = Array.isArray(error.errorcode)
                          ? error.errorcode.filter(
                              (code) => code.error_id && code.error_describtion
                            )
                          : [];

                        const validErrorGridDrops = Array.isArray(
                          error.errorgriddrop
                        )
                          ? error.errorgriddrop.filter(
                              (drop) => drop.griddrop_id && drop.griddrop_name
                            )
                          : [];

                        const validErrorGridFault = Array.isArray(
                          error.errorgridfault
                        )
                          ? error.errorgridfault.filter(
                              (fault) =>
                                fault.gridfault_id && fault.gridfault_name
                            )
                          : [];
                        const validErrorGridMainten = Array.isArray(
                          error.errormaintenance
                        )
                          ? error.errormaintenance.filter(
                              (mainten) =>
                                mainten.maintenance_id &&
                                mainten.maintenance_name
                            )
                          : [];

                        // Only render rows if valid errorcode or errorgriddrop exist
                        if (
                          validErrorCodes.length === 0 &&
                          validErrorGridDrops.length === 0 &&
                          validErrorGridFault.length === 0 &&
                          validErrorGridMainten.length === 0
                        ) {
                          return null;
                        }

                        return (
                          <React.Fragment key={index}>
                            {validErrorCodes.map((code, idx) => {
                              const matchedError =
                                Array.isArray(errorData) &&
                                errorData.find((data) => {
                                  return data.error_id === code.error_id;
                                });
                              const matchedModal =
                                Array.isArray(modalData) &&
                                modalData.find((data) => {
                                  return data.model_id === error.model_id;
                                });
                              return (
                                <tr key={`${index}-error-${idx}`}>
                                  <td>{error.wtg_no}</td>
                                  <td>{error.loc_no}</td>
                                  <td>
                                    {matchedModal
                                      ? matchedModal.model_type
                                      : "no match"}
                                  </td>
                                  <td>{error.capacity}</td>
                                  <td>{error.site_name}</td>
                                  <td>
                                    {matchedError
                                      ? matchedError.error_code
                                      : "No match"}
                                  </td>
                                  <td>
                                    {code.error_describtion ? "Error" : ""}
                                  </td>
                                  <td>{code.error_describtion}</td>
                                  <td>{error.dg_date}</td>
                                  <td>{code.error_from}</td>
                                  <td>{code.error_to}</td>
                                  <td>{code.error_total}</td>
                                </tr>
                              );
                            })}
                            {validErrorGridDrops.map((drop, idx) => {
                              const matchedError =
                                Array.isArray(dropData) &&
                                dropData.find((data) => {
                                  return data.grid_drop_id === drop.griddrop_id;
                                });
                              const matchedModal =
                                Array.isArray(modalData) &&
                                modalData.find((data) => {
                                  return data.model_id === error.model_id;
                                });
                              return (
                                <tr key={`${index}-grid-${idx}`}>
                                  <td>{error.wtg_no}</td>
                                  <td>{error.loc_no}</td>
                                  <td>
                                    {matchedModal
                                      ? matchedModal.model_type
                                      : "no match"}
                                  </td>
                                  <td>{error.capacity}</td>
                                  <td>{error.site_name}</td>
                                  <td>
                                    {matchedError
                                      ? matchedError.grid_drop_code
                                      : "no match"}
                                  </td>
                                  <td>
                                    {drop.griddrop_name ? "Grid Drop" : ""}
                                  </td>
                                  <td>{drop.griddrop_name}</td>
                                  <td>{error.dg_date}</td>
                                  <td>{drop.griddrop_from}</td>
                                  <td>{drop.griddrop_to}</td>
                                  <td>{drop.griddrop_total}</td>
                                </tr>
                              );
                            })}
                            {validErrorGridFault.map((fault, idx) => {
                              const matchedError =
                                Array.isArray(faultData) &&
                                faultData.find((data) => {
                                  return (
                                    data.grid_fault_id === fault.gridfault_id
                                  );
                                });
                              const matchedModal =
                                Array.isArray(modalData) &&
                                modalData.find((data) => {
                                  return data.model_id === error.model_id;
                                });
                              return (
                                <tr key={`${index}-grid-${idx}`}>
                                  <td>{error.wtg_no}</td>
                                  <td>{error.loc_no}</td>
                                  <td>
                                    {matchedModal
                                      ? matchedModal.model_type
                                      : "no match"}
                                  </td>
                                  <td>{error.capacity}</td>
                                  <td>{error.site_name}</td>
                                  <td>
                                    {matchedError
                                      ? matchedError.grid_fault_code
                                      : "no match"}
                                  </td>
                                  <td>
                                    {fault.gridfault_name ? "Grid Fault" : ""}
                                  </td>
                                  <td>{fault.gridfault_name}</td>
                                  <td>{error.dg_date}</td>
                                  <td>{fault.gridfault_from}</td>
                                  <td>{fault.gridfault_to}</td>
                                  <td>{fault.gridfault_total}</td>
                                </tr>
                              );
                            })}
                            {validErrorGridMainten.map((mainten, idx) => {
                              const matchedError =
                                Array.isArray(maintenData) &&
                                maintenData.find((data) => {
                                  return (
                                    data.maintenance_id ===
                                    mainten.maintenance_id
                                  );
                                });
                              const matchedModal =
                                Array.isArray(modalData) &&
                                modalData.find((data) => {
                                  return data.model_id === error.model_id;
                                });
                              return (
                                <tr key={`${index}-grid-${idx}`}>
                                  <td>{error.wtg_no}</td>
                                  <td>{error.loc_no}</td>
                                  <td>
                                    {matchedModal
                                      ? matchedModal.model_type
                                      : "no match"}
                                  </td>
                                  <td>{error.capacity}</td>
                                  <td>{error.site_name}</td>
                                  <td>
                                    {matchedError
                                      ? matchedError.maintenance_code
                                      : "no match"}
                                  </td>
                                  <td>
                                    {mainten.maintenance_name
                                      ? "Maintenance"
                                      : ""}
                                  </td>
                                  <td>{mainten.maintenance_name}</td>
                                  <td>{error.dg_date}</td>
                                  <td>{mainten.maintenance_from}</td>
                                  <td>{mainten.maintenance_to}</td>
                                  <td>{mainten.maintenance_total}</td>
                                </tr>
                              );
                            })}
                            {/* Render valid error grid drops */}
                            {/* {validErrorGridDrops.map((drop, idx) => (
                          <tr key={`${index}-grid-${idx}`}>
                            <td>{index + 1}</td>
                            <td>{error.wtg_no}</td>
                            <td>{error.loc_no}</td>
                            <td>{error.model_id}</td>
                            <td>{error.capacity}</td>
                            <td>{error.site_name}</td>
                            <td>{drop.griddrop_id}</td>
                            <td>{drop.griddrop_name}</td>
                          </tr>
                        ))} */}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </Table>
                </Col>
              )
            )}
          </div>
        </Row>
      </Container>
    </>
  );
};

export default ErrorReport;
// {userError.length > 0 && (
//   <Col lg="12" md="12" xs="12" className="py-3">
//     <Table id="errorTable" striped bordered hover responsive>
//       <thead>
//         <tr>

//           <th>Turbine No</th>
//           <th>LocNo</th>
//           <th>Model</th>
//           <th>Capacity</th>
//           <th>SiteName</th>
//           <th>Error ID</th>
//           <th>Error Type</th>
//           <th>Error Description</th>
//           <th>Date</th>
//           <th>Start</th>
//           <th>End</th>
//           <th>Dowm Time (Hrs)</th>
//         </tr>
//       </thead>
//       <tbody>
//         {userError.map((error, index) => {
//           // Check if errorcode or errorgriddrop have valid data
//           const validErrorCodes = Array.isArray(error.errorcode)
//             ? error.errorcode.filter(
//               (code) => code.error_id && code.error_describtion
//             )
//             : [];

//           const validErrorGridDrops = Array.isArray(error.errorgriddrop)
//             ? error.errorgriddrop.filter(
//               (drop) => drop.griddrop_id && drop.griddrop_name
//             )
//             : [];

//             const validErrorGridFault = Array.isArray(error.errorgridfault)
//             ? error.errorgridfault.filter(
//               (fault) => fault.gridfault_id && fault.gridfault_name
//             )
//             : [];
//             const validErrorGridMainten = Array.isArray(error.errormaintenance)
//             ? error.errormaintenance.filter(
//               (mainten) => mainten.maintenance_id && mainten.maintenance_name
//             )
//             : [];

//           // Only render rows if valid errorcode or errorgriddrop exist
//           if (validErrorCodes.length === 0 && validErrorGridDrops.length === 0 && validErrorGridFault.length === 0 && validErrorGridMainten.length === 0) {
//             return null;
//           }

//           return (
//             <React.Fragment key={index}>
//               {validErrorCodes.map((code, idx) => {
//                 const matchedError = Array.isArray(errorData) &&
//                   errorData.find((data) => {
//                     return data.error_id === code.error_id;
//                   });
//                 const matchedModal = Array.isArray(modalData) &&
//                   modalData.find((data) => {
//                     return data.model_id === error.model_id;
//                   });
//                 return (
//                   <tr key={${index}-error-${idx}}>

//                     <td>{error.wtg_no}</td>
//                     <td>{error.loc_no}</td>
//                     <td>{matchedModal ? matchedModal.model_type : 'no match'}</td>
//                     <td>{error.capacity}</td>
//                     <td>{error.site_name}</td>
//                     <td>{matchedError ? matchedError.error_code : 'No match'}</td>
//                     <td>{code.error_describtion ? 'Error':''}</td>
//                     <td>{code.error_describtion}</td>
//                     <td>{error.dg_date}</td>
//                     <td>{code.error_from}</td>
//                     <td>{code.error_to}</td>
//                     <td>{code.error_total}</td>
//                   </tr>
//                 );
//               })}
//               {validErrorGridDrops.map((drop, idx) => {
//                 const matchedError = Array.isArray(dropData) &&
//                 dropData.find((data) => {
//                     return data.grid_drop_id === drop.griddrop_id;
//                   });
//                 const matchedModal = Array.isArray(modalData) &&
//                   modalData.find((data) => {
//                     return data.model_id === error.model_id;
//                   });
//                 return (
//                   <tr key={${index}-grid-${idx}}>

//                     <td>{error.wtg_no}</td>
//                     <td>{error.loc_no}</td>
//                     <td>{matchedModal ? matchedModal.model_type : 'no match'}</td>
//                     <td>{error.capacity}</td>
//                     <td>{error.site_name}</td>
//                     <td>{matchedError ? matchedError.grid_drop_code:'no match'}</td>
//                     <td>{drop.griddrop_name ? 'Grid Drop':''}</td>
//                     <td>{drop.griddrop_name}</td>
//                     <td>{error.dg_date}</td>
//                     <td>{drop.griddrop_from}</td>
//                     <td>{drop.griddrop_to}</td>
//                     <td>{drop.griddrop_total}</td>
//                   </tr>
//                 );
//               })}
//                {validErrorGridFault.map((fault, idx) => {
//                 const matchedError = Array.isArray(faultData) &&
//                 faultData.find((data) => {
//                     return data.grid_fault_id === fault.gridfault_id;
//                   });
//                 const matchedModal = Array.isArray(modalData) &&
//                   modalData.find((data) => {
//                     return data.model_id === error.model_id;
//                   });
//                 return (
//                   <tr key={${index}-grid-${idx}}>

//                     <td>{error.wtg_no}</td>
//                     <td>{error.loc_no}</td>
//                     <td>{matchedModal ? matchedModal.model_type : 'no match'}</td>
//                     <td>{error.capacity}</td>
//                     <td>{error.site_name}</td>
//                     <td>{matchedError ? matchedError.grid_fault_code:'no match'}</td>
//                     <td>{fault.gridfault_name ? 'Grid Fault':''}</td>
//                     <td>{fault.gridfault_name}</td>
//                     <td>{error.dg_date}</td>
//                     <td>{fault.gridfault_from}</td>
//                     <td>{fault.gridfault_to}</td>
//                     <td>{fault.gridfault_total}</td>
//                   </tr>
//                 );
//               })}
//                  {validErrorGridMainten.map((mainten, idx) => {
//                 const matchedError = Array.isArray(maintenData) &&
//                 maintenData.find((data) => {
//                     return data.maintenance_id === mainten.maintenance_id;
//                   });
//                 const matchedModal = Array.isArray(modalData) &&
//                   modalData.find((data) => {
//                     return data.model_id === error.model_id;
//                   });
//                 return (
//                   <tr key={${index}-grid-${idx}}>

//                     <td>{error.wtg_no}</td>
//                     <td>{error.loc_no}</td>
//                     <td>{matchedModal ? matchedModal.model_type : 'no match'}</td>
//                     <td>{error.capacity}</td>
//                     <td>{error.site_name}</td>
//                     <td>{matchedError ? matchedError.maintenance_code:'no match'}</td>
//                     <td>{mainten.maintenance_name ? 'Maintenance':''}</td>
//                     <td>{mainten.maintenance_name}</td>
//                     <td>{error.dg_date}</td>
//                     <td>{mainten.maintenance_from}</td>
//                     <td>{mainten.maintenance_to}</td>
//                     <td>{mainten.maintenance_total}</td>
//                   </tr>
//                 );
//               })}

//             </React.Fragment>
//           );
//         })}
//       </tbody>
//     </Table>
//   </Col>
// )}
