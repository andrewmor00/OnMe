import React from 'react';
import StarsProfile from '../img/StarsProfile.png';
import './CSVDataPrompt.css';

const CSVDataPrompt = ({ title, description, showImportButton = true }) => {
  return (
    <div className="csv-data-prompt">
      <div className="prompt-content">
        <div className="prompt-left">
          <div className="sparkle-icons">
            <img src={StarsProfile} alt="StarsProfile" className='sparkle-avatar'/>
          </div>
          <div className="prompt-text">
            <h3>{title || 'Импортируйте CSV файлы для просмотра данных'}</h3>
            <p>{description || 'Загрузите ваши CSV файлы, чтобы увидеть реальную статистику и аналитику'}</p>
          </div>
        </div>
        {showImportButton && (
          <button 
            className="import-data-button"

          >
            Импортировать данные
          </button>
        )}
      </div>
    </div>
  );
};

export default CSVDataPrompt; 