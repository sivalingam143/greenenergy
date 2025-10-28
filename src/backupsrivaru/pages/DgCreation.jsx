import React, { useState, useEffect } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import PageNav from "../components/PageNav";
import { TextInputForm, Calender, DropDownUI } from "../components/Forms";
import { ClickButton } from "../components/ClickButton";
import { BiPlus } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import { MdOutlineDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment/moment";
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
const DgCreation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { type, rowData } = location.state || {};
  const initialState =
    type === "edit"
      ? { ...rowData }
      : {
          daily_generation_id: "",
          dg_date: "",
          turbine_id: "",
          location_no: "",
          gen_zero: "",
          gen_one: "",
          gen_two: "",
          total_production: "",
          gen_onehrs: "00:00",
          gen_twohrs: "00:00",
          gen_hourtotal: "",
          kwh_imp: "",
          kwh_exp: "",
          kvarh_imp: "",
          kvarh_exp: "",
          errorcode: [
            {
              error_id: "",
              error_describtion: "",
              error_from: "",
              error_to: "",
              error_total: "",
            },
          ],
          error_overtotal: "",
          errormaintenance: [
            {
              maintenance_id: "",
              maintenance_name: "",
              maintenance_from: "",
              maintenance_to: "",
              maintenance_total: "",
            },
          ],
          maintenance_overtotal: "",
          errorgridfault: [
            {
              gridfault_id: "",
              gridfault_name: "",
              gridfault_from: "",
              gridfault_to: "",
              gridfault_total: "",
            },
          ],
          gridfault_overtotal: "",
          errorgriddrop: [
            {
              griddrop_id: "",
              griddrop_name: "",
              griddrop_from: "",
              griddrop_to: "",
              griddrop_total: "",
            },
          ],
          griddrop_overtotal: "",
          overtotal_hours: "",
          remarks: "",
        };
  const [formData, setFormData] = useState(initialState);
  console.log("formData", formData);
  console.log("formData", formData);
  const setLabel = (value, field) => {
    setFormData({
      ...formData,
      [field]: moment(value).format("YYYY-MM-DD"), // Update the specified field in formData with the provided value
    });
  };
  const handleChange = (e, fieldName, index = null, type = "error") => {
    const value = e.target ? e.target.value : e.value;

    setFormData((prevState) => {
      const newState = { ...prevState };

      if (type === "error") {
        if (index !== null) {
          newState.errorcode[index][fieldName] = value;

          if (fieldName === "error_from" || fieldName === "error_to") {
            const errorFrom = newState.errorcode[index].error_from;
            const errorTo = newState.errorcode[index].error_to;
            newState.errorcode[index].error_total = calculateTimeError(
              errorFrom,
              errorTo
            );
          }
          newState.error_overtotal = calculateErrorOverTotal(
            newState.errorcode
          );
        } else {
          newState[fieldName] = value;
        }
      } else if (type === "maintenance") {
        if (index !== null) {
          newState.errormaintenance[index][fieldName] = value;

          if (
            fieldName === "maintenance_from" ||
            fieldName === "maintenance_to"
          ) {
            const maintenanceFrom =
              newState.errormaintenance[index].maintenance_from;
            const maintenanceTo =
              newState.errormaintenance[index].maintenance_to;
            newState.errormaintenance[index].maintenance_total =
              calculateTimeError(maintenanceFrom, maintenanceTo);
          }
          newState.maintenance_overtotal = calculateMaintenanceOverTotal(
            newState.errormaintenance
          );
        } else {
          newState[fieldName] = value;
        }
      } else if (type === "gridfault") {
        if (index !== null) {
          newState.errorgridfault[index][fieldName] = value;

          if (fieldName === "gridfault_from" || fieldName === "gridfault_to") {
            const gridfaultFrom = newState.errorgridfault[index].gridfault_from;
            const gridfaultTo = newState.errorgridfault[index].gridfault_to;
            newState.errorgridfault[index].gridfault_total = calculateTimeError(
              gridfaultFrom,
              gridfaultTo
            );
          }
          newState.gridfault_overtotal = calculateGridFaultOverTotal(
            newState.errorgridfault
          );
        } else {
          newState[fieldName] = value;
        }
      } else if (type === "griddrop") {
        if (index !== null) {
          newState.errorgriddrop[index][fieldName] = value;

          if (fieldName === "griddrop_from" || fieldName === "griddrop_to") {
            const griddropFrom = newState.errorgriddrop[index].griddrop_from;
            const griddropTo = newState.errorgriddrop[index].griddrop_to;
            newState.errorgriddrop[index].griddrop_total = calculateTimeError(
              griddropFrom,
              griddropTo
            );
          }
          newState.griddrop_overtotal = calculateGridDropOverTotal(
            newState.errorgriddrop
          );
        } else {
          newState[fieldName] = value;
        }
      }

      if (
        fieldName === "gen_zero" ||
        fieldName === "gen_one" ||
        fieldName === "gen_two"
      ) {
        newState.total_production = calculateTotalProduction(
          newState.gen_zero,
          newState.gen_one,
          newState.gen_two
        );
      }
      if (fieldName === "gen_onehrs" || fieldName === "gen_twohrs") {
        newState.gen_hourtotal = calculateTotalHours(
          newState.gen_onehrs,
          newState.gen_twohrs
        );
      }

      return newState;
    });
  };

  const timeToMinutes = (time) => {
    if (!time) return 0;

    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  useEffect(() => {
    // Calculate total hours whenever any of the relevant fields change
    const calculateTotalHours = () => {
      const totalMinutes =
        timeToMinutes(formData.gen_hourtotal) +
        timeToMinutes(formData.error_overtotal) +
        timeToMinutes(formData.maintenance_overtotal) +
        timeToMinutes(formData.gridfault_overtotal) +
        timeToMinutes(formData.griddrop_overtotal);

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      setFormData((prevState) => ({
        ...prevState,
        overtotal_hours: `${String(hours).padStart(2, "0")}:${String(
          minutes
        ).padStart(2, "0")}`,
      }));
    };

    calculateTotalHours();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.gen_hourtotal,
    formData.error_overtotal,
    formData.maintenance_overtotal,
    formData.gridfault_overtotal,
    formData.griddrop_overtotal,
  ]);
  const minutesToTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };
  const calculateTimeError = (timeFrom, timeTo) => {
    if (!timeFrom || !timeTo) return "";

    const timeFromMinutes = timeToMinutes(timeFrom);
    const timeToMinutesValue = timeToMinutes(timeTo);

    let totalMinutes;
    if (timeToMinutesValue >= timeFromMinutes) {
      totalMinutes = timeToMinutesValue - timeFromMinutes;
    } else {
      // Time spans across midnight
      totalMinutes = 24 * 60 - timeFromMinutes + timeToMinutesValue;
    }

    return minutesToTime(totalMinutes);
  };
  const calculateErrorOverTotal = (errorcode) => {
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const minutesToTime = (totalMinutes) => {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}`;
    };

    const totalMinutes = errorcode.reduce((sum, error) => {
      return sum + (error.error_total ? timeToMinutes(error.error_total) : 0);
    }, 0);

    return minutesToTime(totalMinutes);
  };
  const calculateMaintenanceOverTotal = (errormaintenance) => {
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const minutesToTime = (totalMinutes) => {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}`;
    };

    const totalMinutes = errormaintenance.reduce((sum, maintenance) => {
      return (
        sum +
        (maintenance.maintenance_total
          ? timeToMinutes(maintenance.maintenance_total)
          : 0)
      );
    }, 0);

    return minutesToTime(totalMinutes);
  };
  const calculateGridFaultOverTotal = (errorgridfault) => {
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };
    const minutesToTime = (totalMinutes) => {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}`;
    };
    const totalMinutes = errorgridfault.reduce((sum, gridfault) => {
      return (
        sum +
        (gridfault.gridfault_total
          ? timeToMinutes(gridfault.gridfault_total)
          : 0)
      );
    }, 0);
    return minutesToTime(totalMinutes);
  };
  const calculateGridDropOverTotal = (errorgriddrop) => {
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };
    const minutesToTime = (totalMinutes) => {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}`;
    };
    const totalMinutes = errorgriddrop.reduce((sum, griddrop) => {
      return (
        sum +
        (griddrop.griddrop_total ? timeToMinutes(griddrop.griddrop_total) : 0)
      );
    }, 0);
    return minutesToTime(totalMinutes);
  };

  const calculateTotalProduction = (genZero, genOne, genTwo) => {
    const toNumber = (value) => parseFloat(value) || 0;
    return (toNumber(genZero) + toNumber(genOne) + toNumber(genTwo)).toString();
  };
  const calculateTotalHours = (time1, time2) => {
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const minutesToTime = (totalMinutes) => {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}`;
    };

    if (!time1 || !time2) return "";

    const totalMinutes = timeToMinutes(time1) + timeToMinutes(time2);
    return minutesToTime(totalMinutes);
  };
  const calculateTimeDifference = (time1, time2) => {
    if (!time1 || !time2) return "";

    const time1Minutes = timeToMinutes(time1);
    const time2Minutes = timeToMinutes(time2);

    let totalMinutes;
    if (time2Minutes >= time1Minutes) {
      totalMinutes = time2Minutes - time1Minutes;
    } else {
      totalMinutes = 24 * 60 - time1Minutes + time2Minutes;
    }

    return minutesToTime(totalMinutes);
  };

  const handleAddErrorRow = () => {
    setFormData((prevState) => ({
      ...prevState,
      errorcode: [
        ...prevState.errorcode,
        {
          error_id: "",
          error_describtion: "",
          error_from: "",
          error_to: "",
          error_total: "",
        },
      ],
    }));
  };
  const handleAddMaintenanceRow = () => {
    setFormData((prevState) => ({
      ...prevState,
      errormaintenance: [
        ...prevState.errormaintenance,
        {
          maintenance_id: "",
          maintenance_name: "",
          maintenance_from: "",
          maintenance_to: "",
          maintenance_total: "",
        },
      ],
    }));
  };
  const handleAddGridFaultRow = () => {
    setFormData((prevState) => ({
      ...prevState,
      errorgridfault: [
        ...prevState.errorgridfault,
        {
          gridfault_id: "",
          gridfault_name: "",
          gridfault_from: "",
          gridfault_to: "",
          gridfault_total: "",
        },
      ],
    }));
  };
  const handleAddGriddropRow = () => {
    setFormData((prevState) => ({
      ...prevState,
      errorgriddrop: [
        ...prevState.errorgriddrop,
        {
          griddrop_id: "",
          griddrop_name: "",
          griddrop_from: "",
          griddrop_to: "",
          griddrop_total: "",
        },
      ],
    }));
  };
  const deleteContact = (index, type = "error") => {
    const resetAddress = {
      error_id: "",
      error_describtion: "",
      error_from: "",
      error_to: "",
      error_total: "",
    };

    if (type === "error") {
      if (formData.errorcode.length > 1) {
        const updatedContact = formData.errorcode.filter((_, i) => i !== index);
        setFormData({
          ...formData,
          errorcode: updatedContact,
          error_overtotal: calculateErrorOverTotal(updatedContact),
        });
      } else {
        setFormData({
          ...formData,
          errorcode: formData.errorcode.map((address, i) =>
            i === index ? resetAddress : address
          ),
          error_overtotal: calculateErrorOverTotal([resetAddress]),
        });
        toast.info("Resetting the last error row");
      }
    } else if (type === "maintenance") {
      if (formData.errormaintenance.length > 1) {
        const updatedMaintenance = formData.errormaintenance.filter(
          (_, i) => i !== index
        );
        setFormData({
          ...formData,
          errormaintenance: updatedMaintenance,
          maintenance_overtotal:
            calculateMaintenanceOverTotal(updatedMaintenance),
        });
      } else {
        const resetMaintenance = {
          maintenance_id: "",
          maintenance_name: "",
          maintenance_from: "",
          maintenance_to: "",
          maintenance_total: "",
        };
        setFormData({
          ...formData,
          errormaintenance: formData.errormaintenance.map((maintenance, i) =>
            i === index ? resetMaintenance : maintenance
          ),
          maintenance_overtotal: calculateMaintenanceOverTotal([
            resetMaintenance,
          ]),
        });
        toast.info("Resetting the last maintenance row");
      }
    } else if (type === "gridfault") {
      if (formData.errorgridfault.length > 1) {
        const updatedMaintenance = formData.errorgridfault.filter(
          (_, i) => i !== index
        );
        setFormData({
          ...formData,
          errorgridfault: updatedMaintenance,
          gridfault_overtotal:
            calculateMaintenanceOverTotal(updatedMaintenance),
        });
      } else {
        const resetMaintenance = {
          gridfault_id: "",
          gridfault_name: "",
          gridfault_from: "",
          gridfault_to: "",
          gridfault_total: "",
        };
        setFormData({
          ...formData,
          errorgridfault: formData.errorgridfault.map((gridfault, i) =>
            i === index ? resetMaintenance : gridfault
          ),
          gridfault_overtotal: calculateMaintenanceOverTotal([
            resetMaintenance,
          ]),
        });
        toast.info("Resetting the last maintenance row");
      }
    } else if (type === "griddrop") {
      if (formData.errorgriddrop.length > 1) {
        const updatedMaintenance = formData.errorgriddrop.filter(
          (_, i) => i !== index
        );
        setFormData({
          ...formData,
          errorgriddrop: updatedMaintenance,
          griddrop_overtotal: calculateMaintenanceOverTotal(updatedMaintenance),
        });
      } else {
        const resetMaintenance = {
          griddrop_id: "",
          griddrop_name: "",
          griddrop_from: "",
          griddrop_to: "",
          griddrop_total: "",
        };
        setFormData({
          ...formData,
          errorgriddrop: formData.errorgriddrop.map((griddrop, i) =>
            i === index ? resetMaintenance : griddrop
          ),
          griddrop_overtotal: calculateMaintenanceOverTotal([resetMaintenance]),
        });
        toast.info("Resetting the last maintenance row");
      }
    }
  };
  const handleKeyPress = (e, index) => {
    if (e.key === "Enter") {
      if (
        formData.errorcode[index].error_id &&
        formData.errorcode[index].error_describtion
      ) {
        // Only add a new row if both JewelName and weight are filled
        handleAddErrorRow();
      } else {
        // Optionally, you can display a toast or alert indicating that both fields are required
        toast.error(
          "Please fill in both JewelName and weight before adding a new row"
        );
      }
    }
  };
  const [errorData, setErrorData] = useState([]);
  console.log("userData", errorData);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
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
        throw new Error("Failed to fetch data");
      }

      const responseData = await response.json();
      setLoading(false);
      if (responseData.status === 200) {
        setErrorData(responseData.data.error);
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
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

  // const handleSubmit = async () => {
  //     try {

  //         const response = await fetch('https://api.demos.srivarugreenenergy.com/daily_generation/create.php', {
  //             method: 'POST',
  //             headers: {
  //                 'Content-Type': 'application/json'
  //             },
  //             body: JSON.stringify(formData)
  //         });
  //         console.log(formData);
  //         const responseData = await response.json();

  //         console.log('responseData', responseData);

  //         if (responseData.status === 200) {
  //             successAlert(responseData.msg)
  //             setTimeout(() => {
  //                 navigate('/console/dailygeneration')
  //             }, 2000);
  //         }
  //         else if (responseData.status === 400) {
  //             toast.error('Missing required fields!', {
  //                 position: "top-center",
  //                 autoClose: 2000,
  //                 hideProgressBar: false,
  //                 closeOnClick: true,
  //                 pauseOnHover: true,
  //                 draggable: true,
  //                 progress: undefined,
  //                 theme: "colored",
  //             });
  //         }
  //         else {
  //             setShowAlert(true);
  //         }

  //     } catch (error) {
  //         console.error('Error:', error);
  //     }
  // };

  const handleSubmit = async () => {
    try {
      // Convert 'overtotal_hours' to minutes
      const [hours, minutes] = formData.overtotal_hours.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes;

      // Check if 'overtotal_hours' exceeds 24 hours (1440 minutes)
      if (totalMinutes > 1440) {
        toast.error("Total hours cannot exceed 24:00 hours!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return; // Prevent submission
      }

      const response = await fetch(
        "https://api.demos.srivarugreenenergy.com/daily_generation/create.php",
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
          navigate("/console/dailygeneration");
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
  // const handleUpdateSubmit = async () => {
  //     try {

  //         const response = await fetch('https://api.demos.srivarugreenenergy.com/daily_generation/update.php', {
  //             method: 'POST',
  //             headers: {
  //                 'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify({ // Include the company ID in the request
  //                 daily_generation_id: formData.daily_generation_id,
  //                 dg_date: formData.dg_date,
  //                 turbine_no: formData.turbine_no,
  //                 location_no: formData.location_no,
  //                 gen_zero: formData.gen_zero,
  //                 gen_one: formData.gen_one,
  //                 gen_two: formData.gen_two,
  //                 total_production: formData.total_production,
  //                 gen_onehrs: formData.gen_onehrs,
  //                 gen_twohrs: formData.gen_twohrs,
  //                 gen_hourtotal: formData.gen_hourtotal,
  //                 kwh_imp: formData.kwh_imp,
  //                 kwh_exp: formData.kwh_exp,
  //                 kvarh_imp: formData.kvarh_imp,
  //                 kvarh_exp: formData.kvarh_exp,
  //                 errorcode: formData.error_code,
  //                 error_overtotal: formData.error_overtotal,
  //                 errormaintenance: formData.errormaintenance,
  //                 maintenance_overtotal: formData.maintenance_overtotal,
  //                 errorgridfault: formData.errorgridfault,
  //                 gridfault_overtotal: formData.gridfault_overtotal,
  //                 errorgriddrop: formData.errorgriddrop,
  //                 griddrop_overtotal: formData.griddrop_overtotal,
  //                 overtotal_hours: formData.overtotal_hours,
  //                 remarks: formData.remarks,
  //             }),

  //         });
  //         console.log('post', JSON.stringify({ // Include the company ID in the request
  //             daily_generation_id: formData.daily_generation_id,
  //             dg_date: formData.dg_date,
  //             turbine_no: formData.turbine_no,
  //             location_no: formData.location_no,
  //             gen_zero: formData.gen_zero,
  //             gen_one: formData.gen_one,
  //             gen_two: formData.gen_two,
  //             total_production: formData.total_production,
  //             gen_onehrs: formData.gen_onehrs,
  //             gen_twohrs: formData.gen_twohrs,
  //             gen_hourtotal: formData.gen_hourtotal,
  //             kwh_imp: formData.kwh_imp,
  //             kwh_exp: formData.kwh_exp,
  //             kvarh_imp: formData.kvarh_imp,
  //             kvarh_exp: formData.kvarh_exp,
  //             errorcode: formData.error_code,
  //             error_overtotal: formData.error_overtotal,
  //             errormaintenance: formData.errormaintenance,
  //             maintenance_overtotal: formData.maintenance_overtotal,
  //             errorgridfault: formData.errorgridfault,
  //             gridfault_overtotal: formData.gridfault_overtotal,
  //             errorgriddrop: formData.errorgriddrop,
  //             griddrop_overtotal: formData.griddrop_overtotal,
  //             overtotal_hours: formData.overtotal_hours,
  //             remarks: formData.remarks,
  //         }),)

  //         if (!response.ok) {
  //             throw new Error('Failed to update company');
  //         }

  //         const responseData = await response.json();
  //         console.log('responseData', responseData);

  //         if (responseData.status === 200) {

  //             successAlert(responseData.msg)
  //             setTimeout(() => {
  //                 navigate('/console/dailygeneration')
  //             }, 2000);

  //             // Navigate to the user list page after a delay

  //         } else {
  //             console.error(responseData.msg || 'Unknown error occurred during update');
  //         }
  //     } catch (error) {
  //         console.error('Error updating product:', error.msg);
  //     }

  //     setLoading(false);
  // };

  const handleUpdateSubmit = async () => {
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };
    try {
      const overtotalMinutes = timeToMinutes(formData.overtotal_hours);
      const maxMinutes = 24 * 60; // Maximum of 24 hours in minutes
      if (overtotalMinutes > maxMinutes) {
        toast.error("Total hours exceed the maximum of 24:00 hours!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return; // Stop form submission if validation fails
      }
      const response = await fetch(
        "https://api.demos.srivarugreenenergy.com/daily_generation/update.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Include the company ID in the request
            daily_generation_id: formData.daily_generation_id,
            dg_date: formData.dg_date,
            turbine_id: formData.turbine_id,
            location_no: formData.location_no,
            gen_zero: formData.gen_zero,
            gen_one: formData.gen_one,
            gen_two: formData.gen_two,
            total_production: formData.total_production,
            gen_onehrs: formData.gen_onehrs,
            gen_twohrs: formData.gen_twohrs,
            gen_hourtotal: formData.gen_hourtotal,
            kwh_imp: formData.kwh_imp,
            kwh_exp: formData.kwh_exp,
            kvarh_imp: formData.kvarh_imp,
            kvarh_exp: formData.kvarh_exp,
            errorcode: formData.errorcode,
            error_overtotal: formData.error_overtotal,
            errormaintenance: formData.errormaintenance,
            maintenance_overtotal: formData.maintenance_overtotal,
            errorgridfault: formData.errorgridfault,
            gridfault_overtotal: formData.gridfault_overtotal,
            errorgriddrop: formData.errorgriddrop,
            griddrop_overtotal: formData.griddrop_overtotal,
            overtotal_hours: formData.overtotal_hours,
            remarks: formData.remarks,
          }),
        }
      );
      console.log(
        "postedit",
        JSON.stringify({
          // Include the company ID in the request
          daily_generation_id: formData.daily_generation_id,
          dg_date: formData.dg_date,
          turbine_id: formData.turbine_id,
          location_no: formData.location_no,
          gen_zero: formData.gen_zero,
          gen_one: formData.gen_one,
          gen_two: formData.gen_two,
          total_production: formData.total_production,
          gen_onehrs: formData.gen_onehrs,
          gen_twohrs: formData.gen_twohrs,
          gen_hourtotal: formData.gen_hourtotal,
          kwh_imp: formData.kwh_imp,
          kwh_exp: formData.kwh_exp,
          kvarh_imp: formData.kvarh_imp,
          kvarh_exp: formData.kvarh_exp,
          errorcode: formData.errorcode,
          error_overtotal: formData.error_overtotal,
          errormaintenance: formData.errormaintenance,
          maintenance_overtotal: formData.maintenance_overtotal,
          errorgridfault: formData.errorgridfault,
          gridfault_overtotal: formData.gridfault_overtotal,
          errorgriddrop: formData.errorgriddrop,
          griddrop_overtotal: formData.griddrop_overtotal,
          overtotal_hours: formData.overtotal_hours,
          remarks: formData.remarks,
        })
      );

      if (!response.ok) {
        throw new Error("Failed to update company");
      }

      const responseData = await response.json();
      console.log("responseData", responseData);

      if (responseData.status === 200) {
        successAlert(responseData.msg);
        setTimeout(() => {
          navigate("/console/dailygeneration");
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
  const [userDataError, setUserDataError] = useState([]);
  console.log("userDataError", userDataError);
  const fetchDataError = async () => {
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
        throw new Error("Failed to fetch data");
      }

      const responseData = await response.json();
      setLoading(false);
      if (responseData.status === 200) {
        setUserDataError(responseData.data.error);
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  const [userDataMain, setUserDataMain] = useState([]);
  console.log("userDataMain", userDataMain);
  const fetchDataMaintenance = async () => {
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
        setUserDataMain(responseData.data.maintenance);
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };

  const [userDataGridfault, setUserDataGridfault] = useState([]);
  console.log("userDataGridfault", userDataGridfault);

  const fetchDataGridfault = async () => {
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
        setUserDataGridfault(responseData.data.grid_fault);
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  const [userDataGriddrop, setUserDataGriddrop] = useState([]);
  console.log("userDataGriddrop", userDataGriddrop);

  const fetchDataGriddrop = async () => {
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
        setUserDataGriddrop(responseData.data.grid_drop);
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  useEffect(() => {
    fetchDataError();
    fetchDataMaintenance();
    fetchDataGridfault();
    fetchDataGriddrop();
  }, []);

  const [userDataTurbine, setUserDataTurbine] = useState([]);
  console.log("userDataTurbine", userDataTurbine);
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
      setLoading(false);
      if (responseData.status === 200) {
        setUserDataTurbine(responseData.data.turbine);
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
  }, []);
  useEffect(() => {
    // Check if party_id is selected
    if (formData.turbine_id) {
      // Find the selected party in partySalesData
      const selectedParty = userDataTurbine.find(
        (party) => party.turbine_id === formData.turbine_id
      );

      if (selectedParty) {
        // Update formData with party data
        setFormData((prevState) => ({
          ...prevState,
          location_no: selectedParty.loc_no,
        }));
      }
    }
  }, [formData.turbine_id, userDataTurbine]);

  // useEffect(() => {

  // }, [formData.errorcode.map(error => error.error_id), userDataError]);
  return (
    <>
      <div id="main">
        <Container fluid>
          <Row className="regular">
            <Col lg="12" md="12" xs="12" className="py-3">
              <PageNav
                pagetitle={
                  type === "edit"
                    ? "Edit Daily Generation"
                    : "Daily Generation Creation"
                }
              ></PageNav>
            </Col>
            <Col lg="4" md="4" xs="12" className="py-3">
              <div className="w-100">
                <Calender
                  setLabel={(date) => setLabel(date, "dg_date")}
                  selectedDate={formData.dg_date}
                  calenderlabel="Date"
                />
              </div>
            </Col>
            <Col lg="4" md="4" xs="12" className="py-3">
              <DropDownUI
                optionlist={userDataTurbine.map((user) => ({
                  value: user.turbine_id,
                  label: user.wtg_no,
                }))}
                placeholder="Turbine No"
                labelname="Turbine No"
                name="turbine_id"
                value={formData}
                onChange={(updatedFormData) =>
                  setFormData({
                    ...formData,
                    turbine_id: updatedFormData.turbine_id,
                  })
                }
              ></DropDownUI>
            </Col>
            <Col lg="4" md="4" xs="12" className="py-3">
              <TextInputForm
                placeholder={"Location No"}
                labelname={"Location No"}
                name="location_no"
                value={formData.location_no}
                onChange={(e) => handleChange(e, "location_no")}
              ></TextInputForm>
            </Col>

            <Col lg="3" md="4" xs="12" className="py-3">
              <TextInputForm
                placeholder={"Gen 0"}
                labelname={"Gen 0"}
                name="gen_zero"
                value={formData.gen_zero}
                onChange={(e) => handleChange(e, "gen_zero")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="4" xs="12" className="py-3">
              <TextInputForm
                placeholder={"Gen 1"}
                labelname={"Gen 1"}
                name="gen_one"
                value={formData.gen_one}
                onChange={(e) => handleChange(e, "gen_one")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="4" xs="12" className="py-3">
              <TextInputForm
                placeholder={"Gen 2"}
                labelname={"Gen 2"}
                name="gen_two"
                value={formData.gen_two}
                onChange={(e) => handleChange(e, "gen_two")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="4" xs="12" className="py-3">
              <TextInputForm
                placeholder={"Total Production"}
                labelname={"Total Production"}
                name="total_production"
                value={formData.total_production}
                onChange={(e) => handleChange(e, "total_production")}
                readOnly
              ></TextInputForm>
            </Col>
            <Col lg="4" md="4" xs="12" className="py-3 ">
              <TextInputForm
                placeholder={"Gen 1 hrs"}
                labelname={"Gen 1 hrs"}
                name="gen_onehrs"
                value={formData.gen_onehrs}
                onChange={(e) => handleChange(e, "gen_onehrs")}
              ></TextInputForm>
            </Col>
            <Col lg="4" md="4" xs="12" className="py-3">
              <TextInputForm
                placeholder={"Gen 2 hrs"}
                labelname={"Gen 2 hrs"}
                name="gen_twohrs"
                value={formData.gen_twohrs}
                onChange={(e) => handleChange(e, "gen_twohrs")}
              ></TextInputForm>
            </Col>
            <Col lg="4" md="4" xs="12" className="py-3">
              <TextInputForm
                placeholder={"Gen Hours"}
                labelname={"Gen Hours"}
                name="gen_hourtotal"
                value={formData.gen_hourtotal}
                onChange={(e) => handleChange(e, "gen_hourtotal")}
                readOnly
              ></TextInputForm>
            </Col>
            <Col lg="3" md="6" xs="12" className="py-3">
              <TextInputForm
                placeholder={"KWH imp (EB)"}
                labelname={"KWH imp (EB)"}
                name="kwh_imp"
                value={formData.kwh_imp}
                onChange={(e) => handleChange(e, "kwh_imp")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="6" xs="12" className="py-3">
              <TextInputForm
                placeholder={"KWH Exp (EB)"}
                labelname={"KWH Exp (EB)"}
                name="kwh_exp"
                value={formData.kwh_exp}
                onChange={(e) => handleChange(e, "kwh_exp")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                placeholder={"KVARH Imp (EB)"}
                labelname={"KVARH Imp (EB)"}
                name="kvarh_imp"
                value={formData.kvarh_imp}
                onChange={(e) => handleChange(e, "kvarh_imp")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                placeholder={"KVARH Exp (EB)"}
                labelname={"KVARH Exp (EB)"}
                name="kvarh_exp"
                value={formData.kvarh_exp}
                onChange={(e) => handleChange(e, "kvarh_exp")}
              ></TextInputForm>
            </Col>
            {/* error start */}
            <Col lg="12" md="12" xs="12" className="py-4">
              <div className="regular"> Machine fault</div>
            </Col>
            <Col lg="12" md="12" xs="12">
              <Table>
                <th>Error Code</th>
                <th> Error Type</th>
                <th>From </th>
                <th>To </th>
                <th>Total </th>
                <th> </th>
                <th className="text-center">#</th>
                <tbody>
                  {formData.errorcode &&
                    formData.errorcode.map((error, index) => (
                      <tr key={index}>
                        <td className="w-25">
                          <DropDownUI
                            optionlist={userDataError.map((user) => ({
                              value: user.error_id,
                              label: user.error_code,
                            }))}
                            placeholder="Error Code"
                            name="error_id"
                            value={error}
                            onChange={(updatedFormData) => {
                              setFormData({
                                ...formData,
                                errorcode: formData.errorcode.map((r, i) =>
                                  i === index
                                    ? {
                                        ...r,
                                        error_id: updatedFormData.error_id,
                                      }
                                    : r
                                ),
                              });
                              setFormData((prevFormData) => {
                                const updatedErrorcode =
                                  prevFormData.errorcode.map((error) => {
                                    const matchedError = userDataError.find(
                                      (e) => e.error_id === error.error_id
                                    );
                                    return matchedError
                                      ? {
                                          ...error,
                                          error_describtion:
                                            matchedError.error_describtion,
                                        }
                                      : error;
                                  });
                                return {
                                  ...prevFormData,
                                  errorcode: updatedErrorcode,
                                };
                              });
                            }}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                          />
                        </td>
                        <td className="w-25">
                          <TextInputForm
                            placeholder={"Error Type"}
                            name="error_describtion"
                            value={error.error_describtion}
                            onChange={(e) =>
                              handleChange(e, "error_describtion", index)
                            }
                            onKeyPress={(e) => handleKeyPress(e, index)}
                          ></TextInputForm>
                        </td>
                        <td>
                          <TextInputForm
                            placeholder={"Error From "}
                            name="error_from"
                            value={error.error_from}
                            onChange={(e) =>
                              handleChange(e, "error_from", index)
                            }
                          ></TextInputForm>
                        </td>
                        <td>
                          <TextInputForm
                            placeholder={"Error To"}
                            name="error_to"
                            value={error.error_to}
                            onChange={(e) => handleChange(e, "error_to", index)}
                          ></TextInputForm>
                        </td>
                        <td>
                          <TextInputForm
                            placeholder={"Error Total"}
                            name="error_total"
                            value={error.error_total}
                            onChange={(e) =>
                              handleChange(e, "error_total", index)
                            }
                            readOnly
                          ></TextInputForm>
                        </td>
                        <td>
                          <div className="">
                            <ClickButton
                              label={<>AddMore</>}
                              onClick={handleAddErrorRow}
                            ></ClickButton>
                          </div>
                        </td>
                        <td className="text-end">
                          <div className="dlt">
                            <MdOutlineDeleteForever
                              onClick={() => deleteContact(index)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Col>
            <Col lg="3" md="6" xs="12" className="py-3">
              <TextInputForm
                placeholder={"Total Machine Fault Hrs"}
                labelname={"Total Machine Fault Hrs"}
                name="error_overtotal"
                value={formData.error_overtotal}
                onChange={(e) => handleChange(e, "error_overtotal")}
                readOnly
              ></TextInputForm>
            </Col>
            {/* error end */}
            {/* maintenance_code start */}
            <Col lg="12" md="12" xs="12" className="py-3">
              <div className="regular"> Maintenance </div>
            </Col>
            <Col lg="12" md="12" xs="12">
              <Table>
                <th>s.no</th>
                <th>Maintenance Code</th>
                <th> Maintenance Type</th>
                <th>From </th>
                <th>To </th>
                <th>Total </th>
                <th> </th>
                <th className="text-center">#</th>
                <tbody>
                  {formData.errormaintenance.map((maintenance, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="w-25">
                        <DropDownUI
                          optionlist={userDataMain.map((user) => ({
                            value: user.maintenance_id,
                            label: user.maintenance_code,
                          }))}
                          placeholder={" Maintenance Error Code"}
                          name="maintenance_id"
                          value={maintenance}
                          onChange={(updatedFormData) => {
                            setFormData({
                              ...formData,
                              errormaintenance: formData.errormaintenance.map(
                                (r, i) =>
                                  i === index
                                    ? {
                                        ...r,
                                        maintenance_id:
                                          updatedFormData.maintenance_id,
                                      }
                                    : r
                              ),
                            });
                            setFormData((prevFormData) => {
                              const updatedErrorcode =
                                prevFormData.errormaintenance.map((error) => {
                                  const matchedError = userDataMain.find(
                                    (e) =>
                                      e.maintenance_id === error.maintenance_id
                                  );
                                  return matchedError
                                    ? {
                                        ...error,
                                        maintenance_name:
                                          matchedError.maintenance_describtion,
                                      }
                                    : error;
                                });
                              return {
                                ...prevFormData,
                                errormaintenance: updatedErrorcode,
                              };
                            });
                          }}
                        />
                      </td>
                      <td className="w-25">
                        <TextInputForm
                          placeholder={"Maintenance"}
                          name="maintenance_name"
                          value={maintenance.maintenance_name}
                          onChange={(e) =>
                            handleChange(
                              e,
                              "maintenance_name",
                              index,
                              "maintenance"
                            )
                          }
                        ></TextInputForm>
                      </td>
                      <td>
                        <TextInputForm
                          placeholder={"Maintenance From "}
                          name="maintenance_from"
                          value={maintenance.maintenance_from}
                          onChange={(e) =>
                            handleChange(
                              e,
                              "maintenance_from",
                              index,
                              "maintenance"
                            )
                          }
                        ></TextInputForm>
                      </td>
                      <td>
                        <TextInputForm
                          placeholder={"Maintenance To"}
                          name="maintenance_to"
                          value={maintenance.maintenance_to}
                          onChange={(e) =>
                            handleChange(
                              e,
                              "maintenance_to",
                              index,
                              "maintenance"
                            )
                          }
                        ></TextInputForm>
                      </td>
                      <td>
                        <TextInputForm
                          placeholder={"Total"}
                          name="Total"
                          value={maintenance.maintenance_total}
                          onChange={(e) =>
                            handleChange(
                              e,
                              "maintenance_total",
                              index,
                              "maintenance"
                            )
                          }
                          readOnly
                        ></TextInputForm>
                      </td>
                      <td>
                        <div className="">
                          <ClickButton
                            label={<>AddMore Maintenance</>}
                            onClick={handleAddMaintenanceRow}
                          ></ClickButton>
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="dlt">
                          <MdOutlineDeleteForever
                            onClick={() => deleteContact(index, "maintenance")}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            <Col lg="3" md="6" xs="12" className="py-3">
              <TextInputForm
                placeholder={" Total Maintenance Hrs"}
                labelname={" Total Maintenance Hrs"}
                name="maintenance_overtotal"
                value={formData.maintenance_overtotal}
                onChange={(e) => handleChange(e, "maintenance_overtotal")}
                readOnly
              ></TextInputForm>
            </Col>
            {/* maintenance_code end */}
            {/* grid fault start */}
            <Col lg="12" md="12" xs="12" className="py-4">
              <div className="regular"> Grid Fault</div>
            </Col>
            <Col lg="12" md="12" xs="12">
              <Table>
                <th>Grid Fault Code</th>
                <th> Grid Fault Type</th>
                <th>From </th>
                <th>To </th>
                <th>Total </th>
                <th> </th>
                <th className="text-center">#</th>
                <tbody>
                  {formData.errorgridfault.map((gridFault, index) => (
                    <tr key={index}>
                      <td className="w-25">
                        <DropDownUI
                          optionlist={userDataGridfault.map((user) => ({
                            value: user.grid_fault_id,
                            label: user.grid_fault_code,
                          }))}
                          placeholder={" Grid Fault Error Code"}
                          name="gridfault_id"
                          value={gridFault}
                          onChange={(updatedFormData) => {
                            setFormData({
                              ...formData,
                              errorgridfault: formData.errorgridfault.map(
                                (r, i) =>
                                  i === index
                                    ? {
                                        ...r,
                                        gridfault_id:
                                          updatedFormData.gridfault_id,
                                      }
                                    : r
                              ),
                            });
                            setFormData((prevFormData) => {
                              const updatedErrorcode =
                                prevFormData.errorgridfault.map((error) => {
                                  const matchedError = userDataGridfault.find(
                                    (e) =>
                                      e.grid_fault_id === error.gridfault_id
                                  );
                                  return matchedError
                                    ? {
                                        ...error,
                                        gridfault_name:
                                          matchedError.grid_fault_describtion,
                                      }
                                    : error;
                                });
                              return {
                                ...prevFormData,
                                errorgridfault: updatedErrorcode,
                              };
                            });
                          }}
                        />
                      </td>
                      <td className="w-25">
                        <TextInputForm
                          placeholder={" Grid Fault "}
                          name="gridfault_name"
                          value={gridFault.gridfault_name}
                          onChange={(e) =>
                            handleChange(
                              e,
                              "gridfault_name",
                              index,
                              "gridfault"
                            )
                          }
                        ></TextInputForm>
                      </td>
                      <td>
                        <TextInputForm
                          placeholder={" Grid Fault  From "}
                          name="gridfault_from"
                          value={gridFault.gridfault_from}
                          onChange={(e) =>
                            handleChange(
                              e,
                              "gridfault_from",
                              index,
                              "gridfault"
                            )
                          }
                        ></TextInputForm>
                      </td>
                      <td>
                        <TextInputForm
                          placeholder={" Grid Fault To"}
                          name="gridfault_to"
                          value={gridFault.gridfault_to}
                          onChange={(e) =>
                            handleChange(e, "gridfault_to", index, "gridfault")
                          }
                        ></TextInputForm>
                      </td>
                      <td>
                        <TextInputForm
                          placeholder={"Total"}
                          name="Total"
                          value={gridFault.gridfault_total}
                          onChange={(e) =>
                            handleChange(
                              e,
                              "gridfault_total",
                              index,
                              "gridfault"
                            )
                          }
                          readOnly
                        ></TextInputForm>
                      </td>
                      <td>
                        <div className="">
                          <ClickButton
                            label={<>AddMore Grid Fault </>}
                            onClick={handleAddGridFaultRow}
                          ></ClickButton>
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="dlt">
                          <MdOutlineDeleteForever
                            onClick={() => deleteContact(index, "gridfault")}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            <Col lg="3" md="6" xs="12" className="py-3">
              <TextInputForm
                placeholder={"Total Grid Fault Hrs"}
                labelname={"Total Grid Fault Hrs"}
                name="gridfault_overtotal"
                value={formData.gridfault_overtotal}
                onChange={(e) => handleChange(e, "gridfault_overtotal")}
                readOnly
              ></TextInputForm>
            </Col>
            {/* grid fault  end */}
            {/* grid drop start */}
            <Col lg="12" md="12" xs="12" className="pt-4 pb-2">
              <div className="regular">Grid Drop </div>
            </Col>
            <Col lg="12" md="12" xs="12">
              <Table>
                <th>Grid Drop Code</th>
                <th> Grid Drop Type</th>
                <th>From </th>
                <th>To </th>
                <th>Total </th>
                <th> </th>
                <th className="text-center">#</th>
                <tbody>
                  {formData.errorgriddrop.map((griddrop, index) => (
                    <tr key={index}>
                      <td className="w-25">
                        <DropDownUI
                          optionlist={userDataGriddrop.map((user) => ({
                            value: user.grid_drop_id,
                            label: user.grid_drop_code,
                          }))}
                          placeholder={" Grid Drop Error Code"}
                          name="griddrop_id"
                          value={griddrop}
                          onChange={(updatedFormData) => {
                            setFormData({
                              ...formData,
                              errorgriddrop: formData.errorgriddrop.map(
                                (r, i) =>
                                  i === index
                                    ? {
                                        ...r,
                                        griddrop_id:
                                          updatedFormData.griddrop_id,
                                      }
                                    : r
                              ),
                            });
                            setFormData((prevFormData) => {
                              const updatedErrorcode =
                                prevFormData.errorgriddrop.map((error) => {
                                  const matchedError = userDataGriddrop.find(
                                    (e) => e.grid_drop_id === error.griddrop_id
                                  );
                                  return matchedError
                                    ? {
                                        ...error,
                                        griddrop_name:
                                          matchedError.grid_drop_describtion,
                                      }
                                    : error;
                                });
                              return {
                                ...prevFormData,
                                errorgriddrop: updatedErrorcode,
                              };
                            });
                          }}
                        />
                      </td>
                      <td className="w-25">
                        <TextInputForm
                          placeholder={" Grid Drop"}
                          name="griddrop_name"
                          value={griddrop.griddrop_name}
                          onChange={(e) =>
                            handleChange(e, "griddrop_name", index, "griddrop")
                          }
                        ></TextInputForm>
                      </td>
                      <td>
                        <TextInputForm
                          placeholder={" Grid Drop From "}
                          name="griddrop_from"
                          value={griddrop.griddrop_from}
                          onChange={(e) =>
                            handleChange(e, "griddrop_from", index, "griddrop")
                          }
                        ></TextInputForm>
                      </td>
                      <td>
                        <TextInputForm
                          placeholder={"Grid Drop To"}
                          name="griddrop_to"
                          value={griddrop.griddrop_to}
                          onChange={(e) =>
                            handleChange(e, "griddrop_to", index, "griddrop")
                          }
                        ></TextInputForm>
                      </td>
                      <td>
                        <TextInputForm
                          placeholder={"Grid Drop To"}
                          name="griddrop_total"
                          value={griddrop.griddrop_total}
                          onChange={(e) =>
                            handleChange(e, "griddrop_total", index, "griddrop")
                          }
                          readOnly
                        ></TextInputForm>
                      </td>
                      <td>
                        <div className="">
                          <ClickButton
                            label={<>AddMore Grid Drop</>}
                            onClick={handleAddGriddropRow}
                          ></ClickButton>
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="dlt">
                          <MdOutlineDeleteForever
                            onClick={() => deleteContact(index, "griddrop")}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            <Col lg="3" md="6" xs="12" className="py-3">
              <TextInputForm
                placeholder={"Total Grid Drop Hrs"}
                labelname={"Total Grid Drop Hrs"}
                name="griddrop_overtotal"
                value={formData.griddrop_overtotal}
                onChange={(e) => handleChange(e, "griddrop_overtotal")}
                readOnly
              ></TextInputForm>
            </Col>
            {/* grid drop end */}
            <Col lg="3" md="6" xs="12" className="py-3">
              <TextInputForm
                placeholder={"Total Hours"}
                labelname={"Total Hours"}
                name="overtotal_hours"
                value={formData.overtotal_hours}
                onChange={(e) => handleChange(e, "overtotal_hours")}
                readOnly
              ></TextInputForm>
            </Col>
            <Col lg="9" md="12" xs="12">
              <div>
                <label> Remarks</label>
              </div>
              <div className="text-center">
                <textarea
                  className="form-cntrl w-100"
                  placeholder="Remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={(e) => handleChange(e, "remarks")}
                ></textarea>
              </div>
            </Col>
            <Col lg={{ span: 8, offset: 2 }} className="py-5 align-self-center">
              <div className="text-center daily-generation-section">
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
                    <div className="fixed-button-bar">
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
                            onClick={() => navigate("/console/dailygeneration")}
                          ></ClickButton>
                        </span>
                      </div>
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
                    <div className="fixed-button-bar">
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
                            onClick={() => navigate("/console/dailygeneration")}
                          ></ClickButton>
                        </span>
                      </div>
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

export default DgCreation;
