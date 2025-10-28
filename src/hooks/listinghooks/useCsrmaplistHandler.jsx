// src/hooks/useCsrMappingHandlers.js
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCsrMappings, deleteCsrMapping } from "../../slices/CsrMappingSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useCsrmaplistHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mappings, status, error } = useSelector((state) => state.csrMappings);

  const [searchText, setSearchText] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [mappingIdToDelete, setMappingIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchCsrMappings(searchText));
  }, [dispatch, searchText]);

  const handleNavigate = () => {
    navigate("/create-csrmap");
  };

  const handleEdit = (mappingId) => {
    navigate("/create-csrmap", {
      state: { editMappingId: mappingId },
    });
  };

  const handleView = (mappingId) => {
    navigate("/create-csrmap", {
      state: { editMappingId: mappingId, viewMode: true },
    });
  };

  const handleDelete = (mappingId) => {
    setMappingIdToDelete(mappingId);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = (confirm) => {
    setShowConfirmDialog(false);
    if (confirm && mappingIdToDelete) {
      dispatch(deleteCsrMapping(mappingIdToDelete))
        .unwrap()
        .then(() => toast.success("CSR Mapping deleted successfully!"))
        .catch((err) => toast.error(err));
      setMappingIdToDelete(null);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMappings = mappings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(mappings.length / itemsPerPage);

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
    currentMappings,
    status,
    error,
    totalPages,
  };
};

export default useCsrmaplistHandler;
