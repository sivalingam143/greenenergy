import axiosInstance from "../config/API";
const API_ENDPOINT = '/users.php';

// Fetch all users
export const fetchUsersApi = async () => {
  const response = await axiosInstance.get(API_ENDPOINT);
  console.log("fetch user :" , response.data.body.users)
  return response.data.body.users;
};

// Fetch a single user by ID
export const fetchUserByIdApi = async (id) => {
  const response = await axiosInstance.get(`${API_ENDPOINT}/${id}`);
  return response.data.body.data;  // Corrected response structure
};

// Add a new user
export const addUserApi = async (userData) => {
  const response = await axiosInstance.post(API_ENDPOINT, userData);
  console.log("add user :" ,response.data)
  return response.data;  
};

// Update a user by ID
export const updateUserApi = async (id, userData) => {
  const response = await axiosInstance.put(`${API_ENDPOINT}/${id}`, userData);
  return response.data.body.data;  // Corrected response structure
};

// Delete a user by ID
export const deleteUserApi = async (id) => {
  // eslint-disable-next-line no-unused-vars
  const response = await axiosInstance.delete(`${API_ENDPOINT}/${id}`);
  return id;  // Return the user ID for successful deletion
};
