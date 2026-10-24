export function Button({ variant = 'primary', icon, className = '', children, ...props }) {
  return <button className={`button button-${variant} ${className}`.trim()} {...props}>
    {icon && <span aria-hidden="true">{icon}</span>}
    {children}
  </button>;
}
