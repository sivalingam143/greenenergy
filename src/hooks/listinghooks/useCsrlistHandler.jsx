// src/hooks/useCsrHandlers.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCsrs, deleteCsr } from "../../slices/CsrSlice";
import { toast } from "react-toastify";

const useCsrlistHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { csrs, status, error } = useSelector((state) => state.csrs);

  const [searchText, setSearchText] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [csrIdToDelete, setCsrIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchCsrs(searchText));
  }, [dispatch, searchText]);

  const handleNavigate = () => {
    navigate("/create-csr");
  };

  const handleEdit = (csrId) => {
    navigate(`/create-csr?csr_id=${csrId}`);
  };

  const handleView = (csrId) => {
    navigate(`/create-csr?csr_id=${csrId}`, { state: { viewMode: true } });
  };

  const handleDelete = (csrId) => {
    setCsrIdToDelete(csrId);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = (confirm) => {
    setShowConfirmDialog(false);
    if (confirm && csrIdToDelete) {
      dispatch(deleteCsr(csrIdToDelete))
        .unwrap()
        .then(() => toast.success("CSR deleted successfully!"))
        .catch((err) => toast.error(err));
      setCsrIdToDelete(null);
    }
  };

  const handleClearFilter = () => {
    setSearchText("");
    dispatch(fetchCsrs(""))
      .unwrap()
      .catch((err) => {
        console.error(`Failed to clear filter: ${err}`);
      });
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCsrs = csrs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(csrs.length / itemsPerPage);

  return {
    searchText,
    setSearchText,
    showConfirmDialog,
    handleConfirmDelete,
    handleNavigate,
    handleEdit,
    handleView,
    handleDelete,
    handleClearFilter,
    currentPage,
    setCurrentPage,
    indexOfFirstItem,
    currentCsrs,
    status,
    error,
    totalPages,
  };
};

export default useCsrlistHandler;
