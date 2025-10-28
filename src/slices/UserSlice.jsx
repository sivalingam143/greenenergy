import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUsersApi,
  addUserApi,
  fetchUserByIdApi,
  updateUserApi,
  deleteUserApi,
} from "../services/UserService";

// Fetch all users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetchUsersApi();
  return response;
});

// Fetch user by ID
export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (userId) => {
    const response = await fetchUserByIdApi(userId);
    return response;
  }
);

// Add new user
export const addUser = createAsyncThunk("users/addUser", async (userData) => {
  console.log("user data:" ,userData)
  const response = await addUserApi(userData);
  console.log("API Response on Add User:", response);
  return response;
});

// Update user by ID
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ userId, userData }) => {
    const response = await updateUserApi(userId, userData);
    return response;
  }
);

// Delete user by ID
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId) => {
    const response = await deleteUserApi(userId);
    return response;
  }
);
const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users.push(action.payload);  // Add the user to the users array
      })
      .addCase(addUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
