/**
 * Button component
 * variant: 'primary' | 'danger' | 'ghost' | 'success' | 'warn' | 'outline' | 'info'
 * size: 'sm' | 'md' (default)
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const cls = ['btn', `btn-${variant}`, size === 'sm' ? 'btn-sm' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
