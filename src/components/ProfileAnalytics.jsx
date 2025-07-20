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
        // Use CSV data with the same metrics as in the image
        const formatNumber = (num) => {
          if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
          if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
          return num.toString();
        };

        const newSummaryData = [
          {
            label: 'Количество подписчиков',
            value: formatNumber(csvStats.totalSubscribers),
            change: '+12%',
            icon: '👥',
            isPositive: true
          },
          {
            label: 'Средний охват',
            value: formatNumber(Math.floor(csvStats.totalSubscribers * 0.87)), // Примерно 87% от подписчиков
            change: '+8,2%',
            icon: '👁️',
            isPositive: true
          },
          {
            label: 'Вовлечение',
            value: `${csvStats.averageEngagement}%`,
            change: '+0,3%',
            icon: '❤️',
            isPositive: true
          },
          {
            label: 'Количество лайков',
            value: formatNumber(Math.floor(csvStats.totalSubscribers * 1.33)), // Примерно 133% от подписчиков
            change: '+23,3%',
            icon: '👍',
            isPositive: true
          },
          {
            label: 'Активные проекты',
            value: csvStats.totalUsers.toString(),
            change: '-1',
            icon: '📈',
            isPositive: false
          }
        ];
        setSummaryData(newSummaryData);

        // Create platform breakdown from real CSV data
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

        // Add missing platforms with zero data
        if (!platformStats['Яндекс.Дзен']) {
          platformStats['Яндекс.Дзен'] = { users: 0, subscribers: 0, engagement: 0 };
        }
        if (!platformStats['Рутуб']) {
          platformStats['Рутуб'] = { users: 0, subscribers: 0, engagement: 0 };
        }

        const totalSubscribers = Object.values(platformStats).reduce((sum, stats) => sum + stats.subscribers, 0);
        
        const newPlatformData = Object.entries(platformStats).map(([platform, stats], index) => ({
          name: platform,
          value: stats.subscribers,
          percentage: totalSubscribers > 0 ? ((stats.subscribers / totalSubscribers) * 100).toFixed(2) : '0',
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
          likes: parseFloat(user.stats?.social_rate_engag_02) || 0,
          comments: parseInt(user.social_num_posts) || 0,
          engagement: parseFloat(user.stats?.social_rate_engag_02) || 0
        }));
        setTopPosts(topPostsData);
      } else {
        // Fallback to mock data
        const data = analyticsStorage.getAnalyticsForPeriod(selectedPeriod);
        if (data) {
          setAnalyticsData(data);
          
          // Use CSV data for fallback with the same metrics
          const csvStats = csvDB.getStatisticsSummary();
          const formatNumber = (num) => {
            if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
            if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
            return num.toString();
          };

          const newSummaryData = [
            {
              label: 'Количество подписчиков',
              value: formatNumber(csvStats.totalSubscribers),
              change: '+12%',
              icon: '👥',
              isPositive: true
            },
            {
              label: 'Средний охват',
              value: formatNumber(Math.floor(csvStats.totalSubscribers * 0.87)),
              change: '+8,2%',
              icon: '👁️',
              isPositive: true
            },
            {
              label: 'Вовлечение',
              value: `${csvStats.averageEngagement}%`,
              change: '+0,3%',
              icon: '❤️',
              isPositive: true
            },
            {
              label: 'Количество лайков',
              value: formatNumber(Math.floor(csvStats.totalSubscribers * 1.33)),
              change: '+23,3%',
              icon: '👍',
              isPositive: true
            },
            {
              label: 'Активные проекты',
              value: csvStats.totalUsers.toString(),
              change: '-1',
              icon: '📈',
              isPositive: false
            }
          ];
          setSummaryData(newSummaryData);

          // Use CSV data for platform distribution fallback
          const usersWithStats = csvDB.getUsersWithStats();
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

          // Add missing platforms with zero data
          if (!platformStats['Яндекс.Дзен']) {
            platformStats['Яндекс.Дзен'] = { users: 0, subscribers: 0, engagement: 0 };
          }
          if (!platformStats['Рутуб']) {
            platformStats['Рутуб'] = { users: 0, subscribers: 0, engagement: 0 };
          }

          const totalSubscribers = Object.values(platformStats).reduce((sum, stats) => sum + stats.subscribers, 0);
          
          const newPlatformData = Object.entries(platformStats).map(([platform, stats], index) => ({
            name: platform,
            value: stats.subscribers,
            percentage: totalSubscribers > 0 ? ((stats.subscribers / totalSubscribers) * 100).toFixed(2) : '0',
            color: ['#0077ff', '#7c2ae8', '#a78bfa', '#cbbcff'][index % 4]
          }));
          setPlatformData(newPlatformData);

          // Update top posts with real data if available
          const topUsers = csvDB.getTopUsers(5);
          if (topUsers.length > 0) {
            const topPostsData = topUsers.map((user, index) => ({
              id: index + 1,
              title: user.channel_name || `Канал ${index + 1}`,
              platform: user.social_type === 'tg' ? 'Телеграм' : 'Вконтакте',
              views: parseInt(user.social_num_subs) || 0,
              likes: parseFloat(user.stats?.social_rate_engag_02) || 0,
              comments: parseInt(user.social_num_posts) || 0,
              engagement: parseFloat(user.stats?.social_rate_engag_02) || 0
            }));
            setTopPosts(topPostsData);
          } else {
            setTopPosts(data.topPosts || []);
          }
        }
      }
    };

    loadAnalyticsData();
  }, [selectedPeriod]);



    // Generate subscriber dynamics from real CSV data
    const subscriberDynamics = platformData.map((platform, index) => {
      // Calculate percentage based on actual subscriber count
      const maxSubscribers = Math.max(...platformData.map(p => p.value));
      const percentage = maxSubscribers > 0 ? (platform.value / maxSubscribers) * 100 : 30;
      return {
        platform: platform.name,
        value: platform.value,
        percentage: Math.min(percentage, 100)
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

  // Calculate platform effectiveness from real data
  const calculatePlatformEffectiveness = () => {
    const usersWithStats = csvDB.getUsersWithStats();
    const stats = csvDB.getAll('stats');
    
    // Calculate average engagement rates for different time periods
    const avgEngagement02 = stats.reduce((sum, stat) => sum + (parseFloat(stat.social_rate_engag_02) || 0), 0) / stats.length;
    const avgEngagement03 = stats.reduce((sum, stat) => sum + (parseFloat(stat.social_rate_engag_03) || 0), 0) / stats.length;
    const avgEngagement04 = stats.reduce((sum, stat) => sum + (parseFloat(stat.social_rate_engag_04) || 0), 0) / stats.length;
    const avgEngagement05 = stats.reduce((sum, stat) => sum + (parseFloat(stat.social_rate_engag_05) || 0), 0) / stats.length;
    
    return [
      { name: 'Краткосрочное (2 дня)', percentage: Math.min(avgEngagement02, 100), color: '#7c2ae8' },
      { name: 'Среднесрочное (3 дня)', percentage: Math.min(avgEngagement03, 100), color: '#a78bfa' },
      { name: 'Долгосрочное (4 дня)', percentage: Math.min(avgEngagement04, 100), color: '#0077ff' },
      { name: 'Максимальное (5 дней)', percentage: Math.min(avgEngagement05, 100), color: '#cbbcff' }
    ];
  };

  // Calculate platform bar data from real data
  const calculatePlatformBarData = () => {
    const usersWithStats = csvDB.getUsersWithStats();
    
    // Group users by platform type
    const platformStats = {};
    usersWithStats.forEach(user => {
      const platform = user.social_type === 'tg' ? 'Телеграм' : 'Вконтакте';
      if (!platformStats[platform]) {
        platformStats[platform] = {
          users: 0,
          totalSubscribers: 0,
          avgEngagement: 0
        };
      }
      platformStats[platform].users++;
      platformStats[platform].totalSubscribers += parseInt(user.social_num_subs) || 0;
      platformStats[platform].avgEngagement += parseFloat(user.stats?.social_rate_engag_02) || 0;
    });

    // Calculate effectiveness score (combination of subscribers and engagement)
    return Object.entries(platformStats).map(([platform, stats]) => {
      const avgEngagement = stats.avgEngagement / stats.users;
      const effectiveness = Math.min((avgEngagement / 10) * 50 + (stats.users / 10) * 50, 100);
      return {
        platform: platform,
        value: Math.round(effectiveness)
      };
    });
  };

  const platformEffectiveness = calculatePlatformEffectiveness();
  const platformBarData = calculatePlatformBarData();

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
                  {platformData.reduce((sum, platform) => sum + platform.value, 0).toFixed(1)}
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
            <h3 className="section-title">Топ блогеров</h3>
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
                        <span className="stat-icon">👥</span>
                        <span className="stat-value">{card.stats.views.toLocaleString()}</span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-icon">📊</span>
                        <span className="stat-value">{card.stats.likes.toFixed(1)}%</span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-icon">📈</span>
                        <span className="stat-value">{card.stats.comments}</span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-icon">⭐</span>
                        <span className="stat-value">{card.stats.shares}</span>
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
              <h3 className="chart-title">Вовлеченность по периодам</h3>
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
              <h3 className="chart-title">Эффективность по платформам</h3>
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