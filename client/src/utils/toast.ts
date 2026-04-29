import type { Toast } from '../features/ui/uiSlice';
import { store } from '../app/store';
import { addToast } from '../features/ui/uiSlice';

function buildToastId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createToast(
  type: Toast['type'],
  message: string,
  duration?: number,
): Toast {
  return {
    id: buildToastId(),
    type,
    message,
    duration,
  };
}

export function showToast(type: Toast['type'], message: string, duration?: number) {
  store.dispatch(addToast(createToast(type, message, duration)));
}

export function showSuccessToast(message: string, duration?: number) {
  showToast('success', message, duration);
}

export function showErrorToast(message: string, duration?: number) {
  showToast('error', message, duration);
}

export function showInfoToast(message: string, duration?: number) {
  showToast('info', message, duration);
}

export function showWarningToast(message: string, duration?: number) {
  showToast('warning', message, duration);
}
