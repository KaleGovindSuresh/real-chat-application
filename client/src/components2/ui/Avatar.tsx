// Avatar component

interface AvatarProps {
  src?: string;
  name: string;
  size?: number;
  isOnline?: boolean;
  style?: React.CSSProperties;
}

export default function Avatar({ src, name, size = 40, isOnline, style }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const gradients = [
    'linear-gradient(135deg, #6366f1, #8b5cf6)',
    'linear-gradient(135deg, #06b6d4, #3b82f6)',
    'linear-gradient(135deg, #10b981, #06b6d4)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #ec4899, #8b5cf6)',
  ];

  const gradientIndex = name.charCodeAt(0) % gradients.length;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
        ...style,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          style={{
            width: size,
            height: size,
            borderRadius: 'var(--radius-full)',
            objectFit: 'cover',
            border: '2px solid var(--border-secondary)',
          }}
        />
      ) : (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: 'var(--radius-full)',
            background: gradients[gradientIndex],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size * 0.35,
            fontWeight: 600,
            color: '#fff',
            border: '2px solid var(--border-secondary)',
          }}
        >
          {initials}
        </div>
      )}
      {isOnline !== undefined && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: size * 0.3,
            height: size * 0.3,
            borderRadius: '50%',
            background: isOnline ? 'var(--color-success)' : 'var(--text-tertiary)',
            border: `2px solid var(--bg-secondary)`,
            transition: 'background var(--transition-normal)',
          }}
        />
      )}
    </div>
  );
}
