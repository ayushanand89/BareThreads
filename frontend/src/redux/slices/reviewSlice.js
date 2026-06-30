import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axios";

export const fetchReviews = createAsyncThunk(
  "reviews/fetch",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/reviews/${productId}`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const submitReview = createAsyncThunk(
  "reviews/submit",
  async ({ productId, rating, title, comment }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/reviews/${productId}`, {
        rating,
        title,
        comment,
      });
      return res.data.data; // { review, rating, numReviews }
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/delete",
  async (reviewId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/reviews/${reviewId}`);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    loading: false,
    submitting: false,
    error: null,
  },
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load reviews";
      })
      .addCase(submitReview.pending, (state) => {
        state.submitting = true;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.submitting = false;
        const review = action.payload.review;
        const idx = state.reviews.findIndex((r) => r._id === review._id);
        if (idx !== -1) {
          state.reviews[idx] = review;
        } else {
          state.reviews.unshift(review);
        }
      })
      .addCase(submitReview.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r._id !== action.payload);
      });
  },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
