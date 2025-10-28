import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { DropDownUI, TextInputForm, Calender } from "../components/Forms";
import { ClickButton } from "../components/ClickButton";
import Select from "react-select";
import moment from "moment/moment";
import * as XLSX from "xlsx";
import { Spinner } from "react-bootstrap";
const types = [
  {
    label: "Daily",
    value: "daily",
  },
  {
    label: "Monthly",
    value: "monthly",
  },
  {
    label: "Yearly",
    value: "yearly",
  },
];
const verifyOptions = [
  { label: "DGR", value: "dgr" },
  { label: "ERROR", value: "error" },
];
const DgReport = () => {
  const [formDatarep, setFormDatarep] = useState({
    customer_name: [],
    wtg_no: [],
    report: "",
    from_date: "",
    to_date: "",
    type: "",
  });
  console.log("formDatarep", formDatarep);
  const filteredVerifyOptions = () => {
    switch (formDatarep.report) {
      case "daily":
        return verifyOptions; // Both DGR and ERROR
      case "monthly":
      case "yearly":
        return verifyOptions.filter((option) => option.value === "dgr"); // Only DGR
      default:
        return [];
    }
  };

  const setLabel = (value, field) => {
    setFormDatarep({
      ...formDatarep,
      [field]: moment(value).format("YYYY-MM-DD"), // Update the specified field in formData with the provided value
    });
  };
  const [errorMainData, setErrorMainData] = useState([]);
  console.log("errorMainData", errorMainData);
  const [maintenData, setMaintenData] = useState([]);
  console.log("maintenData", maintenData);
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
        setErrorMainData(responseData.data.error); // Set error data in state
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      console.error("Error fetching error data:", error.message);
    } finally {
      setLoading(false);
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
  const [userTurbine, setUserTurbine] = useState([]);

  const fetchDataTurbine = async () => {
    try {
      const response = await fetch(
        "https://api.demos.srivarugreenenergy.com/turbine/listing.php",
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
    fetchDataTurbine(); // Call fetchData directly in useEffect
    fetchDataErrorData();
    fetchDataMaintenData();
  }, []);

  const [userCustomer, setUserCustomer] = useState([]);
  const fetchDataCustomer = async () => {
    try {
      const response = await fetch(
        "https://api.demos.srivarugreenenergy.com/customer/listing.php",
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
    fetchDataCustomer(); // Call fetchData directly in useEffect
  }, []);

  const [loading, setLoading] = useState(true);
  const [dgrData, setDgrData] = useState([]);
  const [errorData, setErrorData] = useState([]);
  console.log("dgrData", dgrData);
  console.log("errorData", errorData);
  const fetchData = async () => {
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
        if (formDatarep.type === "dgr") {
          setDgrData(responseData.data);
        } else if (formDatarep.type === "error") {
          setErrorData(responseData.data);
        }
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      console.error("Error fetching report data:", error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
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

  const downloadExcel = () => {
    let headers = [];
    let tableData = [];

    // Check for daily report type and dgrData
    if (
      formDatarep.report === "daily" &&
      formDatarep.type === "dgr" &&
      dgrData.length > 0
    ) {
      headers = [
        "S No",
        "Date",
        "Customer Name",
        "Turbine No",
        "Location No",
        "HTSC No",
        "Site",
        "Gen 0",
        "Gen 1",
        "Gen 2",
        "Total Production",
        "KWH Import EB",
        "KWH Export EB",
        "Kvarh Imp EB",
        "Kvarh Exp EB",
        "Net Exp",
        "Gen 1 hrs",
        "Gen 2 hrs",
        "Gen Hrs",
        "M/c Fault hrs",
        "M/c Maintenance hrs",
        "Grid fault hrs",
        "Grid down hrs",
        "Lull hrs",
        "Machine Availability %",
        "Grid Availability %",
        "Kvarh Imp",
        "Generation @100 % Grid",
        "Diff. (Panel Vs EB)",
        "Diff. (Panel Vs EB) %",
        "Power factor",
        "Lost KWH - Breakdown (units)",
        "Lost KWH - Maintenance (units)",
        "Lost KWH - Grid Fault (units)",
        "Lost KWH - Grid Down (units)",
        "Lost KWH - Breakdown (%)",
        "Lost KWH - Maintenance (%)",
        "Lost KWH - Grid Fault (%)",
        "Lost KWH - Grid Down (%)",
        "Availability Impact (%)",
        "Rating",
        "Kvarh Exp %",
        "Turbine OK Hrs",
        "Line hrs",
        "Line OK hrs",
        "Line loss (Units)",
      ];

      tableData = dgrData.map((data, index) => [
        index + 1,
        data.dg_date ? moment(data.dg_date).format("DD-MM-YYYY") : "",
        data.customer_name || "",
        data.wtg_no || "",
        data.loc_no || "",
        data.htsc_no || "",
        data.site_name || "",
        data.gen_zero || 0,
        data.gen_one || 0,
        data.gen_two || 0,
        data.total_production || 0,
        data.kwh_imp || 0,
        data.kwh_exp || 0,
        data.kvarh_imp || 0,
        data.kvarh_exp || 0,
        data.net_exp || 0,
        data.gen_onehrs || 0,
        data.gen_twohrs || 0,
        data.gen_hourtotal || 0,
        data.error_overtotal || "00:00",
        data.maintenance_overtotal || "00:00",
        data.gridfault_overtotal || "00:00",
        data.griddrop_overtotal || "00:00",
        data.lull_hrs || 0,
        data.machine_availability || 0,
        data.grid_availability || 0,
        data.kvarh_imp_per || 0,
        data.generation_grid || 0,
        data.diff_panel_vs_eb || 0,
        data.diff_panel_eb_per || 0,
        data.power_factor || 0,
        data.breakdown || 0,
        data.Maintenance || 0,
        data.grid_fault || 0,
        data.grid_down || 0,
        data.breakdown_per || 0,
        data.maintenance_per || 0,
        data.grid_fault_per || 0,
        data.grid_down_per || 0,
        data.availablity_impact || 0,
        data.rating || 0,
        data.kvarh_exp_per || 0,
        data.turbine_ok_hrs || 0,
        data.line_hrs || 0,
        data.line_ok_hrs || 0,
        data.diff_panel_vs_eb || 0, // Line loss (Units)
      ]);
    }

    // Check for monthly report type and dgrData
    if (
      formDatarep.report === "monthly" &&
      formDatarep.type === "dgr" &&
      dgrData.length > 0
    ) {
      // Assuming monthly report has similar data structure to daily
      headers = [
        "S No",
        "Month",
        "Customer Name",
        "Turbine No",
        "Location No",
        "HTSC No",
        "Site",
        "Gen 0",
        "Gen 1",
        "Gen 2",
        "Total Production",
        "KWH Import EB",
        "KWH Export EB",
        "Kvarh Imp EB",
        "Kvarh Exp EB",
        "Net Exp",
        "Gen 1 hrs",
        "Gen 2 hrs",
        "Gen Hrs",
        "M/c Fault hrs",
        "M/c Maintenance hrs",
        "Grid fault hrs",
        "Grid down hrs",
        "Lull hrs",
        "Machine Availability %",
        "Grid Availability %",
        "Kvarh Imp ",
        "Generation @100 % Grid",
        "Diff. (Panel Vs EB)",
        "Diff. (Panel Vs EB) %",
        "Power factor",
        "Lost KWH - Breakdown (units)",
        "Lost KWH - Maintenance (units)",
        "Lost KWH - Grid Fault (units)",
        "Lost KWH - Grid Down (units)",
        "Lost KWH - Breakdown (%)",
        "Lost KWH - Maintenance (%)",
        "Lost KWH - Grid Fault (%)",
        "Lost KWH - Grid Down (%)",
        "Availability Impact (%)",
        "Rating",
        "Kvarh Exp %",
        "Turbine OK Hrs",
        "Line hrs",
        "Line OK hrs",
        "Line loss (Units)",
      ];
      tableData = dgrData.map((data, index) => [
        index + 1,
        data.month || "",
        data.customer_name || "",
        data.wtg_no || "",
        data.loc_no || "",
        data.htsc_no || "",
        data.site_name || "",
        data.gen_zero || 0,
        data.gen_one || 0,
        data.gen_two || 0,
        data.total_production || 0,
        data.kwh_imp || 0,
        data.kwh_exp || 0,
        data.kvarh_imp || 0,
        data.kvarh_exp || 0,
        data.net_exp || 0,
        data.gen_onehrs || 0,
        data.gen_twohrs || 0,
        data.gen_hourtotal || 0,
        data.error_overtotal || "00:00",
        data.maintenance_overtotal || "00:00",
        data.gridfault_overtotal || "00:00",
        data.griddrop_overtotal || "00:00",
        data.lull_hrs || 0,
        data.machine_availability || 0,
        data.grid_availability || 0,
        data.kvarh_imp_per || 0,
        data.generation_grid || 0,
        data.diff_panel_vs_eb || 0,
        data.diff_panel_eb_per || 0,
        data.power_factor || 0,
        data.breakdown || 0,
        data.Maintenance || 0,
        data.grid_fault || 0,
        data.grid_down || 0,
        data.breakdown_per || 0,
        data.maintenance_per || 0,
        data.grid_fault_per || 0,
        data.grid_down_per || 0,
        data.availablity_impact || 0,
        data.rating || 0,
        data.kvarh_exp_per || 0,
        data.turbine_ok_hrs || 0,
        data.line_hrs || 0,
        data.line_ok_hrs || 0,
        data.diff_panel_vs_eb || 0,
      ]);
    }

    // Check for yearly report type and dgrData
    if (
      formDatarep.report === "yearly" &&
      formDatarep.type === "dgr" &&
      dgrData.length > 0
    ) {
      // Assuming yearly report has similar data structure to daily
      headers = [
        "S No",
        "Year",
        "Customer Name",
        "Turbine No",
        "Location No",
        "HTSC No",
        "Site",
        "Gen 0",
        "Gen 1",
        "Gen 2",
        "Total Production",
        "KWH Import EB",
        "KWH Export EB",
        "Kvarh Imp EB",
        "Kvarh Exp EB",
        "Net Exp",
        "Gen 1 hrs",
        "Gen 2 hrs",
        "Gen Hrs",
        "M/c Fault hrs",
        "M/c Maintenance hrs",
        "Grid fault hrs",
        "Grid down hrs",
        "Lull hrs",
        "Machine Availability %",
        "Grid Availability %",
        "Kvarh Imp",
        "Generation @100 % Grid",
        "Diff. (Panel Vs EB)",
        "Diff. (Panel Vs EB) %",
        "Power factor",
        "Lost KWH - Breakdown (units)",
        "Lost KWH - Maintenance (units)",
        "Lost KWH - Grid Fault (units)",
        "Lost KWH - Grid Down (units)",
        "Lost KWH - Breakdown (%)",
        "Lost KWH - Maintenance (%)",
        "Lost KWH - Grid Fault (%)",
        "Lost KWH - Grid Down (%)",
        "Availability Impact (%)",
        "Rating",
        "Kvarh Exp %",
        "Turbine OK Hrs",
        "Line hrs",
        "Line OK hrs",
        "Line loss (Units)",
      ];

      tableData = dgrData.map((data, index) => [
        index + 1,
        data.year || "",
        data.customer_name || "",
        data.wtg_no || "",
        data.loc_no || "",
        data.htsc_no || "",
        data.site_name || "",
        data.gen_zero || 0,
        data.gen_one || 0,
        data.gen_two || 0,
        data.total_production || 0,
        data.kwh_imp || 0,
        data.kwh_exp || 0,
        data.kvarh_imp || 0,
        data.kvarh_exp || 0,
        data.net_exp || 0,
        data.gen_onehrs || 0,
        data.gen_twohrs || 0,
        data.gen_hourtotal || 0,
        data.error_overtotal || "00:00",
        data.maintenance_overtotal || "00:00",
        data.gridfault_overtotal || "00:00",
        data.griddrop_overtotal || "00:00",
        data.lull_hrs || 0,
        data.machine_availability || 0,
        data.grid_availability || 0,
        data.kvarh_imp_per || 0,
        data.generation_grid || 0,
        data.diff_panel_vs_eb || 0,
        data.diff_panel_eb_per || 0,
        data.power_factor || 0,
        data.breakdown || 0,
        data.Maintenance || 0,
        data.grid_fault || 0,
        data.grid_down || 0,
        data.breakdown_per || 0,
        data.maintenance_per || 0,
        data.grid_fault_per || 0,
        data.grid_down_per || 0,
        data.availablity_impact || 0,
        data.rating || 0,
        data.kvarh_exp_per || 0,
        data.turbine_ok_hrs || 0,
        data.line_hrs || 0,
        data.line_ok_hrs || 0,
        data.diff_panel_vs_eb || 0,
      ]);
    }

    // Check for error report type and errorData
    if (
      formDatarep.report === "daily" &&
      formDatarep.type === "error" &&
      errorData.length > 0
    ) {
      headers = [
        "Turbine No",
        "Location No",
        "Model",
        "Capacity",
        "Site Name",
        "Customer Name",
        "Error Code",
        "Error Type",
        "Event Description",
        "Date",
        "Start",
        "End",
        "Down Time (HRS)",
      ];

      tableData = errorData.flatMap((item) => {
        let rows = [];
        const formatDate = (date) =>
          date ? moment(date).format("DD-MM-YYYY") : "";
        const getErrorDetails = (errorCode) => {
          const errorDetail = errorMainData.find(
            (error) => error.error_id === errorCode
          );
          return {
            errorCode: errorDetail?.error_code || "N/A",
          };
        };
        const getErrorMainDetails = (errorCode) => {
          const errorDetails = maintenData.find(
            (error) => error.maintenance_id === errorCode
          );
          return {
            maintenCode: errorDetails?.maintenance_code || "N/A",
          };
        };
        // First row for errorcode data
        if (item.errorcode) {
          const { errorCode } = getErrorDetails(item.errorcode.error_id);
          rows.push([
            item.wtg_no || "",
            item.loc_no || "",
            item.model_type || "",
            item.capacity || "",
            item.site_name || "",
            item.customer_name || "",
            errorCode,
            item.error_type || "",
            item.errorcode.error_describtion || "",
            formatDate(item.dg_date || ""),
            item.errorcode.error_from || "",
            item.errorcode.error_to || "",
            item.errorcode.error_total || "",
          ]);
        }

        // Second row for errorgriddrop data
        if (item.errorgriddrop) {
          rows.push([
            item.wtg_no || "",
            item.loc_no || "",
            item.model_type || "",
            item.capacity || "",
            item.site_name || "",
            item.customer_name || "",
            item.grid_drop_code || "",
            item.error_type || "",
            item.errorgriddrop.griddrop_name || "",
            item.dg_date || "",
            item.errorgriddrop.griddrop_from || "",
            item.errorgriddrop.griddrop_to || "",
            item.errorgriddrop.griddrop_total || "",
          ]);
        }
        if (item.errorgridfault) {
          rows.push([
            item.wtg_no || "",
            item.loc_no || "",
            item.model_type || "",
            item.capacity || "",
            item.site_name || "",
            item.customer_name || "",
            item.grid_fault_code || "",
            item.error_type || "",
            item.errorgridfault.gridfault_name || "",
            item.dg_date || "",
            item.errorgridfault.gridfault_from || "",
            item.errorgridfault.gridfault_to || "",
            item.errorgridfault.gridfault_total || "",
          ]);
        }
        if (item.errormaintenance) {
          const { maintenCode } = getErrorMainDetails(
            item.errormaintenance.maintenance_id
          );
          rows.push([
            item.wtg_no || "",
            item.loc_no || "",
            item.model_type || "",
            item.capacity || "",
            item.site_name || "",
            item.customer_name || "",
            maintenCode,
            item.error_type || "",
            item.errormaintenance.maintenance_name || "",
            item.dg_date || "",
            item.errormaintenance.maintenance_from || "",
            item.errormaintenance.maintenance_to || "",
            item.errormaintenance.maintenance_total || "",
          ]);
        }
        return rows;
      });
    }

    // If there is data to download
    if (headers.length > 0 && tableData.length > 0) {
      // Create the worksheet
      const ws = XLSX.utils.aoa_to_sheet([headers, ...tableData]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `${formDatarep.report} Report`);

      // Download the Excel file
      XLSX.writeFile(
        wb,
        `${formDatarep.report}_${formDatarep.type}_report.xlsx`
      );
    } else {
      alert("No data available to download");
    }
  };

  return (
    <>
      <div id="main">
        <Container fluid>
          <Row>
            <Col lg="12" md="12" xs="12" className="align-self-center">
              <div className="page-nav py-3">
                <span class="nav-list">DGR REPORT</span>
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
                <label className="mb-2">Customer Name</label>
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
                optionlist={filteredVerifyOptions()}
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
                    label={<>Submit</>}
                    onClick={handleSubmit}
                  ></ClickButton>
                </span>
                <span className="mx-2">
                  <ClickButton
                    label={<>Download Excel</>}
                    onClick={downloadExcel}
                  ></ClickButton>
                </span>
                <span className="mx-2"></span>
              </div>
            </Col>
            <Col lg="4" md="12" xs="12" className="py-3 "></Col>
            <Col lg="12">
              {loading ? (
                <Spinner animation="border" />
              ) : (
                <>
                  {/* Check for daily report and type is 'dgr' */}
                  {formDatarep.report === "daily" &&
                    formDatarep.type === "dgr" &&
                    dgrData.length > 0 && (
                      <div className="table-wrapperDgReport">
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>S.No</th>
                              <th>Date</th>
                              <th>Customer Name</th>
                              <th>WEG No.</th>
                              <th>Loc. No</th>
                              <th>HTSC No. </th>
                              <th>Site </th>
                              <th>Gen 0</th>
                              <th>Gen 1</th>
                              <th>Gen 2</th>
                              <th>Total Production</th>
                              <th>KWH Import EB</th>
                              <th>KWH Export EB</th>
                              <th>Kvarh Imp EB</th>
                              <th>Kvarh exp EB</th>
                              <th>Net Exp</th>
                              <th>Gen 1 hrs</th>
                              <th>Gen 2 hrs</th>
                              <th>Gen Hrs</th>
                              <th>M/c Fault hrs</th>
                              <th>M/c Maintenance hrs</th>
                              <th>Grid fault hrs</th>
                              <th>Grid down hrs</th>
                              <th>Lull hrs</th>
                              <th>Machine Availability %</th>
                              <th>Grid Availability %</th>
                              <th>Kvarh Imp</th>
                              <th>Generation @100 % Grid</th>
                              <th>Diff. (Panel Vs EB)</th>
                              <th>Diff. (Panel Vs EB) %</th>
                              <th>Power factor</th>

                              <th>Lost KWH - Breakdown (units) </th>
                              <th>Lost KWH - Maintenance (units) </th>
                              <th>Lost KWH - Grid Fault (units) </th>
                              <th>Lost KWH - Grid Down (units) </th>
                              <th>Lost KWH - Breakdown (%)</th>
                              <th>Lost KWH - Maintenance (%)</th>
                              <th>Lost KWH - Grid Fault (%)</th>
                              <th>Lost KWH - Grid Down (%)</th>
                              <th>Availablity Impact (%)</th>

                              <th>Rating</th>
                              <th>Kvarh Exp % </th>
                              <th>Turbine OK Hrs</th>
                              <th>Line hrs</th>
                              <th>Line OK hrs</th>
                              <th>Line loss (Units)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dgrData.map((data, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  {moment(data.dg_date).format("DD-MM-YYYY")}
                                </td>
                                <td>{data.customer_name}</td>
                                <td>{data.wtg_no || 0}</td>
                                <td>{data.loc_no || 0}</td>
                                <td>{data.htsc_no || 0}</td>
                                <td>{data.site_name}</td>
                                <td>{data.gen_zero || 0}</td>
                                <td>{data.gen_one || 0}</td>
                                <td>{data.gen_two || 0}</td>
                                <td>{data.total_production || 0}</td>
                                <td>{data.kwh_imp || 0}</td>
                                <td>{data.kwh_exp || 0}</td>
                                <td>{data.kvarh_imp || 0}</td>
                                <td>{data.kvarh_exp || 0}</td>
                                <td>{data.net_exp || 0}</td>
                                <td>{data.gen_onehrs || 0}</td>
                                <td>{data.gen_twohrs || 0}</td>
                                <td>{data.gen_hourtotal || 0}</td>
                                <td>{data.error_overtotal || "00:00"}</td>
                                <td>{data.maintenance_overtotal || "00:00"}</td>
                                <td>{data.gridfault_overtotal || "00:00"}</td>
                                <td>{data.griddrop_overtotal || "00:00"}</td>
                                <td>{data.lull_hrs || 0}</td>
                                <td>{data.machine_availability || 0}</td>
                                <td>{data.grid_availability || 0}</td>
                                <td>{data.kvarh_imp_per || 0}</td>
                                <td>{data.generation_grid || 0}</td>
                                <td>{data.diff_panel_vs_eb || 0}</td>
                                <td>{data.diff_panel_eb_per || 0}</td>
                                <td>{data.power_factor || 0}</td>
                                <td>{data.breakdown || 0}</td>
                                <td>{data.Maintenance || 0}</td>
                                <td>{data.grid_fault || 0}</td>
                                <td>{data.grid_down || 0}</td>
                                <td>{data.breakdown_per || 0}</td>
                                <td>{data.maintenance_per || 0}</td>
                                <td>{data.grid_fault_per || 0}</td>
                                <td>{data.grid_down_per || 0}</td>
                                <td>{data.availablity_impact || 0}</td>
                                <td>{data.rating || 0}</td>
                                <td>{data.kvarh_exp_per || 0}</td>
                                <td>{data.turbine_ok_hrs || 0}</td>
                                <td>{data.line_hrs || 0}</td>
                                <td>{data.line_ok_hrs || 0}</td>
                                <td>{data.diff_panel_vs_eb || 0}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  {/* Monthly DGR Report */}
                  {formDatarep.report === "monthly" &&
                    formDatarep.type === "dgr" &&
                    dgrData.length > 0 && (
                      <div className="table-wrapperDgReport">
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>S.No</th>
                              <th>Month</th>
                              <th>Customer Name</th>
                              <th>WEG No.</th>
                              <th>Loc. No</th>
                              <th>HTSC No. </th>
                              <th>Site </th>
                              <th>Gen 0</th>
                              <th>Gen 1</th>
                              <th>Gen 2</th>
                              <th>Total Production</th>
                              <th>KWH Import EB</th>
                              <th>KWH Export EB</th>
                              <th>Kvarh Imp EB</th>
                              <th>Kvarh exp EB</th>
                              <th>Net Exp</th>
                              <th>Gen 1 hrs</th>
                              <th>Gen 2 hrs</th>
                              <th>Gen Hrs</th>
                              <th>M/c Fault hrs</th>
                              <th>M/c Maintenance hrs</th>
                              <th>Grid fault hrs</th>
                              <th>Grid down hrs</th>
                              <th>Lull hrs</th>
                              <th>Machine Availability %</th>
                              <th>Grid Availability %</th>
                              <th>Kvarh Imp </th>
                              <th>Generation @100 % Grid</th>
                              <th>Diff. (Panel Vs EB)</th>
                              <th>Diff. (Panel Vs EB) %</th>
                              <th>Power factor</th>

                              <th>Lost KWH - Breakdown (units) </th>
                              <th>Lost KWH - Maintenance (units) </th>
                              <th>Lost KWH - Grid Fault (units) </th>
                              <th>Lost KWH - Grid Down (units) </th>
                              <th>Lost KWH - Breakdown (%)</th>
                              <th>Lost KWH - Maintenance (%)</th>
                              <th>Lost KWH - Grid Fault (%)</th>
                              <th>Lost KWH - Grid Down (%)</th>
                              <th>Availablity Impact (%)</th>

                              <th>Rating</th>
                              <th>Kvarh Exp % </th>
                              <th>Turbine OK Hrs</th>
                              <th>Line hrs</th>
                              <th>Line OK hrs</th>
                              <th>Line loss (Units)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dgrData.map((data, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{data.month}</td>
                                <td>{data.customer_name}</td>
                                <td>{data.wtg_no || 0}</td>
                                <td>{data.loc_no || 0}</td>
                                <td>{data.htsc_no || 0}</td>
                                <td>{data.site_name}</td>
                                <td>{data.gen_zero || 0}</td>
                                <td>{data.gen_one || 0}</td>
                                <td>{data.gen_two || 0}</td>
                                <td>{data.total_production || 0}</td>
                                <td>{data.kwh_imp || 0}</td>
                                <td>{data.kwh_exp || 0}</td>
                                <td>{data.kvarh_imp || 0}</td>
                                <td>{data.kvarh_exp || 0}</td>
                                <td>{data.net_exp || 0}</td>
                                <td>{data.gen_onehrs || 0}</td>
                                <td>{data.gen_twohrs || 0}</td>
                                <td>{data.gen_hourtotal || 0}</td>
                                <td>{data.error_overtotal || "00:00"}</td>
                                <td>{data.maintenance_overtotal || "00:00"}</td>
                                <td>{data.gridfault_overtotal || "00:00"}</td>
                                <td>{data.griddrop_overtotal || "00:00"}</td>
                                <td>{data.lull_hrs || 0}</td>
                                <td>{data.machine_availability || 0}</td>
                                <td>{data.grid_availability || 0}</td>
                                <td>{data.kvarh_imp_per || 0}</td>
                                <td>{data.generation_grid || 0}</td>
                                <td>{data.diff_panel_vs_eb || 0}</td>
                                <td>{data.diff_panel_eb_per || 0}</td>
                                <td>{data.power_factor || 0}</td>
                                <td>{data.breakdown || 0}</td>
                                <td>{data.Maintenance || 0}</td>
                                <td>{data.grid_fault || 0}</td>
                                <td>{data.grid_down || 0}</td>
                                <td>{data.breakdown_per || 0}</td>
                                <td>{data.maintenance_per || 0}</td>
                                <td>{data.grid_fault_per || 0}</td>
                                <td>{data.grid_down_per || 0}</td>
                                <td>{data.availablity_impact || 0}</td>
                                <td>{data.rating || 0}</td>
                                <td>{data.kvarh_exp_per || 0}</td>
                                <td>{data.turbine_ok_hrs || 0}</td>
                                <td>{data.line_hrs || 0}</td>
                                <td>{data.line_ok_hrs || 0}</td>
                                <td>{data.diff_panel_vs_eb || 0}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  {formDatarep.report === "yearly" &&
                    formDatarep.type === "dgr" &&
                    dgrData.length > 0 && (
                      <div className="table-wrapperDgReport">
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>S.No</th>
                              <th>Year</th>
                              <th>Customer Name</th>
                              <th>WEG No.</th>
                              <th>Loc. No</th>
                              <th>HTSC No.</th>
                              <th>Site</th>
                              <th>Gen 0</th>
                              <th>Gen 1</th>
                              <th>Gen 2</th>
                              <th>Total Production</th>
                              <th>KWH Import EB</th>
                              <th>KWH Export EB</th>
                              <th>Kvarh Imp EB</th>
                              <th>Kvarh exp EB</th>
                              <th>Net Exp</th>
                              <th>Gen 1 hrs</th>
                              <th>Gen 2 hrs</th>
                              <th>Gen Hrs</th>
                              <th>M/c Fault hrs</th>
                              <th>M/c Maintenance hrs</th>
                              <th>Grid fault hrs</th>
                              <th>Grid down hrs</th>
                              <th>Lull hrs</th>
                              <th>Machine Availability %</th>
                              <th>Grid Availability %</th>
                              <th>Kvarh Imp </th>
                              <th>Generation @100 % Grid</th>
                              <th>Diff. (Panel Vs EB)</th>
                              <th>Diff. (Panel Vs EB) %</th>
                              <th>Power factor</th>

                              <th>Lost KWH - Breakdown (units)</th>
                              <th>Lost KWH - Maintenance (units)</th>
                              <th>Lost KWH - Grid Fault (units)</th>
                              <th>Lost KWH - Grid Down (units)</th>
                              <th>Lost KWH - Breakdown (%)</th>
                              <th>Lost KWH - Maintenance (%)</th>
                              <th>Lost KWH - Grid Fault (%)</th>
                              <th>Lost KWH - Grid Down (%)</th>
                              <th>Availablity Impact (%)</th>

                              <th>Rating</th>
                              <th>Kvarh Exp %</th>
                              <th>Turbine OK Hrs</th>
                              <th>Line hrs</th>
                              <th>Line OK hrs</th>
                              <th>Line loss (Units)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dgrData.map((data, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{data.year}</td>
                                <td>{data.customer_name}</td>
                                <td>{data.wtg_no || 0}</td>
                                <td>{data.loc_no || 0}</td>
                                <td>{data.htsc_no || 0}</td>
                                <td>{data.site_name}</td>
                                <td>{data.gen_zero || 0}</td>
                                <td>{data.gen_one || 0}</td>
                                <td>{data.gen_two || 0}</td>
                                <td>{data.total_production || 0}</td>
                                <td>{data.kwh_imp || 0}</td>
                                <td>{data.kwh_exp || 0}</td>
                                <td>{data.kvarh_imp || 0}</td>
                                <td>{data.kvarh_exp || 0}</td>
                                <td>{data.net_exp || 0}</td>
                                <td>{data.gen_onehrs || 0}</td>
                                <td>{data.gen_twohrs || 0}</td>
                                <td>{data.gen_hourtotal || 0}</td>
                                <td>{data.error_overtotal || "00:00"}</td>
                                <td>{data.maintenance_overtotal || "00:00"}</td>
                                <td>{data.gridfault_overtotal || "00:00"}</td>
                                <td>{data.griddrop_overtotal || "00:00"}</td>
                                <td>{data.lull_hrs || 0}</td>
                                <td>{data.machine_availability || 0}</td>
                                <td>{data.grid_availability || 0}</td>
                                <td>{data.kvarh_imp_per || 0}</td>
                                <td>{data.generation_grid || 0}</td>
                                <td>{data.diff_panel_vs_eb || 0}</td>
                                <td>{data.diff_panel_eb_per || 0}</td>
                                <td>{data.power_factor || 0}</td>
                                <td>{data.breakdown || 0}</td>
                                <td>{data.Maintenance || 0}</td>
                                <td>{data.grid_fault || 0}</td>
                                <td>{data.grid_down || 0}</td>
                                <td>{data.breakdown_per || 0}</td>
                                <td>{data.maintenance_per || 0}</td>
                                <td>{data.grid_fault_per || 0}</td>
                                <td>{data.grid_down_per || 0}</td>
                                <td>{data.availablity_impact || 0}</td>
                                <td>{data.rating || 0}</td>
                                <td>{data.kvarh_exp_per || 0}</td>
                                <td>{data.turbine_ok_hrs || 0}</td>
                                <td>{data.line_hrs || 0}</td>
                                <td>{data.line_ok_hrs || 0}</td>
                                <td>{data.diff_panel_vs_eb || 0}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  {/* Check for daily report and type is 'error' */}
                  {formDatarep.report === "daily" &&
                    formDatarep.type === "error" &&
                    errorData.length > 0 && (
                      <div className="table-wrapperDgReport">
                        <Table striped bordered>
                          <thead>
                            <tr>
                              <th>Turbine No</th>
                              <th>Location No</th>
                              <th>Model</th>
                              <th>Capacity</th>
                              <th>Site Name</th>
                              <th>Customer Name</th>
                              <th>Error Code</th>
                              <th>Error Type</th>
                              <th>Event Description</th>
                              <th>Date</th>
                              <th>Start</th>
                              <th>End</th>
                              <th>Down Time (HRS)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {errorData.map((item, index) => (
                              <>
                                {/* First row for errorcode data */}
                                {item.errorcode && (
                                  <tr key={`errorcode-${index}`}>
                                    <td>{item.wtg_no}</td>
                                    <td>{item.loc_no}</td>
                                    <td>{item.model_type}</td>
                                    <td>{item.capacity}</td>
                                    <td>{item.site_name}</td>
                                    <td>{item.customer_name}</td>
                                    <td>
                                      {errorMainData.find(
                                        (error) =>
                                          error.error_id ===
                                          item.errorcode.error_id
                                      )?.error_code || "N/A"}
                                    </td>
                                    <td>{item.error_type}</td>
                                    <td>{item.errorcode.error_describtion}</td>
                                    <td>
                                      {moment(item.dg_date).format(
                                        "DD-MM-YYYY"
                                      )}
                                    </td>
                                    <td>{item.errorcode.error_from}</td>
                                    <td>{item.errorcode.error_to}</td>
                                    <td>{item.errorcode.error_total}</td>
                                  </tr>
                                )}
                                {/* Second row for errorgriddrop data */}
                                {item.errorgriddrop && (
                                  <tr key={`errorgriddrop-${index}`}>
                                    <td>{item.wtg_no}</td>
                                    <td>{item.loc_no}</td>
                                    <td>{item.model_type}</td>
                                    <td>{item.capacity}</td>
                                    <td>{item.site_name}</td>
                                    <td>{item.customer_name}</td>
                                    <td>{item.grid_drop_code}</td>
                                    <td>{item.error_type}</td>
                                    <td>{item.errorgriddrop.griddrop_name}</td>
                                    <td>
                                      {moment(item.dg_date).format(
                                        "DD-MM-YYYY"
                                      )}
                                    </td>
                                    <td>{item.errorgriddrop.griddrop_from}</td>
                                    <td>{item.errorgriddrop.griddrop_to}</td>
                                    <td>{item.errorgriddrop.griddrop_total}</td>
                                  </tr>
                                )}
                                {item.errorgridfault && (
                                  <tr key={`errorgridfault-${index}`}>
                                    <td>{item.wtg_no}</td>
                                    <td>{item.loc_no}</td>
                                    <td>{item.model_type}</td>
                                    <td>{item.capacity}</td>
                                    <td>{item.site_name}</td>
                                    <td>{item.customer_name}</td>
                                    <td>{item.grid_fault_code}</td>
                                    <td>{item.error_type}</td>
                                    <td>
                                      {item.errorgridfault.gridfault_name}
                                    </td>
                                    <td>
                                      {moment(item.dg_date).format(
                                        "DD-MM-YYYY"
                                      )}
                                    </td>
                                    <td>
                                      {item.errorgridfault.gridfault_from}
                                    </td>
                                    <td>{item.errorgridfault.gridfault_to}</td>
                                    <td>
                                      {item.errorgridfault.gridfault_total}
                                    </td>
                                  </tr>
                                )}
                                {item.errormaintenance && (
                                  <tr key={`errormaintenance-${index}`}>
                                    <td>{item.wtg_no}</td>
                                    <td>{item.loc_no}</td>
                                    <td>{item.model_type}</td>
                                    <td>{item.capacity}</td>
                                    <td>{item.site_name}</td>
                                    <td>{item.customer_name}</td>
                                    <td>
                                      {maintenData.find(
                                        (error) =>
                                          error.maintenance_id ===
                                          item.errormaintenance.maintenance_id
                                      )?.maintenance_code || "N/A"}
                                    </td>
                                    <td>{item.error_type}</td>
                                    <td>
                                      {item.errormaintenance.maintenance_name}
                                    </td>
                                    <td>
                                      {moment(item.dg_date).format(
                                        "DD-MM-YYYY"
                                      )}
                                    </td>
                                    <td>
                                      {item.errormaintenance.maintenance_from}
                                    </td>
                                    <td>
                                      {item.errormaintenance.maintenance_to}
                                    </td>
                                    <td>
                                      {item.errormaintenance.maintenance_total}
                                    </td>
                                  </tr>
                                )}
                              </>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                </>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};
export default DgReport;
