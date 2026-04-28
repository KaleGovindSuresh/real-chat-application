// Register Page

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loginStart, loginSuccess, loginFailure, clearError } from '../features/auth/authSlice';
import apiClient from '../services/apiClient';
import Spinner from '../components/ui/Spinner';
import { FiUser, FiMail, FiLock, FiMessageCircle, FiArrowRight } from 'react-icons/fi';

interface Props {
  onSwitchToLogin: () => void;
}

interface AuthErrorResponse {
  message?: string;
}

function getRegisterErrorMessage(error: unknown) {
  if (axios.isAxiosError<AuthErrorResponse>(error)) {
    if (error.response?.data?.message) return error.response.data.message;
    if (error.request) {
      return `Unable to reach auth server at ${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}`;
    }
    return error.message || 'Registration failed';
  }

  return error instanceof Error ? error.message : 'Registration failed';
}

export default function RegisterPage({ onSwitchToLogin }: Props) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await apiClient.post('/api/auth/register', { username, email, password });
      dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
    } catch (err: unknown) {
      dispatch(loginFailure(getRegisterErrorMessage(err)));
    }
  };

  const inputWrap: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'var(--bg-input)', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-primary)', padding: '0 14px',
  };

  const inputStyle: React.CSSProperties = {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    padding: '12px 0', color: 'var(--text-primary)', fontSize: 14,
    fontFamily: 'var(--font-family)',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: 20, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        top: '-10%', right: '-10%', filter: 'blur(60px)',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}
      >
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
            <span className="gradient-text">Create Account</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Join RealChat today</p>
        </div>

        <div className="glass" style={{
          borderRadius: 'var(--radius-lg)', padding: '32px 28px', boxShadow: 'var(--shadow-lg)',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Username</label>
              <div style={inputWrap}>
                <FiUser size={16} color="var(--text-tertiary)" />
                <input id="register-username" value={username} onChange={(e) => { setUsername(e.target.value); dispatch(clearError()); }} placeholder="Choose a username" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Email</label>
              <div style={inputWrap}>
                <FiMail size={16} color="var(--text-tertiary)" />
                <input id="register-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); dispatch(clearError()); }} placeholder="Enter your email" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Password</label>
              <div style={inputWrap}>
                <FiLock size={16} color="var(--text-tertiary)" />
                <input id="register-password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); dispatch(clearError()); }} placeholder="Create a password" style={inputStyle} />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'var(--color-error)' }}>
                {error}
              </motion.div>
            )}

            <motion.button id="register-submit" type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{
                width: '100%', padding: '12px 20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', borderRadius: 'var(--radius-md)',
                cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: isLoading ? 0.7 : 1, fontFamily: 'var(--font-family)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
              }}>
              {isLoading ? <Spinner size={20} color="#fff" /> : <>Create Account <FiArrowRight size={16} /></>}
            </motion.button>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-family)', fontSize: 13 }}>
              Sign in
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
