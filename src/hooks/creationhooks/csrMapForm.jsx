// hooks/useCsrMapForm.js
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCsrs, fetchUsers } from "../../slices/CsrSlice";
import {
  fetchCsrMappings,
  addCsrMapping,
  updateCsrMapping,
} from "../../slices/CsrMappingSlice";
import { toast } from "react-toastify";

const useCsrMapForm = () => {
  const location = useLocation();
  const editMappingId = location.state?.editMappingId || null;
  const viewMode = location.state?.viewMode || false;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { csrs, users, status: csrStatus } = useSelector((state) => state.csrs);
  const { status: mappingStatus } = useSelector((state) => state.csrMappings);

  const [selectedCsrNo, setSelectedCsrNo] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [mappings, setMappings] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    dispatch(fetchCsrs(""));
    dispatch(fetchUsers(""));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCsrMappings("")).then((res) => {
      if (editMappingId) {
        const allMappings = res.payload || [];
        const mapping = allMappings.find(
          (m) => m.csr_mapping_id === editMappingId
        );
        if (mapping) {
          setMappings(mapping.csr_mapping_data || []);
          setSelectedCsrNo(mapping.csr_mapping_data[0]?.csr_no || "");
        }
      }
    });
  }, [dispatch, editMappingId]);

  const csrNoOptions = csrs
    .filter((csr) => csr.status === "Unmapping" || csr.csr_no === selectedCsrNo)
    .map((csr) => ({
      value: csr.csr_no,
      label: csr.csr_no,
    }));

  const technicianOptions = users
    .filter((user) => {
      if (editIndex !== null && mappings[editIndex]?.technician === user.user_name) {
        return true;
      }
      return !mappings.some((m) => m.technician === user.user_name);
    })
    .map((user) => ({
      value: JSON.stringify({
        user_name: user.user_name,
        user_id: user.user_id,
      }),
      label: user.user_name,
    }));

  const handleCsrNoChange = (e) => {
    if (!viewMode && mappings.length === 0) {
      setSelectedCsrNo(e.target.value);
      setSelectedTechnician("");
    }
  };

  const handleTechnicianChange = (e) => {
    if (!viewMode) setSelectedTechnician(e.target.value);
  };

  const handleAddMapping = () => {
    if (viewMode) return;
    if (!selectedCsrNo || !selectedTechnician) {
      toast.error("Please select both CSR No. and Technician Name.");
      return;
    }

    const { user_name, user_id } = JSON.parse(selectedTechnician);
    const newMapping = {
      csr_no: selectedCsrNo,
      technician: user_name,
      technician_id: user_id,
    };

    if (editIndex !== null) {
      const updatedMappings = [...mappings];
      updatedMappings[editIndex] = newMapping;
      setMappings(updatedMappings);
      setEditIndex(null);
      toast.success("Mapping updated successfully!");
    } else {
      setMappings([...mappings, newMapping]);
      toast.success("Mapping added successfully!");
    }

    setSelectedTechnician("");
  };

  const handleSave = async () => {
    if (viewMode) return;
    if (mappings.length === 0) {
      toast.error("No mappings to save.");
      return;
    }

    const mappingData = {
      csr_mapping_data: mappings,
      status: "Active",
    };

    try {
      if (editMappingId) {
        await dispatch(updateCsrMapping({ mappingId: editMappingId, mappingData })).unwrap();
        toast.success("CSR Mapping updated successfully!");
      } else {
        await dispatch(addCsrMapping(mappingData)).unwrap();
        toast.success("CSR Mapping saved successfully!");
      }

      resetForm();
      navigate("/csrmapping", { state: {} });
    } catch (error) {
      toast.error(error);
    }
  };

  const handleSaveAndNext = async () => {
    if (viewMode) return;
    if (mappings.length === 0) {
      toast.error("No mappings to save.");
      return;
    }

    const mappingData = {
      csr_mapping_data: mappings,
      status: "Active",
    };

    try {
      if (editMappingId) {
        await dispatch(updateCsrMapping({ mappingId: editMappingId, mappingData })).unwrap();
        toast.success("CSR Mapping updated successfully!");
      } else {
        await dispatch(addCsrMapping(mappingData)).unwrap();
        toast.success("CSR Mapping saved successfully!");
      }

      resetForm();
      navigate(".", { state: {}, replace: true });
      toast.info("Ready for next mapping");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDeleteMapping = (index) => {
    if (viewMode) return;
    const updated = mappings.filter((_, i) => i !== index);
    setMappings(updated);
    if (updated.length === 0) setSelectedCsrNo("");
    toast.success("Mapping deleted successfully!");
  };

  const handleEditMapping = (index) => {
    if (viewMode) return;
    setEditIndex(index);
    const { technician, technician_id } = mappings[index];
    setSelectedTechnician(
      JSON.stringify({ user_name: technician, user_id: technician_id })
    );
  };

  const handleCloseForm = () => setShowConfirmDialog(true);

  const handleConfirmClose = (confirm) => {
    setShowConfirmDialog(false);
    if (confirm) {
      navigate("/csrmapping", { state: {} });
      toast.info("Form closed");
    }
  };

  const resetForm = () => {
    setMappings([]);
    setSelectedCsrNo("");
    setSelectedTechnician("");
  };

  const InvoiceHead = ["CSR No.", "Technician Name"];
  const InvoiceData = mappings.map((mapping, index) => ({
    values: [
      mapping.csr_no,
      mapping.technician,
      index,
    ],
  }));

  const pageTitle = viewMode
    ? "View CSR Map"
    : editMappingId
    ? "Edit CSR Map"
    : "Create CSR Map";

  return {
    csrNoOptions,
    technicianOptions,
    selectedCsrNo,
    selectedTechnician,
    mappings,
    csrStatus,
    mappingStatus,
    InvoiceHead,
    InvoiceData,
    pageTitle,
    viewMode,
    showConfirmDialog,
    editIndex,

    handleCsrNoChange,
    handleTechnicianChange,
    handleAddMapping,
    handleEditMapping,
    handleDeleteMapping,
    handleSave,
    handleSaveAndNext,
    handleCloseForm,
    handleConfirmClose,
  };
};

export default useCsrMapForm;
