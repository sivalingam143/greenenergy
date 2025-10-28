import axiosInstance from "../config/API";

const API_ENDPOINT = "/parts/parts.php";

// Fetch all parts with optional search text
export const fetchPartsApi = async (searchText = "") => {
  const response = await axiosInstance.post(API_ENDPOINT, {
    search_text: searchText,
  });
  console.log("fetch parts:", response.data.body.parts);
  return response.data.body.parts;
};

// In src/services/PartsService.js
export const addPartApi = async (partData) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, partData);
    console.log("addPartApi response:", response.data);
    return response.data;
  } catch (error) {
    console.error("addPartApi error:", error.response?.data || error.message);
    throw error;
  }
};

export const updatePartApi = async (partsId, partData) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, {
      edit_parts_id: partsId,
      ...partData,
    });
    console.log("updatePartApi response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "updatePartApi error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deletePartApi = async (partsId) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, {
      delete_parts_id: partsId,
    });
    console.log("delete part:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "deletePartApi error:",
      error.response?.data || error.message
    );
    throw error;
  }
};
