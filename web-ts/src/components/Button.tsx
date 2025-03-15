import React, { useState, useRef, useEffect } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  size = 'md',
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if (ripples.length === 0) return;

    const removeRipple = () => {
      setRipples((prevRipples) => prevRipples.slice(1));
    };

    const timer = setTimeout(removeRipple, 600);
    return () => clearTimeout(timer);
  }, [ripples]);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    
    if (button) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const diameter = Math.max(rect.width, rect.height) * 2;
      
      setRipples([
        ...ripples,
        { id: Date.now(), x, y, size: diameter }
      ]);
    }
    
    if (onClick) {
      onClick(e);
    }
  };
  
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };
  
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      ref={buttonRef}
      className={buttonClasses}
      onClick={handleClick}
      style={{ position: 'relative', overflow: 'hidden' }}
      {...props}
    >
      {startIcon && <span className="button-icon-start">{startIcon}</span>}
      {children}
      {endIcon && <span className="button-icon-end">{endIcon}</span>}
      
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size
          }}
        />
      ))}
    </button>
  );
};

export default Button; 