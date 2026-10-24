export function Surface({ as: Element = 'section', className = '', children, ...props }) {
  return <Element className={`card ${className}`.trim()} {...props}>{children}</Element>;
}
