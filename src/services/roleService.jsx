import axiosInstance from "../config/API";
const API_ENDPOINT = '/roles.php';

// Fetch all users
export const fetchRoleApi = async () => {
  const response = await axiosInstance.get(API_ENDPOINT);
  console.log("fetch role :" , response.data.body.users)
  return response.data.body.users;
};

// Fetch a single user by ID
export const fetchRoleByIdApi = async (id) => {
  const response = await axiosInstance.get(`${API_ENDPOINT}/${id}`);
  return response.data.body.data;  // Corrected response structure
};

// Add a new user
export const addRoleApi = async (userData) => {
  const response = await axiosInstance.post(API_ENDPOINT, userData);
  console.log("add user :" ,response.data)
  return response.data;  
};

// Update a user by ID
export const updateRoleApi = async (id, userData) => {
  const response = await axiosInstance.put(`${API_ENDPOINT}/${id}`, userData);
  return response.data.body.data;  // Corrected response structure
};

// Delete a user by ID
export const deleteRoleApi = async (id) => {
  // eslint-disable-next-line no-unused-vars
  const response = await axiosInstance.delete(`${API_ENDPOINT}/${id}`);
  return id;  // Return the user ID for successful deletion
};
