import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCsrEntries, deleteCsrEntry } from "../../slices/CsrEntrySlice";
import { toast } from "react-toastify";

const useCsrEntrylistHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { csrEntries, status, error } = useSelector(
    (state) => state.csrEntries
  );

  const user = JSON.parse(sessionStorage.getItem("user"));
  const userId = user?.user_id;
  const role = user?.role_name.trim() || "";

  const [searchText, setSearchText] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [csrEntryIdToDelete, setCsrEntryIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchCsrEntries({ searchText }));
  }, [dispatch, searchText]);

  // Filter entries based on role and userId before pagination
  const filteredEntries =
    role === "Engineer"
      ? csrEntries.filter((entry) => entry.employee_id === userId)
      : csrEntries;

  // Apply pagination on filtered entries
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEntries = filteredEntries.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);

  const handleNavigate = () => {
    navigate("/create-csrentry");
  };

  const handleEdit = (csrEntry) => {
    navigate("/create-csrentry", { state: { csrEntry } });
  };

  const handleView = (csrEntry) => {
    navigate("/create-csrentry", { state: { csrEntry, viewMode: true } });
  };

  const handleGetSign = (csrEntry) => {
    navigate("/create-csrentry", {
      state: { csrEntry, viewMode: true, getSignMode: true },
    });
  };

  const handleDelete = (csrEntryId) => {
    setCsrEntryIdToDelete(csrEntryId);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = (confirm) => {
    setShowConfirmDialog(false);
    if (confirm && csrEntryIdToDelete) {
      dispatch(deleteCsrEntry(csrEntryIdToDelete))
        .unwrap()
        .then(() => toast.success("CSR entry deleted successfully!"))
        .catch((error) => toast.error(error));
      setCsrEntryIdToDelete(null);
    }
  };

  const handleClearFilter = () => {
    setSearchText("");
    dispatch(fetchCsrEntries({ searchText: "" }))
      .unwrap()
      .catch((err) => console.error(`Failed to clear filter: ${err}`));
    setCurrentPage(1);
  };

  return {
    csrEntries,
    searchText,
    setSearchText,
    showConfirmDialog,
    handleConfirmDelete,
    handleNavigate,
    handleEdit,
    handleView,
    handleGetSign,
    handleDelete,
    handleClearFilter,
    currentPage,
    setCurrentPage,
    indexOfFirstItem,
    currentEntries,
    status,
    error,
    totalPages,
  };
};

export default useCsrEntrylistHandler;
