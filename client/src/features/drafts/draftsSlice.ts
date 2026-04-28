// src/features/drafts/draftsSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type DraftsState = Record<string, string>; // roomId → text

const draftsSlice = createSlice({
  name: 'drafts',
  initialState: {} as DraftsState,
  reducers: {
    setDraft(state, action: PayloadAction<{ roomId: string; text: string }>) {
      state[action.payload.roomId] = action.payload.text;
    },
    clearDraft(state, action: PayloadAction<{ roomId: string }>) {
      delete state[action.payload.roomId];
    },
  },
});

export const { setDraft, clearDraft } = draftsSlice.actions;
export default draftsSlice.reducer;
