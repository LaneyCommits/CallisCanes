import { Link } from 'react-router-dom';
import './Button.css';

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  resin = false,
  type = 'button',
  ...props
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    resin ? 'btn-resin' : '',
    className,
  ].filter(Boolean).join(' ');

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
