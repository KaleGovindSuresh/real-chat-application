// Spinner component

interface SpinnerProps {
  size?: number;
  color?: string;
}

export default function Spinner({ size = 24, color = 'var(--color-primary)' }: SpinnerProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `3px solid var(--border-primary)`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  );
}

// Add keyframe via style tag (injected once)
if (typeof document !== 'undefined' && !document.getElementById('spinner-keyframe')) {
  const style = document.createElement('style');
  style.id = 'spinner-keyframe';
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}
