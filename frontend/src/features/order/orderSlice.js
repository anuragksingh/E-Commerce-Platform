import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";

// Creating Order
export const createOrder = createAsyncThunk(
  "order/createOrder",

  async (order, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post("/api/v1/new/order", order, config);

      console.log("Order Data", data);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Order Creating Failed",
      );
    }
  },
);

// Get User Orders
export const getAllMyOrders = createAsyncThunk(
  "order/getAllMyOrders",

  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/orders/user");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order",
      );
    }
  },
);

// Get Order Details
export const getOrderDetails = createAsyncThunk(
  "order/getOrderDetails",
  async (orderID, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/order/${orderID}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order details",
      );
    }
  },
);

const orderSlice = createSlice({
  name: "order",

  initialState: {
    success: false,
    loading: false,
    error: null,
    orders: [],
    order: {},
  },

  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },

    removeSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload.order;
      state.success = action.payload.success;
    });

    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;

      state.error = action.payload || "Order Creating Failed";
    });

    // Get All user Order

    builder.addCase(getAllMyOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getAllMyOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload.orders;
      state.success = action.payload.success;
    });

    builder.addCase(getAllMyOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch order";
    });

    // Get  Order Details

    builder.addCase(getOrderDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getOrderDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload.order;
      state.success = action.payload.success;
    });

    builder.addCase(getOrderDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch order details";
    });
  },
});

export const { removeErrors, removeSuccess } = orderSlice.actions;

export default orderSlice.reducer;
