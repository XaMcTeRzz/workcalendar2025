import React, { useState, useLayoutEffect } from 'react';

interface RippleProps {
  color?: string;
}

interface RippleInfo {
  x: number;
  y: number;
  size: number;
  id: number;
}

const Ripple: React.FC<RippleProps> = ({ color = 'rgba(255, 255, 255, 0.7)' }) => {
  const [ripples, setRipples] = useState<RippleInfo[]>([]);
  
  useLayoutEffect(() => {
    const duration = 600; // ms
    
    const cleanup = setTimeout(() => {
      if (ripples.length > 0) {
        // Удаляем самый старый ripple
        setRipples((prevRipples) => prevRipples.slice(1));
      }
    }, duration);
    
    return () => clearTimeout(cleanup);
  }, [ripples]);
  
  const addRipple = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const newRipple = {
      x,
      y,
      size,
      id: Date.now()
    };
    
    setRipples((prevRipples) => [...prevRipples, newRipple]);
  };
  
  return (
    <div className="ripple-container" onMouseDown={addRipple}>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: color
          }}
        />
      ))}
    </div>
  );
};

export default Ripple; 