import axiosInstance from "../config/API";

const API_ENDPOINT = "/csrmapping/csrmapping.php";

// Fetch all CSR mappings with optional search text
export const fetchCsrMappingsApi = async (searchText = "") => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, {
      search_text: searchText,
    });
    console.log("fetchCsrMappingsApi response:", response.data);
    return response.data.body.mappings || [];
  } catch (error) {
    console.error(
      "fetchCsrMappingsApi error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Add new CSR mapping
export const addCsrMappingApi = async (mappingData) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, mappingData);
    console.log("addCsrMappingApi response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "addCsrMappingApi error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Update CSR mapping by csr_mapping_id
export const updateCsrMappingApi = async (mappingId, mappingData) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, {
      edit_csr_mapping_id: mappingId,
      ...mappingData,
    });
    console.log("updateCsrMappingApi response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "updateCsrMappingApi error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Delete CSR mapping by csr_mapping_id
export const deleteCsrMappingApi = async (mappingId) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, {
      delete_csr_mapping_id: mappingId,
    });
    console.log("deleteCsrMappingApi response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "deleteCsrMappingApi error:",
      error.response?.data || error.message
    );
    throw error;
  }
};
