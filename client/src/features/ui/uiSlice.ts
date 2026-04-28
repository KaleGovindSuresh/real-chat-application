// src/features/ui/uiSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface UIState {
  isForwardModalOpen: boolean;
  forwardingMessageId: string | null;
  forwardTargetRoomId: string | null;
  isSidebarOpen: boolean;
  toasts: Toast[];
  typingUsers: Record<string, { userId: string; userName: string }[]>;
}

const initialState: UIState = {
  isForwardModalOpen: false,
  forwardingMessageId: null,
  forwardTargetRoomId: null,
  isSidebarOpen: true,
  toasts: [],
  typingUsers: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openForwardModal(
      state,
      action: PayloadAction<{ messageId: string; targetRoomId?: string }>,
    ) {
      state.isForwardModalOpen = true;
      state.forwardingMessageId = action.payload.messageId;
      state.forwardTargetRoomId = action.payload.targetRoomId ?? null;
    },
    closeForwardModal(state) {
      state.isForwardModalOpen = false;
      state.forwardingMessageId = null;
      state.forwardTargetRoomId = null;
    },
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.isSidebarOpen = action.payload;
    },
    addToast(state, action: PayloadAction<Toast>) {
      // Prevent duplicate toasts with same id
      if (!state.toasts.some((t) => t.id === action.payload.id)) {
        state.toasts.push(action.payload);
      }
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    setTypingUser(
      state,
      action: PayloadAction<{ roomId: string; userId: string; userName: string }>,
    ) {
      const { roomId, userId, userName } = action.payload;
      if (!state.typingUsers[roomId]) state.typingUsers[roomId] = [];
      if (!state.typingUsers[roomId].some((t) => t.userId === userId)) {
        state.typingUsers[roomId].push({ userId, userName });
      }
    },
    removeTypingUser(state, action: PayloadAction<{ roomId: string; userId: string }>) {
      const { roomId, userId } = action.payload;
      if (state.typingUsers[roomId]) {
        state.typingUsers[roomId] = state.typingUsers[roomId].filter(
          (t) => t.userId !== userId,
        );
      }
    },
  },
});

export const {
  openForwardModal,
  closeForwardModal,
  toggleSidebar,
  setSidebarOpen,
  addToast,
  removeToast,
  setTypingUser,
  removeTypingUser,
} = uiSlice.actions;
export default uiSlice.reducer;
