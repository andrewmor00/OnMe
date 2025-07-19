import React, { useState, useEffect } from 'react';
import { useStorage } from '../context/StorageContext';
import StorageManager from './StorageManager';
import '../App.css';

const ProfileSettings = () => {
  const { 
    userProfile, 
    updateProfile, 
    notifications, 
    // updateNotifications, 
    toggleNotification,
    securitySettings,
    updateSecuritySetting,
    connectedAccounts,
    connectAccount,
    disconnectAccount,
    addActivity
  } = useStorage();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Initialize form with current profile data
  useEffect(() => {
    setProfileForm({
      name: userProfile.name || '',
      email: userProfile.email || '',
      phone: userProfile.phone || '',
      bio: userProfile.bio || '',
      location: userProfile.location || '',
      website: userProfile.website || ''
    });
  }, [userProfile]);

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const updatedProfile = updateProfile(profileForm);
      if (updatedProfile) {
        setMessage('Профиль успешно обновлен!');
        addActivity('profile_update', { fields: Object.keys(profileForm) });
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountAction = (platform, action) => {
    if (action === 'connect') {
      // Simulate connecting account
      const username = `@user_${platform.toLowerCase()}`;
      connectAccount(platform, username, `token_${platform}`);
      addActivity('account_connected', { platform });
    } else {
      disconnectAccount(platform);
      addActivity('account_disconnected', { platform });
    }
  };

  return (
    <div className="profile-settings-container">
      {/* Header */}
      <div className="settings-header">
        <h1 className="settings-page-title">Настройки</h1>
      </div>

      {/* Settings Tabs */}
      <div className="settings-tabs">
        <button 
          className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Профиль
        </button>
        <button 
          className={`settings-tab ${activeTab === 'accounts' ? 'active' : ''}`}
          onClick={() => setActiveTab('accounts')}
        >
          Аккаунты
        </button>
        <button 
          className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Уведомления
        </button>
        <button 
          className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Безопасность
        </button>
        <button 
          className={`settings-tab ${activeTab === 'storage' ? 'active' : ''}`}
          onClick={() => setActiveTab('storage')}
        >
          Данные
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="settings-content">
          <div className="profile-section">
            <h3 className="section-title">Личная информация</h3>
            <div className="profile-form">
              <div className="avatar-section">
                <div className="avatar-preview">{userProfile.avatar}</div>
                <button className="change-avatar-btn">Изменить фото</button>
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
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Имя</label>
                  <input 
                    type="text" 
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Телефон</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Город</label>
                  <input 
                    type="text" 
                    name="location"
                    value={profileForm.location}
                    onChange={handleProfileInputChange}
                  />
                </div>
                <div className="form-group full-width">
                  <label>О себе</label>
                  <textarea 
                    name="bio"
                    value={profileForm.bio}
                    onChange={handleProfileInputChange}
                    rows={4}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Веб-сайт</label>
                  <input 
                    type="url" 
                    name="website"
                    value={profileForm.website}
                    onChange={handleProfileInputChange}
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  className="save-btn" 
                  onClick={handleSaveProfile}
                  disabled={loading}
                >
                  {loading ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
                <button className="cancel-btn">Отмена</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accounts Tab */}
      {activeTab === 'accounts' && (
        <div className="settings-content">
          <div className="accounts-section">
            <h3 className="section-title">Подключенные аккаунты</h3>
            <div className="accounts-list">
              {connectedAccounts.map((account, index) => (
                <div key={index} className="account-item">
                  <div className="account-info">
                    <div className="account-icon">{account.icon}</div>
                    <div className="account-details">
                      <div className="account-platform">{account.platform}</div>
                      <div className="account-username">{account.username || 'Не подключено'}</div>
                    </div>
                  </div>
                  <div className="account-actions">
                    <span className={`account-status ${account.status}`}>
                      {account.status === 'connected' ? 'Подключено' : 'Отключено'}
                    </span>
                    <button 
                      className="account-btn"
                      onClick={() => handleAccountAction(account.platform, account.status === 'connected' ? 'disconnect' : 'connect')}
                    >
                      {account.status === 'connected' ? 'Отключить' : 'Подключить'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="settings-content">
          <div className="notifications-section">
            <h3 className="section-title">Настройки уведомлений</h3>
            <div className="notifications-list">
              <div className="notification-item">
                <div className="notification-info">
                  <div className="notification-title">Email уведомления</div>
                  <div className="notification-desc">Получать уведомления на email</div>
                </div>
                <label className="toggle">
                  <input 
                    type="checkbox" 
                    checked={notifications.email}
                    onChange={() => toggleNotification('email')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="notification-item">
                <div className="notification-info">
                  <div className="notification-title">Push уведомления</div>
                  <div className="notification-desc">Уведомления в браузере</div>
                </div>
                <label className="toggle">
                  <input 
                    type="checkbox" 
                    checked={notifications.push}
                    onChange={() => toggleNotification('push')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="notification-item">
                <div className="notification-info">
                  <div className="notification-title">SMS уведомления</div>
                  <div className="notification-desc">Уведомления по SMS</div>
                </div>
                <label className="toggle">
                  <input 
                    type="checkbox" 
                    checked={notifications.sms}
                    onChange={() => toggleNotification('sms')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="settings-content">
          <div className="security-section">
            <h3 className="section-title">Безопасность аккаунта</h3>
            <div className="security-list">
              {securitySettings.map((setting, index) => (
                <div key={index} className="security-item">
                  <div className="security-info">
                    <div className="security-title">{setting.name}</div>
                  </div>
                  <label className="toggle">
                    <input 
                      type="checkbox" 
                      checked={setting.enabled}
                      onChange={() => updateSecuritySetting(setting.name, !setting.enabled)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              ))}
            </div>
            
            <div className="password-section">
              <h4>Смена пароля</h4>
              <div className="password-form">
                <div className="form-group">
                  <label>Текущий пароль</label>
                  <input type="password" placeholder="Введите текущий пароль" />
                </div>
                <div className="form-group">
                  <label>Новый пароль</label>
                  <input type="password" placeholder="Введите новый пароль" />
                </div>
                <div className="form-group">
                  <label>Подтвердите пароль</label>
                  <input type="password" placeholder="Повторите новый пароль" />
                </div>
                <button className="change-password-btn">Изменить пароль</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Storage Tab */}
      {activeTab === 'storage' && (
        <div className="settings-content">
          <StorageManager />
        </div>
      )}

      {/* Account Actions */}
      <div className="account-actions-section">
        <h3 className="section-title">Действия с аккаунтом</h3>
        <div className="account-actions-list">
          <button className="action-btn export">Экспорт данных</button>
          <button className="action-btn delete">Удалить аккаунт</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings; 