import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import MobileNav from './MobileNav';
import Toolbar from './Toolbar';

const Layout: React.FC = () => {
  const location = useLocation();
  
  // Определяем заголовок в зависимости от текущего пути
  const getPageTitle = () => {
    const path = location.pathname;
    
    switch (true) {
      case path === '/':
        return 'Головна';
      case path === '/calendar':
        return 'Календар';
      case path === '/tasks':
        return 'Задачі';
      case path === '/settings':
        return 'Налаштування';
      case path === '/statistics':
        return 'Статистика';
      case path.includes('/task/'):
        return 'Деталі задачі';
      default:
        return 'Календар Задач';
    }
  };
  
  // Определяем, показывать ли кнопку добавления на странице задач или календаря
  const shouldShowAddButton = () => {
    return location.pathname === '/tasks' || location.pathname === '/calendar';
  };

  return (
    <div className="app-container">
      <Toolbar 
        title={getPageTitle()} 
        showAddButton={shouldShowAddButton()}
        showSearchButton={location.pathname === '/tasks'}
        showVoiceButton={location.pathname === '/tasks' || location.pathname === '/calendar'}
      />
      
      <main className="content-container">
        <Outlet />
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
};

export default Layout; 