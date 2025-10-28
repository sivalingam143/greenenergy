// src/hooks/usePartsHandlers.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchParts, deletePart } from "../../slices/PartsSlice";
import { toast } from "react-toastify";

const usePartslistHandlers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { parts, status, error } = useSelector((state) => state.parts);

  const [searchText, setSearchText] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [partIdToDelete, setPartIdToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchParts(searchText));
  }, [dispatch, searchText]);

  const handleNavigate = () => {
    navigate("/parts-creation");
  };

  const handleEdit = (part) => {
    navigate("/parts-creation", { state: { part } });
  };

  const handleView = (part) => {
    navigate("/parts-creation", { state: { part, viewMode: true } });
  };

  const handleDelete = (partsId) => {
    setPartIdToDelete(partsId);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = (confirm) => {
    setShowConfirmDialog(false);
    if (confirm && partIdToDelete) {
      dispatch(deletePart(partIdToDelete))
        .unwrap()
        .then(() => toast.success("Part deleted successfully!"))
        .catch((err) => toast.error(err));
      setPartIdToDelete(null);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentParts = parts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(parts.length / itemsPerPage);

  return {
    searchText,
    setSearchText,
    showConfirmDialog,
    handleConfirmDelete,
    handleNavigate,
    handleEdit,
    handleView,
    handleDelete,
    currentPage,
    setCurrentPage,
    indexOfFirstItem,
    currentParts,
    status,
    error,
    totalPages,
  };
};

export default usePartslistHandlers;
