import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCsrsApi,
  fetchTurbinesApi,
  fetchUsersApi,
  addCsrApi,
  updateCsrApi,
  deleteCsrApi,
} from "../services/CsrService";

// Fetch all CSRs
export const fetchCsrs = createAsyncThunk(
  "csrs/fetchCsrs",
  async (searchText, { rejectWithValue }) => {
    try {
      const response = await fetchCsrsApi(searchText);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.head?.msg || "Failed to fetch CSRs"
      );
    }
  }
);

// Fetch turbine data
export const fetchTurbines = createAsyncThunk(
  "csrs/fetchTurbines",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchTurbinesApi();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.head?.msg || "Failed to fetch turbines"
      );
    }
  }
);

// Fetch users
export const fetchUsers = createAsyncThunk(
  "csrs/fetchUsers",
  async (searchText, { rejectWithValue }) => {
    try {
      const response = await fetchUsersApi(searchText);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.head?.msg || "Failed to fetch users"
      );
    }
  }
);

// Add new CSR
export const addCsr = createAsyncThunk(
  "csrs/addCsr",
  async (csrData, { rejectWithValue }) => {
    try {
      const response = await addCsrApi(csrData);
      if (response.head && response.head.code !== 200) {
        return rejectWithValue(response.head.msg);
      }
      return response.body;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.head?.msg || "Failed to add CSR"
      );
    }
  }
);

// Update CSR by csr_id
export const updateCsr = createAsyncThunk(
  "csrs/updateCsr",
  async ({ csrId, csrData }, { rejectWithValue }) => {
    try {
      const response = await updateCsrApi(csrId, csrData);
      if (response.head && response.head.code !== 200) {
        return rejectWithValue(response.head.msg);
      }
      return { csrId, ...response.head.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.head?.msg || "Failed to update CSR"
      );
    }
  }
);

// Delete CSR by csr_id
export const deleteCsr = createAsyncThunk(
  "csrs/deleteCsr",
  async (csrId, { rejectWithValue }) => {
    try {
      const response = await deleteCsrApi(csrId);
      if (response.head && response.head.code !== 200) {
        return rejectWithValue(response.head.msg);
      }
      return csrId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.head?.msg || "Failed to delete CSR"
      );
    }
  }
);

const csrSlice = createSlice({
  name: "csrs",
  initialState: {
    csrs: [],
    turbines: [],
    users: [],
    status: "idle",
    error: null,
  },
  reducers: {
    resetCsrsState: (state) => {
      state.csrs = [];
      state.turbines = [];
      state.users = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch CSRs
      .addCase(fetchCsrs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCsrs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.csrs = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchCsrs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch CSRs";
      })
      // Fetch Turbines
      .addCase(fetchTurbines.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTurbines.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.turbines = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchTurbines.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch turbines";
      })
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch users";
      })
      // Add CSR
      .addCase(addCsr.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addCsr.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.csrs.push(action.payload);
        state.error = null;
      })
      .addCase(addCsr.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add CSR";
      })
      // Update CSR
      .addCase(updateCsr.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCsr.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { csrId, ...updatedCsr } = action.payload;
        state.csrs = state.csrs.map((csr) =>
          csr.csr_id === csrId ? { ...csr, ...updatedCsr } : csr
        );
        state.error = null;
      })
      .addCase(updateCsr.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update CSR";
      })
      // Delete CSR
      .addCase(deleteCsr.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCsr.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.csrs = state.csrs.filter((csr) => csr.csr_id !== action.payload);
        state.error = null;
      })
      .addCase(deleteCsr.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete CSR";
      });
  },
});

export const { resetCsrsState } = csrSlice.actions;
export default csrSlice.reducer;
