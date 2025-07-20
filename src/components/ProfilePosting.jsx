import React, { useState, useEffect } from 'react';
import '../App.css';
import './ProfilePosting.css';

const ProfilePosting = () => {
  const [selectedTab, setSelectedTab] = useState('scheduled');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarView, setCalendarView] = useState('month'); // month, week, day
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    platform: '',
    publishDate: '',
    publishTime: '',
    mediaFiles: []
  });

  // Mock data for scheduled posts with dates
  const scheduledPosts = [
    {
      id: 1,
      title: 'Как увеличить охваты в соцсетях',
      platform: 'Вконтакте',
      scheduledTime: '2025-01-15 14:30',
      scheduledDate: new Date(2025, 0, 15),
      status: 'scheduled',
      image: '📸',
      content: 'Практические советы по увеличению охватов...'
    },
    {
      id: 2,
      title: 'Тренды 2025 года в контенте',
      platform: 'Telegram',
      scheduledTime: '2025-01-15 18:00',
      scheduledDate: new Date(2025, 0, 15),
      status: 'scheduled',
      image: '📊',
      content: 'Анализ основных трендов контента...'
    },
    {
      id: 3,
      title: 'Анализ конкурентов: что работает',
      platform: 'Дзен',
      scheduledTime: '2025-01-16 10:00',
      scheduledDate: new Date(2025, 0, 16),
      status: 'draft',
      image: '📈',
      content: 'Изучаем стратегии успешных блогеров...'
    },
    {
      id: 4,
      title: 'Секреты успешного контента',
      platform: 'Вконтакте',
      scheduledTime: '2025-01-20 15:30',
      scheduledDate: new Date(2025, 0, 20),
      status: 'scheduled',
      image: '🎯',
      content: 'Практические советы по созданию контента...'
    },
    {
      id: 5,
      title: 'Мотивация для блогеров',
      platform: 'Telegram',
      scheduledTime: '2025-01-25 12:00',
      scheduledDate: new Date(2025, 0, 25),
      status: 'draft',
      image: '💪',
      content: 'Как оставаться мотивированным...'
    }
  ];

  const publishedPosts = [
    {
      id: 6,
      title: 'Секреты успешного контента',
      platform: 'Вконтакте',
      publishedTime: '2025-01-14 15:30',
      publishedDate: new Date(2025, 0, 14),
      likes: '2.4K',
      comments: '156',
      shares: '89',
      reach: '45.2K',
      image: '🎯'
    },
    {
      id: 7,
      title: 'Мотивация для блогеров',
      platform: 'Telegram',
      publishedTime: '2025-01-13 12:00',
      publishedDate: new Date(2025, 0, 13),
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

  // Calendar functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date) => {
    const months = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    return months[date.getMonth()];
  };

  const getDayName = (dayIndex) => {
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return days[dayIndex];
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    if (!selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const hasPosts = (date) => {
    const allPosts = [...scheduledPosts, ...publishedPosts];
    return allPosts.some(post => {
      const postDate = post.scheduledDate || post.publishedDate;
      return postDate.getDate() === date.getDate() &&
             postDate.getMonth() === date.getMonth() &&
             postDate.getFullYear() === date.getFullYear();
    });
  };

  const getPostsForDate = (date) => {
    const allPosts = [...scheduledPosts, ...publishedPosts];
    return allPosts.filter(post => {
      const postDate = post.scheduledDate || post.publishedDate;
      return postDate.getDate() === date.getDate() &&
             postDate.getMonth() === date.getMonth() &&
             postDate.getFullYear() === date.getFullYear();
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleCreatePost = () => {
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setFormData({
      title: '',
      content: '',
      platform: '',
      publishDate: '',
      publishTime: '',
      mediaFiles: []
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      mediaFiles: [...prev.mediaFiles, ...files]
    }));
  };

  const handleSubmit = (e, action) => {
    e.preventDefault();
    if (action === 'publish') {
      // Handle publish logic
      console.log('Publishing post:', formData);
    } else if (action === 'draft') {
      // Handle draft logic
      console.log('Saving draft:', formData);
    }
    handleCloseForm();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      days.push(date);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="profile-posting-container">
      {/* Header */}
      <div className="posting-header">
        <h1 className="posting-page-title">Постинг</h1>
        <button className="new-post-btn" onClick={handleCreatePost}>+ Создать пост</button>
      </div>

      {/* Quick Stats */}
      



      {/* Calendar Section */}
      <div className="calendar-section">
        <div className="calendar-header">
          <h3 className="section-title">Календарь публикаций</h3>
          <div className="calendar-controls">
            <button 
              className="calendar-nav" 
              onClick={() => navigateMonth(-1)}
            >
              ‹
            </button>
            <span className="calendar-month">
              {getMonthName(currentDate)} {currentDate.getFullYear()}
            </span>
            <button 
              className="calendar-nav" 
              onClick={() => navigateMonth(1)}
            >
              ›
            </button>
            <button 
              className="calendar-today-btn"
              onClick={() => setCurrentDate(new Date())}
            >
              Сегодня
            </button>
          </div>
        </div>

        <div className="calendar-container">
          {/* Calendar Grid */}
          <div className="calendar-grid">
            {/* Day headers */}
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="calendar-day-header">
                {getDayName(i)}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((date, index) => (
              <div 
                key={index} 
                className={`calendar-day ${!date ? 'empty' : ''} ${
                  date && isToday(date) ? 'today' : ''
                } ${
                  date && isSelected(date) ? 'selected' : ''
                } ${
                  date && hasPosts(date) ? 'has-posts' : ''
                }`}
                onClick={() => date && handleDateClick(date)}
              >
                {date && (
                  <>
                    <span className="day-number">{date.getDate()}</span>
                    {hasPosts(date) && (
                      <div className="post-indicators">
                        {getPostsForDate(date).map((post, postIndex) => (
                          <div 
                            key={postIndex} 
                            className="post-indicator"
                            title={`${post.title} - ${post.platform}`}
                          >
                            {post.image}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Selected Date Details */}
          {selectedDate && (
            <div className="selected-date-details">
              <h4 className="selected-date-title">
                {selectedDate.toLocaleDateString('ru-RU', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h4>
              <div className="selected-date-posts">
                {getPostsForDate(selectedDate).map((post) => (
                  <div key={post.id} className="selected-date-post">
                    <div className="post-header">
                      <div className="post-image">{post.image}</div>
                      <div className="post-info">
                        <h5 className="post-title">{post.title}</h5>
                        <div className="post-meta">
                          <span className="post-platform">{post.platform}</span>
                          <span className="post-time">
                            {post.scheduledTime || post.publishedTime}
                          </span>
                          <span className={`post-status ${post.status || 'published'}`}>
                            {post.status === 'scheduled' ? 'Запланирован' : 
                             post.status === 'draft' ? 'Черновик' : 'Опубликован'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="post-content">{post.content}</div>
                  </div>
                ))}
                {getPostsForDate(selectedDate).length === 0 && (
                  <div className="no-posts-message">
                    На эту дату запланированных постов нет
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Create Post Modal */}
      {showCreateForm && (
        <div className="create-post-modal">
          <div className="modal-overlay" onClick={handleCloseForm}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Создание поста</h2>
              <button className="modal-close" onClick={handleCloseForm}>×</button>
            </div>
            
            <form className="create-post-form">
              {/* Title */}
              <div className="form-group">
                <label htmlFor="title">Заголовок</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Введите заголовок поста"
                  className="form-input"
                />
              </div>

              {/* Content */}
              <div className="form-group">
                <label htmlFor="content">Содержание</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Напишите содержание поста"
                  className="form-textarea"
                  rows="6"
                />
              </div>

              {/* Platform and Date Row */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="platform">Платформа</label>
                  <select
                    id="platform"
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Выберите платформу</option>
                    {platforms.map((platform, index) => (
                      <option key={index} value={platform.name}>
                        {platform.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="publishDate">Дата публикации</label>
                  <input
                    type="date"
                    id="publishDate"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="publishTime">Время публикации</label>
                  <input
                    type="time"
                    id="publishTime"
                    name="publishTime"
                    value={formData.publishTime}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Media Files */}
              <div className="form-group">
                <label>Медиа файлы</label>
                <div className="file-upload-area">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="file-input"
                    id="mediaFiles"
                  />
                  <label htmlFor="mediaFiles" className="file-upload-label">
                    <div className="upload-icon">↑</div>
                    <div className="upload-text">
                      Перетащите файлы сюда или нажмите для выбора
                    </div>
                  </label>
                </div>
                {formData.mediaFiles.length > 0 && (
                  <div className="uploaded-files">
                    {formData.mediaFiles.map((file, index) => (
                      <div key={index} className="uploaded-file">
                        <span className="file-name">{file.name}</span>
                        <button
                          type="button"
                          className="remove-file"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              mediaFiles: prev.mediaFiles.filter((_, i) => i !== index)
                            }));
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-publish"
                  onClick={(e) => handleSubmit(e, 'publish')}
                >
                  Опубликовать
                </button>
                <button
                  type="button"
                  className="btn-draft"
                  onClick={(e) => handleSubmit(e, 'draft')}
                >
                  Черновик
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePosting; 