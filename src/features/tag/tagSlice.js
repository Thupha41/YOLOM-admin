import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import tagService from "./tagService";

export const getTags = createAsyncThunk("tag/get-tags", async (_, thunkAPI) => {
  try {
    return await tagService.getTags();
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const createTag = createAsyncThunk(
  "tag/create-tag",
  async (tagData, thunkAPI) => {
    try {
      return await tagService.createTag(tagData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateTag = createAsyncThunk(
  "tag/update-tag",
  async (tag, thunkAPI) => {
    try {
      return await tagService.updateTag(tag);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteTag = createAsyncThunk(
  "tag/delete-tag",
  async (id, thunkAPI) => {
    try {
      return await tagService.deleteTag(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetState = createAction("Reset_all");

const initialState = {
  tags: [],
  tag: null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const tagSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTags.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTags.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.tags = action.payload;
      })
      .addCase(getTags.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error.message;
      })
      .addCase(createTag.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.tags.push(action.payload);
      })
      .addCase(createTag.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error.message;
      })
      .addCase(updateTag.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        const index = state.tags.findIndex(
          (tag) => tag.id === action.payload.id
        );
        if (index !== -1) {
          state.tags[index] = action.payload;
        }
      })
      .addCase(updateTag.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error.message;
      })
      .addCase(deleteTag.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.tags = state.tags.filter((tag) => tag.id !== action.payload.id);
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error.message;
      })
      .addCase(resetState, () => initialState);
  },
});

export default tagSlice.reducer;
