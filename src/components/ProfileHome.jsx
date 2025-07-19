import React, { useState, useEffect } from 'react';
import { useStorage } from '../context/StorageContext';
import csvDB from '../utils/csvDatabase';
import TelegramLinkModal from './TelegramLinkModal';
import ProfileMan from '../img/ProfileMan.png';
import VK from '../img/VK.png';
import Telegram from '../img/Telegram.png';
import Rutube from '../img/Rutube.png';
import Dzen from '../img/Dzen.png';
import Youtube from '../img/Youtube.png';
import StarsProfile from '../img/StarsProfile.png';
import ProfileFakeInfo from '../img/ProfileFakeInf.png';
import Bell from '../img/Bell.png';
import '../App.css';

const ProfileHome = () => {
  const { 
    connectedAccounts, 
    connectAccount, 
    disconnectAccount,
    // trendingData, 
    analyticsData,
    addActivity 
  } = useStorage();

  const [csvStats, setCsvStats] = useState(null);
  const [topUsers, setTopUsers] = useState([]);
  const [showTelegramModal, setShowTelegramModal] = useState(false);

  useEffect(() => {
    // Load CSV data
    const stats = csvDB.getStatisticsSummary();
    const top = csvDB.getTopUsers(5);
    setCsvStats(stats);
    setTopUsers(top);
  }, []);

  const handleConnectAccount = (platform) => {
    console.log('handleConnectAccount called with platform:', platform);
    if (platform === 'Telegram') {
      console.log('Opening Telegram modal...');
      setShowTelegramModal(true);
    } else {
      const username = `@user_${platform.toLowerCase()}`;
      connectAccount(platform, username, `token_${platform}`);
      addActivity('account_connected', { platform });
    }
  };

  const handleDisconnectAccount = (platform) => {
    console.log('Disconnecting account:', platform);
    disconnectAccount(platform);
    addActivity('account_disconnected', { platform });
  };

  const handleTelegramSuccess = (accountData) => {
    connectAccount(accountData.platform, accountData.username, accountData.phoneNumber);
    addActivity('account_connected', { platform: 'Telegram' });
    setShowTelegramModal(false);
  };

  const getConnectedCount = () => {
    return connectedAccounts.filter(account => account.status === 'connected').length;
  };

  const formatSubscribers = (subs) => {
    const num = parseInt(subs) || 0;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="dashboard-content">
      <h1 className="dashboard-page-title">
        Главная страница
        <div className="header-notifications">
          <button className="notification-btn"><img src={Bell} alt="Bell" /></button>
        </div>
      </h1>
      
      <div className="dashboard-grid">
        {/* Left Content Block - Analytics Overview */}
        <div className="dashboard-card main-card">
          <div className="card-illustration">
            <img src={ProfileMan} alt="Analytics Illustration" className="analytics-illustration-img" />
          </div>
          <div className="card-content">
            {csvStats && csvStats.totalUsers > 0 ? (
              <div>
                <h3>Статистика базы данных</h3>
                <div className="analytics-summary">
                  <div className="stat-item">
                    <span className="stat-number">{csvStats.totalUsers}</span>
                    <span className="stat-label">Блогеров</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{csvStats.totalSubscribers.toLocaleString()}</span>
                    <span className="stat-label">Подписчиков</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{csvStats.totalPosts}</span>
                    <span className="stat-label">Постов</span>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                  Данные загружены из CSV файлов
                </p>
              </div>
            ) : getConnectedCount() > 0 ? (
              <div>
                <h3>Статистика аккаунта</h3>
                <div className="analytics-summary">
                  <div className="stat-item">
                    <span className="stat-number">{analyticsData.totalPosts}</span>
                    <span className="stat-label">Постов</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{analyticsData.totalViews}</span>
                    <span className="stat-label">Просмотров</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{analyticsData.followers}</span>
                    <span className="stat-label">Подписчиков</span>
                  </div>
                </div>
              </div>
            ) : (
              <p>Здесь будут приведены показатели постов, которое вы загрузите последним, и аккаунта в целом.</p>
            )}
            <button className="add-account-btn" onClick={() => window.location.href = '/csv-manager'}>
              {csvStats && csvStats.totalUsers > 0 ? 'Управление данными' : 'Добавить аккаунт'}
            </button>
            <button 
              className="add-account-btn" 
              style={{ marginLeft: '10px', backgroundColor: '#0088cc' }}
              onClick={() => {
                console.log('Test button clicked');
                setShowTelegramModal(true);
              }}
            >
              Test Telegram Modal
            </button>
            <button 
              className="add-account-btn" 
              style={{ marginLeft: '10px', backgroundColor: '#dc3545' }}
              onClick={() => {
                console.log('Force disconnect Telegram');
                disconnectAccount('Telegram');
              }}
            >
              Disconnect Telegram
            </button>
          </div>
        </div>

        {/* Middle Content Block - Account Linking */}
        <div className="dashboard-card account-card">
          <div className="card-header">
            <img src={StarsProfile} alt="Stars" className="sparkle-icon" />
            <h3>Добавьте или привяжите аккаунт, чтобы увидеть статистику</h3>
          </div>
          <p>С помощью нее вы сможете увидеть свои охваты и статистику</p>
          
          <div className="social-accounts">
            {connectedAccounts.map((account, index) => (
              <div key={index} className="social-account">
                <img 
                  src={
                    account.platform === 'Вконтакте' ? VK :
                    account.platform === 'Telegram' ? Telegram :
                    account.platform === 'Рутуб' ? Rutube :
                    account.platform === 'Дзен' ? Dzen :
                    account.platform === 'YouTube' ? Youtube : VK
                  } 
                  alt={account.platform} 
                  className="social-icon-img" 
                />
                <span>{account.platform}</span>
                <button 
                  className={`link-btn ${account.status === 'connected' ? 'connected' : ''}`}
                  onClick={() => {
                    if (account.status === 'connected') {
                      handleDisconnectAccount(account.platform);
                    } else {
                      handleConnectAccount(account.platform);
                    }
                  }}
                >
                  {account.status === 'connected' ? 'Отключить' : 'Привязать'}
                </button>
              </div>
            ))}
          </div>
          
          <p className="note">В будущем будет возможность привязать аккаунты из других соцсетей<br/>Следите за обновлениями!</p>
        </div>

        {/* Right Content Blocks */}
        <div className="dashboard-side-cards">
          <h3>Топ блогеров</h3>
          {/* Top Bloggers */}
          <div className="dashboard-card trends-card">
            <div className="trends-table">
              <div className="trends-header">
                <span>Канал</span>
                <span>Подписчики</span>
              </div>
              {topUsers.length > 0 ? (
                topUsers.map((user, index) => (
                  <div key={index} className="trends-row">
                    <span>{user.channel_name || `Канал ${index + 1}`}</span>
                    <span className="trend-up">{formatSubscribers(user.social_num_subs)}</span>
                  </div>
                ))
              ) : (
                <div className="trends-row">
                  <span>Нет данных</span>
                  <span>-</span>
                </div>
              )}
            </div>
          </div>

          {/* Useful Articles */}
          <div className="dashboard-card articles-card">
            <h3>Полезные статьи</h3>
            <div className="articles-list">
              <div className="article-item">
                <img className="article-thumbnail" src={ProfileFakeInfo} alt="Article thumbnail"/>
                <div className="article-content">
                  <h4>Час пробил: в какое время публиковать посты в разных соцсетях, чтоб «залетели»</h4>
                  <p>Как запрещённые, так и разрешённые в России соцсети кричат начинающему блогеру....</p>
                </div>
              </div>
              <div className="article-item">
                <img className="article-thumbnail" src={ProfileFakeInfo} alt="Article thumbnail"/>
                <div className="article-content">
                  <h4>Час пробил: в какое время публиковать посты в разных соцсетях, чтоб «залетели»</h4>
                  <p>Как запрещённые, так и разрешённые в России соцсети кричат начинающему блогеру....</p>
                </div>
              </div>
              <div className="article-item">
                <img className="article-thumbnail" src={ProfileFakeInfo} alt="Article thumbnail"/>
                <div className="article-content">
                  <h4>Час пробил: в какое время публиковать посты в разных соцсетях, чтоб «залетели»</h4>
                  <p>Как запрещённые, так и разрешённые в России соцсети кричат начинающему блогеру....</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Telegram Link Modal */}
      <TelegramLinkModal
        isOpen={showTelegramModal}
        onClose={() => setShowTelegramModal(false)}
        onSuccess={handleTelegramSuccess}
      />
    </div>
  );
};

export default ProfileHome; 