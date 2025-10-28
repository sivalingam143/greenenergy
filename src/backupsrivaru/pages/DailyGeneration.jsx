import React, { useState, useEffect, useRef } from "react";
import { Container, Col, Row, Form, Modal, Table } from "react-bootstrap";
import { FaAngleRight } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import TableUI from "../components/Table";
import Pagnation from "../components/Pagnation";
import { ClickButton, Delete, Buttons } from "../components/ClickButton";
import { Calender, TextInputForm } from "../components/Forms";
import { useNavigate } from "react-router-dom";
import { MdDriveFolderUpload } from "react-icons/md";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { MdKeyboardArrowRight } from "react-icons/md";
import moment from "moment/moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineClose } from "react-icons/md";
import { PageTitle } from "../components/PageTitle";
import { FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";
import * as XLSX from 'xlsx';
// const UserTablehead = [
//   "No",
//   <span onClick={sortTurbine}>
//     Turbine No <FaAngleRight />
//   </span>,
//   <span onClick={sortDate}>
//     Date <FaAngleRight />
//   </span>,
//   "OverTotalHours",
//
// ];

const DailyGeneration = ({ onFileChange }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [viewDgr, setviewDgr] = useState(false);
  const closeModal = () => setviewDgr(false);
  const showModal = () => {
    setviewDgr(true);
    setShow(false);
  };

  const [viewDgrUn, setviewDgrUn] = useState(false);
  const closeModalUn = () => setviewDgrUn(false);
  const showModalun = () => {
    setviewDgrUn(true);
    setShow(false);
  };
  const [sortOrderTurbine, setSortOrderTurbine] = useState("asc");
  const [sortOrderDate, setSortOrderDate] = useState("asc");
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      // Call the callback function passed as a prop
      onFileChange(file);
    }
  };
  const [userData, setUserData] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [userDataMain, setUserDataMain] = useState([]);
  const [userDataGridfault, setUserDataGridfault] = useState([]);
  const [userDataGriddrop, setUserDataGriddrop] = useState([]);
  const [userDataTurbine, setUserDataTurbine] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const handleSearch = (value) => {
    setSearchText(value);
  };
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://api.demos.srivarugreenenergy.com/daily_generation/list.php",
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
      //setLoading(false);
      if (responseData.status === 200) {
       
        setUserData(responseData.data.daily_generation);
      } else {
        throw new Error(responseData.msg);
      }

      const errorResponse = await fetch(
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

      if (!errorResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const errorResponseData = await errorResponse.json();
      //setLoading(false);
      if (errorResponseData.status === 200) {
        setErrorData(errorResponseData.data.error);
      } else {
        throw new Error(errorResponseData.msg);
      }


      const maintenanceResponse = await fetch(
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

      if (!maintenanceResponse.ok) {
        throw new Error("Failed to fetch data");
      }
      const maintenanceresponseData = await maintenanceResponse.json();
      setLoading(false);
      if (maintenanceresponseData.status === 200) {
        setUserDataMain(maintenanceresponseData.data.maintenance);
      } else {
        throw new Error(maintenanceresponseData.msg);
      }

      const gridFaultResponse = await fetch(
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

      if (!gridFaultResponse.ok) {
        throw new Error("Failed to fetch data");
      }
      const gridFaultResponseData = await gridFaultResponse.json();
      setLoading(false);
      if (gridFaultResponseData.status === 200) {
        setUserDataGridfault(gridFaultResponseData.data.grid_fault);
      } else {
        throw new Error(gridFaultResponseData.msg);
      }


      const gridDropResponse = await fetch(
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

      if (!gridDropResponse.ok) {
        throw new Error("Failed to fetch data");
      }
      const gridDropResponseData = await gridDropResponse.json();
      setLoading(false);
      if (gridDropResponseData.status === 200) {
        setUserDataGriddrop(gridDropResponseData.data.grid_drop);
      } else {
        throw new Error(gridDropResponseData.msg);
      }

      const turbineResponse = await fetch(
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

      if (!turbineResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const turbineResponseData = await turbineResponse.json();
      setLoading(false);
      if (turbineResponseData.status === 200) {
        setUserDataTurbine(turbineResponseData.data.turbine);
      } else {
        throw new Error(turbineResponseData.msg);
      }


      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchText]);

  const [formData, setFormData] = useState({
    date: "",
  });
  const [verifiedData, setVerifiedData] = useState({
    verifiedCount: 0,
    updateCount: 0,
    balance: 0,
    customerdetails: [
      {
        wtg_no: "",
        customer_name: "",
      },
    ],
  });
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
  const fetchDatas = async () => {
    try {
      const response = await fetch(
        "https://api.demos.srivarugreenenergy.com/daily_generation/dgrverified.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: formData.date,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const responseData = await response.json();

      if (responseData.status === 200) {
        setVerifiedData({
          verifiedCount: responseData.data.verified.verifiedcount || 0,
          updateCount: responseData.data.verified.updatecount || 0,
          balance: responseData.data.verified.balance || 0,
          customerdetails: responseData.data.verified.customer_details || 0,
        });
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      toast.error("Failed to fetch data. Please try again later.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchDatas();
  };
  const sortTurbine = () => {
    const sortedData = [...userData].sort((a, b) => {
      const wtgNoA = String(a.wtg_no);
      const wtgNoB = String(b.wtg_no);
      if (sortOrderTurbine === "asc") {
        return wtgNoA.localeCompare(wtgNoB);
      } else {
        return wtgNoB.localeCompare(wtgNoA);
      }
    });
    setUserData(sortedData);
    setSortOrderTurbine(sortOrderTurbine === "asc" ? "desc" : "asc");
  };
  const sortDate = () => {
    const sortedData = [...userData].sort((a, b) => {
      const dateA = new Date(a.dg_date).getTime();
      const dateB = new Date(b.dg_date).getTime();
      return sortOrderDate === "asc" ? dateA - dateB : dateB - dateA;
    });
    setUserData(sortedData);
    setSortOrderDate(sortOrderDate === "asc" ? "desc" : "asc");
  };

  const UserTablehead = [
    "No",
    <span onClick={sortTurbine} style={{ cursor: "pointer" }}>
      Turbine No <FaSortAlphaDown />
    </span>,
    <span onClick={sortDate} style={{ cursor: "pointer" }}>
      Date <FaSortAlphaDown />
    </span>,
    "Over Total Hours",
  ];



  const fileInputRef = useRef(null);

  const uploadExcel = () => {
    fileInputRef.current.click();
  };


  const calculateTimeDifference = (start, end) => {
    if (!start || !end) return "00:00";

    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);

    let startTotalMinutes = startHours * 60 + startMinutes;
    let endTotalMinutes = endHours * 60 + endMinutes;

    // If end time is less than start time, assume it passed midnight
    if (endTotalMinutes < startTotalMinutes) {
      endTotalMinutes += 24 * 60;
    }

    const diffMinutes = endTotalMinutes - startTotalMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };


  const handleExcelFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // All sheets read
      const defaultSheet = XLSX.utils.sheet_to_json(workbook.Sheets['DEFAULT']);
      const machineFaultSheet = XLSX.utils.sheet_to_json(workbook.Sheets['MACHINE FAULT']);
      const maintenanceSheet = XLSX.utils.sheet_to_json(workbook.Sheets['MAINTENANCE']);
      const gridFaultSheet = XLSX.utils.sheet_to_json(workbook.Sheets['GRID FAULT']);
      const gridDropSheet = XLSX.utils.sheet_to_json(workbook.Sheets['GRID DROP']);


      // Correct the Date field
      const formatDates = (data) => {
        return data.map((row) => ({
          ...row,
          Date: row.Date ? excelSerialDateToJSDate(row.Date) : null,
          "From": typeof row["From"] === "number" ? excelTimeToHHMM(row["From"]) : row["From"],
          "To": typeof row["To"] === "number" ? excelTimeToHHMM(row["To"]) : row["To"],
        }));
      };


      const finalData = defaultSheet.map((defaultRow) => {

        defaultRow = {
          ...defaultRow,
          Date: defaultRow.Date ? excelSerialDateToJSDate(defaultRow.Date) : null,
          "Gen 1 hrs": typeof defaultRow["Gen 1 hrs"] === "number" ? excelTimeToHHMM(defaultRow["Gen 1 hrs"]) : defaultRow["Gen 1 hrs"],
          "Gen 2 hrs": typeof defaultRow["Gen 2 hrs"] === "number" ? excelTimeToHHMM(defaultRow["Gen 2 hrs"]) : defaultRow["Gen 2 hrs"],
        }


        const { Date, 'Turbine No': TurbineNo } = defaultRow;



        var machineFault = formatDates(machineFaultSheet);
        machineFault = machineFault.filter(row => row.Date === Date && row['Turbine No'] === TurbineNo);
        var maintenanceFault = formatDates(maintenanceSheet);
        maintenanceFault = maintenanceFault.filter(row => row.Date === Date && row['Turbine No'] === TurbineNo);

        var gridFault = formatDates(gridFaultSheet);
        gridFault = gridFault.filter(row => row.Date === Date && row['Turbine No'] === TurbineNo);

        var gridDrop = formatDates(gridDropSheet);
        gridDrop = gridDrop.filter(row => row.Date === Date && row['Turbine No'] === TurbineNo);

        // machineFault =  machineFault ? [machineFault] : [];
        // maintenanceFault = maintenanceFault ? [maintenanceFault] : [];
        // gridFault = gridFault ? [gridFault] : [];
        // gridDrop = gridDrop ? [gridDrop] : [];


        machineFault = machineFault && machineFault.length > 0 ? machineFault.map((data) => {

          const matchedError = errorData.find(row => row.error_code == data["Error Code"]);
          const fromTime = data["From"];
          const toTime = data["To"];
          const totalTime = calculateTimeDifference(fromTime, toTime);

          return {
            "error_id": matchedError ? matchedError.error_id : "",
            "error_describtion": matchedError ? matchedError.error_describtion : "",
            "error_from": fromTime,
            "error_to": toTime,
            "error_total": totalTime
          };

        }) : [{
          "error_id": "",
          "error_describtion": "",
          "error_from": "",
          "error_to": "",
          "error_total": ""
        }];


        maintenanceFault = maintenanceFault && maintenanceFault.length > 0 ? maintenanceFault.map((data) => {

          const matchedError = userDataMain.find(row => row.maintenance_code == data["Maintenance Code"]);
          const fromTime = data["From"];
          const toTime = data["To"];
          const totalTime = calculateTimeDifference(fromTime, toTime);
          return {
            "maintenance_id": matchedError ? matchedError.maintenance_id : "",
            "maintenance_name": matchedError ? matchedError.maintenance_describtion : "",
            "maintenance_from": fromTime,
            "maintenance_to": toTime,
            "maintenance_total": totalTime
          }

        }) : [
          {
            "maintenance_id": "",
            "maintenance_name": "",
            "maintenance_from": "",
            "maintenance_to": "",
            "maintenance_total": ""
          }
        ];


        gridFault = gridFault && gridFault.length > 0 ? gridFault.map((data) => {
          const matchedError = userDataGridfault.find(row => row.grid_fault_code == data["Grid Fault Code"]);
          const fromTime = data["From"];
          const toTime = data["To"];
          const totalTime = calculateTimeDifference(fromTime, toTime);

          return {
            "gridfault_id": matchedError ? matchedError.grid_fault_id : "",
            "gridfault_name": matchedError ? matchedError.grid_fault_describtion : "",
            "gridfault_from": fromTime,
            "gridfault_to": toTime,
            "gridfault_total": totalTime
          }

        }) : [
          {
            "gridfault_id": "",
            "gridfault_name": "",
            "gridfault_from": "",
            "gridfault_to": "",
            "gridfault_total": ""
          }
        ];

        gridDrop = gridDrop && gridDrop.length > 0 ? gridDrop.map((data) => {
          const matchedError = userDataGriddrop.find(row => row.grid_fault_code == data["Grid Drop Code"]);
          const fromTime = data["From"];
          const toTime = data["To"];
          const totalTime = calculateTimeDifference(fromTime, toTime);
          return {
            "griddrop_id": matchedError ? matchedError.grid_drop_id : "",
            "griddrop_name": matchedError ? matchedError.grid_drop_describtion : "",
            "griddrop_from": fromTime,
            "griddrop_to": toTime,
            "griddrop_total": totalTime,
          }

        }) : [
          {
            "griddrop_id": "",
            "griddrop_name": "",
            "griddrop_from": "",
            "griddrop_to": "",
            "griddrop_total": "",
          }
        ];

        const timeToMinutes = (timeStr) => {
          if (!timeStr) return 0;
          const [hours, minutes] = timeStr.split(':').map(Number);
          return hours * 60 + minutes;
        };

        // Step 2: Function to convert total minutes to HH:MM
        const minutesToHHMM = (totalMinutes) => {
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        };


        const total_production =
          (parseFloat(defaultRow["Gen 0"]) || 0) +
          (parseFloat(defaultRow["Gen 1"]) || 0) +
          (parseFloat(defaultRow["Gen 2"]) || 0);

        const genHourTotalMinutes = timeToMinutes(defaultRow["Gen 1 hrs"]) + timeToMinutes(defaultRow["Gen 2 hrs"]);
        const errorOverTotalMinutes = machineFault.reduce((sum, item) => sum + timeToMinutes(item.error_total), 0);
        const maintenanceOverTotalMinutes = maintenanceFault.reduce((sum, item) => sum + timeToMinutes(item.maintenance_total), 0);
        const gridFaultOverTotalMinutes = gridFault.reduce((sum, item) => sum + timeToMinutes(item.gridfault_total), 0);
        const gridDropOverTotalMinutes = gridDrop.reduce((sum, item) => sum + timeToMinutes(item.griddrop_total), 0);

        const overtotal_hours = minutesToHHMM(
          genHourTotalMinutes +
          errorOverTotalMinutes +
          maintenanceOverTotalMinutes +
          gridFaultOverTotalMinutes +
          gridDropOverTotalMinutes
        );

        const turbineDetail = userDataTurbine.find(row => row.wtg_no == defaultRow["Turbine No"]);

        return {
          "dg_date": defaultRow["Date"],
          "turbine_id": turbineDetail.turbine_id,
          "location_no": defaultRow["Location No"],
          "gen_zero": defaultRow["Gen 0"],
          "gen_one": defaultRow["Gen 1"],
          "gen_two": defaultRow["Gen 2"],
          "total_production": total_production,
          "gen_onehrs": defaultRow["Gen 1 hrs"],
          "gen_twohrs": defaultRow["Gen 2 hrs"],
          "gen_hourtotal": minutesToHHMM(timeToMinutes(defaultRow["Gen 1 hrs"]) + timeToMinutes(defaultRow["Gen 2 hrs"])),
          "kwh_imp": defaultRow["KWH imp (EB)"],
          "kwh_exp": defaultRow["KWH Exp (EB)"],
          "kvarh_imp": defaultRow["KVARH Imp (EB)"],
          "kvarh_exp": defaultRow["KVARH Exp (EB)"],
          "errorcode": machineFault,
          "error_overtotal": minutesToHHMM(
            machineFault.reduce((sum, item) => sum + timeToMinutes(item.error_total), 0)
          ),
          "errormaintenance": maintenanceFault,
          "maintenance_overtotal": minutesToHHMM(
            maintenanceFault.reduce((sum, item) => sum + timeToMinutes(item.maintenance_total), 0)
          ),
          "errorgridfault": gridFault,
          "gridfault_overtotal": minutesToHHMM(
            gridFault.reduce((sum, item) => sum + timeToMinutes(item.gridfault_total), 0)
          ),
          "errorgriddrop": gridDrop,
          "griddrop_overtotal": minutesToHHMM(
            gridDrop.reduce((sum, item) => sum + timeToMinutes(item.griddrop_total), 0)
          ),
          "overtotal_hours": overtotal_hours,
          "remarks": defaultRow["Remarks"],
        };
      });
      submitEvent(finalData);
    };

    reader.readAsArrayBuffer(file);





    // You can add logic here to process the Excel file
  };
  const submitEvent = async (finalData) => {
    try {
      setIsLoading(true); // Show loader

      const bulkResponse = await fetch(
        "https://api.demos.srivarugreenenergy.com/daily_generation/bulkcreate.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ excel_data: finalData }),
        }
      );

      const BulkResponseData = await bulkResponse.json();

      if (BulkResponseData.status == 200) {
        successAlert(BulkResponseData.msg);
        fetchData();
      } else if (BulkResponseData.status == 400) {
        errorAlert(BulkResponseData.msg);
      } else {
        setShowAlert(true);
      }
    } catch (error) {
      errorAlert("Upload failed. Please try again.");
    } finally {
      setIsLoading(false); // Hide loader
    }
  };


  const excelSerialDateToJSDate = (serial) => {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    return date_info.toISOString().split('T')[0];
  };

  const excelTimeToHHMM = (excelTime) => {
    const totalMinutes = Math.round(excelTime * 24 * 60); // excelTime * 24 hours * 60 minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div id="main">
        <Container fluid>
          <Row>
            <Col lg="7" md="6" xs="3" className="align-self-center">
              <div className="page-nav py-3">
                <span class="nav-list">Daily Generation</span>
              </div>
            </Col>
            <Col lg="5" md="6" xs="9" className="align-self-center py-3">
              <div className="d-flex justify-content-end">
                <div className="px-2">
                  {/* <ClickButton
                  label={<>Bulk Upload</>}
                  className="create-btn "
                  onClick={uploadExcel}
                ></ClickButton> */}
                  <ClickButton
                    label={isLoading ? "Uploading..." : <>Bulk Upload</>}
                    className="create-btn"
                    onClick={!isLoading ? uploadExcel : null} // Prevent double click
                    disabled={isLoading}
                  />
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    ref={fileInputRef}
                    onChange={handleExcelFileChange}
                    style={{ display: 'none' }}
                  />
                  {isLoading && (
                    <div className="mt-2 text-primary">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Uploading...</span>
                      </div>
                      <span className="ms-2">Uploading...</span>
                    </div>
                  )}
                </div>
                <div className="px-2">
                  <ClickButton
                    label={<>Verify DGR</>}
                    className="create-btn "
                    onClick={handleShow}
                  ></ClickButton>
                </div>
                <div className="px-2">
                  <ClickButton
                    label={<>Add New</>}
                    className="create-btn "
                    onClick={() => navigate("/dgr/create")}
                  ></ClickButton>
                </div>
              </div>
            </Col>
            <Col lg="3" md="5" xs="12" className="py-1">
              <Form className="form page-nav">
                <TextInputForm
                  placeholder={"Turbine No"}
                  onChange={(e) => handleSearch(e.target.value)}
                  prefix_icon={<FaMagnifyingGlass />}
                >
                  {" "}
                </TextInputForm>
              </Form>
            </Col>

            <Col lg="12" md="12" xs="12" className="px-0">
              <div className="py-2 c-table table-scroll">
                <TableUI
                  headers={UserTablehead}
                  body={userData}
                  onDelete={fetchData}
                  pageview={"yes"}
                  style={{ borderRadius: "5px" }}
                  type="dailygen"
                />
              </div>
            </Col>
            <>
              <Modal show={show} centered size="lg">
                <Modal.Header closeButton>
                  <Modal.Title>DGR Verification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div>
                    <Tabs
                      defaultActiveKey="verified"
                      id="justify-tab-example"
                      className="mb-3"
                      justify
                    >
                      <Tab eventKey="verified" title="Verified">
                        <div className="d-flex">
                          <span className="mx-2">
                            <div className="w-70">
                              <Calender
                                setLabel={(date) => setLabel(date, "date")}
                                selectedDate={formData.date}
                                calenderlabel="Date"
                              />
                            </div>
                          </span>
                          <span className="mx-2 mt-3">
                            <ClickButton
                              label={<>Submit</>}
                              onClick={handleSubmit}
                            ></ClickButton>
                          </span>
                        </div>
                        <Table>
                          <tr>
                            <td>Verified Count</td>
                            <td>Update DGR Count</td>
                            <td>Balance </td>
                            <td className="text-center"># </td>
                          </tr>
                          <tbody>
                            <tr>
                              <td>{verifiedData.verifiedCount}</td>
                              <td>{verifiedData.updateCount}</td>
                              <td>{verifiedData.balance}</td>
                              <td className="text-center">
                                <ClickButton
                                  label={
                                    <>
                                      View
                                      <span>
                                        <MdKeyboardArrowRight />
                                      </span>
                                    </>
                                  }
                                  onClick={showModal}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Tab>
                    </Tabs>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <ClickButton
                    label={<>Cancel</>}
                    onClick={handleClose}
                  ></ClickButton>
                  <ClickButton label={<>Submit</>}></ClickButton>
                </Modal.Footer>
              </Modal>
            </>
            <>
              <Modal show={viewDgr} centered size="xs" onHide={closeModal}>
                <Modal.Body>
                  <Row>
                    <Col lg="6" className="py-3">
                      <PageTitle PageTitle={<>Verified DGR list</>} />
                    </Col>
                    <Col lg="6" className="align-self-center py-3">
                      <div className="text-end">
                        <ClickButton
                          onClick={closeModal}
                          label={
                            <>
                              <MdOutlineClose className="icon-style" />
                            </>
                          }
                        ></ClickButton>
                      </div>
                    </Col>
                  </Row>
                  <Container>
                    <Row>
                      <Col xs={12}>
                        <div className="table-wrapper">
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr>
                                <th style={{ border: '1px solid black', padding: '8px' }}>S.No</th>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Turbine No</th>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Customer Name</th>
                              </tr>
                            </thead>
                            <tbody>
                              {verifiedData.customerdetails.map((verifi, verifie) => (
                                <tr key={verifie}>
                                  <td style={{ border: '1px solid black', padding: '8px' }}>{verifie + 1}</td>
                                  <td style={{ border: '1px solid black', padding: '8px' }}>{verifi.wtg_no}</td>
                                  <td style={{ border: '1px solid black', padding: '8px' }}>{verifi.customer_name}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </Modal.Body>
              </Modal>
            </>
            <>
              <Modal show={viewDgrUn} centered size="xs" onHide={closeModalUn}>
                <Modal.Header closeButton>
                  <Modal.Title>UN Verified DGR list</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Container>
                    <Row>
                      <Col xs={12}>
                        <table>
                          <tr>
                            <td>Turbine No</td>
                            <td>Customer Name</td>
                            <td className="text-center">#</td>
                          </tr>
                          <tbody>
                            <tr>
                              <td>142</td>
                              <td>TR Marketing</td>
                              <td className="text-end">
                                <div>
                                  <Delete
                                    label={<> View</>}
                                    onClick={() =>
                                      navigate("/console/dailygeneration/create")
                                    }
                                  />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </Col>
                    </Row>
                  </Container>
                </Modal.Body>
              </Modal>
            </>
          </Row>
        </Container>
        <ToastContainer />
      </div>
    </>

  );
};

export default DailyGeneration;
