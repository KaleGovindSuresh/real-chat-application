import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiMessageCircle } from 'react-icons/fi';

interface AuthShellProps {
  title: string;
  subtitle: string;
  switchLabel: string;
  switchText: string;
  onSwitch: () => void;
  children: ReactNode;
}

export default function AuthShell({
  children,
  onSwitch,
  subtitle,
  switchLabel,
  switchText,
  title,
}: AuthShellProps) {
  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb--left" />
      <div className="auth-orb auth-orb--right" />

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="auth-panel"
      >
        <header className="auth-header">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="auth-logo"
          >
            <FiMessageCircle size={28} color="#fff" />
          </motion.div>
          <span className="auth-eyebrow">Realtime Messaging</span>
          <h1 className="auth-title">{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
        </header>

        <div className="auth-card glass">{children}</div>

        <div className="auth-switch">
          <span>{switchLabel}</span>
          <button type="button" className="auth-switch__button" onClick={onSwitch}>
            <span>{switchText}</span>
            <FiArrowRight size={14} />
          </button>
        </div>
      </motion.section>
    </div>
  );
}
