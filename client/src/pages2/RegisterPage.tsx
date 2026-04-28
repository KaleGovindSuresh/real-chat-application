import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loginStart, loginSuccess, loginFailure, clearError } from '../features/auth/authSlice';
import { addToast } from '../features/ui/uiSlice';
import { getAuthErrorMessage } from '../features/auth/authFeedback';
import { registerSchema, type RegisterFormValues } from '../features/auth/authSchemas';
import apiClient from '../services/apiClient';
import AuthShell from '../components/ui/AuthShell';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import Spinner from '../components/ui/Spinner';
import { FiUser, FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { createToast } from '../utils/toast';

interface Props {
  onSwitchToLogin: () => void;
}

export default function RegisterPage({ onSwitchToLogin }: Props) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    dispatch(loginStart());
    try {
      const res = await apiClient.post('/api/auth/register', values);
      dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
      dispatch(addToast(createToast('success', `Account created for ${res.data.user.username}`)));
    } catch (err: unknown) {
      const message = getAuthErrorMessage(err, 'Registration failed');
      dispatch(loginFailure(message));
      dispatch(addToast(createToast('error', message, 5000)));
    }
  };

  return (
    <AuthShell
      title="Create account"
      subtitle="Join RealChat — free forever"
      footer={
        <span className="inline-flex flex-wrap items-center justify-center gap-1.5">
          <span style={{ color: 'var(--text-tertiary)' }}>Already have an account?</span>{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="inline-flex items-center font-semibold transition-colors duration-150 hover:underline"
            style={{ color: 'var(--color-primary)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            Sign in
          </button>
        </span>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit, (formErrors) => {
          const firstError = Object.values(formErrors)[0]?.message;
          if (firstError) dispatch(addToast(createToast('error', firstError, 4500)));
        })}
        className="flex flex-col gap-4.5"
      >
        <InputField
          id="register-username"
          label="Username"
          placeholder="Choose a username"
          icon={<FiUser size={18} />}
          error={errors.username?.message}
          autoComplete="username"
          {...register('username', {
            onChange: () => { if (error) dispatch(clearError()); },
          })}
        />

        <InputField
          id="register-email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          icon={<FiMail size={18} />}
          error={errors.email?.message}
          autoComplete="email"
          {...register('email', {
            onChange: () => { if (error) dispatch(clearError()); },
          })}
        />

        <InputField
          id="register-password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="Create a strong password"
          icon={<FiLock size={18} />}
          error={errors.password?.message}
          autoComplete="new-password"
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors duration-150 hover:bg-white/8"
              style={{ color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          }
          {...register('password', {
            onChange: () => { if (error) dispatch(clearError()); },
          })}
        />

        <div className="pt-2">
          <Button
            id="register-submit"
            type="submit"
            fullWidth
            loading={isLoading}
            rightIcon={
              isLoading
                ? <Spinner size={16} />
                : <FiArrowRight size={18} />
            }
          >
            {isLoading ? 'Creating account…' : 'Create Account'}
          </Button>
        </div>
      </form>
    </AuthShell>
  );
}
