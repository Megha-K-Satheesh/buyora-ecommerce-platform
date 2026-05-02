



import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userChatService } from "../../services/userChatService";

export const fetchHistory = createAsyncThunk(
  "userChat/fetchHistory",
  async (_, thunkAPI) => {
    try {
      const res = await userChatService.getHistory();
      return res.data.data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to load chat history");
    }
  }
);



const initialState = {
  messages: [],
  loading: false,
  error: null,
  historyLoaded: false,

};

const userChatSlice = createSlice({
  name: "userChat",
  initialState,
  reducers: {




     addMessage: (state, action) => {
      state.messages.push({
    type: action.payload.senderRole,
    text: action.payload.text,
    createdAt: action.payload.createdAt,
    userId: action.payload.userId,
  });
    },

   
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;

        state.messages = action.payload.messages.map((msg) => ({
          type: msg.senderRole,
          text: msg.text,
          createdAt: msg.createdAt,
        }));

        state.historyLoaded = true;
      
      })

      .addCase(fetchHistory.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load chat history";
      })

   
  },
});

export const {
  addMessage,

  
} = userChatSlice.actions;

export default userChatSlice.reducer;
