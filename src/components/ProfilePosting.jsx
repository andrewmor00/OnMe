import React, { useState } from 'react';
import '../App.css';

const ProfilePosting = () => {
  const [selectedTab, setSelectedTab] = useState('scheduled');

  // Mock data for scheduled posts
  const scheduledPosts = [
    {
      id: 1,
      title: 'Как увеличить охваты в соцсетях',
      platform: 'Вконтакте',
      scheduledTime: '2024-01-15 14:30',
      status: 'scheduled',
      image: '📸',
      content: 'Практические советы по увеличению охватов...'
    },
    {
      id: 2,
      title: 'Тренды 2024 года в контенте',
      platform: 'Telegram',
      scheduledTime: '2024-01-15 18:00',
      status: 'scheduled',
      image: '📊',
      content: 'Анализ основных трендов контента...'
    },
    {
      id: 3,
      title: 'Анализ конкурентов: что работает',
      platform: 'Дзен',
      scheduledTime: '2024-01-16 10:00',
      status: 'draft',
      image: '📈',
      content: 'Изучаем стратегии успешных блогеров...'
    }
  ];

  const publishedPosts = [
    {
      id: 4,
      title: 'Секреты успешного контента',
      platform: 'Вконтакте',
      publishedTime: '2024-01-14 15:30',
      likes: '2.4K',
      comments: '156',
      shares: '89',
      reach: '45.2K',
      image: '🎯'
    },
    {
      id: 5,
      title: 'Мотивация для блогеров',
      platform: 'Telegram',
      publishedTime: '2024-01-13 12:00',
      likes: '1.8K',
      comments: '98',
      shares: '67',
      reach: '32.1K',
      image: '💪'
    }
  ];

  const platforms = [
    { name: 'Вконтакте', icon: 'VK', color: '#0077ff' },
    { name: 'Telegram', icon: 'TG', color: '#0088cc' },
    { name: 'Дзен', icon: 'DZ', color: '#ff0000' },
    { name: 'Рутуб', icon: 'RT', color: '#ff0000' }
  ];

  return (
    <div className="profile-posting-container">
      {/* Header */}
      <div className="posting-header">
        <h1 className="posting-page-title">Постинг</h1>
        <button className="new-post-btn">+ Создать пост</button>
      </div>

      {/* Quick Stats */}
      <div className="posting-stats">
        <div className="stat-item">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">12</div>
            <div className="stat-label">Запланировано</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">📤</div>
          <div className="stat-content">
            <div className="stat-value">847</div>
            <div className="stat-label">Опубликовано</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">2.1M</div>
            <div className="stat-label">Общий охват</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <div className="stat-value">14:30</div>
            <div className="stat-label">Следующий пост</div>
          </div>
        </div>
      </div>

      {/* Platform Selection */}
      <div className="platform-selection">
        <h3 className="section-title">Платформы</h3>
        <div className="platform-grid">
          {platforms.map((platform, index) => (
            <div key={index} className="platform-card">
              <div 
                className="platform-icon" 
                style={{ backgroundColor: platform.color }}
              >
                {platform.icon}
              </div>
              <div className="platform-name">{platform.name}</div>
              <div className="platform-status active">Подключено</div>
            </div>
          ))}
        </div>
      </div>

      {/* Posts Tabs */}
      <div className="posts-section">
        <div className="posts-tabs">
          <button 
            className={`tab-btn ${selectedTab === 'scheduled' ? 'active' : ''}`}
            onClick={() => setSelectedTab('scheduled')}
          >
            Запланированные (3)
          </button>
          <button 
            className={`tab-btn ${selectedTab === 'published' ? 'active' : ''}`}
            onClick={() => setSelectedTab('published')}
          >
            Опубликованные (847)
          </button>
          <button 
            className={`tab-btn ${selectedTab === 'drafts' ? 'active' : ''}`}
            onClick={() => setSelectedTab('drafts')}
          >
            Черновики (5)
          </button>
        </div>

        {/* Posts List */}
        <div className="posts-list">
          {selectedTab === 'scheduled' && scheduledPosts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-image">{post.image}</div>
                <div className="post-info">
                  <h4 className="post-title">{post.title}</h4>
                  <div className="post-meta">
                    <span className="post-platform">{post.platform}</span>
                    <span className="post-time">{post.scheduledTime}</span>
                    <span className={`post-status ${post.status}`}>
                      {post.status === 'scheduled' ? 'Запланирован' : 'Черновик'}
                    </span>
                  </div>
                </div>
                <div className="post-actions">
                  <button className="action-btn edit">✏️</button>
                  <button className="action-btn delete">🗑️</button>
                </div>
              </div>
              <div className="post-content">{post.content}</div>
            </div>
          ))}

          {selectedTab === 'published' && publishedPosts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-image">{post.image}</div>
                <div className="post-info">
                  <h4 className="post-title">{post.title}</h4>
                  <div className="post-meta">
                    <span className="post-platform">{post.platform}</span>
                    <span className="post-time">{post.publishedTime}</span>
                  </div>
                </div>
                <div className="post-actions">
                  <button className="action-btn view">👁️</button>
                  <button className="action-btn duplicate">📋</button>
                </div>
              </div>
              <div className="post-stats">
                <div className="stat">
                  <span className="stat-icon">❤️</span>
                  <span className="stat-value">{post.likes}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">💬</span>
                  <span className="stat-value">{post.comments}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">📤</span>
                  <span className="stat-value">{post.shares}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">👁️</span>
                  <span className="stat-value">{post.reach}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Preview */}
      <div className="calendar-section">
        <h3 className="section-title">Календарь публикаций</h3>
        <div className="calendar-preview">
          <div className="calendar-header">
            <button className="calendar-nav">‹</button>
            <span className="calendar-month">Январь 2024</span>
            <button className="calendar-nav">›</button>
          </div>
          <div className="calendar-grid">
            {Array.from({ length: 31 }, (_, i) => (
              <div key={i} className={`calendar-day ${i === 14 ? 'has-post' : ''}`}>
                <span className="day-number">{i + 1}</span>
                {i === 14 && <div className="post-indicator">📝</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePosting; 