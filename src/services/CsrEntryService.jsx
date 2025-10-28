import axiosInstance from "../config/API";
const API_ENDPOINT = "/csrentry/csrentry.php";

// Fetch all CSR entries with optional search text
export const fetchCsrEntriesApi = async ({
  searchText = "",
  fromDate = "",
  toDate = "",
}) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, {
      search_text: searchText,
      fromDate,
      toDate,
    });
    console.log("fetchCsrEntriesApi response:", response.data);
    return response.data.body.csr_entries || [];
  } catch (error) {
    console.error(
      "fetchCsrEntriesApi error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fetch all errors with optional search text
export const fetchErrorsApi = async (searchText = "") => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, {
      action: "list_error",
      search_text: searchText,
    });
    console.log("fetchErrorsApi response:", response.data);
    return response.data.body.errors || [];
  } catch (error) {
    console.error(
      "fetchErrorsApi error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Add a new CSR entry
export const addCsrEntryApi = async (csrData) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, csrData);
    console.log("addCsrEntryApi response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "addCsrEntryApi error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Update an existing CSR entry
export const updateCsrEntryApi = async (csrEntryId, csrData) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, {
      edit_csr_entry_id: csrEntryId,
      ...csrData,
    });
    console.log("updateCsrEntryApi response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "updateCsrEntryApi error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Delete a CSR entry by csr_entry_id
export const deleteCsrEntryApi = async (csrEntryId) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, {
      delete_csr_entry_id: csrEntryId,
    });
    console.log("deleteCsrEntryApi response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "deleteCsrEntryApi error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fetch turbine data
export const fetchTurbineDataApi = async () => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, {
      action: "get_turbine_data",
    });
    console.log("fetchTurbineDataApi response:", response.data);
    return response.data.body || [];
  } catch (error) {
    console.error(
      "fetchTurbineDataApi error:",
      error.response?.data || error.message
    );
    throw error;
  }
};
