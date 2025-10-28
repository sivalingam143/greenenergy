import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCsrEntriesApi,
  addCsrEntryApi,
  updateCsrEntryApi,
  deleteCsrEntryApi,
  fetchTurbineDataApi,
  fetchErrorsApi,
} from "../services/CsrEntryService";

// Fetch all CSR entries
export const fetchCsrEntries = createAsyncThunk(
  "csrEntries/fetchCsrEntries",
  async (args = {}, { rejectWithValue }) => {
    const { searchText = "", fromDate = "", toDate = "" } = args;
    try {
      const response = await fetchCsrEntriesApi({
        searchText,
        fromDate,
        toDate,
      });
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.head?.msg || "Failed to fetch CSR entries"
      );
    }
  }
);

// Fetch all errors
export const fetchErrors = createAsyncThunk(
  "csrEntries/fetchErrors",
  async (searchText, { rejectWithValue }) => {
    try {
      const response = await fetchErrorsApi(searchText);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.head?.msg || "Failed to fetch errors"
      );
    }
  }
);

// Add new CSR entry
export const addCsrEntry = createAsyncThunk(
  "csrEntries/addCsrEntry",
  async (csrData, { rejectWithValue }) => {
    try {
      const response = await addCsrEntryApi(csrData);
      if (response.head && response.head.code !== 200) {
        return rejectWithValue(response.head.msg);
      }
      return response.body;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.head?.msg || "Failed to add CSR entry"
      );
    }
  }
);

// Update CSR entry by csr_entry_id
export const updateCsrEntry = createAsyncThunk(
  "csrEntries/updateCsrEntry",
  async ({ csrEntryId, csrData }, { rejectWithValue }) => {
    try {
      const response = await updateCsrEntryApi(csrEntryId, csrData);
      if (response.head && response.head.code !== 200) {
        return rejectWithValue(response.head.msg);
      }
      return response.body;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.head?.msg || "Failed to update CSR entry"
      );
    }
  }
);

// Delete CSR entry by csr_entry_id
export const deleteCsrEntry = createAsyncThunk(
  "csrEntries/deleteCsrEntry",
  async (csrEntryId, { rejectWithValue }) => {
    try {
      const response = await deleteCsrEntryApi(csrEntryId);
      if (response.head && response.head.code !== 200) {
        return rejectWithValue(response.head.msg);
      }
      return csrEntryId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.head?.msg || "Failed to delete CSR entry"
      );
    }
  }
);

// Fetch turbine data
export const fetchTurbineData = createAsyncThunk(
  "csrEntries/fetchTurbineData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchTurbineDataApi();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.head?.msg || "Failed to fetch turbine data"
      );
    }
  }
);

const csrEntrySlice = createSlice({
  name: "csrEntries",
  initialState: {
    csrEntries: [],
    turbineData: [],
    errors: [],
    status: "idle",
    error: null,
  },
  reducers: {
    resetCsrEntriesState: (state) => {
      state.csrEntries = [];
      state.turbineData = [];
      state.errors = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch CSR Entries
      .addCase(fetchCsrEntries.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCsrEntries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.csrEntries = action.payload;
        state.error = null;
      })
      .addCase(fetchCsrEntries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch CSR entries";
      })
      // Fetch Errors
      .addCase(fetchErrors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchErrors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.errors = action.payload;
        state.error = null;
      })
      .addCase(fetchErrors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch errors";
      })
      // Add CSR Entry
      .addCase(addCsrEntry.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addCsrEntry.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.csrEntries.push(action.payload);
        state.error = null;
      })
      .addCase(addCsrEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add CSR entry";
      })
      // Update CSR Entry
      .addCase(updateCsrEntry.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCsrEntry.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedCsrEntry = action.payload;
        state.csrEntries = state.csrEntries.map((entry) =>
          entry.csr_entry_id === updatedCsrEntry.csr_entry_id
            ? { ...entry, ...updatedCsrEntry }
            : entry
        );
        state.error = null;
      })
      .addCase(updateCsrEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update CSR entry";
      })
      // Delete CSR Entry
      .addCase(deleteCsrEntry.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCsrEntry.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.csrEntries = state.csrEntries.filter(
          (entry) => entry.csr_entry_id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteCsrEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete CSR entry";
      })
      // Fetch Turbine Data
      .addCase(fetchTurbineData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTurbineData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.turbineData = action.payload;
        state.error = null;
      })
      .addCase(fetchTurbineData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch turbine data";
      });
  },
});

export const { resetCsrEntriesState } = csrEntrySlice.actions;
export default csrEntrySlice.reducer;
