import React from 'react';
import './CSVWelcome.css';

const CSVWelcome = () => {
  return (
    <div className="csv-welcome">
      <div className="welcome-content">
        <div className="welcome-icon">📊</div>
        <h2>Добро пожаловать в Базу Данных!</h2>
        <p>Здесь вы можете управлять и анализировать CSV данные, которые уже загружены в систему</p>
        
        <div className="welcome-steps">
          <h3>Как начать:</h3>
          <ol>
            <li>
              <strong>Данные уже загружены:</strong> CSV файлы автоматически загружены из встроенной базы данных
            </li>
            <li>
              <strong>Просматривайте данные:</strong> Используйте таблицу для просмотра и поиска информации
            </li>
            <li>
              <strong>Анализируйте:</strong> Сортируйте и фильтруйте данные для получения нужной информации
            </li>
            <li>
              <strong>Импортируйте дополнительные файлы:</strong> При необходимости загрузите дополнительные CSV файлы
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
          <p><strong>💡 Совет:</strong> Данные уже загружены и готовы к использованию. Выберите тип данных в выпадающем списке выше для начала работы.</p>
        </div>
      </div>
    </div>
  );
};

export default CSVWelcome; 