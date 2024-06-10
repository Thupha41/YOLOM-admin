import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

// Fetch user from localStorage if available
const getUserFromLocalStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  user: getUserFromLocalStorage,
  orders: [],
  order: null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

// Async thunk to fetch orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, thunkAPI) => {
    try {
      const response = await authService.getOrders();
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk to fetch order by user
export const fetchOrderByUser = createAsyncThunk(
  "orders/fetchOrderByUser",
  async (order_id, thunkAPI) => {
    try {
      const response = await authService.getOrderByUser(order_id);
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk to update order
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ order_id, status }, thunkAPI) => {
    try {
      const response = await authService.updateOrder(order_id, status);
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      state.order = null; // Reset order state when resetting
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchOrderByUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.order = action.payload;
      })
      .addCase(fetchOrderByUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.orders.findIndex(
          (order) => order.order_id === action.meta.arg.order_id
        );
        if (index !== -1) {
          state.orders[index] = {
            ...state.orders[index],
            order_status: action.meta.arg.status,
          };
        }
        if (state.order?.order_id === action.meta.arg.order_id) {
          state.order = {
            ...state.order,
            order_status: action.meta.arg.status,
          };
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
