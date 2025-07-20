import React, { useState, useEffect } from 'react';
import StarsProfile from '../img/StarsProfile.png';
import ProfileIcon from '../img/ProfileIcon.png';
import csvDB from '../utils/csvDatabase';
import '../App.css';

const ProfileBloggers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [bloggers, setBloggers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    platform: 'all',
    minSubscribers: '',
    maxSubscribers: '',
    minEngagement: '',
    maxEngagement: '',
    tags: [],
    verified: 'all'
  });
  const [sortBy, setSortBy] = useState('subscribers');
  const [sortOrder, setSortOrder] = useState('desc');
  const cardsPerPage = 6; // Show 6 cards per page (2 rows of 3)

  // Load real data from CSV database
  useEffect(() => {
    const loadBloggersData = () => {
      try {
        // Get users with their stats
        const usersWithStats = csvDB.getUsersWithStats();
        console.log('Raw users with stats:', usersWithStats);
        console.log('Number of users found:', usersWithStats.length);
        
        // Check if we have any data
        if (usersWithStats.length === 0) {
          console.log('No users found in CSV database');
          // Check what's in localStorage
          const rawUsers = csvDB.getAll('users');
          const rawStats = csvDB.getAll('stats');
          console.log('Raw users from localStorage:', rawUsers);
          console.log('Raw stats from localStorage:', rawStats);
          console.log('Users count:', rawUsers.length);
          console.log('Stats count:', rawStats.length);
        }
        
        // Transform CSV data to match the expected format
        const transformedBloggers = usersWithStats.map((user, index) => {
          const stats = user.stats || {};
          const engagementRate = parseFloat(stats.social_rate_engag_02) || 0;
          
          return {
            id: index + 1,
            name: user.channel_name || `Канал ${index + 1}`,
            platform: user.social_type === 'tg' ? 'Телеграм' : 'Вконтакте',
            platformIcon: user.social_type === 'tg' ? 'Telegram' : 'VK',
            subscribers: formatSubscribers(user.social_num_subs),
            engagement: `${engagementRate.toFixed(1)}%`,
            reach: formatReach(user.social_num_subs, engagementRate),
            tags: generateTags(user.channel_info || ''),
            verified: Math.random() > 0.3, // Random verification status
            channelInfo: user.channel_info,
            channelLink: user.channel_link
          };
        });

        console.log('Transformed bloggers:', transformedBloggers);
        
        // If no data from CSV, create some sample data for testing
        if (transformedBloggers.length === 0) {
          console.log('Creating sample data for testing...');
          const sampleBloggers = [
            {
              id: 1,
              name: 'Антистресс для предпринимателей',
              platform: 'Телеграм',
              platformIcon: 'Telegram',
              subscribers: '299',
              engagement: '17.0%',
              reach: '50',
              tags: ['Общее'],
              verified: true,
              channelInfo: 'Антистресс для предпринимателей',
              channelLink: 'https://t.me/antistress'
            },
            {
              id: 2,
              name: 'ДЛЯ ОСНОВАТЕЛЕЙ',
              platform: 'Телеграм',
              platformIcon: 'Telegram',
              subscribers: '25',
              engagement: '22.0%',
              reach: '3',
              tags: ['Коллаборация'],
              verified: false,
              channelInfo: 'Канал для основателей',
              channelLink: 'https://t.me/founders'
            },
            {
              id: 3,
              name: 'Бегин',
              platform: 'Телеграм',
              platformIcon: 'Telegram',
              subscribers: '9',
              engagement: '0.5%',
              reach: '1',
              tags: ['Маркетинг', 'Контент'],
              verified: true,
              channelInfo: 'Маркетинговый канал',
              channelLink: 'https://t.me/begin'
            },
            {
              id: 4,
              name: 'Бизнес Аналитика',
              platform: 'Телеграм',
              platformIcon: 'Telegram',
              subscribers: '1.2K',
              engagement: '8.5%',
              reach: '120',
              tags: ['Бизнес', 'Коллаборация'],
              verified: true,
              channelInfo: 'Бизнес аналитика',
              channelLink: 'https://t.me/business_analytics'
            },
            {
              id: 5,
              name: 'SMM Эксперт',
              platform: 'Вконтакте',
              platformIcon: 'VK',
              subscribers: '850',
              engagement: '12.1%',
              reach: '95',
              tags: ['SMM', 'Коллаборация'],
              verified: false,
              channelInfo: 'SMM эксперт',
              channelLink: 'https://vk.com/smm_expert'
            },
            {
              id: 6,
              name: 'Контент Мастер',
              platform: 'Телеграм',
              platformIcon: 'Telegram',
              subscribers: '2.1K',
              engagement: '6.8%',
              reach: '180',
              tags: ['Контент', 'Маркетинг'],
              verified: true,
              channelInfo: 'Контент маркетинг',
              channelLink: 'https://t.me/content_master'
            }
          ];
          setBloggers(sampleBloggers);
        } else {
          setBloggers(transformedBloggers);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading bloggers data:', error);
        setLoading(false);
      }
    };

    loadBloggersData();
  }, []);

  // Helper functions
  const formatSubscribers = (subs) => {
    const num = parseInt(subs) || 0;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatReach = (subs, engagement) => {
    const num = parseInt(subs) || 0;
    const reach = Math.floor(num * (engagement / 100));
    if (reach >= 1000000) return `${(reach / 1000000).toFixed(1)}M`;
    if (reach >= 1000) return `${(reach / 1000).toFixed(1)}K`;
    return reach.toString();
  };

  const generateTags = (channelInfo) => {
    const tags = [];
    const info = channelInfo.toLowerCase();
    
    if (info.includes('маркетинг') || info.includes('маркетолог')) tags.push('Маркетинг');
    if (info.includes('бизнес') || info.includes('предприниматель')) tags.push('Бизнес');
    if (info.includes('блог') || info.includes('блогер')) tags.push('Блогер');
    if (info.includes('smm') || info.includes('соцсети')) tags.push('SMM');
    if (info.includes('пиар') || info.includes('pr')) tags.push('PR');
    if (info.includes('контент') || info.includes('контент-маркетинг')) tags.push('Контент');
    
    // Add collaboration tag for some channels
    if (Math.random() > 0.5) tags.push('Коллаборация');
    
    return tags.length > 0 ? tags : ['Общее'];
  };

  // Get all available tags for filter options
  const getAllTags = () => {
    const allTags = new Set();
    bloggers.forEach(blogger => {
      blogger.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  };

  // Convert subscriber string back to number for filtering
  const parseSubscribers = (subsStr) => {
    if (!subsStr) return 0;
    const num = subsStr.replace(/[KMB]/g, '');
    const multiplier = subsStr.includes('M') ? 1000000 : subsStr.includes('K') ? 1000 : 1;
    return parseFloat(num) * multiplier;
  };

  // Convert engagement string back to number for filtering
  const parseEngagement = (engStr) => {
    if (!engStr) return 0;
    return parseFloat(engStr.replace('%', ''));
  };

  // Apply filters and sorting
  const applyFiltersAndSort = (bloggersList) => {
    let filtered = bloggersList.filter(blogger => {
      // Search filter
      if (searchQuery && !blogger.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Platform filter
      if (filters.platform !== 'all' && blogger.platform !== filters.platform) {
        return false;
      }

      // Subscriber range filter
      const subs = parseSubscribers(blogger.subscribers);
      if (filters.minSubscribers && subs < parseFloat(filters.minSubscribers)) {
        return false;
      }
      if (filters.maxSubscribers && subs > parseFloat(filters.maxSubscribers)) {
        return false;
      }

      // Engagement range filter
      const engagement = parseEngagement(blogger.engagement);
      if (filters.minEngagement && engagement < parseFloat(filters.minEngagement)) {
        return false;
      }
      if (filters.maxEngagement && engagement > parseFloat(filters.maxEngagement)) {
        return false;
      }

      // Tags filter
      if (filters.tags.length > 0 && !filters.tags.some(tag => blogger.tags.includes(tag))) {
        return false;
      }

      // Verification filter
      if (filters.verified === 'verified' && !blogger.verified) {
        return false;
      }
      if (filters.verified === 'unverified' && blogger.verified) {
        return false;
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'subscribers':
          aValue = parseSubscribers(a.subscribers);
          bValue = parseSubscribers(b.subscribers);
          break;
        case 'engagement':
          aValue = parseEngagement(a.engagement);
          bValue = parseEngagement(b.engagement);
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'platform':
          aValue = a.platform.toLowerCase();
          bValue = b.platform.toLowerCase();
          break;
        default:
          aValue = parseSubscribers(a.subscribers);
          bValue = parseSubscribers(b.subscribers);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const clearFilters = () => {
    setFilters({
      platform: 'all',
      minSubscribers: '',
      maxSubscribers: '',
      minEngagement: '',
      maxEngagement: '',
      tags: [],
      verified: 'all'
    });
    setSearchQuery('');
    setCurrentPage(0);
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'VK':
        return 'VK';
      case 'Rutube':
        return 'RT';
      case 'Telegram':
        return 'TG';
      case 'Dzen':
        return 'DZ';
      default:
        return 'SM';
    }
  };

  const filteredBloggers = applyFiltersAndSort(bloggers);
  const totalPages = Math.ceil(filteredBloggers.length / cardsPerPage);
  const startIndex = currentPage * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentBloggers = filteredBloggers.slice(startIndex, endIndex);

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className="profile-bloggers-container">
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Загрузка данных...
        </div>
      ) : bloggers.length === 0 ? (
        <div className="account-integration-banner">
          <div className="banner-content">
            <div className="banner-left">
              <div className="sparkle-icons">
                <img src={StarsProfile} alt="StarsProfile" className='sparkle-avatar'/>
              </div>
              <div className="banner-text">
                <h3>Импортируйте CSV файлы для просмотра блогеров</h3>
                <p>Загрузите файлы users_df.csv и stats_df.csv для отображения реальных данных</p>
              </div>
            </div>
            <button className="add-account-button" onClick={() => window.location.href = '/csv-manager'}>
              Импортировать данные
            </button>
          </div>
        </div>
      ) : null}

      {/* Search Section */}
      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Введите имя или никнейм"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">Поиск</button>
        </div>
      </div>

      {/* Main Content with Carousel and Filters */}
      <div className="main-content-layout">
        {/* Bloggers Carousel */}
        <div className="bloggers-carousel-section">
          <div className="carousel-container">
            <div className="carousel-header">
              <h3 className="carousel-title">Блогеры</h3>
              <div className="carousel-navigation">
                <button 
                  className="carousel-btn prev-btn" 
                  onClick={prevPage}
                  disabled={currentPage === 0}
                >
                  ‹
                </button>
                <span className="carousel-indicator">
                  {currentPage + 1} / {totalPages}
                </span>
                <button 
                  className="carousel-btn next-btn" 
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                >
                  ›
                </button>
              </div>
            </div>
            
            <div className="bloggers-carousel">
              <div className="bloggers-grid">
                {currentBloggers.map((blogger) => (
                  <div key={blogger.id} className="blogger-card">
                    <div className="blogger-header">
                      <div className="blogger-avatar">
                        <img src={ProfileIcon} alt="ProfileBlogs" className='ProfileBlogs'/>
                      </div>
                      <div className="blogger-info">
                        <div className="blogger-name-row">
                          <span className="blogger-name">{blogger.name}</span>
                          {blogger.verified && <span className="verified-icon">✓</span>}
                        </div>
                        <div className="platform-info">
                          <span className="platform-name">{blogger.platform}</span>
                        </div>
                      </div>
                      <div className="platform-icon-container">
                        <span className="platform-icon">{getPlatformIcon(blogger.platformIcon)}</span>
                      </div>
                    </div>
                    
                    <div className="blogger-statistics">
                      <div className="stat-item">
                        <div className="stat-value">{blogger.subscribers}</div>
                        <div className="stat-label">Подписчики</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-value">{blogger.engagement}</div>
                        <div className="stat-label">Вовлечение</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-value">{blogger.reach}</div>
                        <div className="stat-label">Охват</div>
                      </div>
                    </div>
                    
                    <div className="blogger-tags">
                      {blogger.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className={`tag ${tag === 'Коллаборация' ? 'tag-collaboration' : 'tag-category'}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="filters-panel">
          <h3 className="filters-title">Фильтры</h3>
          <div className="filters-content">
            {/* Platform Filter */}
            <div className="filter-group">
              <label>Платформа:</label>
              <select 
                value={filters.platform} 
                onChange={(e) => setFilters({...filters, platform: e.target.value})}
              >
                <option value="all">Все платформы</option>
                <option value="Вконтакте">Вконтакте</option>
                <option value="Телеграм">Телеграм</option>
              </select>
            </div>

            {/* Subscriber Range */}
            <div className="filter-group">
              <label>Подписчики:</label>
              <div className="range-inputs">
                <input
                  type="number"
                  placeholder="От"
                  value={filters.minSubscribers}
                  onChange={(e) => setFilters({...filters, minSubscribers: e.target.value})}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="До"
                  value={filters.maxSubscribers}
                  onChange={(e) => setFilters({...filters, maxSubscribers: e.target.value})}
                />
              </div>
            </div>

            {/* Engagement Range */}
            <div className="filter-group">
              <label>Вовлечение (%):</label>
              <div className="range-inputs">
                <input
                  type="number"
                  placeholder="От"
                  value={filters.minEngagement}
                  onChange={(e) => setFilters({...filters, minEngagement: e.target.value})}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="До"
                  value={filters.maxEngagement}
                  onChange={(e) => setFilters({...filters, maxEngagement: e.target.value})}
                />
              </div>
            </div>

            {/* Verification Filter */}
            <div className="filter-group">
              <label>Верификация:</label>
              <select 
                value={filters.verified} 
                onChange={(e) => setFilters({...filters, verified: e.target.value})}
              >
                <option value="all">Все</option>
                <option value="verified">Верифицированные</option>
                <option value="unverified">Не верифицированные</option>
              </select>
            </div>

            {/* Tags Filter */}
            <div className="filter-group">
              <label>Теги:</label>
              <div className="tags-filter">
                {getAllTags().map(tag => (
                  <label key={tag} className="tag-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.tags.includes(tag)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({...filters, tags: [...filters.tags, tag]});
                        } else {
                          setFilters({...filters, tags: filters.tags.filter(t => t !== tag)});
                        }
                      }}
                    />
                    {tag}
                  </label>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="sort-section">
              <label>Сортировка:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="subscribers">По подписчикам</option>
                <option value="engagement">По вовлечению</option>
                <option value="name">По имени</option>
                <option value="platform">По платформе</option>
              </select>
              <button 
                className={`sort-order-btn ${sortOrder === 'desc' ? 'desc' : 'asc'}`}
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              >
                {sortOrder === 'desc' ? '↓' : '↑'}
              </button>
            </div>

            {/* Filter Actions */}
            <div className="filter-actions">
              <button className="clear-filters-btn" onClick={clearFilters}>
                Очистить фильтры
              </button>
              <span className="results-count">
                Найдено: {filteredBloggers.length} из {bloggers.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBloggers; 