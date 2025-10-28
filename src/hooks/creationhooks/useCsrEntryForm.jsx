import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCsrs } from "../../slices/CsrSlice";
import { fetchCsrMappings } from "../../slices/CsrMappingSlice";
import { fetchParts } from "../../slices/PartsSlice";
import {
  addCsrEntry,
  updateCsrEntry,
  fetchErrors,
} from "../../slices/CsrEntrySlice";
import { toast } from "react-toastify";
import moment from "moment";

export default function useCsrEntryForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const inchargeSignatureRef = useRef();
  const viewMode = location.state?.viewMode || false;
  const getSignMode = location.state?.getSignMode || false;
  const [editCsrEntryId, setEditCsrEntryId] = useState(null);
  const [step, setStep] = useState(1);
  const [employeeSignatureUrl, setEmployeeSignatureUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const {
    csrs,
    status: csrStatus,
    error: csrError,
  } = useSelector((state) => state.csrs);
  const {
    mappings,
    status: csrMappingStatus,
    error: csrMappingError,
  } = useSelector((state) => state.csrMappings);
  const {
    parts,
    status: partsStatus,
    error: partsError,
  } = useSelector((state) => state.parts);
  const {
    errors,
    status: turbineStatus,
    error: turbineError,
  } = useSelector((state) => state.csrEntries);

  const [csrNoOptions, setCsrNoOptions] = useState([]);
  const [partNoOptions, setPartNoOptions] = useState([]);
  const [descriptionOptions, setDescriptionOptions] = useState([]);
  const [errorOptions, setErrorOptions] = useState([]);

  const statusOptions = [
    { value: "New", label: "New" },
    { value: "Repaired", label: "Repaired" },
    { value: "Standby", label: "Standby" },
    { value: "Damaged", label: "Damaged" },
    { value: "Supply By Customer", label: "Supply By Customer" },
    { value: "Defective", label: "Defective" },
    { value: "Checking Purpose", label: "Checking Purpose" },
  ];

  const workStatusOptions = [
    { value: "Complete", label: "Complete" },
    { value: "Incomplete", label: "Incomplete" },
    { value: "Under Observation", label: "Under Observation" },
    { value: "Working Solution Provided", label: "Working Solution Provided" },
  ];

  function sanitizeDate(dateStr) {
    if (!dateStr || dateStr === "0000-00-00" || dateStr === "00:00:00") {
      return null;
    }
    return dateStr;
  }

  const [formData, setFormData] = useState({
    csr_no: "",
    csr_entry_date: "",
    customer_id: "",
    customer_name: "",
    contract_id: "",
    contract_type: "",
    error_id: "",
    error_details: [],
    error_value_temp: "",
    turbine_id: "",
    wtg_no: "",
    loc_no: "",
    model_id: "",
    model_type: "",
    htsc_no: "",
    capacity: "",
    make: "",
    csr_booked_by: "",
    csr_booked_by_date: "",
    csr_booked_by_time: "",
    nature_of_work: "",
    machine_status: 0,
    system_down: 0,
    system_down_date: "",
    system_down_time: "",
    work_st_date: "",
    work_st_time: "",
    work_end_date: "",
    work_end_time: "",
    parts_data: [],
    work_status: "",
    employee_name: "",
    employee_sign: "",
    incharge_operator_name: "",
    incharge_operator_sign: "",
    customer_feedback: "",
    site_id: "",
    site_name: "",
    csr_type: "",
  });

  console.log(formData);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSystemDown, setIsSystemDown] = useState(false);
  const [checkboxLabel, setCheckboxLabel] = useState("No");
  const [isMachineStatus, setIsMachineStatus] = useState(false);
  const [machineCheckboxLabel, setMachineCheckboxLabel] = useState("Stop");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = user?.role_name.trim() || "";
  const user_id = user?.user_id || "";

  useEffect(() => {
    if (getSignMode) {
      setStep(2);
    }
  }, [getSignMode]);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("user")) || {};

    let signatureUrl = userData.sign_image
      ? `http://api.demos.srivarugreenenergy.com/user/${userData.sign_image}`
      : "";

    if (location.state?.csrEntry?.employee_sign) {
      signatureUrl = location.state.csrEntry.employee_sign;
    }

    setEmployeeSignatureUrl(signatureUrl);

    if (!editCsrEntryId && !viewMode && userData.user_name) {
      setFormData((prev) => ({
        ...prev,
        employee_name: userData.user_name,
        employee_id: userData.user_id,
      }));
    }
  }, [location.state, editCsrEntryId, viewMode]);

  // Separate effect to handle base64 conversion once URL is set
  useEffect(() => {
    if (employeeSignatureUrl && !viewMode && !editCsrEntryId) {
      handleSaveEmployeeSignature();
    }
  }, [employeeSignatureUrl]);

  const handleSaveEmployeeSignature = async () => {
    try {
      const response = await fetch(employeeSignatureUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch employee signature image.");
      }
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData((prev) => ({
          ...prev,
          employee_sign: base64String,
        }));
        toast.success("Employee signature saved successfully!");
      };
      reader.onerror = () => {
        toast.error("Failed to convert employee signature to Base64.");
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error converting employee signature:", error);
      toast.error("Failed to fetch or convert employee signature.");
    }
  };
  useEffect(() => {
    dispatch(fetchCsrs(""));
    dispatch(fetchCsrMappings(""));
    dispatch(fetchParts(""));
    dispatch(fetchErrors(""));
  }, [dispatch]);

  useEffect(() => {
    if (csrMappingStatus === "succeeded" && mappings.length > 0) {
      if (editCsrEntryId && formData.csr_no) {
        setCsrNoOptions([
          {
            value: formData.csr_no,
            label: formData.csr_no,
          },
        ]);
      } else {
        console.log(mappings, "mappings");
        console.log(role, "role");
        console.log(user_id, "user_id");

        let completedMappings = [];

        if (role === "Engineer") {
          completedMappings = mappings.filter(
            (mapping) =>
              mapping.status === "Not Completed" &&
              mapping.csr_mapping_data.some(
                (data) => data.technician_id === user_id
              )
          );
        } else {
          // All Not Completed mappings for other roles
          completedMappings = mappings.filter(
            (mapping) => mapping.status === "Not Completed"
          );
        }

        console.log(completedMappings, "completedMappings0");

        // Extract unique CSR numbers from the filtered mappings
        const uniqueCsrNos = [
          ...new Set(
            completedMappings
              .flatMap((mapping) => mapping.csr_mapping_data)
              .map((data) => data.csr_no)
          ),
        ];

        const options = uniqueCsrNos.map((csrNo) => ({
          value: csrNo,
          label: csrNo,
        }));

        setCsrNoOptions(options);
      }
    }
  }, [
    mappings,
    csrMappingStatus,
    editCsrEntryId,
    formData.csr_no,
    role,
    user_id,
  ]);

  useEffect(() => {
    if (partsStatus === "succeeded" && parts.length > 0) {
      const partOptions = parts.map((part) => ({
        value: part.part_no.toString(),
        label: part.part_no.toString(),
      }));
      const descOptions = parts.map((part) => ({
        value: part.description,
        label: part.description,
        part_no: part.part_no.toString(),
        uom: part.uom,
      }));
      setPartNoOptions(partOptions);
      setDescriptionOptions(descOptions);
    }
  }, [parts, partsStatus]);

  useEffect(() => {
    if (turbineStatus === "succeeded" && errors.length > 0) {
      const errorOptions = errors.map((error) => ({
        value: error.error_id,
        label: `${error.error_code} - ${error.error_description}`,
        error_description: `${error.error_code} - ${error.error_description}`,
      }));
      setErrorOptions(errorOptions);
    }
  }, [errors, turbineStatus]);

  useEffect(() => {
    if (location.state && location.state.csrEntry) {
      const csrEntry = location.state.csrEntry;

      console.log(csrEntry, "csrEntry from state");
      setEditCsrEntryId(csrEntry.csr_entry_id);
      setFormData({
        csr_no: csrEntry.csr_no || "",
        csr_entry_date: sanitizeDate(csrEntry.csr_entry_date) || "",
        customer_id: csrEntry.customer_id || "",
        customer_name: csrEntry.customer_name || "",
        contract_id: csrEntry.contract_id || "",
        contract_type: csrEntry.contract_type || "",
        error_id: "",
        error_details:
          typeof csrEntry.error_details === "string" &&
          csrEntry.error_details.trim()
            ? JSON.parse(csrEntry.error_details)
            : Array.isArray(csrEntry.error_details)
            ? csrEntry.error_details
            : [],

        error_value_temp: "",
        turbine_id: csrEntry.turbine_id || "",
        wtg_no: csrEntry.wtg_no ? csrEntry.wtg_no.toString() : "",
        loc_no: csrEntry.loc_no ? csrEntry.loc_no.toString() : "",
        model_id: csrEntry.model_id || "",
        model_type: csrEntry.model_type || "",
        htsc_no: csrEntry.htsc_no ? csrEntry.htsc_no.toString() : "",
        capacity: csrEntry.capacity ? csrEntry.capacity.toString() : "",
        make: csrEntry.make || "",
        csr_booked_by: csrEntry.csr_booked_by || "",
        csr_booked_by_date: sanitizeDate(csrEntry.csr_booked_by_date) || "",
        csr_booked_by_time: csrEntry.csr_booked_by_time || "",
        nature_of_work: csrEntry.nature_of_work || "",
        machine_status: csrEntry.machine_status || 0,
        system_down: csrEntry.system_down || 0,
        system_down_date: sanitizeDate(csrEntry.system_down_date) || "",
        system_down_time: csrEntry.system_down_time || "",
        work_st_date: sanitizeDate(csrEntry.work_st_date) || "",
        work_st_time: csrEntry.work_st_time || "",
        work_end_date: sanitizeDate(csrEntry.work_end_date) || "",
        work_end_time: csrEntry.work_end_time || "",
        parts_data:
          csrEntry.parts_data.map((part) => ({
            part_no: part.part_no
              ? part.part_no.toString()
              : part.item_no
              ? part.item_no.toString()
              : "",
            description: part.description || "",
            uom: part.uom || "",
            qty: part.qty ? part.qty.toString() : "",
            serial_no: part.serial_no || "",
            status: part.status || "",
          })) || [],
        work_status: csrEntry.work_status || "",
        employee_name: csrEntry.employee_name || "",
        employee_sign: csrEntry.employee_sign || "",
        incharge_operator_name: csrEntry.incharge_operator_name || "",
        incharge_operator_sign: csrEntry.incharge_operator_sign || "",
        customer_feedback: csrEntry.customer_feedback || "",
        site_id: csrEntry.site_id || "",
        site_name: csrEntry.site_name || "",
        csr_type: csrEntry.csr_type || "",
      });
      setIsSystemDown(csrEntry.system_down === 1);
      setCheckboxLabel(csrEntry.system_down === 1 ? "Yes" : "No");
      setIsMachineStatus(csrEntry.machine_status === 1);
      setMachineCheckboxLabel(csrEntry.machine_status === 1 ? "Run" : "Stop");

      if (csrEntry.incharge_operator_name || csrEntry.incharge_operator_sign) {
        setStep(2);
      }
      setStep(2);
    }
  }, [location.state]);

  useEffect(() => {
    if (step === 2 && inchargeSignatureRef.current) {
      if (formData.incharge_operator_sign && editCsrEntryId) {
        const loadSignature = async () => {
          try {
            const response = await fetch(formData.incharge_operator_sign, {
              mode: "cors",
              headers: {},
            });
            if (!response.ok) {
              throw new Error(
                `Failed to fetch signature image: ${response.statusText}`
              );
            }
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64String = reader.result;
              inchargeSignatureRef.current.clear();
              inchargeSignatureRef.current.fromDataURL(base64String);
              toast.success("Incharge operator signature loaded successfully!");
            };
            reader.onerror = () => {
              toast.error("Failed to convert signature to Base64.");
            };
            reader.readAsDataURL(blob);
          } catch (error) {
            console.error("Error loading signature:", error);
            toast.error("Failed to load incharge operator signature.");
          }
        };
        loadSignature();
      } else {
        inchargeSignatureRef.current.clear();
      }
    }
  }, [step, formData.incharge_operator_sign, editCsrEntryId]);

  const handleCsrNoChange = (e) => {
    if (viewMode) return;
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      csr_no: value,
      csr_entry_date: "",
      customer_id: "",
      customer_name: "",
      contract_id: "",
      contract_type: "",
      wtg_no: "",
      loc_no: "",
      model_id: "",
      model_type: "",
      htsc_no: "",
      capacity: "",
      make: "",
      csr_booked_by: "",
      system_down: 0,
      site_id: "",
      site_name: "",
      csr_type: "",
    }));
    setIsSystemDown(false);
    setCheckboxLabel("No");

    if (csrStatus === "succeeded" && csrs.length > 0) {
      const selectedCsr = csrs.find((csr) => csr.csr_no === value);
      if (selectedCsr) {
        setFormData((prev) => ({
          ...prev,
          csr_entry_date: selectedCsr.csr_date || "",
          customer_id: selectedCsr.customer_id || "",
          customer_name: selectedCsr.customer_name || "",
          contract_id: selectedCsr.contract_id || "",
          contract_type: selectedCsr.contract_type || "",
          wtg_no: selectedCsr.weg_no ? selectedCsr.weg_no.toString() : "",
          loc_no: selectedCsr.loc_no ? selectedCsr.loc_no.toString() : "",
          model_id: selectedCsr.model_id || "",
          model_type: selectedCsr.model_type || "",
          htsc_no: selectedCsr.htsc_no ? selectedCsr.htsc_no.toString() : "",
          capacity: selectedCsr.capacity ? selectedCsr.capacity.toString() : "",
          make: selectedCsr.make || "",
          csr_booked_by: selectedCsr.csr_booked_by || "",
          csr_booked_by_date: selectedCsr.csr_date || "",
          system_down: selectedCsr.system_down || 0,
          turbine_id: selectedCsr.turbine_id || "",
          site_id: selectedCsr.site_id || "",
          site_name: selectedCsr.site_name || "",
          csr_type: selectedCsr.csr_type || "",
        }));
        setIsSystemDown(selectedCsr.system_down === 1);
        setCheckboxLabel(selectedCsr.system_down === 1 ? "Yes" : "No");
      }
    }
  };

  const handleInputChange = (e) => {
    if (viewMode && !getSignMode) return;
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleErrorValueChange = (e) => {
    if (viewMode) return;
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      error_value_temp: value,
    }));
  };
  const handleTimeChange = (value, fieldName) => {
    if (value) {
      const formattedTime = moment(value, "HH:mm").format("hh:mm A");
      setFormData((prev) => ({
        ...prev,
        [fieldName]: formattedTime,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  const handleErrorChange = (e) => {
    if (viewMode) return;
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      error_id: value,
      error_value_temp: isEditing ? prev.error_value_temp : "",
    }));
  };

  const handleAddError = () => {
    if (viewMode) return;

    const selectedError = errorOptions.find(
      (option) => option.value === formData.error_id
    );
    const errorEntry = {
      error_id: formData.error_id,
      error_description: selectedError ? selectedError.error_description : "",
      error_value: formData.error_value_temp,
    };
    if (isEditing) {
      setFormData((prev) => {
        const updatedErrorDetails = [...prev.error_details];
        updatedErrorDetails[editIndex] = errorEntry;
        return {
          ...prev,
          error_details: updatedErrorDetails,
          error_id: "",
          error_value_temp: "",
          isEditing: false,
          editIndex: null,
        };
      });
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setFormData((prev) => ({
        ...prev,
        error_details: [...prev.error_details, errorEntry],
        error_id: "",
        error_value_temp: "",
      }));
    }
  };

  const handleEditError = (index) => {
    if (viewMode) return;
    const error = formData.error_details[index];
    setFormData((prev) => ({
      ...prev,
      error_id: error.error_id,
      error_value_temp: error.error_value,
    }));
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDeleteError = (index) => {
    if (viewMode) return;
    setFormData((prev) => {
      const updatedErrorDetails = prev.error_details.filter(
        (_, i) => i !== index
      );
      return {
        ...prev,
        error_details: updatedErrorDetails,
        error_id: isEditing && editIndex === index ? "" : prev.error_id,
        error_value_temp:
          isEditing && editIndex === index ? "" : prev.error_value_temp,
        isEditing: isEditing && editIndex === index ? false : prev.isEditing,
        editIndex: isEditing && editIndex === index ? null : prev.editIndex,
      };
    });
    toast.success("Error deleted successfully!");
  };

  const handleMachineStatusChange = (event) => {
    if (viewMode) return;
    const checked = event.target.checked;
    setIsMachineStatus(checked);
    setMachineCheckboxLabel(checked ? "Run" : "Stop");
    setFormData((prev) => ({ ...prev, machine_status: checked ? 1 : 0 }));
  };

  const handleCheckBoxChange = (event) => {
    if (viewMode) return;
    const checked = event.target.checked;
    setIsSystemDown(checked);
    setCheckboxLabel(checked ? "Yes" : "No");
    setFormData((prev) => ({ ...prev, system_down: checked ? 1 : 0 }));
  };

  const handlePartsDataChange = (index, field, value) => {
    if (viewMode) return;
    setFormData((prev) => {
      const updatedPartsData = [...prev.parts_data];
      if (field === "description") {
        const selectedPart = parts.find((part) => part.description === value);
        updatedPartsData[index] = {
          ...updatedPartsData[index],
          part_no: selectedPart ? selectedPart.part_no.toString() : "",
          description: value,
          uom: selectedPart ? selectedPart.uom : "",
        };
      } else {
        updatedPartsData[index] = {
          ...updatedPartsData[index],
          [field]: value,
        };
      }
      return { ...prev, parts_data: updatedPartsData };
    });
  };

  const handlePartNoChange = (index, e) => {
    if (viewMode) return;
    const { value } = e.target;
    const selectedPart = parts.find(
      (part) => part.part_no.toString() === value
    );
    setFormData((prev) => {
      const updatedPartsData = [...prev.parts_data];
      updatedPartsData[index] = {
        ...updatedPartsData[index],
        part_no: value,
        description: selectedPart ? selectedPart.description : "",
        uom: selectedPart ? selectedPart.uom : "",
      };
      return { ...prev, parts_data: updatedPartsData };
    });
  };

  const addPartRow = () => {
    if (viewMode) return;
    setFormData((prev) => ({
      ...prev,
      parts_data: [
        ...prev.parts_data,
        {
          part_no: "",
          description: "",
          uom: "",
          qty: "",
          serial_no: "",
          status: "",
        },
      ],
    }));
  };

  const deletePartRow = (index) => {
    if (viewMode) return;
    setFormData((prev) => {
      const updatedPartsData = prev.parts_data.filter((_, i) => i !== index);
      return { ...prev, parts_data: updatedPartsData };
    });
  };

  const getSignatureDataUrl = (ref) => {
    if (ref.current && !ref.current.isEmpty()) {
      return ref.current.toDataURL();
    }
    return "";
  };

  const handleClearSignature = (ref) => {
    if (viewMode && !getSignMode) return;
    setFormData((prev) => ({
      ...prev,
      incharge_operator_sign: "",
    }));
    if (ref.current) {
      ref.current.clear();
    }
  };

  const handleSaveSignature = (ref) => {
    if (viewMode && !getSignMode) return;
    try {
      const signatureDataUrl = getSignatureDataUrl(ref);
      if (signatureDataUrl) {
        setFormData((prev) => ({
          ...prev,
          incharge_operator_sign: signatureDataUrl,
        }));
        toast.success("Incharge operator signature saved successfully!");
      } else {
        toast.error("Please provide a signature before saving.");
      }
    } catch (error) {
      console.error("Error saving signature:", error);
      toast.error("Failed to save signature due to a canvas error.");
    }
  };

  const handleNext = () => {
    // if (!formData.csr_no) {
    //   toast.error("Please select a CSR Number.");
    //   return;
    // }
    // if (!employeeSignatureUrl) {
    //   toast.error("Employee signature image is not available.");
    //   return;
    // }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    if (viewMode && !getSignMode) return;
    e.preventDefault();
    // if (!formData.incharge_operator_name) {
    //   toast.error("Please enter the Incharge Operator Name.");
    //   return;
    // }

    const csrData = {
      ...formData,

      incharge_operator_sign: formData.incharge_operator_sign,
      ...(editCsrEntryId ? {} : { employee_sign: formData.employee_sign }),
    };

    const action = editCsrEntryId
      ? updateCsrEntry({ csrEntryId: editCsrEntryId, csrData })
      : addCsrEntry(csrData);

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(
          `CSR Entry ${editCsrEntryId ? "updated" : "created"} successfully!`
        );
        navigate("/csrentry");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleCloseForm = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmClose = (confirm) => {
    setShowConfirmDialog(false);
    if (confirm) {
      toast.info("Form closed. Navigating back.");
      navigate(-1);
    } else {
      toast.info("Form close cancelled.");
    }
  };

  return {
    formData,
    setFormData,
    step,
    setStep,
    employeeSignatureUrl,
    setEmployeeSignatureUrl,
    csrNoOptions,
    partNoOptions,
    descriptionOptions,
    errorOptions,
    statusOptions,
    workStatusOptions,
    showConfirmDialog,
    setShowConfirmDialog,
    isSystemDown,
    setIsSystemDown,
    checkboxLabel,
    setCheckboxLabel,
    isMachineStatus,
    setIsMachineStatus,
    machineCheckboxLabel,
    setMachineCheckboxLabel,
    viewMode,
    editCsrEntryId,
    inchargeSignatureRef,
    csrs,
    csrStatus,
    csrError,
    mappings,
    csrMappingStatus,
    csrMappingError,
    parts,
    partsStatus,
    partsError,
    errors,
    turbineStatus,
    turbineError,
    isEditing,
    getSignMode,
    handleCsrNoChange,
    handleInputChange,
    handleTimeChange,
    handleErrorChange,
    handleErrorValueChange,
    handleAddError,
    handleEditError,
    handleDeleteError,
    handleMachineStatusChange,
    handleCheckBoxChange,
    handlePartsDataChange,
    handlePartNoChange,
    addPartRow,
    deletePartRow,
    handleSaveEmployeeSignature,
    handleClearSignature,
    handleSaveSignature,
    handleNext,
    handleBack,
    handleSubmit,
    handleCloseForm,
    handleConfirmClose,
    navigate,
  };
}
