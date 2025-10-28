import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchParts, addPart, updatePart } from "../../slices/PartsSlice";
import { toast } from "react-toastify";
import { TYPE_CLASS_LIST } from "../../components/TypeClassList";

const initialFormState = {
  type_and_classification: "",
  part_no: "",
  description: "",
  technical_description: "",
  uom: "",
  amc: "",
  non_amc: "",
  part_img: [],
};

 const usePartForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { parts } = useSelector((state) => state.parts);
  const viewMode = location.state?.viewMode || false;
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(initialFormState);
  const [editPartId, setEditPartId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    dispatch(fetchParts());
  }, [dispatch]);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserRole(user.role_name);
    }
  }, []);

  useEffect(() => {
    if (location.state?.part) {
      const part = location.state.part;
      setEditPartId(part.parts_id);
      setFormData({
        type_and_classification: part.type_and_classification || "",
        part_no: part.part_no ? String(part.part_no) : "",
        description: part.description || "",
        technical_description: part.technical_description || "",
        uom: part.uom || "",
        amc: part.amc || "",
        non_amc: part.non_amc || "",
        part_img: part.part_img || [],
      });
    }
  }, [location.state]);

  const generatePartNo = (code) => {
    const matchingParts = parts.filter((part) =>
      String(part.part_no).startsWith(String(code))
    );
    const sequenceNumbers = matchingParts
      .map((part) => {
        const suffix = String(part.part_no).slice(String(code).length);
        return parseInt(suffix, 10) || 0;
      })
      .filter((num) => !isNaN(num));

    const maxSequence = sequenceNumbers.length > 0 ? Math.max(...sequenceNumbers) : 0;
    const nextSequence = maxSequence + 1;
    return `${code}${nextSequence.toString().padStart(3, "0")}`;
  };

  const handleInputChange = (e) => {
    if (viewMode) return;
    const { name, value } = e.target;

    if (name === "type_and_classification") {
      const selected = TYPE_CLASS_LIST.find(
        (item) => `${item.type} / ${item.classification}` === value
      );
      if (selected) {
        const newPartNo = generatePartNo(selected.code);
        setFormData((prev) => ({
          ...prev,
          type_and_classification: value,
          part_no: newPartNo,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          type_and_classification: value,
          part_no: "",
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    if (viewMode) return;
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        part_img: [{ data: reader.result }],
      }));
      toast.success("Image uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImages = () => {
    if (viewMode) return;
    setFormData((prev) => ({ ...prev, part_img: [] }));
    toast.success("Images deleted successfully!");
  };

  const handleSubmit = (e, isSaveAndNext = false) => {
    if (viewMode) return;
    e.preventDefault();
    const partData = { ...formData };

    // if (!partData.part_no || !partData.part_no.trim()) {
    //   toast.error("Part No. is required and must be valid!");
    //   return;
    // }

    const action = editPartId
      ? updatePart({ partsId: editPartId, partData })
      : addPart(partData);

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(`Part ${editPartId ? "updated" : "created"} successfully!`);
        if (isSaveAndNext) {
          setFormData(initialFormState);
          setEditPartId(null);
        } else {
          navigate("/master/parts");
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const openFileDialog = () => {
    if (!viewMode && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCloseForm = () => setShowConfirmDialog(true);

  const handleConfirmClose = (confirm) => {
    setShowConfirmDialog(false);
    if (confirm) {
      navigate(-1);
      toast.info("Form closed");
    }
  };

  return {
    formData,
    viewMode,
    userRole,
    editPartId,
    showConfirmDialog,
    fileInputRef,
    typeAndClassOptions: TYPE_CLASS_LIST.map(({ type, classification }) => ({
      value: `${type} / ${classification}`,
      label: `${type} / ${classification}`,
    })),
    handleInputChange,
    handleFileChange,
    handleDeleteImages,
    handleSubmit,
    openFileDialog,
    handleCloseForm,
    handleConfirmClose,
  };
};
export default usePartForm;