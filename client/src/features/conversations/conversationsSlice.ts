// src/features/conversations/conversationsSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Conversation, Participant, LastMessage } from "../../types";

interface ConversationsState {
  list: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  error: string | null;
  onlineUsers: Record<string, boolean>;
}

const initialState: ConversationsState = {
  list: [],
  activeConversationId: null,
  isLoading: false,
  error: null,
  onlineUsers: {},
};

const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setConversations(state, action: PayloadAction<Conversation[]>) {
      state.list = action.payload;
      state.isLoading = false;
    },
    setActiveConversation(state, action: PayloadAction<string | null>) {
      state.activeConversationId = action.payload;
    },
    updateLastMessage(
      state,
      action: PayloadAction<{ roomId: string; message: LastMessage }>,
    ) {
      const conv = state.list.find((c) => c.id === action.payload.roomId);
      if (conv) {
        conv.lastMessage = action.payload.message;
        conv.updatedAt = action.payload.message.timestamp;
      }
    },
    setUserOnline(
      state,
      action: PayloadAction<{ userId: string; isOnline: boolean }>,
    ) {
      const { userId, isOnline } = action.payload;
      state.onlineUsers[userId] = isOnline;
      for (const conv of state.list) {
        const p = conv.participantUsers?.find(
          (p: Participant) => p.id === userId,
        );
        if (p) p.isOnline = isOnline;
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setConversations,
  setActiveConversation,
  updateLastMessage,
  setUserOnline,
  setLoading,
  setError,
} = conversationsSlice.actions;
export default conversationsSlice.reducer;
