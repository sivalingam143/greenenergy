import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addRoleApi,
  fetchRoleApi,
  fetchRoleByIdApi,
  updateRoleApi,
  deleteRoleApi
} from "../services/roleService";

// Fetch all roles
export const fetchRoles = createAsyncThunk("roles/fetchRoles", async () => {
  const response = await fetchRoleApi();
  return response;
});

// Fetch roles by ID
export const fetchRolesById = createAsyncThunk(
  "roles/fetchRoleById",
  async (rolesId) => {
    const response = await fetchRoleByIdApi(rolesId);
    return response;
  }
);

// Add new roles
export const addRole = createAsyncThunk("roles/addroles", async (rolesData) => {
  console.log("roles data:" ,rolesData)
  const response = await addRoleApi(rolesData);
  console.log("API Response on Add Role:", response);
  return response;
});

// Update roles by ID
export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async ({ rolesId, rolesData }) => {
    const response = await updateRoleApi(rolesId, rolesData);
    return response;
  }
);

// Delete role by ID
export const deleteRole = createAsyncThunk(
  "roles/deleteroles",
  async (rolesId) => {
    const response = await deleteRoleApi(rolesId);
    return response;
  }
);
const roleslice = createSlice({
  name: "roles",
  initialState: {
    roles: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchRolesById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRolesById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.roles = action.payload;
      })
      .addCase(fetchRolesById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addRole.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addRole.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.roles.push(action.payload);  
      })
      .addCase(addRole.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteRole.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.roles = state.roles.filter((roles) => roles.id !== action.payload);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default roleslice.reducer;
