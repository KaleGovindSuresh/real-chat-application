import type { Toast } from '../features/ui/uiSlice';

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
