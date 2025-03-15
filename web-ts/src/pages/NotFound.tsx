import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { FaHome } from 'react-icons/fa';

const NotFound: React.FC = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Сторінку не знайдено</h2>
        <p>На жаль, сторінка, яку ви шукаєте, не існує або була переміщена.</p>
        
        <Link to="/">
          <Button variant="primary" startIcon={<FaHome />}>
            Повернутися на головну
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 