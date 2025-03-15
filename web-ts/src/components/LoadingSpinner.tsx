import React from 'react';
import '../styles/LoadingSpinner.css';

export interface LoadingSpinnerProps {
  type?: 'circular' | 'linear' | 'pulse';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  fullPage?: boolean;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  type = 'circular',
  size = 'medium',
  color,
  fullPage = false,
  text,
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { width: '24px', height: '24px', border: '2px' };
      case 'large':
        return { width: '56px', height: '56px', border: '4px' };
      case 'medium':
      default:
        return { width: '40px', height: '40px', border: '3px' };
    }
  };

  const spinnerStyle = {
    ...(type === 'circular' ? getSize() : {}),
    ...(color ? { borderTopColor: color } : {}),
  };

  const renderSpinner = () => {
    switch (type) {
      case 'linear':
        return <div className="spinner-linear" style={color ? { backgroundColor: `${color}20` } : {}} />;
      case 'pulse':
        return <div 
          className="spinner-pulse" 
          style={{ 
            ...getSize(), 
            backgroundColor: color ? `${color}99` : undefined 
          }} 
        />;
      case 'circular':
      default:
        return <div className="spinner" style={spinnerStyle} />;
    }
  };

  const containerClassName = fullPage ? 'spinner-fullpage-container' : 'spinner-container';

  return (
    <div className={containerClassName}>
      {renderSpinner()}
      {text && <div className="spinner-text">{text}</div>}
    </div>
  );
};

export default LoadingSpinner; 