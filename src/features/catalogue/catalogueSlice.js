import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import catalogueService from "./catalogueService";

// Thunks for async actions
export const getCatalogues = createAsyncThunk(
  "catalogue/get-catalogues",
  async (_, thunkAPI) => {
    try {
      return await catalogueService.getCatalogues();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createCatalogue = createAsyncThunk(
  "catalogue/create-catalogue",
  async (catalogueData, thunkAPI) => {
    try {
      return await catalogueService.createCatalogue(catalogueData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateCatalogue = createAsyncThunk(
  "catalogue/update-catalogue",
  async (catalogueData, thunkAPI) => {
    try {
      return await catalogueService.updateCatalogue(catalogueData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteCatalogue = createAsyncThunk(
  "catalogue/delete-catalogue",
  async (id, thunkAPI) => {
    try {
      return await catalogueService.deleteCatalogue(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const resetState = createAction("Reset_all");

const initialState = {
  catalogues: [],
  catalogue: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

const catalogueSlice = createSlice({
  name: "catalogue",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Catalogues
      .addCase(getCatalogues.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCatalogues.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.catalogues = action.payload;
      })
      .addCase(getCatalogues.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload.message;
      })
      // Create Catalogue
      .addCase(createCatalogue.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCatalogue.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.catalogues.push(action.payload);
      })
      .addCase(createCatalogue.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload.message;
      })
      // Update Catalogue
      .addCase(updateCatalogue.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCatalogue.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        const index = state.catalogues.findIndex(
          (cat) => cat.id === action.payload.id
        );
        if (index !== -1) {
          state.catalogues[index] = action.payload;
        }
      })
      .addCase(updateCatalogue.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload.message;
      })
      // Delete Catalogue
      .addCase(deleteCatalogue.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCatalogue.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.catalogues = state.catalogues.filter(
          (cat) => cat.id !== action.payload.id
        );
      })
      .addCase(deleteCatalogue.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload.message;
      })
      .addCase(resetState, () => initialState);
  },
});

export default catalogueSlice.reducer;
