// src/features/messages/messagesSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Message } from '../../types';

interface MessagesState {
  byRoomId: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;
}

const initialState: MessagesState = {
  byRoomId: {},
  isLoading: false,
  error: null,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<{ roomId: string; messages: Message[] }>) {
      state.byRoomId[action.payload.roomId] = action.payload.messages;
      state.isLoading = false;
    },
    addMessage(state, action: PayloadAction<Message>) {
      const { roomId } = action.payload;
      if (!state.byRoomId[roomId]) state.byRoomId[roomId] = [];
      const exists = state.byRoomId[roomId].some((m) => m.id === action.payload.id);
      if (!exists) state.byRoomId[roomId].push(action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearRoomMessages(state, action: PayloadAction<string>) {
      delete state.byRoomId[action.payload];
    },
  },
});

export const { setMessages, addMessage, setLoading, setError, clearRoomMessages } =
  messagesSlice.actions;
export default messagesSlice.reducer;
