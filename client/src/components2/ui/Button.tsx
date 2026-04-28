import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses = {
  primary: [
    'bg-[var(--color-primary)]',
    'text-white font-semibold',
    'border border-transparent',
    'hover:bg-[var(--color-primary-hover)]',
    'active:bg-[var(--color-primary-dark)]',
    'transition-colors duration-150',
  ].join(' '),
  ghost: [
    'bg-transparent border border-[var(--border-primary)]',
    'text-[var(--color-primary)] font-medium',
    'hover:bg-[var(--color-primary-alpha)] hover:border-[var(--border-focus)]',
    'transition-all duration-150',
  ].join(' '),
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg px-5 text-[14px] leading-none',
        'select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]',
        'disabled:pointer-events-none disabled:opacity-55',
        variantClasses[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {leftIcon && <span className="flex shrink-0 items-center justify-center">{leftIcon}</span>}
      <span className="inline-flex items-center justify-center">{children}</span>
      {rightIcon && <span className="flex shrink-0 items-center justify-center">{rightIcon}</span>}
    </button>
  ),
);

Button.displayName = 'Button';

export default Button;
