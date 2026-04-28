// src/utils/constants.ts
export const APP_NAME = 'RealChat';
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
export const ACCEPTED_MEDIA_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES];
export const TYPING_DEBOUNCE_MS = 500;
export const TYPING_TIMEOUT_MS = 3000;
export const TOAST_DURATION_MS = 4000;
