import axios from 'axios';

interface AuthErrorResponse {
  message?: string;
}

export function getAuthErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<AuthErrorResponse>(error)) {
    if (error.response?.data?.message) return error.response.data.message;
    if (error.request) {
      return `Unable to reach auth server at ${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}`;
    }
    return error.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
}
