// Login Page

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loginStart, loginSuccess, loginFailure, clearError } from '../features/auth/authSlice';
import apiClient from '../services/apiClient';
import Spinner from '../components/ui/Spinner';
import { FiMail, FiLock, FiMessageCircle, FiArrowRight } from 'react-icons/fi';

interface Props {
  onSwitchToRegister: () => void;
}

interface AuthErrorResponse {
  message?: string;
}

function getLoginErrorMessage(error: unknown) {
  if (axios.isAxiosError<AuthErrorResponse>(error)) {
    if (error.response?.data?.message) return error.response.data.message;
    if (error.request) {
      return `Unable to reach auth server at ${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}`;
    }
    return error.message || 'Login failed';
  }

  return error instanceof Error ? error.message : 'Login failed';
}

export default function LoginPage({ onSwitchToRegister }: Props) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('alice@example.com');
  const [password, setPassword] = useState('password123');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await apiClient.post('/api/auth/login', { email, password });
      dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
    } catch (err: unknown) {
      dispatch(loginFailure(getLoginErrorMessage(err)));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background gradient orbs */}
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        top: '-10%', left: '-10%', filter: 'blur(60px)',
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
        bottom: '-10%', right: '-10%', filter: 'blur(60px)',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%',
          maxWidth: 420,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
            style={{
              width: 64, height: 64, borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16, boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
            }}
          >
            <FiMessageCircle size={30} color="#fff" />
          </motion.div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
            <span className="gradient-text">RealChat</span>
          </h1>
        </div>

        {/* Card */}
        <div className="glass" style={{
          borderRadius: 'var(--radius-lg)',
          padding: '32px 28px',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Email
              </label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'var(--bg-input)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)', padding: '0 14px',
                transition: 'border-color var(--transition-fast)',
              }}>
                <FiMail size={16} color="var(--text-tertiary)" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); dispatch(clearError()); }}
                  placeholder="Enter your email"
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    padding: '12px 0', color: 'var(--text-primary)', fontSize: 14,
                    fontFamily: 'var(--font-family)',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Password
              </label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'var(--bg-input)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)', padding: '0 14px',
                transition: 'border-color var(--transition-fast)',
              }}>
                <FiLock size={16} color="var(--text-tertiary)" />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); dispatch(clearError()); }}
                  placeholder="Enter your password"
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    padding: '12px 0', color: 'var(--text-primary)', fontSize: 14,
                    fontFamily: 'var(--font-family)',
                  }}
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: 16,
                  fontSize: 13, color: 'var(--color-error)',
                }}
              >
                {error}
              </motion.div>
            )}

            <motion.button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%', padding: '12px 20px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', fontWeight: 600, fontSize: 15,
                border: 'none', borderRadius: 'var(--radius-md)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: isLoading ? 0.7 : 1,
                fontFamily: 'var(--font-family)',
                boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
                transition: 'opacity var(--transition-fast)',
              }}
            >
              {isLoading ? <Spinner size={20} color="#fff" /> : <>Sign In <FiArrowRight size={16} /></>}
            </motion.button>
          </form>

          <div style={{
            marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)',
          }}>
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              style={{
                background: 'none', border: 'none', color: 'var(--color-primary)',
                cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-family)',
                fontSize: 13,
              }}
            >
              Sign up
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
