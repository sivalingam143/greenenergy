import React, { useState, useEffect } from "react";
import { Col, Container, Row, Modal } from "react-bootstrap";
import PageNav from "../components/PageNav";
import { TextInputForm, DropDown, Calender } from "../components/Forms";
import { ClickButton } from "../components/ClickButton";
import { DropDownUI } from "../components/Forms";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment/moment";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";

const DropList = [
  {
    value: "YES",
    label: "YES",
  },
  {
    value: "NO",
    label: "NO",
  },
];
const Statename = [
  {
    value: "Tamilnadu",
    label: "Tamilnadu",
  },
];
const SiteName = [
  {
    value: "viruthunagar",
    label: "viruthunagar",
  },
];
const TurbineCreation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const [showModalLocation, setShowModalLocation] = useState(false);
  const handleCloseModalLoaction = () => setShowModalLocation(false);
  const handleShowModalLocation = () => setShowModalLocation(true);

  const [showModalModal, setShowModalModal] = useState(false);
  const handleCloseModalModal = () => setShowModalModal(false);
  const handleShowModalModal = () => setShowModalModal(true);

  const [showModalContract, setShowModalContract] = useState(false);
  const handleCloseModalContract = () => setShowModalContract(false);
  const handleShowModalcontract = () => setShowModalContract(true);

  const { type, rowData } = location.state || {};
  console.log("rowData", rowData);
  console.log("rowDataPdffiles", rowData?.pdf_files);

  const initialState =
    type === "edit"
      ? {
          ...rowData,
          site_id: rowData.site_id,
          pdf_files: Array.isArray(rowData.pdf_files)
            ? rowData.pdf_files.map((pdf) => {
                if (typeof pdf === "string") {
                  return {
                    pdf_id: null, // Assign pdf_id when needed
                    file: null,
                    fileName: pdf.split("/").pop(),
                    pdf_date: null,
                  };
                }
                return {
                  pdf_id: pdf.pdf_id || null, // Assuming pdf_id is part of the PDF object
                  file: null,
                  fileName: "",
                  pdf_date: null,
                };
              })
            : [],
        }
      : {
          pdf_files: [],
          turbine_id: "",
          date: "",
          customer_id: "",
          customername_id: "",
          wtg_no: "",
          loc_no: "",
          htsc_no: "",
          site_id: "",
          location_id: "",
          model_id: "",
          contracttype_id: "",
          dgr_need: "",
          capacity: "",
          feeder_voltage: "",
          feed_name: "",
          sub_station: "",
          tower_ht: "",
          latitude: "",
          lognitude: "",
          controler: "",
          ctpt_make: "",
          ctpt_sino: "",
          ctpt_ratio: "",
          ctpt_multiplicationfactor: "",
          transformer_make: "",
          transformer_sino: "",
          transformer_ratio: "",
          energymeter_sino: "",
          energymeter_ratio: "",
          acb_sino: "",
          acb_ratio: "",
          apfcpanel_make: "",
          apfcpanel_sino: "",
          mainpanel_make: "",
          mainpanel_sino: "",
          gearbox_make: "",
          gearbox_sino: "",
          generator_make: "",
          generator_sino: "",
          bladeone_make: "",
          bladeone_sino: "",
          bladeone_classofweight: "",
          bladeone_bladebearing: "",
          bladetwo_make: "",
          bladetwo_sino: "",
          bladetwo_classofweight: "",
          bladetwo_bladebearing: "",
          bladethree_make: "",
          bladethree_sino: "",
          bladethree_classofweight: "",
          bladethree_bladebearing: "",
          hydraunit_make: "",
          hydraunit_sino: "",
          hydramotor_make: "",
          hydramotor_sino: "",
          hydrafiltertype_make: "",
          hydrafiltertype_sino: "",
          propositionalvalve_make: "",
          propositionalvalve_sino: "",
          incharge_name: "",
          incharge_mobile_no: "",
          siteoperator_name: "",
          siteoperator_mobileno: "",
        };

  const [formData, setFormData] = useState(initialState);
  console.log("rowData", rowData);
  console.log("formData", formData);
  const [siteForm, setSiteForm] = useState({
    state_id: "",
    site_name: "",
    short_code: "",
  });
  const handleChangeSite = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;

    setSiteForm({
      ...siteForm,
      [fieldName]: value,
    });
  };

  const handleChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Set date label
  const setLabel = (value, field) => {
    setFormData({
      ...formData,
      [field]: moment(value).format("YYYY-MM-DD"),
    });
  };

  // useEffect(() => {
  //   if (rowData) {
  //     const pdfFiles = typeof rowData.pdf_files === 'string'
  //       ? JSON.parse(rowData.pdf_files) // Parse if it's a JSON string
  //       : rowData.pdf_files; // Assume it's already an array

  //     setFormData(prevFormData => ({
  //       ...prevFormData,
  //       pdf_files: Array.isArray(pdfFiles)
  //         ? pdfFiles.map(pdf => ({
  //           file: new File([], pdf.split('/').pop().replace(/\s?\d{4}-\d{2}-\d{2}.*$/, '')),
  //           fileName: pdf.split('/').pop().replace(/\s?\d{4}-\d{2}-\d{2}.*$/, ''), // Extract file name from path
  //         }))
  //         : [], // Default to an empty array if not an array
  //     }));
  //   }
  // }, [rowData]);

  ///correct code pdf
  // const handlePDFChange = (e, index) => {
  //   const files = e.target.files;
  //   const file = files[0];

  //   if (file) {
  //     const fileName = file.name;

  //     setFormData(prevFormData => {
  //       const newFiles = [...prevFormData.pdf_files];
  //       newFiles[index] = {
  //         file,        // Store the file object
  //         fileName     // Store the name for display
  //       };
  //       return {
  //         ...prevFormData,
  //         pdf_files: newFiles,
  //       };
  //     });
  //   }
  // };

  // const handleAddMorePDF = () => {
  //   setFormData(prevFormData => ({
  //     ...prevFormData,
  //     pdf_files: [...prevFormData.pdf_files, { file: null, fileName: ''}], // Add a new empty file slot
  //   }));
  // };

  // const handleDeletePDF = (index) => {
  //   setFormData(prevFormData => {
  //     const newFiles = prevFormData.pdf_files.filter((_, i) => i !== index);
  //     return {
  //       ...prevFormData,
  //       pdf_files: newFiles,
  //     };
  //   });
  // };
  // const getPdfFileUrl = (fileName) => {
  //   return `https://greenenergy.zentexus.in/api/uploads/${fileName}`;
  // };

  // useEffect(() => {
  //   if (rowData) {
  //     const pdfFiles =
  //       typeof rowData.pdf_files === "string"
  //         ? JSON.parse(rowData.pdf_files) // Parse if it's a JSON string
  //         : rowData.pdf_files; // Assume it's already an array

  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       pdf_files: Array.isArray(pdfFiles)
  //         ? pdfFiles.map((pdf) => ({
  //           file: new File([], pdf.split("/").pop().replace(/\s?\d{4}-\d{2}-\d{2}.*$/, "")),
  //           fileName: pdf.split("/").pop().replace(/\s?\d{4}-\d{2}-\d{2}.*$/, ""), // Extract file name
  //           pdf_date: moment().format("YYYY-MM-DD"),
  //         }))
  //         : [],
  //     }));
  //   }
  // }, [rowData]);

  const getPdfFileUrl = (fileName, pdfId) => {
    console.log("fileName.....", fileName);
    console.log("fileName Id.....", pdfId);

    return `https://greenenergy.zentexus.in/api/uploads/${pdfId}_${fileName}`;
  };

  // Adjusted useEffect to handle "edit" state and set fileName
  useEffect(() => {
    if (rowData) {
      const pdfFiles =
        typeof rowData.pdf_files === "string"
          ? JSON.parse(rowData.pdf_files) // Parse if it's a JSON string
          : rowData.pdf_files; // Assume it's already an array

      setFormData((prevFormData) => ({
        ...prevFormData,
        pdf_files: Array.isArray(pdfFiles)
          ? pdfFiles.map((pdf) => ({
              file: pdf.file || null, // If file is available, set it
              fileName: pdf.fileName || pdf.split("/").pop(), // If fileName is available, use it, otherwise extract from the path
              pdf_date: pdf.pdf_date || moment().format("YYYY-MM-DD"),
              pdf_id: pdf.pdf_id || null, // Ensure pdf_id is added
            }))
          : [],
      }));
    }
  }, [rowData]);

  // handleAddMorePDF remains the same
  const handleAddMorePDF = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      pdf_files: [
        ...prevFormData.pdf_files,
        {
          file: null, // No file initially uploaded
          fileName: "", // No file name initially
          pdf_date: moment().format("YYYY-MM-DD"), // Set the current date by default
        },
      ],
    }));
  };

  const handlePDFChange = (e, index) => {
    const files = e.target.files;
    const file = files[0];

    if (file) {
      const fileName = file.name;

      setFormData((prevFormData) => {
        const newFiles = [...prevFormData.pdf_files];
        newFiles[index] = {
          ...newFiles[index],
          file,
          fileName,
        };
        return {
          ...prevFormData,
          pdf_files: newFiles,
        };
      });
    }
  };

  const handleDateChange = (e, index) => {
    const selectedDate = e.target.value; // Use input field's value
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");

    setFormData((prevFormData) => {
      const newFiles = [...prevFormData.pdf_files];
      newFiles[index] = {
        ...newFiles[index],
        pdf_date: formattedDate, // Save as formatted moment date
      };
      return {
        ...prevFormData,
        pdf_files: newFiles,
      };
    });
  };
  const handleUploadAllPDFs = async () => {
    try {
      if (!formData.wtg_no) {
        toast.error("WTG No is required");
        return;
      }

      // Filter out existing PDFs (those with a pdf_id)
      const newPDFs = formData.pdf_files.filter((pdf) => !pdf.pdf_id);

      if (newPDFs.length === 0) {
        toast.info("No new PDFs to upload");
        return;
      }

      // Convert files to Base64 and prepare the array
      const pdfFilesPayload = await Promise.all(
        newPDFs.map(async (pdf) => ({
          fileName: pdf.fileName,
          pdf_date: pdf.pdf_date,
          file: pdf.file ? await toBase64(pdf.file) : null, // Convert file to Base64 if present
        }))
      );

      const payload = {
        wtg_no: formData.wtg_no,
        pdf_files: pdfFilesPayload,
      };

      // Make API call
      const response = await fetch(
        "https://greenenergy.zentexus.in/api/pdfadmin/create.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json();

      if (responseData.status === 200) {
        toast.success("PDFs uploaded successfully");

        // Optionally update formData to reflect uploaded PDFs
        setFormData((prevFormData) => ({
          ...prevFormData,
          pdf_files: prevFormData.pdf_files.map((pdf) =>
            !pdf.pdf_id
              ? {
                  ...pdf,
                  pdf_id: responseData.pdf_id || null, // Update with server response if available
                }
              : pdf
          ),
        }));
      } else {
        toast.error(responseData.msg || "Error uploading PDFs");
      }
    } catch (error) {
      console.error("Error uploading PDFs:", error);
      toast.error("An error occurred while uploading PDFs");
    }
  };
  const handleUpdatePDF = async () => {
    try {
      if (!formData.wtg_no) {
        toast.error("WTG No is required");
        return;
      }

      // Prepare the payload for the update API
      const updatedPDFPayload = await Promise.all(
        formData.pdf_files
          .filter((pdf) => pdf.pdf_id) // Only update existing pdf_files with pdf_id
          .map(async (pdf) => ({
            pdf_id: pdf.pdf_id,
            fileName: pdf.fileName,
            pdf_date: pdf.pdf_date,
            pdfBase64: pdf.file ? await toBase64(pdf.file) : null, // Convert file to Base64 if a new file is uploaded
          }))
      );

      const payload = {
        wtg_no: formData.wtg_no,
        pdf_files: updatedPDFPayload,
      };

      // Make API call to update existing PDF files
      const response = await fetch(
        "https://greenenergy.zentexus.in/api/pdfadmin/update.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json();

      if (responseData.status === 200) {
        toast.success("PDFs updated successfully");
      } else {
        toast.error(responseData.msg || "Error updating PDFs");
      }
    } catch (error) {
      console.error("Error updating PDFs:", error);
      toast.error("An error occurred while updating PDFs");
    }
  };

  const handleDeletePDF = async (pdf_id) => {
    try {
      if (!pdf_id) {
        toast.error("PDF ID is required");
        return;
      }

      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        customClass: {
          confirmButton: "my-confirm-button-class",
          cancelButton: "my-cancel-button-class",
        },
      });
      if (result.isConfirmed) {
        const response = await fetch(
          "https://greenenergy.zentexus.in/api/pdfadmin/delete.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pdf_id }),
          }
        );

        const responseData = await response.json();

        if (responseData.status === 200) {
          toast.success("PDF deleted successfully");
          // Remove the deleted PDF from the formData state
          setFormData((prevFormData) => ({
            ...prevFormData,
            pdf_files: prevFormData.pdf_files.filter(
              (pdf) => pdf.pdf_id !== pdf_id
            ),
          }));
        } else {
          toast.error(responseData.msg || "Error deleting PDF");
        }
      }
    } catch (error) {
      console.error("Error deleting PDF:", error);
      toast.error("An error occurred while deleting the PDF");
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

  // const handleSubmit = async () => {
  //   try {
  //     if (formData.wtg_no === "") {
  //       if (formData.wtg_no === "") {
  //         errorAlert("Name is Must");
  //       }
  //     } else {
  //       const formDataBody = new FormData();

  //       // Append required text fields
  //       formDataBody.append("date", formData.site_id ||"");
  //       formDataBody.append("customer_id", formData.customer_id ||"");
  //       formDataBody.append("customername_id", formData.customername_id ||"");
  //       formDataBody.append("wtg_no", formData.wtg_no ||"");
  //       formDataBody.append("loc_no", formData.loc_no ||"");
  //       formDataBody.append("htsc_no", formData.htsc_no ||"");

  //       // Append optional fields with conditional checks
  //       formDataBody.append("site_id", formData.site_id || "");
  //       formDataBody.append("location_id", formData.location_id || "");
  //       formDataBody.append("model_id", formData.model_id || "");
  //       formDataBody.append("contracttype_id", formData.contracttype_id || "");
  //       formDataBody.append("dgr_need", formData.dgr_need || "");
  //       formDataBody.append("capacity", formData.capacity || "");
  //       formDataBody.append("feeder_voltage", formData.feeder_voltage || "");
  //       formDataBody.append("feed_name", formData.feed_name || "");
  //       formDataBody.append("sub_station", formData.sub_station || "");
  //       formDataBody.append("tower_ht", formData.tower_ht || "");
  //       formDataBody.append("latitude", formData.latitude || "");
  //       formDataBody.append("lognitude", formData.lognitude || "");
  //       formDataBody.append("controler", formData.controler || "");
  //       formDataBody.append("ctpt_make", formData.ctpt_make || "");
  //       formDataBody.append("ctpt_sino", formData.ctpt_sino || "");
  //       formDataBody.append("ctpt_ratio", formData.ctpt_ratio || "");
  //       formDataBody.append("ctpt_multiplicationfactor", formData.ctpt_multiplicationfactor || "");
  //       formDataBody.append("transformer_make", formData.transformer_make || "");
  //       formDataBody.append("transformer_sino", formData.transformer_sino || "");
  //       formDataBody.append("transformer_ratio", formData.transformer_ratio || "");
  //       formDataBody.append("energymeter_sino", formData.energymeter_sino || "");

  //       // Optionally append file fields like pdf_files if they exist
  //       if (formData.pdf_files.length > 0) { // Corrected here
  //         formData.pdf_files.forEach(pdf => { // Corrected here
  //           formDataBody.append("pdf_files[]", pdf.file); // Make sure you are appending the file correctly
  //         });
  //       }

  //       const response = await fetch("https://greenenergy.zentexus.in/api/turbine/create.php",
  //         {
  //           method: "POST",
  //           body: formDataBody,
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );
  //       // console.log(
  //       //   "post",
  //       //   JSON.stringify({
  //       //     date: formData.date,
  //       //     customer_id: formData.customer_id,
  //       //     customername_id: formData.customername_id,
  //       //     wtg_no: formData.wtg_no,
  //       //     loc_no: formData.loc_no,
  //       //     htsc_no: formData.htsc_no,
  //       //     site_id: formData.site_id,
  //       //     location_id: formData.location_id,
  //       //     model_id: formData.model_id,
  //       //     contracttype_id: formData.contracttype_id,
  //       //     dgr_need: formData.dgr_need,
  //       //     capacity: formData.capacity,
  //       //     feeder_voltage: formData.feeder_voltage,
  //       //     feed_name: formData.feed_name,
  //       //     sub_station: formData.sub_station,
  //       //     tower_ht: formData.tower_ht,
  //       //     latitude: formData.latitude,
  //       //     lognitude: formData.lognitude,
  //       //     controler: formData.controler,
  //       //     ctpt_make: formData.ctpt_make,
  //       //     ctpt_sino: formData.ctpt_sino,
  //       //     ctpt_ratio: formData.ctpt_ratio,
  //       //     ctpt_multiplicationfactor: formData.ctpt_multiplicationfactor,
  //       //     transformer_make: formData.transformer_make,
  //       //     transformer_sino: formData.transformer_sino,
  //       //     transformer_ratio: formData.transformer_ratio,
  //       //     energymeter_sino: formData.energymeter_sino,
  //       //     energymeter_ratio: formData.energymeter_ratio,
  //       //     acb_sino: formData.acb_sino,
  //       //     acb_ratio: formData.acb_ratio,
  //       //     apfcpanel_make: formData.apfcpanel_make,
  //       //     apfcpanel_sino: formData.apfcpanel_sino,
  //       //     mainpanel_make: formData.mainpanel_make,
  //       //     mainpanel_sino: formData.mainpanel_sino,
  //       //     gearbox_make: formData.gearbox_make,
  //       //     gearbox_sino: formData.gearbox_sino,
  //       //     generator_make: formData.generator_make,
  //       //     generator_sino: formData.generator_sino,
  //       //     bladeone_make: formData.bladeone_make,
  //       //     bladeone_sino: formData.bladeone_sino,
  //       //     bladeone_classofweight: formData.bladeone_classofweight,
  //       //     bladeone_bladebearing: formData.bladeone_bladebearing,
  //       //     bladetwo_make: formData.bladetwo_make,
  //       //     bladetwo_sino: formData.bladetwo_sino,
  //       //     bladetwo_classofweight: formData.bladetwo_classofweight,
  //       //     bladetwo_bladebearing: formData.bladetwo_bladebearing,
  //       //     bladethree_make: formData.bladethree_make,
  //       //     bladethree_sino: formData.bladethree_sino,
  //       //     bladethree_classofweight: formData.bladethree_classofweight,
  //       //     bladethree_bladebearing: formData.bladethree_bladebearing,
  //       //     hydraunit_make: formData.hydraunit_make,
  //       //     hydraunit_sino: formData.hydraunit_sino,
  //       //     hydramotor_make: formData.hydramotor_make,
  //       //     hydramotor_sino: formData.hydramotor_sino,
  //       //     hydrafiltertype_make: formData.hydrafiltertype_make,
  //       //     hydrafiltertype_sino: formData.hydrafiltertype_sino,
  //       //     propositionalvalve_make: formData.propositionalvalve_make,
  //       //     propositionalvalve_sino: formData.propositionalvalve_sino,
  //       //     incharge_name: formData.incharge_name,
  //       //     incharge_mobile_no: formData.incharge_mobile_no,
  //       //     siteoperator_name: formData.siteoperator_name,
  //       //     siteoperator_mobileno: formData.siteoperator_mobileno,
  //       //   })
  //       // );
  //       const responseData = await response.json();

  //       console.log("responseData", responseData);

  //       if (responseData.status === 200) {
  //         successAlert(responseData.msg);
  //         setTimeout(() => {
  //           navigate("/master/turbines");
  //         }, 2000);
  //       } else if (responseData.status === 400) {
  //         errorAlert(responseData.msg);
  //       } else {
  //         setShowAlert(true);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  const handleSubmit = async () => {
    try {
      if (!formData.wtg_no) {
        toast.error("WTG No is required");
        return;
      }

      const pdfFiles = await Promise.all(
        formData.pdf_files.map(async (pdf) => {
          const base64File = pdf.file ? await toBase64(pdf.file) : null;
          console.log(
            `Base64 for ${pdf.fileName || "Unnamed File"}:`,
            base64File
          );
          return {
            fileName: pdf.fileName,
            pdf_date: pdf.pdf_date,
            file: base64File,
          };
        })
      );

      const jsonPayload = {
        ...formData,
        pdf_files: pdfFiles,
      };

      const response = await fetch(
        "https://greenenergy.zentexus.in/api/turbine/create.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonPayload),
        }
      );
      console.log(
        "Payload being sent to the API:",
        JSON.stringify(jsonPayload, null, 2)
      );
      const responseData = await response.json();

      console.log("responseData", responseData);

      if (responseData.status === 200) {
        toast.success(responseData.msg);
        setTimeout(() => {
          navigate("/master/turbines");
        }, 2000);
      } else if (responseData.status === 400) {
        toast.error(responseData.msg);
      } else {
        toast.error("Unexpected error occurred");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while submitting the form");
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      const pdfFiles = await Promise.all(
        formData.pdf_files.map(async (pdf) => {
          if (pdf.file && !(pdf.file instanceof Blob)) {
            console.error(`Invalid file type for ${pdf.fileName}:`, pdf.file);
            throw new Error(`Invalid file type for ${pdf.fileName}`);
          }

          const base64File = pdf.file ? await toBase64(pdf.file) : null;
          return {
            fileName: pdf.fileName,
            pdf_date: pdf.pdf_date,
            file: base64File, // Include Base64 file if present
          };
        })
      );

      // Prepare the request payload
      const jsonData = {
        ...formData,
        pdf_files: pdfFiles, // Include processed PDF files
      };

      // Send JSON data in the request body
      const response = await fetch(
        "https://greenenergy.zentexus.in/api/turbine/update.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Set content type to JSON
          },
          body: JSON.stringify(jsonData), // Convert the object to JSON string
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update company");
      }

      const responseData = await response.json();
      console.log(responseData);

      if (responseData.status === 200) {
        successAlert(responseData.msg);
        setTimeout(() => {
          navigate("/master/turbines");
        }, 2000);
      } else {
        console.error(
          responseData.msg || "Unknown error occurred during update"
        );
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }

    setLoading(false);
  };

  // const handleSubmit = async () => {
  //   try {
  //     if (!formData.wtg_no) {
  //       errorAlert("Name is required");
  //       return;
  //     }

  //     const formDataBody = new FormData();

  //     // Append all formData fields
  //     Object.entries(formData).forEach(([key, value]) => {
  //       if (key === "pdf_files" && value.length > 0) {
  //         value.forEach((pdf) => {
  //           formDataBody.append("pdf_files[]", pdf.file);
  //         });
  //       } else {
  //         formDataBody.append(key, value || "");
  //       }
  //     });

  //     const response = await fetch("https://greenenergy.zentexus.in/api/turbine/create.php", {
  //       method: "POST",
  //       body: formDataBody,
  //     });

  //     // Attempt to parse response as JSON
  //     const responseData = await response.json(); // Get the response as text

  //     console.log("responseData", responseData);

  //     if (responseData.status === 200) {
  //       successAlert(responseData.msg);
  //       setTimeout(() => {
  //         navigate("/master/turbines");
  //       }, 2000);
  //     } else if (responseData.status === 400) {
  //       errorAlert(responseData.msg);
  //     } else {
  //       setShowAlert(true);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  // const handleUpdateSubmit = async () => {
  //   try {
  //     const formDataBody = new FormData();

  //     // Append all formData fields
  //     Object.entries(formData).forEach(([key, value]) => {
  //       if (key === "pdf_files" && value.length > 0) {
  //         value.forEach((pdf) => {
  //           formDataBody.append("pdf_files[]", pdf.file);
  //         });
  //       } else {
  //         formDataBody.append(key, value || "");
  //       }
  //     });

  //     const response = await fetch("https://greenenergy.zentexus.in/api/turbine/update.php",
  //       {
  //         method: "POST",
  //         body: formDataBody, // Use FormData here
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to update company");
  //     }

  //     const responseData = await response.json();
  //     console.log(responseData);

  //     if (responseData.status === 200) {
  //       successAlert(responseData.msg);
  //       setTimeout(() => {
  //         navigate("/master/turbines");
  //       }, 2000);
  //     } else {
  //       console.error(
  //         responseData.msg || "Unknown error occurred during update"
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error updating product:", error);
  //   }

  //   setLoading(false);
  // };

  // const handleUpdateSubmit = async () => {
  //   try {
  //     const response = await fetch("https://greenenergy.zentexus.in/api/turbine/update.php",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           // Include the company ID in the request
  //           turbine_id: formData.turbine_id,
  //           date: formData.date,
  //           customer_id: formData.customer_id,
  //           customername_id: formData.customername_id,
  //           wtg_no: formData.wtg_no,
  //           loc_no: formData.loc_no,
  //           htsc_no: formData.htsc_no,
  //           site_id: formData.site_id,
  //           location_id: formData.location_id,
  //           model_id: formData.model_id,
  //           contracttype_id: formData.contracttype_id,
  //           dgr_need: formData.dgr_need,
  //           capacity: formData.capacity,
  //           feeder_voltage: formData.feeder_voltage,
  //           feed_name: formData.feed_name,
  //           sub_station: formData.sub_station,
  //           tower_ht: formData.tower_ht,
  //           latitude: formData.latitude,
  //           lognitude: formData.lognitude,
  //           controler: formData.controler,
  //           ctpt_make: formData.ctpt_make,
  //           ctpt_sino: formData.ctpt_sino,
  //           ctpt_ratio: formData.ctpt_ratio,
  //           ctpt_multiplicationfactor: formData.ctpt_multiplicationfactor,
  //           transformer_make: formData.transformer_make,
  //           transformer_sino: formData.transformer_sino,
  //           transformer_ratio: formData.transformer_ratio,
  //           energymeter_sino: formData.energymeter_sino,
  //           energymeter_ratio: formData.energymeter_ratio,
  //           acb_sino: formData.acb_sino,
  //           acb_ratio: formData.acb_ratio,
  //           apfcpanel_make: formData.apfcpanel_make,
  //           apfcpanel_sino: formData.apfcpanel_sino,
  //           mainpanel_make: formData.mainpanel_make,
  //           mainpanel_sino: formData.mainpanel_sino,
  //           gearbox_make: formData.gearbox_make,
  //           gearbox_sino: formData.gearbox_sino,
  //           generator_make: formData.generator_make,
  //           generator_sino: formData.generator_sino,
  //           bladeone_make: formData.bladeone_make,
  //           bladeone_sino: formData.bladeone_sino,
  //           bladeone_classofweight: formData.bladeone_classofweight,
  //           bladeone_bladebearing: formData.bladeone_bladebearing,
  //           bladetwo_make: formData.bladetwo_make,
  //           bladetwo_sino: formData.bladetwo_sino,
  //           bladetwo_classofweight: formData.bladetwo_classofweight,
  //           bladetwo_bladebearing: formData.bladetwo_bladebearing,
  //           bladethree_make: formData.bladethree_make,
  //           bladethree_sino: formData.bladethree_sino,
  //           bladethree_classofweight: formData.bladethree_classofweight,
  //           bladethree_bladebearing: formData.bladethree_bladebearing,
  //           hydraunit_make: formData.hydraunit_make,
  //           hydraunit_sino: formData.hydraunit_sino,
  //           hydramotor_make: formData.hydramotor_make,
  //           hydramotor_sino: formData.hydramotor_sino,
  //           hydrafiltertype_make: formData.hydrafiltertype_make,
  //           hydrafiltertype_sino: formData.hydrafiltertype_sino,
  //           propositionalvalve_make: formData.propositionalvalve_make,
  //           propositionalvalve_sino: formData.propositionalvalve_sino,
  //           incharge_name: formData.incharge_name,
  //           incharge_mobile_no: formData.incharge_mobile_no,
  //           siteoperator_name: formData.siteoperator_name,
  //           siteoperator_mobileno: formData.siteoperator_mobileno,
  //         }),
  //       }
  //     );
  //     console.log(
  //       "kannanvnr",
  //       JSON.stringify({
  //         // Include the company ID in the request
  //         turbine_id: formData.turbine_id,
  //         date: formData.date,
  //         customer_id: formData.customer_id,
  //         customername_id: formData.customername_id,
  //         wtg_no: formData.wtg_no,
  //         loc_no: formData.loc_no,
  //         htsc_no: formData.htsc_no,
  //         site_id: formData.site_id,
  //         location_id: formData.location_id,
  //         model_id: formData.model_id,
  //         contracttype_id: formData.contracttype_id,
  //         dgr_need: formData.dgr_need,
  //         capacity: formData.capacity,
  //         feeder_voltage: formData.feeder_voltage,
  //         feed_name: formData.feed_name,
  //         sub_station: formData.sub_station,
  //         tower_ht: formData.tower_ht,
  //         latitude: formData.latitude,
  //         lognitude: formData.lognitude,
  //         controler: formData.controler,
  //         ctpt_make: formData.ctpt_make,
  //         ctpt_sino: formData.ctpt_sino,
  //         ctpt_ratio: formData.ctpt_ratio,
  //         ctpt_multiplicationfactor: formData.ctpt_multiplicationfactor,
  //         transformer_make: formData.transformer_make,
  //         transformer_sino: formData.transformer_sino,
  //         transformer_ratio: formData.transformer_ratio,
  //         energymeter_sino: formData.energymeter_sino,
  //         energymeter_ratio: formData.energymeter_ratio,
  //         acb_sino: formData.acb_sino,
  //         acb_ratio: formData.acb_ratio,
  //         apfcpanel_make: formData.apfcpanel_make,
  //         apfcpanel_sino: formData.apfcpanel_sino,
  //         mainpanel_make: formData.mainpanel_make,
  //         mainpanel_sino: formData.mainpanel_sino,
  //         gearbox_make: formData.gearbox_make,
  //         gearbox_sino: formData.gearbox_sino,
  //         generator_make: formData.generator_make,
  //         generator_sino: formData.generator_sino,
  //         bladeone_make: formData.bladeone_make,
  //         bladeone_sino: formData.bladeone_sino,
  //         bladeone_classofweight: formData.bladeone_classofweight,
  //         bladeone_bladebearing: formData.bladeone_bladebearing,
  //         bladetwo_make: formData.bladetwo_make,
  //         bladetwo_sino: formData.bladetwo_sino,
  //         bladetwo_classofweight: formData.bladetwo_classofweight,
  //         bladetwo_bladebearing: formData.bladetwo_bladebearing,
  //         bladethree_make: formData.bladethree_make,
  //         bladethree_sino: formData.bladethree_sino,
  //         bladethree_classofweight: formData.bladethree_classofweight,
  //         bladethree_bladebearing: formData.bladethree_bladebearing,
  //         hydraunit_make: formData.hydraunit_make,
  //         hydraunit_sino: formData.hydraunit_sino,
  //         hydramotor_make: formData.hydramotor_make,
  //         hydramotor_sino: formData.hydramotor_sino,
  //         hydrafiltertype_make: formData.hydrafiltertype_make,
  //         hydrafiltertype_sino: formData.hydrafiltertype_sino,
  //         propositionalvalve_make: formData.propositionalvalve_make,
  //         propositionalvalve_sino: formData.propositionalvalve_sino,
  //         incharge_name: formData.incharge_name,
  //         incharge_mobile_no: formData.incharge_mobile_no,
  //         siteoperator_name: formData.siteoperator_name,
  //         siteoperator_mobileno: formData.siteoperator_mobileno,
  //       })
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to update company");
  //     }

  //     const responseData = await response.json();
  //     console.log(responseData);

  //     if (responseData.status === 200) {
  //       successAlert(responseData.msg);
  //       setTimeout(() => {
  //         navigate("/master/turbines");
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
  const [customer, setCustomer] = useState([]);
  console.log("customer", customer);
  const fetchDataCustomer = async () => {
    try {
      const response = await fetch(
        "https://greenenergy.zentexus.in/api/customer/list.php",
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
        setCustomer(responseData.data.customer);
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  const [siteData, setSiterData] = useState([]);
  const fetchDataSite = async () => {
    try {
      const response = await fetch(
        "https://greenenergy.zentexus.in/api/site/list.php",
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
        setSiterData(responseData.data.site);
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  const handleSiteSubmit = async () => {
    try {
      if (siteForm.site_name === "" || siteForm.short_code === "") {
        if (siteForm.site_name === "") {
          errorAlert("Name is Must");
        } else if (siteForm.short_code === "") {
          errorAlert("Mobile Number is Must");
        }
      } else {
        const response = await fetch(
          "https://greenenergy.zentexus.in/api/site/create.php",
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
          toast.success("site create success!", {
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
            console.log("Attempting to close modal");
            handleCloseModal();
          }, 1000);
          await fetchDataSite();
          setFormData({
            ...formData,
            site_id: newSite.site_id, // Assuming `site_id` is returned in the response
          });
          setSiteForm([]);
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
  console.log("aftersite", formData);
  const [locationData, setLocationData] = useState([]);
  console.log("locationData", locationData);
  const fetchDataLocation = async () => {
    try {
      const response = await fetch(
        "https://greenenergy.zentexus.in/api/location/list.php",
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
        setLocationData(responseData.data.location);
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  const handleSubmitLocation = async () => {
    try {
      if (formData.location_name === "") {
        if (formData.location_name === "") {
          errorAlert("LocationName is Must");
        }
      } else {
        const response = await fetch(
          "https://greenenergy.zentexus.in/api/location/create.php",
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
          }, 1000);
          await fetchDataLocation();
          setFormData({
            ...formData,
            location_id: newSite.location_id, // Assuming `site_id` is returned in the response
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
  const [modelData, setModelData] = useState([]);
  console.log("modelData", modelData);
  const fetchDataModel = async () => {
    try {
      const response = await fetch(
        "https://greenenergy.zentexus.in/api/model/list.php",
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
        setModelData(responseData.data.model);
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  const handleSubmitModel = async () => {
    try {
      if (formData.model_type === "") {
        if (formData.model_type === "") {
          errorAlert("ModelName is Must");
        }
      } else {
        const response = await fetch(
          "https://greenenergy.zentexus.in/api/model/create.php",
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
            handleCloseModalModal();
          }, 2000);
          await fetchDataModel();
          setFormData({
            ...formData,
            model_id: newSite.model_id, // Assuming `site_id` is returned in the response
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
  const [contractData, setContractData] = useState([]);
  const fetchDataContract = async () => {
    try {
      const response = await fetch(
        "https://greenenergy.zentexus.in/api/contract_type/list.php",
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
        setContractData(responseData.data.contract_type);
      } else {
        throw new Error(responseData.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  const handleSubmitContract = async () => {
    try {
      if (formData.contract_name === "" || formData.contract_code === "") {
        if (formData.contract_name === "") {
          errorAlert("Name is Must");
        } else if (formData.contract_code === "") {
          errorAlert("Mobile Number is Must");
        }
      } else {
        const response = await fetch(
          "https://greenenergy.zentexus.in/api/contract_type/create.php",
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

        console.log(responseData);

        if (responseData.status === 200) {
          const newSite = responseData.data;

          console.log("newSite", newSite);
          successAlert(responseData.msg);
          setTimeout(() => {
            handleCloseModalContract();
          }, 2000);
          await fetchDataContract();
          setFormData({
            ...formData,
            contracttype_id: newSite.contract_id, // Assuming `site_id` is returned in the response
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
  useEffect(() => {
    fetchDataCustomer();
    fetchDataSite();
    fetchDataLocation();
    fetchDataModel();
    fetchDataContract();
  }, []);
  useEffect(() => {
    // Check if party_id is selected
    if (formData.customer_id) {
      // Find the selected party in partySalesData
      const selectedParty = customer.find(
        (party) => party.customer_unique_id === formData.customer_id
      );

      if (selectedParty) {
        // Update formData with party data
        setFormData((prevFormData) => ({
          ...prevFormData,
          customername_id: selectedParty
            ? selectedParty.customer_unique_id
            : "",
        }));
      }
    }
  }, [formData.customer_id, customer]);
  useEffect(() => {
    // Check if party_id is selected
    if (formData.customername_id) {
      // Find the selected party in partySalesData
      const selectedParty = customer.find(
        (party) => party.customer_unique_id === formData.customername_id
      );

      if (selectedParty) {
        // Update formData with party data
        setFormData((prevFormData) => ({
          ...prevFormData,
          customer_id: selectedParty ? selectedParty.customer_unique_id : "",
        }));
      }
    }
  }, [formData.customername_id, customer]);

  return (
    <>
      <div id="main">
        <Container fluid>
          <Row className="regular">
            <Col lg="12" md="12" xs="12" className="py-3">
              <PageNav
                pagetitle={
                  type === "edit" ? "Edit Turbine" : "Turbine Creation"
                }
              ></PageNav>
            </Col>
            <Col lg="12" md="12" xs="12">
              <div> </div>
            </Col>
            {type === "edit" && (
              <Col lg="8" md="12" xs="12" className="py-3">
                <div className="pdf-upload-section">
                  <h3>PDF Files</h3>
                  {formData.pdf_files.map((pdf, index) => (
                    <div key={index} className="pdf-file">
                      <span>{pdf.fileName || "No file uploaded"}</span>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handlePDFChange(e, index)}
                      />
                      <input
                        type="date"
                        value={pdf.pdf_date || ""}
                        onChange={(e) => handleDateChange(e, index)}
                      />
                      {/* <button className="update-pdfs-btn" onClick={handleUpdatePDF}>
                      Update PDFs
                    </button> */}
                      <button
                        className="delete-btn"
                        onClick={() => handleDeletePDF(pdf.pdf_id)} // Pass pdf_id to delete API
                      >
                        Delete
                      </button>
                      {pdf.fileName && pdf.pdf_id && (
                        <button
                          onClick={() =>
                            window.open(
                              getPdfFileUrl(pdf.fileName, pdf.pdf_id),
                              "_blank"
                            )
                          }
                        >
                          Open
                        </button>
                      )}
                    </div>
                  ))}
                  <button className="add-more" onClick={handleAddMorePDF}>
                    Add More PDF
                  </button>
                  <button
                    className="upload-all-btn"
                    onClick={handleUploadAllPDFs}
                  >
                    Submit
                  </button>
                </div>
              </Col>
            )}

            <Col lg="4" md="4" xs="12" className="py-3">
              <div className="w-100">
                <Calender
                  setLabel={(date) => setLabel(date, "date")}
                  selectedDate={formData.date}
                  calenderlabel="Turbine Date"
                />
              </div>
            </Col>
            <Col lg="4" md="4" xs="12" className="py-3">
              <DropDownUI
                optionlist={customer.map((user) => ({
                  value: user.customer_unique_id,
                  label: user.customer_id,
                }))}
                placeholder="Customer ID"
                labelname="Customer ID"
                name="customer_id"
                value={formData}
                onChange={(updatedFormData) =>
                  setFormData({
                    ...formData,
                    customer_id: updatedFormData.customer_id,
                  })
                }
              />
            </Col>
            <Col lg="4" md="4" xs="12" className="py-3">
              <DropDownUI
                optionlist={customer.map((user) => ({
                  value: user.customer_unique_id,
                  label: user.customer_name,
                }))}
                placeholder="Customer Name"
                labelname="Customer Name"
                name="customername_id"
                value={formData}
                onChange={(updatedFormData) =>
                  setFormData({
                    ...formData,
                    customername_id: updatedFormData.customername_id,
                  })
                }
              />
            </Col>
            <Col lg="4" md="4" xs="12" className="py-3">
              <TextInputForm
                labelname={"WTG No."}
                name="wtg_no"
                value={formData.wtg_no}
                onChange={(e) => handleChange(e, "wtg_no")}
              ></TextInputForm>
            </Col>
            <Col lg="4" md="4" xs="12" className="py-3">
              <TextInputForm
                labelname={"Loc No."}
                name="loc_no"
                value={formData.loc_no}
                onChange={(e) => handleChange(e, "loc_no")}
              ></TextInputForm>
            </Col>
            <Col lg="4" md="4" xs="12" className="py-3">
              <TextInputForm
                labelname={"HTSC No"}
                name="htsc_no"
                value={formData.htsc_no}
                onChange={(e) => handleChange(e, "htsc_no")}
              ></TextInputForm>
            </Col>

            <Col lg="3" md="3" xs="12" className="py-3">
              <DropDown
                optionlist={siteData.map((user) => ({
                  value: user.site_id,
                  label: user.site_name,
                }))}
                placeholder="Site Name"
                labelname="Site  Name"
                name="site_id"
                value={formData.site_id}
                onChange={(updatedFormData) =>
                  setFormData({ ...formData, site_id: updatedFormData.site_id })
                }
                onClick={handleShowModal}
              ></DropDown>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <DropDown
                optionlist={locationData.map((user) => ({
                  value: user.location_id,
                  label: user.location_name,
                }))}
                placeholder="Location"
                labelname=" Location"
                name="location_id"
                value={formData.location_id}
                onChange={(updatedFormData) =>
                  setFormData({
                    ...formData,
                    location_id: updatedFormData.location_id,
                  })
                }
                onClick={handleShowModalLocation}
              ></DropDown>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <DropDown
                optionlist={modelData.map((user) => ({
                  value: user.model_id,
                  label: user.model_type,
                }))}
                placeholder="Model"
                labelname="Model"
                name="model_id"
                value={formData.model_id}
                onChange={(updatedFormData) =>
                  setFormData({
                    ...formData,
                    model_id: updatedFormData.model_id,
                  })
                }
                onClick={handleShowModalModal}
              ></DropDown>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <DropDown
                optionlist={contractData.map((user) => ({
                  value: user.contract_id,
                  label: user.contract_name,
                }))}
                placeholder=" Contract Type"
                labelname="Contract Type"
                name="contracttype_id"
                value={formData.contracttype_id}
                onChange={(updatedFormData) =>
                  setFormData({
                    ...formData,
                    contracttype_id: updatedFormData.contracttype_id,
                  })
                }
                onClick={handleShowModalcontract}
              ></DropDown>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <DropDownUI
                optionlist={DropList}
                placeholder=" DGR Need ?"
                labelname="DGR Need ?"
                name="dgr_need"
                value={formData}
                onChange={(updatedFormData) =>
                  setFormData({
                    ...formData,
                    dgr_need: updatedFormData.dgr_need,
                  })
                }
              ></DropDownUI>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"Capacity"}
                name="capacity"
                value={formData.capacity}
                onChange={(e) => handleChange(e, "capacity")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"Feeder Voltage"}
                name="feeder_voltage"
                value={formData.feeder_voltage}
                onChange={(e) => handleChange(e, "feeder_voltage")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"Feed Name"}
                name="feed_name"
                value={formData.feed_name}
                onChange={(e) => handleChange(e, "feed_name")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"Sub Station"}
                name="sub_station"
                value={formData.sub_station}
                onChange={(e) => handleChange(e, "sub_station")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"Tower Ht"}
                name="tower_ht"
                value={formData.tower_ht}
                onChange={(e) => handleChange(e, "tower_ht")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"Latitude"}
                name="latitude"
                value={formData.latitude}
                onChange={(e) => handleChange(e, "latitude")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"Lognitude"}
                name="lognitude"
                value={formData.lognitude}
                onChange={(e) => handleChange(e, "lognitude")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"Controler"}
                name="controler"
                value={formData.controler}
                onChange={(e) => handleChange(e, "controler")}
              ></TextInputForm>
            </Col>
            <Col lg="12" xs="12" md="12">
              <div className="py-4"> CT / PT</div>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"CTPT make"}
                name="ctpt_make"
                value={formData.ctpt_make}
                onChange={(e) => handleChange(e, "ctpt_make")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"CTPT SI No"}
                name="ctpt_sino"
                value={formData.ctpt_sino}
                onChange={(e) => handleChange(e, "ctpt_sino")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"CTPT Ratio"}
                name="ctpt_ratio"
                value={formData.ctpt_ratio}
                onChange={(e) => handleChange(e, "ctpt_ratio")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"CTPT Multiplication Factor"}
                name="ctpt_multiplicationfactor"
                value={formData.ctpt_multiplicationfactor}
                onChange={(e) => handleChange(e, "ctpt_multiplicationfactor")}
              ></TextInputForm>
            </Col>
            <Col lg="12" xs="12" md="12">
              <div className="py-4"> Transformer</div>
            </Col>
            <Col lg="4" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"Transformer Make"}
                name="transformer_make"
                value={formData.transformer_make}
                onChange={(e) => handleChange(e, "transformer_make")}
              ></TextInputForm>
            </Col>
            <Col lg="4" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"Transformer SI No."}
                name="transformer_sino"
                value={formData.transformer_sino}
                onChange={(e) => handleChange(e, "transformer_sino")}
              ></TextInputForm>
            </Col>
            <Col lg="4" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"Transformer Ratio"}
                name="transformer_ratio"
                value={formData.transformer_ratio}
                onChange={(e) => handleChange(e, "transformer_ratio")}
              ></TextInputForm>
            </Col>
            <Col lg="6" md="6" xs="12">
              <Row>
                <Col lg="12" xs="12" md="12">
                  <div className="py-3">Energy Meter</div>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"Energy Meter SI No."}
                    name="energymeter_sino"
                    value={formData.energymeter_sino}
                    onChange={(e) => handleChange(e, "energymeter_sino")}
                  ></TextInputForm>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"Energy meter Ratio"}
                    name="energymeter_ratio"
                    value={formData.energymeter_ratio}
                    onChange={(e) => handleChange(e, "energymeter_ratio")}
                  ></TextInputForm>
                </Col>
              </Row>
            </Col>
            <Col lg="6" md="6" xs="12">
              <Row>
                <Col lg="12" xs="12" md="12">
                  <div className="py-3">ACB</div>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"ACB SI No."}
                    name="acb_sino"
                    value={formData.acb_sino}
                    onChange={(e) => handleChange(e, "acb_sino")}
                  ></TextInputForm>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"ACB Ratio"}
                    name="acb_ratio"
                    value={formData.acb_ratio}
                    onChange={(e) => handleChange(e, "acb_ratio")}
                  ></TextInputForm>
                </Col>
              </Row>
            </Col>
            <Col lg="6" md="6" xs="12">
              <Row>
                <Col lg="12" xs="12" md="12">
                  <div className="py-3">APFC Panel</div>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"APFC Panel Make"}
                    name="apfcpanel_make"
                    value={formData.apfcpanel_make}
                    onChange={(e) => handleChange(e, "apfcpanel_make")}
                  ></TextInputForm>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"APFC Panel SI No."}
                    name="apfcpanel_sino"
                    value={formData.apfcpanel_sino}
                    onChange={(e) => handleChange(e, "apfcpanel_sino")}
                  ></TextInputForm>
                </Col>
              </Row>
            </Col>
            <Col lg="6" md="6" xs="12">
              <Row>
                <Col lg="12" xs="12" md="12">
                  <div className="py-3">Main Panel</div>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"Main Panel Make"}
                    name="mainpanel_make"
                    value={formData.mainpanel_make}
                    onChange={(e) => handleChange(e, "mainpanel_make")}
                  ></TextInputForm>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"Main Panel SI No"}
                    name="mainpanel_sino"
                    value={formData.mainpanel_sino}
                    onChange={(e) => handleChange(e, "mainpanel_sino")}
                  ></TextInputForm>
                </Col>
              </Row>
            </Col>
            <Col lg="6" md="6" xs="12">
              <Row>
                <Col lg="12" xs="12" md="12">
                  <div className="py-3">Gear Box</div>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"Gear Box Make"}
                    name="gearbox_make"
                    value={formData.gearbox_make}
                    onChange={(e) => handleChange(e, "gearbox_make")}
                  ></TextInputForm>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"Gear Box SI No."}
                    name="gearbox_sino"
                    value={formData.gearbox_sino}
                    onChange={(e) => handleChange(e, "gearbox_sino")}
                  ></TextInputForm>
                </Col>
              </Row>
            </Col>
            <Col lg="6" md="6" xs="12">
              <Row>
                <Col lg="12" xs="12" md="12">
                  <div className="py-3">Generator</div>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"Generator Make"}
                    name="generator_make"
                    value={formData.generator_make}
                    onChange={(e) => handleChange(e, "generator_make")}
                  ></TextInputForm>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"Generator SI No."}
                    name="generator_sino"
                    value={formData.generator_sino}
                    onChange={(e) => handleChange(e, "generator_sino")}
                  ></TextInputForm>
                </Col>
              </Row>
            </Col>
            <Col lg="12" xs="12" md="12">
              <div className="py-4">Blade 1</div>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"Blade 1 Make"}
                name="bladeone_make"
                value={formData.bladeone_make}
                onChange={(e) => handleChange(e, "bladeone_make")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"Blade 1 SI No."}
                name="bladeone_sino"
                value={formData.bladeone_sino}
                onChange={(e) => handleChange(e, "bladeone_sino")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"Blade 1 Class Of weight"}
                name="bladeone_classofweight"
                value={formData.bladeone_classofweight}
                onChange={(e) => handleChange(e, "bladeone_classofweight")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"Blade 1 Blade Bearing"}
                name="bladeone_bladebearing"
                value={formData.bladeone_bladebearing}
                onChange={(e) => handleChange(e, "bladeone_bladebearing")}
              ></TextInputForm>
            </Col>
            <Col lg="12" xs="12" md="12">
              <div className="py-4">Blade 2</div>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"Blade 2 Make"}
                name="bladetwo_make"
                value={formData.bladetwo_make}
                onChange={(e) => handleChange(e, "bladetwo_make")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"Blade 2 SI No."}
                name="bladetwo_sino"
                value={formData.bladetwo_sino}
                onChange={(e) => handleChange(e, "bladetwo_sino")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"Blade 2 Class Of weight"}
                name="bladetwo_classofweight"
                value={formData.bladetwo_classofweight}
                onChange={(e) => handleChange(e, "bladetwo_classofweight")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"Blade 2 Blade Bearing"}
                name="bladetwo_bladebearing"
                value={formData.bladetwo_bladebearing}
                onChange={(e) => handleChange(e, "bladetwo_bladebearing")}
              ></TextInputForm>
            </Col>
            <Col lg="12" xs="12" md="12">
              <div className="py-4">Blade 3</div>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"Blade 3 Make"}
                name="bladethree_make"
                value={formData.bladethree_make}
                onChange={(e) => handleChange(e, "bladethree_make")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"Blade 3 SI No."}
                name="bladethree_sino"
                value={formData.bladethree_sino}
                onChange={(e) => handleChange(e, "bladethree_sino")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"Blade 3 Class Of weight"}
                name="bladethree_classofweight"
                value={formData.bladethree_classofweight}
                onChange={(e) => handleChange(e, "bladethree_classofweight")}
              ></TextInputForm>
            </Col>
            <Col lg="3" md="3" xs="12" className="py-3">
              <TextInputForm
                labelname={"Blade 3 Blade Bearing"}
                name="bladethree_bladebearing"
                value={formData.bladethree_bladebearing}
                onChange={(e) => handleChange(e, "bladethree_bladebearing")}
              ></TextInputForm>
            </Col>
            <Col lg="6" md="6" xs="12">
              <Row>
                <Col lg="12" xs="12" md="12">
                  <div className="py-3">Hydra Unit</div>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"Hydra Unit Make"}
                    name="hydraunit_make"
                    value={formData.hydraunit_make}
                    onChange={(e) => handleChange(e, "hydraunit_make")}
                  ></TextInputForm>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"Hydra Unit SI No."}
                    name="hydraunit_sino"
                    value={formData.hydraunit_sino}
                    onChange={(e) => handleChange(e, "hydraunit_sino")}
                  ></TextInputForm>
                </Col>
              </Row>
            </Col>
            <Col lg="6" md="6" xs="12">
              <Row>
                <Col lg="12" xs="12" md="12">
                  <div className="py-3">Hydra Motor</div>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"Hydra Motor Make "}
                    name="hydramotor_make"
                    value={formData.hydramotor_make}
                    onChange={(e) => handleChange(e, "hydramotor_make")}
                  ></TextInputForm>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"Hydra Motor SI No."}
                    name="hydramotor_sino"
                    value={formData.hydramotor_sino}
                    onChange={(e) => handleChange(e, "hydramotor_sino")}
                  ></TextInputForm>
                </Col>
              </Row>
            </Col>
            <Col lg="6" md="6" xs="12">
              <Row>
                <Col lg="12" xs="12" md="12">
                  <div className="py-3">Hydra Filter Type</div>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"Hydra Filter Type Make"}
                    name="hydrafiltertype_make"
                    value={formData.hydrafiltertype_make}
                    onChange={(e) => handleChange(e, "hydrafiltertype_make")}
                  ></TextInputForm>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"Hydra Filter Type SI No"}
                    name="hydrafiltertype_sino"
                    value={formData.hydrafiltertype_sino}
                    onChange={(e) => handleChange(e, "hydrafiltertype_sino")}
                  ></TextInputForm>
                </Col>
              </Row>
            </Col>
            <Col lg="6" md="6" xs="12">
              <Row>
                <Col lg="12" xs="12" md="12">
                  <div className="py-3">Propositional Valve</div>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"Propositional Valve Make"}
                    name="propositionalvalve_make"
                    value={formData.propositionalvalve_make}
                    onChange={(e) => handleChange(e, "propositionalvalve_make")}
                  ></TextInputForm>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"SI No."}
                    name="propositionalvalve_sino"
                    value={formData.propositionalvalve_sino}
                    onChange={(e) => handleChange(e, "propositionalvalve_sino")}
                  ></TextInputForm>
                </Col>
              </Row>
            </Col>
            <Col lg="6" md="6" xs="12">
              <Row>
                <Col lg="12" xs="12" md="12">
                  <div className="py-3">Site Incharge Name</div>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"Name"}
                    name="incharge_name"
                    value={formData.incharge_name}
                    onChange={(e) => handleChange(e, "incharge_name")}
                  ></TextInputForm>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"Mobile No."}
                    name="incharge_mobile_no"
                    value={formData.incharge_mobile_no}
                    onChange={(e) => handleChange(e, "incharge_mobile_no")}
                  ></TextInputForm>
                </Col>
              </Row>
            </Col>
            <Col lg="6" md="6" xs="12">
              <Row>
                <Col lg="12" xs="12" md="12">
                  <div className="py-3">Site Operator</div>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"Name"}
                    name="siteoperator_name"
                    value={formData.siteoperator_name}
                    onChange={(e) => handleChange(e, "siteoperator_name")}
                  ></TextInputForm>
                </Col>
                <Col lg="6" xs="12" md="6" className="py-3">
                  <TextInputForm
                    labelname={"Mobile No."}
                    name="siteoperator_mobileno"
                    value={formData.siteoperator_mobileno}
                    onChange={(e) => handleChange(e, "siteoperator_mobileno")}
                  ></TextInputForm>
                </Col>
              </Row>
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
                          onClick={() => navigate("/master/turbines")}
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
                          onClick={() => navigate("/master/turbines")}
                        ></ClickButton>
                      </span>
                    </div>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
        <>
          <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
            <Modal.Header>
              <Modal.Title> Site Creation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container fluid>
                <Row>
                  <Col lg="4" className="py-3">
                    <DropDownUI
                      optionlist={Statename}
                      placeholder="choose State"
                      labelname="State"
                      name="state_id"
                      value={siteForm}
                      onChange={(updatedFormData) => {
                        setSiteForm({
                          ...siteForm,
                          state_id: updatedFormData.state_id,
                        });
                      }}
                    ></DropDownUI>
                  </Col>
                  <Col lg="4" className="py-3">
                    <TextInputForm
                      placeholder={"Site Name"}
                      labelname={"Site Name"}
                      name="site_name"
                      value={siteForm.site_name}
                      onChange={(e) => handleChangeSite(e, "site_name")}
                    ></TextInputForm>
                  </Col>
                  <Col lg="4" className="py-3">
                    <TextInputForm
                      placeholder={"Short Code"}
                      labelname={"Short Code"}
                      name="short_code"
                      value={siteForm.short_code}
                      onChange={(e) => handleChangeSite(e, "short_code")}
                    ></TextInputForm>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Col lg="12" className="py-5 align-self-center">
                <div className="text-center">
                  <>
                    <div className="d-flex justify-content-center">
                      <span className="mx-2">
                        <ClickButton
                          label={<> Submit</>}
                          onClick={handleSiteSubmit}
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
                </div>
              </Col>
            </Modal.Footer>
          </Modal>
        </>
        <>
          <Modal
            show={showModalLocation}
            onHide={handleCloseModalLoaction}
            size="lg"
            centered
          >
            <Modal.Header>
              <Modal.Title> Location Creation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container fluid>
                <Row>
                  <Col lg="4" className="py-3">
                    <DropDownUI
                      optionlist={Statename}
                      placeholder="State name"
                      labelname="Choose State"
                      name="state_id"
                      value={siteForm}
                      onChange={(updatedFormData) => {
                        setSiteForm({
                          ...siteForm,
                          state_id: updatedFormData.state_id,
                        });
                      }}
                    ></DropDownUI>
                  </Col>
                  <Col lg="4" className="py-3">
                    <DropDownUI
                      optionlist={siteData.map((user) => ({
                        value: user.site_id,
                        label: user.site_name,
                      }))}
                      placeholder="Site Name"
                      labelname="Site Name"
                      name="site_id"
                      value={siteForm}
                      onChange={(updatedFormData) => {
                        setSiteForm({
                          ...siteForm,
                          site_id: updatedFormData.site_id,
                        });
                      }}
                    ></DropDownUI>
                  </Col>
                  <Col lg="4" className="py-3">
                    <TextInputForm
                      placeholder={"Location Name"}
                      labelname={"Location Name"}
                      name="location_name"
                      value={siteForm.location_name}
                      onChange={(e) => handleChangeSite(e, "location_name")}
                    ></TextInputForm>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Col lg="12" className="py-5 align-self-center">
                <div className="text-center">
                  <>
                    <div className="d-flex justify-content-center">
                      <span className="mx-2">
                        <ClickButton
                          label={<> Submit</>}
                          onClick={handleSubmitLocation}
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
        <>
          <Modal
            show={showModalModal}
            onHide={handleCloseModalModal}
            size="md"
            centered
          >
            <Modal.Header>
              <Modal.Title> Model Creation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <TextInputForm
                placeholder={"Model Type"}
                name="model_type"
                value={siteForm.model_type}
                onChange={(e) => handleChangeSite(e, "model_type")}
              ></TextInputForm>
            </Modal.Body>
            <Modal.Footer>
              <Col lg="12" className="py-5 align-self-center">
                <div className="text-center">
                  <>
                    <div className="d-flex justify-content-center">
                      <span className="mx-2">
                        <ClickButton
                          label={<> Submit</>}
                          onClick={handleSubmitModel}
                        ></ClickButton>
                      </span>
                      <span className="mx-2">
                        <ClickButton
                          label={<>Cancel</>}
                          onClick={handleCloseModalModal}
                        ></ClickButton>
                      </span>
                    </div>
                  </>
                </div>
              </Col>
            </Modal.Footer>
          </Modal>
        </>
        <>
          <Modal
            show={showModalContract}
            onHide={handleCloseModalContract}
            size="md"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Contract Type</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row>
                  <Col lg="12" md="12" xs="12" className="py-3">
                    <TextInputForm
                      placeholder={"Contract Name"}
                      labelname={" Contract Name"}
                      name="contract_name"
                      value={siteForm.contract_name}
                      onChange={(e) => handleChangeSite(e, "contract_name")}
                    ></TextInputForm>
                  </Col>
                  <Col lg="12" md="12" xs="12" className="py-3">
                    <TextInputForm
                      placeholder={"Contract Code"}
                      labelname={" Contract Code"}
                      name="contract_code"
                      value={siteForm.contract_code}
                      onChange={(e) => handleChangeSite(e, "contract_code")}
                    ></TextInputForm>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Col lg="12" className="py-5 align-self-center">
                <div className="text-center">
                  <>
                    <div className="d-flex justify-content-center">
                      <span className="mx-2">
                        <ClickButton
                          label={<> Submit</>}
                          onClick={handleSubmitContract}
                        ></ClickButton>
                      </span>
                      <span className="mx-2">
                        <ClickButton
                          label={<>Cancel</>}
                          onClick={handleCloseModalContract}
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
export default TurbineCreation;
