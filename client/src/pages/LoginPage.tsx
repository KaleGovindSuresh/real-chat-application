// Login Page
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loginStart, loginSuccess, loginFailure, clearError } from '../features/auth/authSlice';
import { getAuthErrorMessage } from '../features/auth/authFeedback';
import { loginSchema } from '../features/auth/authSchemas';
import apiClient from '../services/apiClient';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';
import AuthShell from '../components/auth/AuthShell';
import { showErrorToast, showSuccessToast, showWarningToast } from '../utils/toast';
import type { LoginFormValues } from '../features/auth/authSchemas';

interface Props {
  onSwitchToRegister: () => void;
}

export default function LoginPage({ onSwitchToRegister }: Props) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: 'alice@example.com',
      password: 'password123',
    },
    mode: 'onBlur',
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    dispatch(loginStart());
    try {
      const res = await apiClient.post('/api/auth/login', values);
      dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
      showSuccessToast(`Welcome back, ${res.data.user.username}`);
    } catch (err: unknown) {
      const message = getAuthErrorMessage(err, 'Login failed');
      dispatch(loginFailure(message));
      showErrorToast(message);
    }
  }, (invalid) => {
    const firstError = Object.values(invalid)[0]?.message;
    if (firstError) showWarningToast(firstError);
  });

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Sign in to continue your conversations across devices."
      switchLabel="Don't have an account?"
      switchText="Create one"
      onSwitch={() => {
        dispatch(clearError());
        onSwitchToRegister();
      }}
    >
      <form className="auth-form" onSubmit={onSubmit}>
        <TextField
          id="login-email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          autoComplete="email"
          leftIcon={<FiMail size={16} />}
          error={errors.email?.message}
          {...register('email', {
            onChange: () => dispatch(clearError()),
          })}
        />

        <TextField
          id="login-password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          leftIcon={<FiLock size={16} />}
          error={errors.password?.message}
          rightAction={{
            ariaLabel: showPassword ? 'Hide password' : 'Show password',
            icon: showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />,
            onClick: () => setShowPassword((value) => !value),
          }}
          {...register('password', {
            onChange: () => dispatch(clearError()),
          })}
        />

        <Button
          id="login-submit"
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          endIcon={<FiArrowRight size={16} />}
        >
          Sign In
        </Button>
      </form>
    </AuthShell>
  );
}
