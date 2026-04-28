import { cn } from '../../utils/cn';

interface SpinnerProps {
  size?: 16 | 20 | 24 | 32;
  className?: string;
}

const sizeClasses: Record<NonNullable<SpinnerProps['size']>, string> = {
  16: 'h-4 w-4 border-[1.5px]',
  20: 'h-5 w-5 border-2',
  24: 'h-6 w-6 border-2',
  32: 'h-8 w-8 border-[2.5px]',
};

export default function Spinner({ size = 24, className }: SpinnerProps) {
  return (
    <span
      className={cn(
        'inline-block animate-spin rounded-full',
        'border-[rgba(255,255,255,0.18)] border-t-white',
        sizeClasses[size],
        className,
      )}
      style={{ animationDuration: '0.65s' }}
      aria-hidden="true"
    />
  );
}