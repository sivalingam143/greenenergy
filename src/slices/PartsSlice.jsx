import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchPartsApi,
  addPartApi,
  updatePartApi,
  deletePartApi,
} from "../services/PartsService";

// Fetch all parts
export const fetchParts = createAsyncThunk(
  "parts/fetchParts",
  async (searchText) => {
    const response = await fetchPartsApi(searchText);
    return response;
  }
);

// Add new part
export const addPart = createAsyncThunk(
  "parts/addPart",
  async (partData, { rejectWithValue }) => {
    try {
      const response = await addPartApi(partData);
      if (response.head && response.head.code !== 200) {
        return rejectWithValue(response.head.msg);
      }
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.head?.msg || "An unexpected error occurred"
      );
    }
  }
);

// Update part by parts_id
export const updatePart = createAsyncThunk(
  "parts/updatePart",
  async ({ partsId, partData }, { rejectWithValue }) => {
    try {
      const response = await updatePartApi(partsId, partData);
      if (response.head && response.head.code !== 200) {
        return rejectWithValue(response.head.msg);
      }
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.head?.msg || "An unexpected error occurred"
      );
    }
  }
);

// Delete part by parts_id
export const deletePart = createAsyncThunk(
  "parts/deletePart",
  async (partsId, { rejectWithValue }) => {
    try {
      const response = await deletePartApi(partsId);
      if (response.head && response.head.code !== 200) {
        return rejectWithValue(response.head.msg);
      }
      return partsId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.head?.msg || "An unexpected error occurred"
      );
    }
  }
);

const partsSlice = createSlice({
  name: "parts",
  initialState: {
    parts: [],
    status: "idle",
    error: null,
  },
  reducers: {
    resetPartsState: (state) => {
      state.parts = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchParts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.parts = action.payload;
        state.error = null;
      })
      .addCase(fetchParts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch parts";
      })
      .addCase(addPart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addPart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.parts.push(action.payload);
        state.error = null;
      })
      .addCase(addPart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add part";
      })
      .addCase(updatePart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePart.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedPart = action.payload;
        state.parts = state.parts.map((part) =>
          part.parts_id === updatedPart.edit_parts_id
            ? { ...part, ...updatedPart }
            : part
        );
        state.error = null;
      })
      .addCase(updatePart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update part";
      })
      .addCase(deletePart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.parts = state.parts.filter(
          (part) => part.parts_id !== action.payload
        );
        state.error = null;
      })
      .addCase(deletePart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete part";
      });
  },
});

export const { resetPartsState } = partsSlice.actions;
export default partsSlice.reducer;
