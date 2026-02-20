import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export default function Button({
  variant = 'primary',
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''} ${className ?? ''}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
