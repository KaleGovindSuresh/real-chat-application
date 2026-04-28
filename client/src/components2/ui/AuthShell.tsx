import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { FiMessageCircle } from 'react-icons/fi';

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="auth-page">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="auth-panel"
      >
        <div className="mb-7 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.15 }}
            className="auth-logo"
            style={{
              width: 52,
              height: 52,
              marginBottom: 16,
              borderRadius: 16,
              backgroundColor: 'var(--color-primary)',
              boxShadow: '0 10px 24px rgba(99, 102, 241, 0.22)',
            }}
          >
            <FiMessageCircle size={18} color="#fff" strokeWidth={2} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.45 }}
          >
            <p className="auth-eyebrow">Realtime workspace</p>
            <h1
              className="text-[1.75rem] font-bold leading-tight tracking-[-0.02em]"
              style={{ color: 'var(--text-primary)', marginBottom: subtitle ? 0 : 2 }}
            >
              {title}
            </h1>
            {subtitle ? (
              <p
                className="mt-1.5 text-[14px] leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {subtitle}
              </p>
            ) : null}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="auth-card"
          style={{
            border: '1px solid rgba(148, 163, 184, 0.14)',
            background: '#0f172a',
            boxShadow: '0 20px 48px rgba(2, 6, 23, 0.32)',
          }}
        >
          {children}

          <div
            className="mt-5 border-t pt-4 text-center text-[13px]"
            style={{
              borderColor: 'var(--border-primary)',
              color: 'var(--text-secondary)',
            }}
          >
            {footer}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
