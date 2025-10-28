import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

import CSR_TYPE_SHORT_CODES from "../../constants/csrTypeShortCodes";
import { generateCsrNo } from "../../utils/csrNo";

import {
  addCsr,
  updateCsr,
  fetchTurbines,
  fetchCsrs,
} from "../../slices/CsrSlice";
import { fetchTurbineData } from "../../slices/CsrEntrySlice";

export const useCsrCreation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { turbines, csrs } = useSelector((state) => state.csrs);
  const { turbineData } = useSelector((state) => state.csrEntries);

  const viewMode = location.state?.viewMode || false;

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isMailChecked, setIsMailChecked] = useState(false);
  const [checkboxLabel, setCheckboxLabel] = useState("No");
  const [isEdit, setIsEdit] = useState(false);
  const [csrId, setCsrId] = useState(null);

  const [formData, setFormData] = useState({
    weg_no: "",
    csr_type: "",
    system_down: 0,
    csr_no: "",
    csr_date: "",
    csr_booked_by: "",
    customer_id: "",
    customer_name: "",
    contract_id: "",
    contract_type: "",
    loc_no: "",
    model_id: "",
    model_type: "",
    htsc_no: "",
    capacity: "",
    make: "",
    turbine_id: "",
    site_id: "",
    site_name: "",
  });

  // bootstrap data
  useEffect(() => {
    dispatch(fetchTurbines());
    dispatch(fetchCsrs(""));
    dispatch(fetchTurbineData());
  }, [dispatch]);

  // auto populate fields when weg_no changes
  useEffect(() => {
    if (!viewMode && formData.weg_no && Array.isArray(turbineData)) {
      const selectedTurbine = turbineData.find(
        (turbine) => String(turbine.wtg_no) === String(formData.weg_no)
      );
      if (selectedTurbine) {
        setFormData((prev) => ({
          ...prev,
          turbine_id: selectedTurbine.turbine_id || "",
          customer_id: selectedTurbine.customer_id || "",
          customer_name: selectedTurbine.customer_name || "",
          contract_id: selectedTurbine.contracttype_id || "",
          contract_type: selectedTurbine.contract_code || "",
          loc_no: selectedTurbine.loc_no || "",
          model_id: selectedTurbine.model_id || "",
          model_type: selectedTurbine.model_type || "",
          htsc_no: selectedTurbine.htsc_no || "",
          capacity: selectedTurbine.capacity || "",
          make: selectedTurbine.ctpt_make || "",
          csr_booked_by:
            formData.system_down === 1
              ? selectedTurbine.siteoperator_name || ""
              : selectedTurbine.incharge_name || "",
          site_id: selectedTurbine.site_id || "",
          site_name: selectedTurbine.site_name || "",
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.weg_no, turbineData, viewMode]);

  // update csr_booked_by when system_down toggles
  useEffect(() => {
    if (!viewMode && formData.weg_no && Array.isArray(turbineData)) {
      const selectedTurbine = turbineData.find(
        (turbine) => String(turbine.wtg_no) === String(formData.weg_no)
      );
      if (selectedTurbine) {
        setFormData((prev) => ({
          ...prev,
          csr_booked_by:
            formData.system_down === 1
              ? selectedTurbine.siteoperator_name || ""
              : selectedTurbine.incharge_name || "",
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.system_down, formData.weg_no, turbineData, viewMode]);

  // auto generate CSR no
  useEffect(() => {
    if (
      !viewMode &&
      formData.weg_no &&
      formData.csr_type &&
      turbines.length > 0
    ) {
      let sequenceNumber = "";
      if (isEdit && formData.csr_no) {
        // Extract sequence number from existing csr_no in edit mode
        const parts = formData.csr_no.split("/");
        sequenceNumber = parts[parts.length - 1]; // Get the last part (sequence number)
      }

      const newCsrNo = generateCsrNo({
        wegNo: formData.weg_no,
        csrType: formData.csr_type,
        turbines,
        csrs,
        existingSequenceNumber: isEdit ? sequenceNumber : undefined, // Pass sequence number in edit mode
      });
      if (newCsrNo) {
        setFormData((prev) => ({ ...prev, csr_no: newCsrNo }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.weg_no,
    formData.csr_type,
    turbines,
    viewMode,
    csrs,
    isEdit,
    formData.csr_no,
  ]);

  // edit mode (prefill)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("csr_id");
    if (id) {
      setIsEdit(!viewMode);
      setCsrId(id);
      const csr = csrs.find((c) => c.csr_id === id);
      if (csr) {
        const newFormData = {
          weg_no: csr.weg_no || "",
          csr_type: csr.csr_type || "",
          system_down: parseInt(csr.system_down) || 0,
          csr_no: csr.csr_no || "",
          csr_date: csr.csr_date || "",
          csr_booked_by: csr.csr_booked_by || "",
          customer_id: csr.customer_id || "",
          customer_name: csr.customer_name || "",
          contract_id: csr.contract_id || "",
          contract_type: csr.contract_type || "",
          loc_no: csr.loc_no || "",
          model_id: csr.model_id || "",
          model_type: csr.model_type || "",
          htsc_no: csr.htsc_no || "",
          capacity: csr.capacity || "",
          make: csr.make || "",
          turbine_id: csr.turbine_id || "",
          site_id: csr.site_id || "",
          site_name: csr.site_name || "",
        };
        setFormData(newFormData);
        const isDown = parseInt(csr.system_down) === 1;
        setIsMailChecked(isDown);
        setCheckboxLabel(isDown ? "Yes" : "No");
      }
    }
  }, [location, csrs, viewMode]);

  const handleCheckBoxChange = useCallback(
    (event) => {
      if (viewMode) return;
      const checked = event.target.checked;
      setIsMailChecked(checked);
      setCheckboxLabel(checked ? "Yes" : "No");
      setFormData((prev) => {
        const selectedTurbine = turbineData.find(
          (turbine) => String(turbine.wtg_no) === String(prev.weg_no)
        );
        return {
          ...prev,
          system_down: checked ? 1 : 0,
          csr_booked_by: selectedTurbine
            ? checked
              ? selectedTurbine.siteoperator_name || ""
              : selectedTurbine.incharge_name || ""
            : prev.csr_booked_by,
        };
      });
    },
    [turbineData, viewMode]
  );

  const handleInputChange = useCallback(
    (field) => (value) => {
      if (viewMode) return;
      const newValue =
        value && value.target ? value.target.value : value.value || value;
      setFormData((prev) => ({
        ...prev,
        [field]: newValue,
      }));
    },
    [viewMode]
  );

  const handleSubmit = useCallback(
    (e, isSaveAndNext = false) => {
      if (viewMode) return;
      e.preventDefault();
      // if (
      //   !formData.weg_no ||
      //   !formData.csr_type ||
      //   !formData.csr_no ||
      //   !formData.csr_date
      // ) {
      //   toast.error(
      //     "Please fill all required fields: Weg No., CSR Type, CSR No., and Date"
      //   );
      //   return;
      // }

      const payload = {
        weg_no: formData.weg_no,
        csr_type: formData.csr_type,
        system_down: formData.system_down,
        csr_no: formData.csr_no,
        csr_date: formData.csr_date,
        csr_booked_by: formData.csr_booked_by,
        customer_id: formData.customer_id,
        customer_name: formData.customer_name,
        contract_id: formData.contract_id,
        contract_type: formData.contract_type,
        loc_no: formData.loc_no,
        model_id: formData.model_id,
        model_type: formData.model_type,
        htsc_no: formData.htsc_no,
        capacity: formData.capacity,
        make: formData.make,
        turbine_id: formData.turbine_id,
        site_id: formData.site_id,
        site_name: formData.site_name,
      };

      const action = isEdit
        ? updateCsr({ csrId, csrData: payload })
        : addCsr(payload);

      dispatch(action)
        .unwrap()
        .then(() => {
          toast.success(`CSR ${isEdit ? "updated" : "created"} successfully`);
          if (isSaveAndNext) {
            setFormData({
              weg_no: "",
              csr_type: "",
              system_down: 0,
              csr_no: "",
              csr_date: "",
              csr_booked_by: "",
              customer_id: "",
              customer_name: "",
              contract_id: "",
              contract_type: "",
              loc_no: "",
              model_id: "",
              model_type: "",
              htsc_no: "",
              capacity: "",
              make: "",
              turbine_id: "",
              site_id: "",
              site_name: "",
            });
            setIsMailChecked(false);
            setCheckboxLabel("No");
            setIsEdit(false);
            setCsrId(null);
          } else {
            navigate("/csr");
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    },
    [csrId, dispatch, formData, isEdit, navigate, viewMode]
  );

  const handleCloseForm = useCallback(() => setShowConfirmDialog(true), []);
  const handleConfirmClose = useCallback(
    (confirm) => {
      setShowConfirmDialog(false);
      if (confirm) {
        navigate("/csr");
        toast.info("Form closed");
      }
    },
    [navigate]
  );

  const turbineOptions = useMemo(
    () =>
      Array.isArray(turbines)
        ? turbines.flatMap((turbine) =>
            turbine.wtg_no.map((wtg) => ({
              value: wtg,
              label: wtg,
            }))
          )
        : [],
    [turbines]
  );

  const pageTitle = useMemo(
    () => (viewMode ? "View CSR" : isEdit ? "Edit CSR" : "Create CSR"),
    [isEdit, viewMode]
  );

  return {
    // state
    formData,
    isEdit,
    csrId,
    isMailChecked,
    checkboxLabel,
    showConfirmDialog,
    turbineOptions,
    pageTitle,
    viewMode,

    // handlers
    handleInputChange,
    handleCheckBoxChange,
    handleSubmit,
    handleCloseForm,
    handleConfirmClose,

    // constants
    CSR_TYPE_SHORT_CODES,
  };
};
