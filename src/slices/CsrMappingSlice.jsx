import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCsrMappingsApi,
  addCsrMappingApi,
  updateCsrMappingApi,
  deleteCsrMappingApi,
} from "../services/CsrMappingService";

// Fetch all CSR mappings
export const fetchCsrMappings = createAsyncThunk(
  "csrMappings/fetchCsrMappings",
  async (searchText, { rejectWithValue }) => {
    try {
      const response = await fetchCsrMappingsApi(searchText);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.head?.msg || "Failed to fetch CSR mappings"
      );
    }
  }
);

// Add new CSR mapping
export const addCsrMapping = createAsyncThunk(
  "csrMappings/addCsrMapping",
  async (mappingData, { rejectWithValue }) => {
    try {
      const response = await addCsrMappingApi(mappingData);
      if (response.head && response.head.code !== 200) {
        return rejectWithValue(response.head.msg);
      }
      return response.body;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.head?.msg || "Failed to add CSR mapping"
      );
    }
  }
);

// Update CSR mapping by csr_mapping_id
export const updateCsrMapping = createAsyncThunk(
  "csrMappings/updateCsrMapping",
  async ({ mappingId, mappingData }, { rejectWithValue }) => {
    try {
      const response = await updateCsrMappingApi(mappingId, mappingData);
      if (response.head && response.head.code !== 200) {
        return rejectWithValue(response.head.msg);
      }
      return response.head.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.head?.msg || "Failed to update CSR mapping"
      );
    }
  }
);

// Delete CSR mapping by csr_mapping_id
export const deleteCsrMapping = createAsyncThunk(
  "csrMappings/deleteCsrMapping",
  async (mappingId, { rejectWithValue }) => {
    try {
      const response = await deleteCsrMappingApi(mappingId);
      if (response.head && response.head.code !== 200) {
        return rejectWithValue(response.head.msg);
      }
      return mappingId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.head?.msg || "Failed to delete CSR mapping"
      );
    }
  }
);

const csrMappingSlice = createSlice({
  name: "csrMappings",
  initialState: {
    mappings: [],
    status: "idle",
    error: null,
  },
  reducers: {
    resetCsrMappingsState: (state) => {
      state.mappings = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch CSR Mappings
      .addCase(fetchCsrMappings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCsrMappings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.mappings = action.payload;
        state.error = null;
      })
      .addCase(fetchCsrMappings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch CSR mappings";
      })
      // Add CSR Mapping
      .addCase(addCsrMapping.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addCsrMapping.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.mappings.push(action.payload);
        state.error = null;
      })
      .addCase(addCsrMapping.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add CSR mapping";
      })
      // Update CSR Mapping
      .addCase(updateCsrMapping.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCsrMapping.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedMapping = action.payload;
        state.mappings = state.mappings.map((mapping) =>
          mapping.csr_mapping_id === updatedMapping.edit_csr_mapping_id
            ? { ...mapping, csr_mapping_data: updatedMapping.csr_mapping_data }
            : mapping
        );
        state.error = null;
      })
      .addCase(updateCsrMapping.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update CSR mapping";
      })
      // Delete CSR Mapping
      .addCase(deleteCsrMapping.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCsrMapping.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.mappings = state.mappings.filter(
          (mapping) => mapping.csr_mapping_id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteCsrMapping.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete CSR mapping";
      });
  },
});

export const { resetCsrMappingsState } = csrMappingSlice.actions;
export default csrMappingSlice.reducer;
