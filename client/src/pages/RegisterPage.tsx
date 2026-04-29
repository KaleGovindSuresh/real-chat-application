// Register Page
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loginStart, loginSuccess, loginFailure, clearError } from '../features/auth/authSlice';
import { getAuthErrorMessage } from '../features/auth/authFeedback';
import { registerSchema } from '../features/auth/authSchemas';
import apiClient from '../services/apiClient';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';
import AuthShell from '../components/auth/AuthShell';
import { showErrorToast, showSuccessToast, showWarningToast } from '../utils/toast';
import type { RegisterFormValues } from '../features/auth/authSchemas';

interface Props {
  onSwitchToLogin: () => void;
}

export default function RegisterPage({ onSwitchToLogin }: Props) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<RegisterFormValues>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    mode: 'onBlur',
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    dispatch(loginStart());
    try {
      const res = await apiClient.post('/api/auth/register', values);
      dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
      showSuccessToast(`Account created for ${res.data.user.username}`);
    } catch (err: unknown) {
      const message = getAuthErrorMessage(err, 'Registration failed');
      dispatch(loginFailure(message));
      showErrorToast(message);
    }
  }, (invalid) => {
    const firstError = Object.values(invalid)[0]?.message;
    if (firstError) showWarningToast(firstError);
  });

  return (
    <AuthShell
      title="Create Account"
      subtitle="Start chatting with a cleaner auth flow and responsive UI."
      switchLabel="Already have an account?"
      switchText="Sign in"
      onSwitch={() => {
        dispatch(clearError());
        onSwitchToLogin();
      }}
    >
      <form className="auth-form" onSubmit={onSubmit}>
        <TextField
          id="register-username"
          type="text"
          label="Username"
          placeholder="Choose a username"
          autoComplete="username"
          leftIcon={<FiUser size={16} />}
          error={errors.username?.message}
          {...register('username', {
            onChange: () => dispatch(clearError()),
          })}
        />

        <TextField
          id="register-email"
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
          id="register-password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="Create a password"
          autoComplete="new-password"
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
          id="register-submit"
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          endIcon={<FiArrowRight size={16} />}
        >
          Create Account
        </Button>
      </form>
    </AuthShell>
  );
}
