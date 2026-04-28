// src/features/upload/uploadSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CloudinaryResponse } from '../../types';

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  result: CloudinaryResponse | null;
  previewUrl: string | null;
  previewType: 'image' | 'video' | null;
}

const initialState: UploadState = {
  isUploading: false,
  progress: 0,
  error: null,
  result: null,
  previewUrl: null,
  previewType: null,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    uploadStart(state) {
      state.isUploading = true;
      state.progress = 0;
      state.error = null;
      state.result = null;
    },
    uploadProgress(state, action: PayloadAction<number>) {
      state.progress = action.payload;
    },
    uploadSuccess(state, action: PayloadAction<CloudinaryResponse>) {
      state.isUploading = false;
      state.progress = 100;
      state.result = action.payload;
    },
    uploadFailure(state, action: PayloadAction<string>) {
      state.isUploading = false;
      state.error = action.payload;
    },
    setPreview(state, action: PayloadAction<{ url: string; type: 'image' | 'video' }>) {
      state.previewUrl = action.payload.url;
      state.previewType = action.payload.type;
    },
    clearUpload(state) {
      state.isUploading = false;
      state.progress = 0;
      state.error = null;
      state.result = null;
      state.previewUrl = null;
      state.previewType = null;
    },
  },
});

export const {
  uploadStart,
  uploadProgress,
  uploadSuccess,
  uploadFailure,
  setPreview,
  clearUpload,
} = uploadSlice.actions;
export default uploadSlice.reducer;
