import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axios";

// Fetch all orders (admin only)
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/orders");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// update order delivery status
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/admin/orders/${id}`, {
        status,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete an order
export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/admin/orders/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminOrderSlice = createSlice({
    name: "adminOrders", 
    initialState: {
        orders: [], 
        totalOrders: 0, 
        totalSales: 0, 
        loading: false, 
        error: null, 
    },
    reducers: {}, 
    extraReducers: (builder) => {
        builder
        // Fetch all orders
        .addCase(fetchAllOrders.pending, (state) => {
            state.loading = true; 
            state.error = null;
        })
        .addCase(fetchAllOrders.fulfilled, (state, action) => {
            state.loading = false; 
            state.orders = action.payload; 
            state.totalOrders = action.payload.length; 

            // calculate total sales
            const totalSales = action.payload.reduce((acc, order) => {
                return acc + order.totalPrce; 
            }, 0);
            state.totalSales = totalSales;  
        })
        .addCase(fetchAllOrders.rejected, (state, action) => {
            state.loading = false; 
            state.error = action.payload.message; 
        })
        // Update Order Status
        .addCase(updateOrderStatus.fulfilled, (state, action) => {
            const updatedOrder = action.payload; 
            const orderIndex = state.orders.findIndex((order) => order._id === updatedOrder._id); 
            if(orderIndex !== -1) {
                state.orders[orderIndex] = updatedOrder; 
            }
        })
        // Delete Order
        .addCase(deleteOrder.fulfilled, (state, action) => {
            state.orders = state.orders.filter((order) => order._id !== action.payload); 
        })
    }
})

export default adminOrderSlice.reducer; 