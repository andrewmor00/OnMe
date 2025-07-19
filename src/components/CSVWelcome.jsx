import React from 'react';
import './CSVWelcome.css';

const CSVWelcome = () => {
  return (
    <div className="csv-welcome">
      <div className="welcome-content">
        <div className="welcome-icon">📊</div>
        <h2>Добро пожаловать в Базу Данных!</h2>
        <p>Здесь вы можете управлять и анализировать ваши CSV файлы</p>
        
        <div className="welcome-steps">
          <h3>Как начать:</h3>
          <ol>
            <li>
              <strong>Импортируйте файлы:</strong> Загрузите ваши CSV файлы (users_df.csv, stats_df.csv, comments.csv, posts_df.csv)
            </li>
            <li>
              <strong>Просматривайте данные:</strong> Используйте таблицу для просмотра и поиска информации
            </li>
            <li>
              <strong>Анализируйте:</strong> Сортируйте и фильтруйте данные для получения нужной информации
            </li>
            <li>
              <strong>Экспортируйте:</strong> При необходимости экспортируйте данные обратно в CSV формат
            </li>
          </ol>
        </div>

        <div className="welcome-features">
          <h3>Возможности:</h3>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">🔍</span>
              <span>Поиск по любому полю</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📈</span>
              <span>Сортировка данных</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Статистика и аналитика</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💾</span>
              <span>Автоматическое сохранение</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <span>Мобильная версия</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📤</span>
              <span>Экспорт в CSV</span>
            </div>
          </div>
        </div>

        <div className="welcome-tip">
          <p><strong>💡 Совет:</strong> Начните с импорта файла users_df.csv для тестирования системы</p>
        </div>
      </div>
    </div>
  );
};

export default CSVWelcome; 