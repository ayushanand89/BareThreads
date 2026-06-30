import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axios";

// Async thunk to fetch user orders
 export const fetchUserOrders = createAsyncThunk("orders/fetchUserOrders", async(_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("/orders/my-orders");
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
 })

// Async thunk to fetch order details by ID
export const fetchOrderDetails = createAsyncThunk("orders/fetchOrderDetails", async (orderId, {rejectWithValue}) => {
    try {
        const response = await axiosInstance.get(`/orders/${orderId}`)
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
})

const orderSlice = createSlice({
    name: "orders", 
    initialState: {
        orders: [], 
        totalOrders: 0, 
        orderDetails: null, 
        loading: false, 
        error: null, 
    },
    reducers: {}, 
    extraReducers: (builder) => {
        builder
        // Fetch user orders
        .addCase(fetchUserOrders.pending, (state) => {
            state.loading = true; 
            state.error = null; 
        })
        .addCase(fetchUserOrders.fulfilled, (state, action) => {
            state.loading = false; 
            state.orders = action.payload; 
        })
        .addCase(fetchUserOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to load orders";
        })
        // Fetch order details
        .addCase(fetchOrderDetails.pending, (state) => {
            state.loading = true; 
            state.error = null; 
        })
        .addCase(fetchOrderDetails.fulfilled, (state, action) => {
            state.loading = false; 
            state.orderDetails = action.payload; 
        })
        .addCase(fetchOrderDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to load order";
        });
    }
})

export default orderSlice.reducer;