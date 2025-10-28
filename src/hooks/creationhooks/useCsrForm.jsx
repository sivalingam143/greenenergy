// components/Csr/useCsrForm.js
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addCsr,
  updateCsr,
  fetchTurbines,
  fetchCsrs,
} from "../../slices/CsrSlice";
import { fetchTurbineData } from "../../slices/CsrEntrySlice";

const useCsrForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { turbines, csrs } = useSelector((state) => state.csrs);
  const { turbineData } = useSelector((state) => state.csrEntries);

  const viewMode = location.state?.viewMode || false;
  const [isEdit, setIsEdit] = useState(false);
  const [csrId, setCsrId] = useState(null);
  const [isMailChecked, setIsMailChecked] = useState(false);
  const [checkboxLabel, setCheckboxLabel] = useState("No");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

  const csrTypeShortCodes = [
    { type: "Breakdown", shortCode: "BD" },
    { type: "Maintenance", shortCode: "MD" },
    { type: "General check", shortCode: "GC" },
    { type: "Tower re-torque", shortCode: "TR" },
  ];

  const turbineOptions =
    turbines?.flatMap((t) =>
      t.wtg_no.map((wtg) => ({ value: wtg, label: wtg }))
    ) || [];

  const getFinancialYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const start = today.getMonth() >= 3 ? year : year - 1;
    return `${start.toString().slice(2)}-${(start + 1).toString().slice(2)}`;
  };

  const getShortCodeForWegNo = (wegNo) => {
    return turbines.find((t) => t.wtg_no.includes(wegNo))?.short_code || "";
  };

  const generateSequenceNumber = (csrType, financialYear) => {
    const shortCode = csrTypeShortCodes.find(
      (c) => c.type === csrType
    )?.shortCode;
    const filtered = csrs.filter(
      (c) =>
        c.csr_type === csrType &&
        c.csr_no?.includes(`/${shortCode}/${financialYear}/`)
    );

    const lastSeq = Math.max(
      ...filtered
        .map((c) => parseInt(c.csr_no.split("/").pop()))
        .filter(Boolean),
      0
    );
    return (lastSeq + 1).toString().padStart(4, "0");
  };

  const generateCsrNo = (wegNo, csrType) => {
    const fy = getFinancialYear();
    const sc = getShortCodeForWegNo(wegNo);
    const typeCode = csrTypeShortCodes.find(
      (c) => c.type === csrType
    )?.shortCode;
    const seq = generateSequenceNumber(csrType, fy);
    return sc
      ? `SVGE/${sc}/${typeCode}/${fy}/${seq}`
      : `SVGE/${typeCode}/${fy}/${seq}`;
  };

  useEffect(() => {
    dispatch(fetchTurbines());
    dispatch(fetchCsrs(""));
    dispatch(fetchTurbineData());
  }, [dispatch]);

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("csr_id");
    if (id) {
      setIsEdit(!viewMode);
      setCsrId(id);
      const selected = csrs.find((c) => c.csr_id === id);
      if (selected) {
        setFormData({ ...selected });
        const down = parseInt(selected.system_down);
        setIsMailChecked(down === 1);
        setCheckboxLabel(down === 1 ? "Yes" : "No");
      }
    }
  }, [location, csrs, viewMode]);

  useEffect(() => {
    if (!viewMode && !isEdit && formData.weg_no && turbineData?.length) {
      const t = turbineData.find(
        (t) => String(t.wtg_no) === String(formData.weg_no)
      );
      if (t) {
        setFormData((prev) => ({
          ...prev,
          turbine_id: t.turbine_id,
          customer_id: t.customer_id,
          customer_name: t.customer_name,
          contract_id: t.contracttype_id,
          contract_type: t.contract_code,
          loc_no: t.loc_no,
          model_id: t.model_id,
          model_type: t.model_type,
          htsc_no: t.htsc_no,
          capacity: t.capacity,
          make: t.ctpt_make,
          site_id: t.site_id,
          site_name: t.site_name,
          csr_booked_by:
            formData.system_down === 1 ? t.siteoperator_name : t.incharge_name,
        }));
      }
    }
  }, [formData.weg_no, turbineData, formData.system_down, viewMode, isEdit]);

  useEffect(() => {
    if (
      !viewMode &&
      !isEdit &&
      formData.weg_no &&
      formData.csr_type &&
      turbines.length
    ) {
      setFormData((prev) => ({
        ...prev,
        csr_no: generateCsrNo(formData.weg_no, formData.csr_type),
      }));
    }
  }, [formData.weg_no, formData.csr_type, turbines]);

  const handleInputChange = (field) => (val) => {
    if (viewMode) return;
    const v = val?.target?.value ?? val?.value ?? val;
    setFormData((prev) => ({ ...prev, [field]: v }));
  };

  const handleCheckBoxChange = (e) => {
    const checked = e.target.checked;
    setIsMailChecked(checked);
    setCheckboxLabel(checked ? "Yes" : "No");

    const turbine = turbineData.find(
      (t) => String(t.wtg_no) === String(formData.weg_no)
    );
    setFormData((prev) => ({
      ...prev,
      system_down: checked ? 1 : 0,
      csr_booked_by: turbine
        ? checked
          ? turbine.siteoperator_name
          : turbine.incharge_name
        : prev.csr_booked_by,
    }));
  };

  const handleSubmit = (e, next = false) => {
    e.preventDefault();
    // const required = ["weg_no", "csr_type", "csr_no", "csr_date"];
    // const missing = required.find(field => !formData[field]);
    // if (missing) return toast.error("Please fill all required fields");

    const action = isEdit
      ? updateCsr({ csrId, csrData: formData })
      : addCsr(formData);

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(`CSR ${isEdit ? "updated" : "created"} successfully`);
        if (next) {
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
          setIsEdit(false);
          setCsrId(null);
        } else navigate("/csr");
      })
      .catch(toast.error);
  };

  return {
    formData,
    handleInputChange,
    handleSubmit,
    handleCheckBoxChange,
    isMailChecked,
    checkboxLabel,
    turbineOptions,
    viewMode,
    showConfirmDialog,
    setShowConfirmDialog,
    setFormData,
  };
};
export default useCsrForm;
