import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  notifPanelOpen: false,
  theme: 'dark',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleNotifPanel: (state) => {
      state.notifPanelOpen = !state.notifPanelOpen;
    },
    setNotifPanelOpen: (state, action) => {
      state.notifPanelOpen = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleNotifPanel,
  setNotifPanelOpen,
  setTheme,
} = uiSlice.actions;

export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectNotifPanelOpen = (state) => state.ui.notifPanelOpen;
export const selectTheme = (state) => state.ui.theme;

export default uiSlice.reducer;
