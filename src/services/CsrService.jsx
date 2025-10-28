import axiosInstance from "../config/API";

const API_ENDPOINT = "/csr/csr.php";

// Fetch all CSRs with optional search text
export const fetchCsrsApi = async (searchText = "") => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, {
      search_text: searchText,
    });
    console.log("fetchCsrsApi response:", response.data);
    return response.data.body.csrs || [];
  } catch (error) {
    console.error("fetchCsrsApi error:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch turbine data
export const fetchTurbinesApi = async () => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, {
      get_turbines: true,
    });
    console.log("fetchTurbinesApi response:", response.data);
    return response.data.body.data || [];
  } catch (error) {
    console.error(
      "fetchTurbinesApi error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fetch users
export const fetchUsersApi = async (searchText = "") => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, {
      get_users: true,
      search_text: searchText,
    });
    console.log("fetchUsersApi response:", response.data);
    if (!response.data.body || !response.data.body.users) {
      console.warn("No users found in response, returning empty array");
      return [];
    }
    return response.data.body.users || [];
  } catch (error) {
    console.error(
      "fetchUsersApi error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Add new CSR
export const addCsrApi = async (csrData) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, csrData);
    console.log("addCsrApi response:", response.data);
    return response.data;
  } catch (error) {
    console.error("addCsrApi error:", error.response?.data || error.message);
    throw error;
  }
};

// Update CSR by csr_id
export const updateCsrApi = async (csrId, csrData) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, {
      edit_csr_id: csrId,
      ...csrData,
    });
    console.log("updateCsrApi response:", response.data);
    return response.data;
  } catch (error) {
    console.error("updateCsrApi error:", error.response?.data || error.message);
    throw error;
  }
};

// Delete CSR by csr_id
export const deleteCsrApi = async (csrId) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, {
      delete_csr_id: csrId,
    });
    console.log("deleteCsrApi response:", response.data);
    return response.data;
  } catch (error) {
    console.error("deleteCsrApi error:", error.response?.data || error.message);
    throw error;
  }
};
