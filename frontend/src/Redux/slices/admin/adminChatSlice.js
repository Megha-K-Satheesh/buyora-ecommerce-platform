



import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminChatService } from "../../../services/adminChatService";

export const fetchAllChats = createAsyncThunk(
  "adminChat/fetchAllChats",
  async (_, thunkAPI) => {
    try {
      const res = await adminChatService.getAllChats();
      return res.data.data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to load chats");
    }
  }
);

export const fetchChatByUser = createAsyncThunk(
  "adminChat/fetchChatByUser",
  async (userId, thunkAPI) => {
    try {
      const res = await adminChatService.getChat(userId);
      return res.data.data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to load chat");
    }
  }
);

const initialState = {
  chatList: [],
  activeChat: [],
  selectedUserId: null,
  loading: false,
  error: null,
};

const adminChatSlice = createSlice({
  name: "adminChat",
  initialState,
  reducers: {
    setActiveUser: (state, action) => {
      state.selectedUserId = action.payload;
    },

    addIncomingMessage: (state, action) => {
      const exists = state.activeChat.some(
        (m) => m.createdAt === action.payload.createdAt
      );

      if (!exists) {
        state.activeChat.push({
          type: action.payload.type,
          text: action.payload.text,
          createdAt: action.payload.createdAt || new Date().toISOString(),
        });
      }
    },

  
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllChats.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchAllChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chatList = action.payload;
      })

      .addCase(fetchAllChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchChatByUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchChatByUser.fulfilled, (state, action) => {
        state.loading = false;

        const messages = action.payload?.messages || [];

        state.activeChat = messages.map((msg) => ({
          type: msg.senderRole,
          text: msg.text,
          createdAt: msg.createdAt,
        }));
      })

      .addCase(fetchChatByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setActiveUser,
  addIncomingMessage,
  
} = adminChatSlice.actions;

export default adminChatSlice.reducer;
