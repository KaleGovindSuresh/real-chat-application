import { forwardRef, useEffect } from 'react';
import type { ReactNode } from 'react';
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

const colorConfig = {
  success: {
    icon: '#10b981',
    border: 'rgba(16, 185, 129, 0.2)',
    bar: '#10b981',
    bg: 'rgba(16, 185, 129, 0.06)',
  },
  error: {
    icon: '#ef4444',
    border: 'rgba(239, 68, 68, 0.2)',
    bar: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.06)',
  },
  info: {
    icon: '#3b82f6',
    border: 'rgba(59, 130, 246, 0.2)',
    bar: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.06)',
  },
  warning: {
    icon: '#f59e0b',
    border: 'rgba(245, 158, 11, 0.2)',
    bar: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.06)',
  },
};

export default function ToastContainer() {
  const toasts = useAppSelector((state) => state.ui.toasts);
  const dispatch = useAppDispatch();

  return (
    <div className="toast-stack">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type];
          const colors = colorConfig[toast.type];
          return (
            <ToastItem
              key={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              icon={<Icon size={16} color={colors.icon} />}
              colors={colors}
              onDismiss={() => dispatch(removeToast(toast.id))}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

interface ToastItemProps {
  message: string;
  type: string;
  duration?: number;
  icon: ReactNode;
  colors: { icon: string; border: string; bar: string; bg: string };
  onDismiss: () => void;
}

const ToastItem = forwardRef<HTMLDivElement, ToastItemProps>(
  ({ message, type, duration = 4000, icon, colors, onDismiss }, ref) => {
    useEffect(() => {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }, [duration, onDismiss]);

    const label = type.charAt(0).toUpperCase() + type.slice(1);

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, x: 60, scale: 0.92 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 60, scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 360, damping: 32 }}
        onClick={onDismiss}
        className="relative w-full cursor-pointer overflow-hidden rounded-xl"
        style={{
          background: '#0f172a',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 14px 32px rgba(2, 6, 23, 0.28)',
        }}
      >
        <div
          className="absolute inset-y-0 left-0 w-[3px]"
          style={{ background: colors.bar }}
        />

        <div className="flex items-start gap-3 px-4 py-3.5 pl-5">
          <div
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center self-start rounded-lg"
            style={{ background: colors.bg }}
          >
            {icon}
          </div>

          <div className="min-w-0 flex-1 py-0.5">
            <div
              className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.08em]"
              style={{ color: colors.icon }}
            >
              {label}
            </div>
            <div
              className="break-words text-[13.5px] leading-[1.5]"
              style={{ color: 'var(--text-primary)' }}
            >
              {message}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDismiss(); }}
            className="ml-1 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 hover:bg-white/10"
            style={{ color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label="Dismiss"
          >
            <FiX size={12} />
          </button>
        </div>

        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className="absolute bottom-0 left-0 h-[2px] w-full origin-left"
          style={{ background: `linear-gradient(90deg, ${colors.bar}, transparent)` }}
        />
      </motion.div>
    );
  },
);

ToastItem.displayName = 'ToastItem';
