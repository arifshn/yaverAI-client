import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { chatApi } from "../api/chatApi";
import type {
  ChatDto,
  ChatDetailDto,
  QueryLimitDto,
  MessageDto,
} from "../models/IChat";
import { updateCredits } from "../../account/slices/creditSlice";

interface ChatState {
  chats: ChatDto[];
  currentChat: ChatDetailDto | null;
  queryLimit: QueryLimitDto | null;
  loading: boolean;
  sendingMessage: boolean;
}

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  queryLimit: null,
  loading: false,
  sendingMessage: false,
};

export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async (_, { rejectWithValue }) => {
    try {
      return await chatApi.getChats();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Sohbetler yüklenemedi");
    }
  }
);

export const createChat = createAsyncThunk(
  "chat/createChat",
  async (title: string | undefined, { rejectWithValue }) => {
    try {
      return await chatApi.createChat({ title });
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Sohbet oluşturulamadı");
    }
  }
);

export const fetchChatDetail = createAsyncThunk(
  "chat/fetchChatDetail",
  async (chatId: number, { rejectWithValue }) => {
    try {
      return await chatApi.getChat(chatId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Sohbet yüklenemedi");
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    {
      chatId,
      content,
      files,
    }: { chatId: number; content: string; files?: File[] },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await chatApi.sendMessage(chatId, content, files);
      if (response.remainingCredits !== undefined) {
        dispatch(updateCredits(response.remainingCredits));
      }

      return response.message; // Sadece message'ı döndür
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Mesaj gönderilemedi");
    }
  }
);

export const deleteChat = createAsyncThunk(
  "chat/deleteChat",
  async (chatId: number, { rejectWithValue }) => {
    try {
      await chatApi.deleteChat(chatId);
      return chatId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Sohbet silinemedi");
    }
  }
);

export const fetchQueryLimit = createAsyncThunk(
  "chat/fetchQueryLimit",
  async (_, { rejectWithValue }) => {
    try {
      return await chatApi.getQueryLimit();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Limit bilgisi alınamadı");
    }
  }
);

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearCurrentChat: (state) => {
      state.currentChat = null;
    },
    addUserMessage: (state, action) => {
      if (state.currentChat) {
        const userMessage: MessageDto = {
          id: Date.now(),
          role: "user",
          content: action.payload.content,
          createdAt: new Date().toISOString(),
          files: action.payload.files,
        };
        state.currentChat.messages.push(userMessage);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state) => {
        state.loading = false;
      })

      .addCase(createChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
        toast.success("Yeni sohbet başlatıldı");
      })
      .addCase(createChat.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as any;
        toast.error(error?.message || "Sohbet oluşturulamadı");
      })

      .addCase(fetchChatDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
      })
      .addCase(fetchChatDetail.rejected, (state) => {
        state.loading = false;
      })

      .addCase(sendMessage.pending, (state) => {
        state.sendingMessage = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingMessage = false;
        if (state.currentChat) {
          state.currentChat.messages.push(action.payload);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        const error = action.payload as any;
        toast.error(error?.message || "Mesaj gönderilemedi");
      })

      .addCase(deleteChat.fulfilled, (state, action) => {
        state.chats = state.chats.filter((chat) => chat.id !== action.payload);
        if (state.currentChat?.id === action.payload) {
          state.currentChat = null;
        }
        toast.success("Sohbet silindi");
      })
      .addCase(deleteChat.rejected, () => {
        toast.error("Sohbet silinemedi");
      })

      .addCase(fetchQueryLimit.fulfilled, (state, action) => {
        state.queryLimit = action.payload;
      });
  },
});

export const { clearCurrentChat, addUserMessage } = chatSlice.actions;
