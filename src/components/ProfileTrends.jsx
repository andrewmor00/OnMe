import React, { useState } from 'react';
import '../App.css';

const ProfileTrends = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock trending data
  const trendingTopics = [
    {
      id: 1,
      title: 'Искусственный интеллект',
      platform: 'Вконтакте',
      mentions: '125.4K',
      growth: '+45%',
      category: 'tech',
      hashtags: ['#AI', '#технологии', '#будущее']
    },
    {
      id: 2,
      title: 'Здоровый образ жизни',
      platform: 'Telegram',
      mentions: '89.2K',
      growth: '+32%',
      category: 'lifestyle',
      hashtags: ['#зож', '#здоровье', '#фитнес']
    },
    {
      id: 3,
      title: 'Криптовалюты',
      platform: 'Дзен',
      mentions: '67.8K',
      growth: '+18%',
      category: 'finance',
      hashtags: ['#крипта', '#биткоин', '#инвестиции']
    },
    {
      id: 4,
      title: 'Путешествия',
      platform: 'Рутуб',
      mentions: '45.6K',
      growth: '+28%',
      category: 'travel',
      hashtags: ['#путешествия', '#отпуск', '#туризм']
    }
  ];

  const trendingHashtags = [
    { tag: '#AI', mentions: '89.2K', growth: '+67%', platform: 'Вконтакте' },
    { tag: '#зож', mentions: '67.4K', growth: '+45%', platform: 'Telegram' },
    { tag: '#крипта', mentions: '45.8K', growth: '+23%', platform: 'Дзен' },
    { tag: '#путешествия', mentions: '34.2K', growth: '+38%', platform: 'Рутуб' },
    { tag: '#технологии', mentions: '28.9K', growth: '+52%', platform: 'Вконтакте' },
    { tag: '#фитнес', mentions: '23.7K', growth: '+41%', platform: 'Telegram' }
  ];

  const contentSuggestions = [
    {
      id: 1,
      title: 'Как ИИ изменит нашу жизнь',
      type: 'video',
      duration: '5-7 мин',
      platform: 'Вконтакте',
      estimatedReach: '45.2K',
      difficulty: 'medium'
    },
    {
      id: 2,
      title: '10 способов вести здоровый образ жизни',
      type: 'article',
      duration: '3-5 мин',
      platform: 'Telegram',
      estimatedReach: '32.1K',
      difficulty: 'easy'
    },
    {
      id: 3,
      title: 'Инвестиции в криптовалюты: с чего начать',
      type: 'video',
      duration: '8-10 мин',
      platform: 'Дзен',
      estimatedReach: '28.7K',
      difficulty: 'hard'
    }
  ];

  const categories = [
    { id: 'all', name: 'Все', count: 12 },
    { id: 'tech', name: 'Технологии', count: 4 },
    { id: 'lifestyle', name: 'Лайфстайл', count: 3 },
    { id: 'finance', name: 'Финансы', count: 2 },
    { id: 'travel', name: 'Путешествия', count: 3 }
  ];

  const filteredTopics = selectedCategory === 'all' 
    ? trendingTopics 
    : trendingTopics.filter(topic => topic.category === selectedCategory);

  return (
    <div className="profile-trends-container">
      {/* Header */}
      <div className="trends-header">
        <h1 className="trends-page-title">Тренды</h1>
        <div className="trends-period">
          <span className="period-label">Период:</span>
          <select className="period-select">
            <option>Сегодня</option>
            <option>Неделя</option>
            <option>Месяц</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="trends-stats">
        <div className="stat-item">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-value">156</div>
            <div className="stat-label">Активных трендов</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-value">+23%</div>
            <div className="stat-label">Рост упоминаний</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">89</div>
            <div className="stat-label">Рекомендаций</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <div className="stat-value">2ч</div>
            <div className="stat-label">Обновление</div>
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="categories-section">
        <div className="categories-tabs">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="trending-section">
        <h3 className="section-title">Популярные темы</h3>
        <div className="trending-grid">
          {filteredTopics.map((topic) => (
            <div key={topic.id} className="trending-card">
              <div className="trending-header">
                <div className="trending-platform">{topic.platform}</div>
                <div className="trending-growth positive">{topic.growth}</div>
              </div>
              <h4 className="trending-title">{topic.title}</h4>
              <div className="trending-stats">
                <span className="mentions">{topic.mentions} упоминаний</span>
              </div>
              <div className="trending-hashtags">
                {topic.hashtags.map((tag, index) => (
                  <span key={index} className="hashtag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Hashtags */}
      <div className="hashtags-section">
        <h3 className="section-title">Популярные хештеги</h3>
        <div className="hashtags-grid">
          {trendingHashtags.map((hashtag, index) => (
            <div key={index} className="hashtag-card">
              <div className="hashtag-header">
                <span className="hashtag-tag">{hashtag.tag}</span>
                <span className="hashtag-growth positive">{hashtag.growth}</span>
              </div>
              <div className="hashtag-stats">
                <span className="hashtag-mentions">{hashtag.mentions}</span>
                <span className="hashtag-platform">{hashtag.platform}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Suggestions */}
      <div className="suggestions-section">
        <h3 className="section-title">Рекомендации контента</h3>
        <div className="suggestions-list">
          {contentSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="suggestion-card">
              <div className="suggestion-header">
                <div className="suggestion-type">{suggestion.type === 'video' ? '🎥' : '📝'}</div>
                <div className="suggestion-info">
                  <h4 className="suggestion-title">{suggestion.title}</h4>
                  <div className="suggestion-meta">
                    <span className="suggestion-duration">{suggestion.duration}</span>
                    <span className="suggestion-platform">{suggestion.platform}</span>
                  </div>
                </div>
                <div className="suggestion-stats">
                  <div className="estimated-reach">
                    <span className="reach-label">Охват:</span>
                    <span className="reach-value">{suggestion.estimatedReach}</span>
                  </div>
                  <div className={`difficulty ${suggestion.difficulty}`}>
                    {suggestion.difficulty === 'easy' ? 'Легко' : 
                     suggestion.difficulty === 'medium' ? 'Средне' : 'Сложно'}
                  </div>
                </div>
              </div>
              <div className="suggestion-actions">
                <button className="action-btn create">Создать</button>
                <button className="action-btn save">Сохранить</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="analysis-section">
        <h3 className="section-title">Анализ трендов</h3>
        <div className="analysis-grid">
          <div className="analysis-card">
            <h4>Время публикации</h4>
            <div className="time-chart">
              <div className="time-bar" style={{ height: '60%' }}></div>
              <div className="time-bar" style={{ height: '80%' }}></div>
              <div className="time-bar" style={{ height: '40%' }}></div>
              <div className="time-bar" style={{ height: '90%' }}></div>
              <div className="time-bar" style={{ height: '70%' }}></div>
              <div className="time-bar" style={{ height: '50%' }}></div>
              <div className="time-bar" style={{ height: '30%' }}></div>
            </div>
            <div className="time-labels">
              <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span>
              <span>Пт</span><span>Сб</span><span>Вс</span>
            </div>
          </div>
          <div className="analysis-card">
            <h4>Популярные форматы</h4>
            <div className="format-stats">
              <div className="format-item">
                <span className="format-icon">🎥</span>
                <span className="format-name">Видео</span>
                <span className="format-percentage">45%</span>
              </div>
              <div className="format-item">
                <span className="format-icon">📝</span>
                <span className="format-name">Статьи</span>
                <span className="format-percentage">32%</span>
              </div>
              <div className="format-item">
                <span className="format-icon">📸</span>
                <span className="format-name">Фото</span>
                <span className="format-percentage">23%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTrends; 