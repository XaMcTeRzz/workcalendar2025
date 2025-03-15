import React from 'react';
import { FaPlus } from 'react-icons/fa';

interface FABProps {
  onClick: () => void;
  ariaLabel?: string;
}

const FAB: React.FC<FABProps> = ({ onClick, ariaLabel = 'Додати' }) => {
  return (
    <button 
      className="btn-fab ripple-effect" 
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <FaPlus />
    </button>
  );
};

export default FAB; 