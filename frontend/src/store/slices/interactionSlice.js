import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";
import { addNotification } from "./notificationSlice";

export const fetchInteractions = createAsyncThunk(
  "interaction/fetchInteractions",
  async () => {
    const response = await API.get("/history/all");
    return response.data;
  },
);

export const fetchAnalytics = createAsyncThunk(
  "interaction/fetchAnalytics",
  async () => {
    const response = await API.get("/stats/dashboard");
    return response.data;
  },
);

export const fetchAiInsights = createAsyncThunk(
  "interaction/fetchAiInsights",
  async () => {
    const response = await API.get("/stats/ai-insights");
    return response.data.insights;
  },
);

export const updateInteraction = createAsyncThunk(
  "interaction/updateInteraction",
  async ({ id, payload }, { dispatch }) => {
    const response = await API.put(`/history/update/${id}`, payload);
    dispatch(fetchInteractions());
    dispatch(fetchAnalytics());
    return response.data;
  },
);

export const saveInteraction = createAsyncThunk(
  "interaction/saveInteraction",
  async (payload, { dispatch }) => {
    const response = await API.post("/interaction/save", payload);
    dispatch(fetchInteractions());
    dispatch(fetchAnalytics());
    dispatch(
      addNotification({
        type: "success",
        message: `Interaction with ${payload.hcp_name} saved successfully.`,
      }),
    );
    return response.data;
  },
);

const initialState = {
  interactions: [],
  analytics: null,
  aiInsights: [],
  selectedInteraction: null,
  lastSavedId: null,
  loading: false,
  error: null,
  filters: {
    search: "",
    sentiment: "All",
  },
};

const interactionSlice = createSlice({
  name: "interaction",
  initialState,
  reducers: {
    setSelectedInteraction: (state, action) => {
      state.selectedInteraction = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.loading = false;
        state.interactions = action.payload;
      })
      .addCase(fetchInteractions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAiInsights.fulfilled, (state, action) => {
        state.aiInsights = action.payload;
      })
      .addCase(saveInteraction.fulfilled, (state, action) => {
        state.lastSavedId = action.payload.interaction_id;
      });
  },
});

export const { setSelectedInteraction, setFilters } = interactionSlice.actions;
export default interactionSlice.reducer;
