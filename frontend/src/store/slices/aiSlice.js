import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

export const analyzeInteraction = createAsyncThunk(
  "ai/analyzeInteraction",
  async (payload) => {
    const response = await API.post("/interaction/analyze", payload);
    return response.data.data;
  },
);

const initialState = {
  messages: [
    {
      role: "assistant",
      content:
        "Hi! I'm Genie, your clinical copilot. I'm monitoring this interaction to provide real-time insights and ensure compliance.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ],
  isProcessing: false,
  insights: null,
  error: null,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = initialState.messages;
    },
    resetInsights: (state) => {
      state.insights = null;
    },
    setAiProcessing: (state, action) => {
      state.isProcessing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeInteraction.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(analyzeInteraction.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.insights = action.payload;
        
        const content = action.payload.answer || action.payload.summary || "Analysis complete.";
        
        state.messages.push({
          role: "assistant",
          content: content,
          type: action.payload.type || "text",
          data: action.payload.data || action.payload,
          timestamp: new Date().toLocaleTimeString(),
        });
      })
      .addCase(analyzeInteraction.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.error.message;
      });
  },
});

export const { addMessage, clearMessages, resetInsights, setAiProcessing } =
  aiSlice.actions;
export default aiSlice.reducer;
