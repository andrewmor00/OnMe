import React, { useState } from 'react';
import { useStorage } from '../context/StorageContext';
import '../App.css';

const StorageManager = () => {
  const { 
    exportData, 
    importData, 
    clearAllData, 
    getStorageSize,
    recentActivity,
    analyticsData,
    connectedAccounts,
    userProfile,
    notifications,
    securitySettings,
    userPreferences,
    draftPosts,
    bookmarks,
    trendingData
  } = useStorage();

  const [showDetails, setShowDetails] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `onmyfeed_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage('Данные успешно экспортированы!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Ошибка при экспорте данных');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleImport = () => {
    if (!importFile) {
      setMessage('Пожалуйста, выберите файл для импорта');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const success = importData(data);
        if (success) {
          setMessage('Данные успешно импортированы!');
          setImportFile(null);
        } else {
          setMessage('Ошибка при импорте данных');
        }
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Неверный формат файла');
        setTimeout(() => setMessage(''), 3000);
      }
    };
    reader.readAsText(importFile);
  };

  const handleClearAll = () => {
    if (window.confirm('Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.')) {
      const success = clearAllData();
      if (success) {
        setMessage('Все данные удалены');
      } else {
        setMessage('Ошибка при удалении данных');
      }
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDataSummary = () => {
    return {
      profile: userProfile.name ? 'Настроен' : 'Не настроен',
      accounts: connectedAccounts.filter(acc => acc.status === 'connected').length,
      drafts: draftPosts.length,
      bookmarks: bookmarks.length,
      activities: recentActivity.length,
      size: formatBytes(getStorageSize())
    };
  };

  const summary = getDataSummary();

  return (
    <div className="storage-manager">
      <div className="storage-header">
        <h2>Управление данными</h2>
        <p>Управляйте данными, хранящимися в вашем браузере</p>
      </div>

      {message && (
        <div className="message" style={{ 
          color: message.includes('успешно') ? 'green' : 'red', 
          marginBottom: '15px',
          textAlign: 'center',
          padding: '10px',
          backgroundColor: message.includes('успешно') ? '#e8f5e8' : '#ffe8e8',
          borderRadius: '5px'
        }}>
          {message}
        </div>
      )}

      <div className="storage-summary">
        <h3>Сводка данных</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Профиль:</span>
            <span className="summary-value">{summary.profile}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Подключенные аккаунты:</span>
            <span className="summary-value">{summary.accounts}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Черновики:</span>
            <span className="summary-value">{summary.drafts}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Закладки:</span>
            <span className="summary-value">{summary.bookmarks}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Активность:</span>
            <span className="summary-value">{summary.activities} записей</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Размер данных:</span>
            <span className="summary-value">{summary.size}</span>
          </div>
        </div>
      </div>

      <div className="storage-actions">
        <h3>Действия</h3>
        
        <div className="action-group">
          <h4>Экспорт данных</h4>
          <p>Сохраните все ваши данные в файл для резервного копирования</p>
          <button className="action-btn export-btn" onClick={handleExport}>
            Экспортировать данные
          </button>
        </div>

        <div className="action-group">
          <h4>Импорт данных</h4>
          <p>Восстановите данные из ранее экспортированного файла</p>
          <input 
            type="file" 
            accept=".json"
            onChange={(e) => setImportFile(e.target.files[0])}
            style={{ marginBottom: '10px' }}
          />
          <button 
            className="action-btn import-btn" 
            onClick={handleImport}
            disabled={!importFile}
          >
            Импортировать данные
          </button>
        </div>

        <div className="action-group">
          <h4>Очистка данных</h4>
          <p>Удалите все данные из локального хранилища (включая выход из системы)</p>
          <button className="action-btn clear-btn" onClick={handleClearAll}>
            Удалить все данные
          </button>
        </div>
      </div>

      <div className="storage-details">
        <button 
          className="toggle-details-btn"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Скрыть детали' : 'Показать детали данных'}
        </button>

        {showDetails && (
          <div className="details-content">
            <div className="detail-section">
              <h4>Профиль пользователя</h4>
              <pre>{JSON.stringify(userProfile, null, 2)}</pre>
            </div>

            <div className="detail-section">
              <h4>Подключенные аккаунты</h4>
              <pre>{JSON.stringify(connectedAccounts, null, 2)}</pre>
            </div>

            <div className="detail-section">
              <h4>Настройки уведомлений</h4>
              <pre>{JSON.stringify(notifications, null, 2)}</pre>
            </div>

            <div className="detail-section">
              <h4>Настройки безопасности</h4>
              <pre>{JSON.stringify(securitySettings, null, 2)}</pre>
            </div>

            <div className="detail-section">
              <h4>Пользовательские настройки</h4>
              <pre>{JSON.stringify(userPreferences, null, 2)}</pre>
            </div>

            <div className="detail-section">
              <h4>Аналитика</h4>
              <pre>{JSON.stringify(analyticsData, null, 2)}</pre>
            </div>

            <div className="detail-section">
              <h4>Тренды</h4>
              <pre>{JSON.stringify(trendingData, null, 2)}</pre>
            </div>

            <div className="detail-section">
              <h4>Черновики ({draftPosts.length})</h4>
              <pre>{JSON.stringify(draftPosts, null, 2)}</pre>
            </div>

            <div className="detail-section">
              <h4>Закладки ({bookmarks.length})</h4>
              <pre>{JSON.stringify(bookmarks, null, 2)}</pre>
            </div>

            <div className="detail-section">
              <h4>Последняя активность ({recentActivity.length})</h4>
              <pre>{JSON.stringify(recentActivity, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorageManager; 