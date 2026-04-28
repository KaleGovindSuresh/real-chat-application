// src/hooks/useMediaUpload.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  uploadStart,
  uploadProgress,
  uploadSuccess,
  uploadFailure,
  setPreview,
  clearUpload,
} from '../features/upload/uploadSlice';
import { uploadMedia, getMediaType } from '../services/cloudinaryService';

export function useMediaUpload() {
  const dispatch = useAppDispatch();
  const uploadState = useAppSelector((state) => state.upload);

  const upload = useCallback(
    async (file: File) => {
      dispatch(uploadStart());

      // Show local preview immediately
      const localUrl = URL.createObjectURL(file);
      const type = getMediaType(file);
      dispatch(setPreview({ url: localUrl, type }));

      try {
        const result = await uploadMedia(file, (pct) => dispatch(uploadProgress(pct)));
        dispatch(uploadSuccess(result));
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Upload failed';
        dispatch(uploadFailure(msg));
        throw err;
      }
    },
    [dispatch],
  );

  const clear = useCallback(() => dispatch(clearUpload()), [dispatch]);

  return { upload, clear, ...uploadState };
}
