import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDarkMode: false,
  isSidebarOpen: true,
  currentView: "dashboard",
  windowWidth: window.innerWidth,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
    setWindowWidth: (state, action) => {
      state.windowWidth = action.payload;
    },
  },
});

export const {
  toggleDarkMode,
  setSidebarOpen,
  toggleSidebar,
  setCurrentView,
  setWindowWidth,
} = uiSlice.actions;

export default uiSlice.reducer;
