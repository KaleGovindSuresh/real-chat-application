import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label: string;
  leftIcon?: ReactNode;
  rightAction?: {
    ariaLabel: string;
    icon: ReactNode;
    onClick: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  };
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { className, error, label, leftIcon, rightAction, type = 'text', ...props },
  ref,
) {
  return (
    <label className="form-field">
      <span className="form-field__label">{label}</span>
      <span
        className={cn('form-field__control', error && 'form-field__control--error')}
      >
        {leftIcon ? <span className="form-field__icon">{leftIcon}</span> : null}
        <input
          ref={ref}
          type={type}
          className={cn('form-field__input input-field', className)}
          {...props}
        />
        {rightAction ? (
          <button
            type="button"
            className="form-field__action"
            aria-label={rightAction.ariaLabel}
            onClick={rightAction.onClick}
          >
            {rightAction.icon}
          </button>
        ) : null}
      </span>
      {error ? <span className="form-field__error">{error}</span> : null}
    </label>
  );
});

export default TextField;
