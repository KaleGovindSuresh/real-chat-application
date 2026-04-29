// Toast notification component

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { removeToast } from '../../features/ui/uiSlice';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';

const iconMap = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  info: FiInfo,
  warning: FiAlertTriangle,
};

const colorMap = {
  success: '#10b981',
  error: '#ef4444',
  info: '#3b82f6',
  warning: '#f59e0b',
};

export default function ToastContainer() {
  const toasts = useAppSelector((state) => state.ui.toasts);
  const dispatch = useAppDispatch();

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type];
          return (
            <ToastItem
              key={toast.id}
              id={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              icon={<Icon size={18} color={colorMap[toast.type]} />}
              onDismiss={() => dispatch(removeToast(toast.id))}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({
  id,
  message,
  type,
  duration = 4000,
  icon,
  onDismiss,
}: {
  id: string;
  message: string;
  type: string;
  duration?: number;
  icon: React.ReactNode;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        background: 'var(--bg-tertiary)',
        border: `1px solid ${colorMap[type as keyof typeof colorMap]}33`,
        borderLeft: `3px solid ${colorMap[type as keyof typeof colorMap]}`,
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: 'var(--shadow-lg)',
        backdropFilter: 'blur(12px)',
        cursor: 'pointer',
      }}
      onClick={onDismiss}
    >
      {icon}
      <span style={{ flex: 1, fontSize: 14, color: 'var(--text-primary)' }}>{message}</span>
      <FiX size={14} color="var(--text-tertiary)" style={{ cursor: 'pointer', flexShrink: 0 }} />
    </motion.div>
  );
}
