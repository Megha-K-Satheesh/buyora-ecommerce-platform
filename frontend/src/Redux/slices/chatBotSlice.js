



import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { chatbotService } from "../../services/chatBotService";

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (message, thunkAPI) => {
    try {
      const res = await chatbotService.sendMessage(message);
      return res.data.data; 
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to get response");
    }
  }
);

export const fetchHistory = createAsyncThunk(
  "chat/fetchHistory",
  async (_, thunkAPI) => {
    try {
      const res = await chatbotService.getHistory();
      return res.data.data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to load history");
    }
  }
);

export const clearChatFromServer = createAsyncThunk(
  "chat/clearChat",
  async (_, thunkAPI) => {
    try {
      await chatbotService.clearChat();
      return true;
    } catch {
      return thunkAPI.rejectWithValue("Failed to clear chat");
    }
  }
);

const initialState = {
  messages: [],
  loading: false,
  error: null,
  historyLoaded: false
};

const chatbotSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({
        type: "user",
        text: action.payload,
        createdAt: new Date()
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          type: "bot",
          text: action.payload.reply,
          createdAt: new Date()
        });
      })
      .addCase(sendMessage.rejected, (state) => {
        state.loading = false;
        state.messages.push({
          type: "bot",
          text: "Something went wrong.",
          createdAt: new Date()
        });
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        const grouped = action.payload; 
        const formatted = [];

        Object.keys(grouped).forEach(date => {
          grouped[date].forEach(msg => {
            formatted.push({
              type: msg.type || "bot",
              text: msg.text,
              createdAt: msg.createdAt
            });
          });
        });

        state.messages = formatted;
        state.historyLoaded = true;
      })
      .addCase(fetchHistory.rejected, (state) => {
        state.error = "Failed to load chat history";
      })
      .addCase(clearChatFromServer.fulfilled, (state) => {
        state.messages = [];
        state.historyLoaded = false;
      })
      .addCase(clearChatFromServer.rejected, (state) => {
        state.error = "Failed to clear chat";
      });
  },
});

export const { addUserMessage } = chatbotSlice.actions;
export default chatbotSlice.reducer;
