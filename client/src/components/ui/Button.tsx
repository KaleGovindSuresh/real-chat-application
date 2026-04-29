import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";
import Spinner from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
}

export default function Button({
  children,
  className,
  disabled,
  endIcon,
  fullWidth = false,
  loading = false,
  startIcon,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "ui-button",
        `ui-button--${variant}`,
        fullWidth && "ui-button--full",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Spinner size={18} color="currentColor" />
      ) : (
        <>
          {startIcon ? (
            <span className="ui-button__icon">{startIcon}</span>
          ) : null}
          <span>{children}</span>
          {endIcon ? <span className="ui-button__icon">{endIcon}</span> : null}
        </>
      )}
    </button>
  );
}
