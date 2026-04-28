import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
  endAdornment?: ReactNode;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, icon, endAdornment, className, id, ...props }, ref) => (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="block text-[12.5px] font-semibold uppercase tracking-[0.03em]"
        style={{ color: "var(--text-tertiary)" }}
      >
        {label}
      </label>

      <div
        className={cn(
          "group flex min-h-[48px] items-center gap-3 rounded-lg border px-3.5 transition-colors duration-150",
          error
            ? "border-[rgba(239,68,68,0.45)]"
            : "border-(--border-primary) focus-within:border-(--border-focus)",
        )}
        style={{
          backgroundColor: error ? 'rgba(239,68,68,0.04)' : '#132033',
        }}
      >
        {icon && (
          <span
            className="shrink-0 transition-colors duration-150 group-focus-within:text-(--color-primary)"
            style={{ color: error ? "var(--color-error)" : "var(--text-tertiary)" }}
          >
            {icon}
          </span>
        )}

        <input
          ref={ref}
          id={id}
          className={cn(
            "input-field min-w-0 flex-1 bg-transparent py-3 text-[14px] text-(--text-primary)",
            "border-0 shadow-none outline-none",
            "placeholder:text-(--text-tertiary)",
            className,
          )}
          {...props}
        />

        {endAdornment && <span className="shrink-0">{endAdornment}</span>}
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--color-error)" }}>
          <span className="inline-block h-1 w-1 rounded-full bg-current" />
          {error}
        </p>
      )}
    </div>
  ),
);

InputField.displayName = "InputField";

export default InputField;
