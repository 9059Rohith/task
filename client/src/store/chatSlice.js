import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { messagesAPI } from '../services/api';

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ room, page, limit }, { rejectWithValue }) => {
    try {
      const response = await messagesAPI.getMessages(room, page, limit);
      return response.data; // { messages, totalPages, currentPage }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch messages');
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'chat/deleteMessage',
  async (messageId, { rejectWithValue }) => {
    try {
      await messagesAPI.deleteMessage(messageId);
      return messageId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete message');
    }
  }
);

const initialState = {
  messages: [],
  onlineUsers: [],
  typingUsers: [], // Array of { userId, username }
  notifications: [],
  room: 'general',
  page: 1,
  totalPages: 1,
  hasMore: true,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      // Don't add duplicate if it already exists
      const exists = state.messages.find(m => m._id === action.payload._id);
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(m => m._id !== action.payload);
    },
    updateMessageReadBy: (state, action) => {
      const { messageId, readBy } = action.payload;
      const message = state.messages.find(m => m._id === messageId);
      if (message) {
        message.readBy = readBy;
      }
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    markNotificationRead: (state, action) => {
      state.notifications = state.notifications.filter(n => n.messageId !== action.payload);
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addOnlineUser: (state, action) => {
      const exists = state.onlineUsers.find(u => u.userId === action.payload.userId);
      if (!exists) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(u => u.userId !== action.payload);
    },
    setTypingUser: (state, action) => {
      const exists = state.typingUsers.find(u => u.userId === action.payload.userId);
      if (!exists) {
        state.typingUsers.push(action.payload);
      }
    },
    removeTypingUser: (state, action) => {
      state.typingUsers = state.typingUsers.filter(u => u.userId !== action.payload);
    },
    setRoom: (state, action) => {
      state.room = action.payload;
      state.messages = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        // Prepend messages since we fetch chunks of older messages
        if (action.payload.currentPage === 1) {
          state.messages = action.payload.messages;
        } else {
          state.messages = [...action.payload.messages, ...state.messages];
        }
        state.page = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.hasMore = action.payload.currentPage < action.payload.totalPages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter(m => m._id !== action.payload);
      });
  },
});

export const {
  addMessage,
  removeMessage,
  updateMessageReadBy,
  addNotification,
  clearNotifications,
  markNotificationRead,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  setTypingUser,
  removeTypingUser,
  setRoom,
} = chatSlice.actions;

export const selectMessages = (state) => state.chat.messages;
export const selectOnlineUsers = (state) => state.chat.onlineUsers;
export const selectTypingUsers = (state) => state.chat.typingUsers;
export const selectNotifications = (state) => state.chat.notifications;
export const selectUnreadCount = (state) => state.chat.notifications.length;
export const selectChatLoading = (state) => state.chat.loading;
export const selectHasMore = (state) => state.chat.hasMore;
export const selectPage = (state) => state.chat.page;

export default chatSlice.reducer;
