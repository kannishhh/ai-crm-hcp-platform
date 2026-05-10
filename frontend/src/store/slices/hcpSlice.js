import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

export const fetchHcps = createAsyncThunk("hcp/fetchHcps", async () => {
  const response = await API.get("/history/all");
  const uniqueNames = [...new Set(response.data.map((item) => item.hcp_name))];
  return uniqueNames.map((name, index) => ({ id: index.toString(), name }));
});

const initialState = {
  hcps: [],
  selectedHcp: null,
  loading: false,
  error: null,
};

const hcpSlice = createSlice({
  name: "hcp",
  initialState,
  reducers: {
    setSelectedHcp: (state, action) => {
      state.selectedHcp = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHcps.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHcps.fulfilled, (state, action) => {
        state.loading = false;
        state.hcps = action.payload;
      })
      .addCase(fetchHcps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSelectedHcp } = hcpSlice.actions;
export default hcpSlice.reducer;
