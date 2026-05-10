import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async () => {
    const response = await API.get("/notifications/");
    return response.data;
  },
);

export const fetchUnreadCount = createAsyncThunk(
  "notification/fetchUnreadCount",
  async () => {
    const response = await API.get("/notifications/unread-count");
    return response.data.unread_count;
  },
);

export const markNotificationRead = createAsyncThunk(
  "notification/markRead",
  async (id) => {
    await API.patch(`/notifications/read/${id}`);
    return id;
  },
);

export const markAllNotificationsRead = createAsyncThunk(
  "notification/markAllRead",
  async () => {
    await API.patch("/notifications/read-all");
    return;
  },
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const payload = action.payload;

      if (payload.id && state.notifications.find((n) => n.id === payload.id)) {
        return;
      }

      const newNotification = {
        id: payload.id || Date.now(),
        type: payload.type || "info",
        message: payload.message,
        is_read: payload.is_read || false,
        timestamp: payload.timestamp || new Date().toISOString(),
      };

      state.notifications.unshift(newNotification);
      if (!newNotification.is_read) {
        state.unreadCount += 1;
      }
    },
    clearLocalNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const n = state.notifications.find((n) => n.id === action.payload);
        if (n && !n.is_read) {
          n.is_read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => (n.is_read = true));
        state.unreadCount = 0;
      });
  },
});

export const { addNotification, clearLocalNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
