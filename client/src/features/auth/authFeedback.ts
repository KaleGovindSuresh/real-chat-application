import axios from 'axios';
import { getApiBaseUrl } from '../../config/runtime';

interface AuthErrorResponse {
  message?: string;
}

export function getAuthErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<AuthErrorResponse>(error)) {
    if (error.response?.data?.message) return error.response.data.message;
    if (error.request) {
      return `Unable to reach auth server at ${getApiBaseUrl()}`;
    }
    return error.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
}
