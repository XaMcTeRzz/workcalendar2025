import React, { useState } from 'react';
import { FaBars, FaSearch, FaMicrophone, FaPlus } from 'react-icons/fa';
import Drawer from './Drawer';

interface ToolbarProps {
  title: string;
  showAddButton?: boolean;
  onAddClick?: () => void;
  showSearchButton?: boolean;
  onSearchClick?: () => void;
  showVoiceButton?: boolean;
  onVoiceClick?: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  title,
  showAddButton = false,
  onAddClick,
  showSearchButton = false,
  onSearchClick,
  showVoiceButton = false,
  onVoiceClick,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <div className="toolbar">
        <button 
          className="toolbar-nav-icon" 
          onClick={handleDrawerToggle}
          aria-label="Відкрити меню"
        >
          <FaBars />
        </button>
        
        <h1 className="toolbar-title">{title}</h1>
        
        <div className="toolbar-actions">
          {showSearchButton && (
            <button 
              className="toolbar-nav-icon" 
              onClick={onSearchClick}
              aria-label="Пошук"
            >
              <FaSearch />
            </button>
          )}
          
          {showVoiceButton && (
            <button 
              className="toolbar-nav-icon" 
              onClick={onVoiceClick}
              aria-label="Голосовий ввід"
            >
              <FaMicrophone />
            </button>
          )}
          
          {showAddButton && (
            <button 
              className="toolbar-nav-icon" 
              onClick={onAddClick}
              aria-label="Додати"
            >
              <FaPlus />
            </button>
          )}
        </div>
      </div>
      
      <Drawer isOpen={isDrawerOpen} onClose={handleDrawerClose} />
    </>
  );
};

export default Toolbar; 