import React, { useState, useEffect } from 'react';
import { analyticsStorage } from '../utils/localStorage';
import csvDB from '../utils/csvDatabase';
import '../App.css';

const ProfileAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [summaryData, setSummaryData] = useState([]);
  const [platformData, setPlatformData] = useState([]);
  const [topPosts, setTopPosts] = useState([]);

  // Load analytics data when period changes
  useEffect(() => {
    const loadAnalyticsData = () => {
      // Try to get real data from CSV first
      const csvStats = csvDB.getStatisticsSummary();
      const usersWithStats = csvDB.getUsersWithStats();
      
      if (csvStats.totalUsers > 0) {
        // Use real CSV data
        const newSummaryData = [
          {
            label: 'Количество блогеров',
            value: csvStats.totalUsers.toLocaleString(),
            change: '+0%',
            icon: '👥',
            isPositive: true
          },
          {
            label: 'Общее количество подписчиков',
            value: csvStats.totalSubscribers.toLocaleString(),
            change: '+0%',
            icon: '👁️',
            isPositive: true
          },
          {
            label: 'Среднее вовлечение',
            value: `${csvStats.averageEngagement}%`,
            change: '+0%',
            icon: '❤️',
            isPositive: true
          },
          {
            label: 'Количество комментариев',
            value: csvStats.totalComments.toLocaleString(),
            change: '+0%',
            icon: '👍',
            isPositive: true
          },
          {
            label: 'Количество постов',
            value: csvStats.totalPosts.toLocaleString(),
            change: '+0%',
            icon: '📈',
            isPositive: true
          }
        ];
        setSummaryData(newSummaryData);

        // Create platform breakdown from real data
        const platformStats = {};
        usersWithStats.forEach(user => {
          const platform = user.social_type === 'tg' ? 'Телеграм' : 'Вконтакте';
          if (!platformStats[platform]) {
            platformStats[platform] = {
              users: 0,
              subscribers: 0,
              engagement: 0
            };
          }
          platformStats[platform].users++;
          platformStats[platform].subscribers += parseInt(user.social_num_subs) || 0;
          platformStats[platform].engagement += parseFloat(user.stats?.social_rate_engag_02) || 0;
        });

        const newPlatformData = Object.entries(platformStats).map(([platform, stats], index) => ({
          name: platform,
          value: stats.subscribers,
          percentage: ((stats.subscribers / csvStats.totalSubscribers) * 100).toFixed(2),
          color: ['#0077ff', '#7c2ae8', '#a78bfa', '#cbbcff'][index % 4]
        }));
        setPlatformData(newPlatformData);

        // Create top users as "posts"
        const topUsers = csvDB.getTopUsers(5);
        const topPostsData = topUsers.map((user, index) => ({
          id: index + 1,
          title: user.channel_name || `Канал ${index + 1}`,
          platform: user.social_type === 'tg' ? 'Телеграм' : 'Вконтакте',
          views: parseInt(user.social_num_subs) || 0,
          likes: Math.floor((parseInt(user.social_num_subs) || 0) * 0.1),
          comments: Math.floor((parseInt(user.social_num_subs) || 0) * 0.05),
          engagement: parseFloat(user.stats?.social_rate_engag_02) || 0
        }));
        setTopPosts(topPostsData);
      } else {
        // Fallback to mock data
        const data = analyticsStorage.getAnalyticsForPeriod(selectedPeriod);
        if (data) {
          setAnalyticsData(data);
          
          // Update summary data
          const summary = data.summary;
          const newSummaryData = [
            {
              label: 'Количество подписчиков',
              value: summary.followers.toLocaleString(),
              change: '+12%',
              icon: '👥',
              isPositive: true
            },
            {
              label: 'Средний охват',
              value: summary.reach.toLocaleString(),
              change: '+8,2%',
              icon: '👁️',
              isPositive: true
            },
            {
              label: 'Вовлечение',
              value: `${summary.engagementRate}%`,
              change: '+0,3%',
              icon: '❤️',
              isPositive: true
            },
            {
              label: 'Количество лайков',
              value: summary.totalLikes.toLocaleString(),
              change: '+23,3%',
              icon: '👍',
              isPositive: true
            },
            {
              label: 'Активные проекты',
              value: summary.totalPosts.toString(),
              change: '-1',
              icon: '📈',
              isPositive: false
            }
          ];
          setSummaryData(newSummaryData);

          // Update platform data
          const platformBreakdown = data.platformBreakdown;
          const newPlatformData = platformBreakdown.map((platform, index) => ({
            name: platform.platform,
            value: platform.views,
            percentage: ((platform.views / summary.totalViews) * 100).toFixed(2),
            color: ['#0077ff', '#7c2ae8', '#a78bfa', '#cbbcff'][index % 4]
          }));
          setPlatformData(newPlatformData);

          // Update top posts
          setTopPosts(data.topPosts || []);
        }
      }
    };

    loadAnalyticsData();
  }, [selectedPeriod]);



    // Generate subscriber dynamics with balanced heights
    const subscriberDynamics = platformData.map((platform, index) => {
      // Use predefined heights that look good visually
      const predefinedHeights = [85, 75, 65, 45, 35]; // Вконтакте, Telegram, Дзен, Рутуб, YouTube
      return {
        platform: platform.name,
        value: platform.value,
        percentage: predefinedHeights[index] || 30
      };
    });

    // Convert top posts to blogger cards format
  const bloggerCards = topPosts.map((post, index) => ({
    id: post.id || index + 1,
    title: post.title,
    platform: post.platform,
    platformIcon: post.platform === 'Вконтакте' ? '💙' : 
                  post.platform === 'Telegram' ? '✈️' : 
                  post.platform === 'Дзен' ? '🔍' : 
                  post.platform === 'Рутуб' ? '📺' : '📱',
    stats: {
      likes: post.likes,
      shares: Math.floor(post.likes * 0.1), // Estimate shares
      comments: post.comments,
      views: post.views
    }
  }));

  const platformEffectiveness = [
    { name: 'Изображение', percentage: 83.81, color: '#7c2ae8' },
    { name: 'Текст', percentage: 70.71, color: '#a78bfa' },
    { name: 'Видео', percentage: 62.73, color: '#0077ff' },
    { name: 'Карусель', percentage: 47.3, color: '#cbbcff' }
  ];

  const platformBarData = [
    { platform: 'Вконтакте', value: 56 },
    { platform: 'Телеграм', value: 56 },
    { platform: 'Рутуб', value: 99 },
    { platform: 'Яндекс.Дзен', value: 50 }
  ];

  return (
    <div className="profile-analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <h1 className="analytics-page-title">Аналитика</h1>
        <div className="period-selector">
          <button 
            className={`period-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('week')}
          >
            Неделя
          </button>
          <button 
            className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('month')}
          >
            Месяц
          </button>
          <button 
            className={`period-btn ${selectedPeriod === 'year' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('year')}
          >
            Год
          </button>
        </div>
      </div>

      {/* Summary Section */}
      <div className="summary-section">
        <h2 className="summary-title">
          Общая сводка за {selectedPeriod === 'week' ? 'неделю' : selectedPeriod === 'month' ? 'месяц' : 'год'}
        </h2>
        <div className="summary-grid">
          {summaryData.map((item, index) => (
            <div key={index} className="summary-card">
              <div className="summary-icon">{item.icon}</div>
              <div className="summary-content">
                <div className="summary-label">{item.label}</div>
                <div className="summary-value">{item.value}</div>
                <div className={`summary-change ${item.isPositive ? 'positive' : 'negative'}`}>
                  {item.isPositive ? '↗' : '↘'} {item.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">

        {/* Subscriber Dynamics Chart */}
        <div className="chart-container">
          <h3 className="chart-title">Динамика подписчиков</h3>
          <div className="bar-chart-container">
            <div className="bar-chart">
              {subscriberDynamics.map((platform, index) => (
                <div key={index} className="bar-item">
                  <div className="bar-wrapper">
                    <div className="bar">
                      <div 
                        className="bar-segment bar-segment-light" 
                        style={{ height: `${platform.percentage}%` }}
                      ></div>
                      <div 
                        className="bar-segment bar-segment-purple" 
                        style={{ height: `${platform.platform === 'Вконтакте' ? 85 : platform.platform === 'Телеграм' ? 75 : platform.platform === 'Рутуб' ? 72 : 52}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="bar-label">{platform.platform}</div>
                </div>
              ))}
            </div>
            <div className="bar-chart-y-axis">
              <div className="y-label">100%</div>
              <div className="y-label">75%</div>
              <div className="y-label">50%</div>
              <div className="y-label">25%</div>
              <div className="y-label">0%</div>
            </div>
          </div>
        </div>

        {/* Platform Distribution Chart */}
        <div className="chart-container">
          <h3 className="chart-title">Распределение по платформам</h3>
          <div className="donut-chart-container">
            <div className="donut-chart">
              <div className="donut-center">
                <span className="donut-value">
                  {analyticsData?.summary?.totalViews ? 
                    (analyticsData.summary.totalViews / 1000).toFixed(1) + 'k' : 
                    '0'
                  }
                </span>
              </div>
              <svg className="donut-svg" viewBox="0 0 100 100">
                {platformData.map((platform, index) => {
                  const total = platformData.reduce((sum, p) => sum + parseFloat(p.percentage), 0);
                  const startAngle = platformData.slice(0, index).reduce((sum, p) => sum + (parseFloat(p.percentage) / total) * 360, 0);
                  const angle = (parseFloat(platform.percentage) / total) * 360;
                  const x1 = 50 + 35 * Math.cos((startAngle - 90) * Math.PI / 180);
                  const y1 = 50 + 35 * Math.sin((startAngle - 90) * Math.PI / 180);
                  const x2 = 50 + 35 * Math.cos((startAngle + angle - 90) * Math.PI / 180);
                  const y2 = 50 + 35 * Math.sin((startAngle + angle - 90) * Math.PI / 180);
                  const largeArcFlag = angle > 180 ? 1 : 0;
                  
                  return (
                    <path
                      key={index}
                      d={`M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={platform.color}
                    />
                  );
                })}
              </svg>
            </div>
            <div className="donut-legend">
              {platformData.map((platform, index) => (
                <div key={index} className="legend-item">
                  <div 
                    className="legend-color" 
                    style={{ backgroundColor: platform.color }}
                  ></div>
                  <div className="legend-content">
                    <div className="legend-name">{platform.name}</div>
                    <div className="legend-value">{platform.value} {platform.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Analytics Block */}
      <div className="analytics-block-section">
        <div className="analytics-block-layout">
          {/* Left Section: Blogger Cards List */}
          <div className="blogger-cards-section">
            <h3 className="section-title">Популярные посты</h3>
            <div className="blogger-cards-list">
              {bloggerCards.map((card) => (
                <div key={card.id} className="blogger-card-item">
                  <div className="card-content">
                    <h4 className="card-title">{card.title}</h4>
                    <div className="card-platform">
                      <span className="platform-icon-small">{card.platformIcon}</span>
                      <span className="platform-name-small">{card.platform}</span>
                    </div>
                    <div className="card-stats">
                      <div className="stat-row">
                        <span className="stat-icon">❤️</span>
                        <span className="stat-value">{card.stats.likes}</span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-icon">📤</span>
                        <span className="stat-value">{card.stats.shares}</span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-icon">💬</span>
                        <span className="stat-value">{card.stats.comments}</span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-icon">👁️</span>
                        <span className="stat-value">{card.stats.views.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section: Charts */}
          <div className="charts-right-section">
            {/* Pie Chart */}
            <div className="chart-card">
              <h3 className="chart-title">Эффективность платформы</h3>
              <div className="pie-chart-container">
                <div className="pie-chart">
                  <svg viewBox="0 0 100 100" className="pie-svg">
                    {platformEffectiveness.map((item, index) => {
                      const total = platformEffectiveness.reduce((sum, p) => sum + p.percentage, 0);
                      const startAngle = platformEffectiveness.slice(0, index).reduce((sum, p) => sum + (p.percentage / total) * 360, 0);
                      const angle = (item.percentage / total) * 360;
                      const x1 = 50 + 35 * Math.cos((startAngle - 90) * Math.PI / 180);
                      const y1 = 50 + 35 * Math.sin((startAngle - 90) * Math.PI / 180);
                      const x2 = 50 + 35 * Math.cos((startAngle + angle - 90) * Math.PI / 180);
                      const y2 = 50 + 35 * Math.sin((startAngle + angle - 90) * Math.PI / 180);
                      const largeArcFlag = angle > 180 ? 1 : 0;
                      
                      return (
                        <path
                          key={index}
                          d={`M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                          fill={item.color}
                        />
                      );
                    })}
                  </svg>
                </div>
                <div className="pie-legend">
                  {platformEffectiveness.map((item, index) => (
                    <div key={index} className="legend-item">
                      <div 
                        className="legend-dot" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="legend-text">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="chart-card">
              <h3 className="chart-title">Эффективность платформы</h3>
              <div className="effectiveness-bar-chart">
                <div className="bar-chart-y-axis">
                  <div className="y-label">100</div>
                  <div className="y-label">80</div>
                  <div className="y-label">60</div>
                  <div className="y-label">40</div>
                  <div className="y-label">20</div>
                  <div className="y-label">0</div>
                </div>
                <div className="bar-chart-bars">
                  {platformBarData.map((platform, index) => (
                    <div key={index} className="bar-chart-item">
                      <div className="bar-container">
                        <div 
                          className="effectiveness-bar" 
                          style={{ height: `${platform.value}%` }}
                        ></div>
                      </div>
                      <div className="bar-label">{platform.platform}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAnalytics; 