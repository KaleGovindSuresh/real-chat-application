// Spinner component

interface SpinnerProps {
  size?: number;
  color?: string;
}

export default function Spinner({
  size = 24,
  color = "var(--color-primary)",
}: SpinnerProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        border: `3px solid var(--border-primary)`,
        borderTopColor: color,
        borderRadius: "50%",
        animation: "spinner-rotate 0.8s linear infinite",
      }}
    />
  );
}
