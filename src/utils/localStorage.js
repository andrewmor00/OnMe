// Local Storage Utility for OnMyFeed Application

// Storage Keys
const STORAGE_KEYS = {
  USER: 'onmyfeed_user',
  AUTH_TOKEN: 'onmyfeed_auth_token',
  USERS_DATABASE: 'onmyfeed_users_database',
  USER_PROFILE: 'onmyfeed_user_profile',
  CONNECTED_ACCOUNTS: 'onmyfeed_connected_accounts',
  NOTIFICATIONS: 'onmyfeed_notifications',
  SECURITY_SETTINGS: 'onmyfeed_security_settings',
  ANALYTICS_DATA: 'onmyfeed_analytics_data',
  TRENDING_DATA: 'onmyfeed_trending_data',
  USER_PREFERENCES: 'onmyfeed_user_preferences',
  THEME: 'onmyfeed_theme',
  LANGUAGE: 'onmyfeed_language',
  RECENT_ACTIVITY: 'onmyfeed_recent_activity',
  DRAFT_POSTS: 'onmyfeed_draft_posts',
  BOOKMARKS: 'onmyfeed_bookmarks'
};

// Default values
const DEFAULT_VALUES = {
  user: null,
  authToken: null,
  userProfile: {
    name: '',
    email: '',
    phone: '',
    bio: '',
    avatar: '👤',
    location: '',
    website: '',
    createdAt: null,
    lastLogin: null
  },
  connectedAccounts: [
    {
      platform: 'Вконтакте',
      username: '',
      status: 'disconnected',
      icon: 'VK',
      accessToken: null
    },
    {
      platform: 'Telegram',
      username: '',
      status: 'disconnected',
      icon: 'TG',
      accessToken: null
    },
    {
      platform: 'Дзен',
      username: '',
      status: 'disconnected',
      icon: 'DZ',
      accessToken: null
    },
    {
      platform: 'Рутуб',
      username: '',
      status: 'disconnected',
      icon: 'RT',
      accessToken: null
    },
    {
      platform: 'YouTube',
      username: '',
      status: 'disconnected',
      icon: 'YT',
      accessToken: null
    }
  ],
  notifications: {
    email: true,
    push: false,
    sms: false,
    newFollowers: true,
    comments: true,
    likes: true,
    mentions: true
  },
  securitySettings: [
    { name: 'Двухфакторная аутентификация', enabled: false },
    { name: 'Уведомления о входе', enabled: true },
    { name: 'Автоматический выход', enabled: false },
    { name: 'Резервное копирование', enabled: true }
  ],
  analyticsData: {
    week: {
      summary: {
        totalPosts: 12,
        totalViews: 15420,
        totalLikes: 892,
        totalComments: 234,
        followers: 1247,
        engagementRate: 7.3,
        reach: 23450,
        shares: 156,
        saves: 89
      },
      dailyData: [
        { date: '2024-01-15', posts: 2, views: 2100, likes: 145, comments: 32, followers: 15 },
        { date: '2024-01-16', posts: 1, views: 1850, likes: 98, comments: 28, followers: 12 },
        { date: '2024-01-17', posts: 3, views: 3200, likes: 234, comments: 45, followers: 28 },
        { date: '2024-01-18', posts: 2, views: 1950, likes: 112, comments: 31, followers: 18 },
        { date: '2024-01-19', posts: 1, views: 1680, likes: 89, comments: 25, followers: 10 },
        { date: '2024-01-20', posts: 2, views: 2340, likes: 156, comments: 38, followers: 22 },
        { date: '2024-01-21', posts: 1, views: 2300, likes: 58, comments: 35, followers: 15 }
      ],
      platformBreakdown: [
        { platform: 'Вконтакте', posts: 5, views: 6800, likes: 456, comments: 98, followers: 45 },
        { platform: 'Telegram', posts: 3, views: 4200, likes: 234, comments: 67, followers: 32 },
        { platform: 'Дзен', posts: 2, views: 2800, likes: 134, comments: 45, followers: 28 },
        { platform: 'Рутуб', posts: 1, views: 1200, likes: 45, comments: 12, followers: 8 },
        { platform: 'YouTube', posts: 1, views: 420, likes: 23, comments: 12, followers: 5 }
      ],
      topPosts: [
        { id: 1, title: 'Как создать качественный контент', platform: 'Вконтакте', views: 3200, likes: 234, comments: 45, engagement: 8.7 },
        { id: 2, title: 'Секреты успешного блогера', platform: 'Telegram', views: 2800, likes: 198, comments: 38, engagement: 8.4 },
        { id: 3, title: 'Тренды 2024 года', platform: 'Дзен', views: 2100, likes: 156, comments: 29, engagement: 8.9 }
      ],
      audienceDemographics: {
        ageGroups: [
          { age: '18-24', percentage: 35 },
          { age: '25-34', percentage: 42 },
          { age: '35-44', percentage: 18 },
          { age: '45+', percentage: 5 }
        ],
        gender: [
          { gender: 'Женщины', percentage: 68 },
          { gender: 'Мужчины', percentage: 32 }
        ],
        locations: [
          { city: 'Москва', percentage: 45 },
          { city: 'Санкт-Петербург', percentage: 28 },
          { city: 'Новосибирск', percentage: 12 },
          { city: 'Другие', percentage: 15 }
        ]
      }
    },
    month: {
      summary: {
        totalPosts: 48,
        totalViews: 67890,
        totalLikes: 3456,
        totalComments: 892,
        followers: 5234,
        engagementRate: 6.8,
        reach: 98760,
        shares: 678,
        saves: 445
      },
      weeklyData: [
        { week: '1', posts: 12, views: 15420, likes: 892, comments: 234, followers: 1247 },
        { week: '2', posts: 11, views: 14230, likes: 756, comments: 198, followers: 1156 },
        { week: '3', posts: 13, views: 16890, likes: 987, comments: 245, followers: 1345 },
        { week: '4', posts: 12, views: 21350, likes: 821, comments: 215, followers: 1486 }
      ],
      platformBreakdown: [
        { platform: 'Вконтакте', posts: 20, views: 28900, likes: 1456, comments: 356, followers: 189 },
        { platform: 'Telegram', posts: 12, views: 18900, likes: 987, comments: 234, followers: 145 },
        { platform: 'Дзен', posts: 8, views: 12300, likes: 567, comments: 178, followers: 98 },
        { platform: 'Рутуб', posts: 5, views: 5200, likes: 234, comments: 78, followers: 45 },
        { platform: 'YouTube', posts: 3, views: 2590, likes: 212, comments: 46, followers: 23 }
      ],
      topPosts: [
        { id: 1, title: 'Полное руководство по SMM', platform: 'Вконтакте', views: 8900, likes: 567, comments: 123, engagement: 7.8 },
        { id: 2, title: 'Как увеличить охват постов', platform: 'Telegram', views: 7200, likes: 445, comments: 98, engagement: 7.6 },
        { id: 3, title: 'Алгоритмы соцсетей 2024', platform: 'Дзен', views: 6100, likes: 389, comments: 87, engagement: 7.9 },
        { id: 4, title: 'Контент-план на месяц', platform: 'Вконтакте', views: 5800, likes: 345, comments: 76, engagement: 7.4 },
        { id: 5, title: 'Монетизация блога', platform: 'Telegram', views: 5200, likes: 298, comments: 65, engagement: 7.1 }
      ],
      audienceDemographics: {
        ageGroups: [
          { age: '18-24', percentage: 32 },
          { age: '25-34', percentage: 45 },
          { age: '35-44', percentage: 20 },
          { age: '45+', percentage: 3 }
        ],
        gender: [
          { gender: 'Женщины', percentage: 72 },
          { gender: 'Мужчины', percentage: 28 }
        ],
        locations: [
          { city: 'Москва', percentage: 42 },
          { city: 'Санкт-Петербург', percentage: 31 },
          { city: 'Новосибирск', percentage: 14 },
          { city: 'Екатеринбург', percentage: 8 },
          { city: 'Другие', percentage: 5 }
        ]
      }
    },
    year: {
      summary: {
        totalPosts: 576,
        totalViews: 823450,
        totalLikes: 45678,
        totalComments: 12345,
        followers: 45678,
        engagementRate: 7.1,
        reach: 1234567,
        shares: 8901,
        saves: 5678
      },
      monthlyData: [
        { month: 'Январь', posts: 48, views: 67890, likes: 3456, comments: 892, followers: 5234 },
        { month: 'Февраль', posts: 52, views: 72340, likes: 3890, comments: 987, followers: 5890 },
        { month: 'Март', posts: 49, views: 68920, likes: 3678, comments: 923, followers: 5456 },
        { month: 'Апрель', posts: 55, views: 78910, likes: 4234, comments: 1123, followers: 6234 },
        { month: 'Май', posts: 51, views: 72340, likes: 3890, comments: 987, followers: 5890 },
        { month: 'Июнь', posts: 47, views: 65430, likes: 3456, comments: 876, followers: 5123 },
        { month: 'Июль', posts: 53, views: 75670, likes: 4123, comments: 1056, followers: 6123 },
        { month: 'Август', posts: 50, views: 71230, likes: 3789, comments: 945, followers: 5678 },
        { month: 'Сентябрь', posts: 54, views: 78920, likes: 4234, comments: 1123, followers: 6234 },
        { month: 'Октябрь', posts: 48, views: 67890, likes: 3456, comments: 892, followers: 5234 },
        { month: 'Ноябрь', posts: 52, views: 72340, likes: 3890, comments: 987, followers: 5890 },
        { month: 'Декабрь', posts: 49, views: 68920, likes: 3678, comments: 923, followers: 5456 }
      ],
      platformBreakdown: [
        { platform: 'Вконтакте', posts: 240, views: 345600, likes: 18901, comments: 5123, followers: 18901 },
        { platform: 'Telegram', posts: 144, views: 226800, likes: 12345, comments: 3456, followers: 12345 },
        { platform: 'Дзен', posts: 96, views: 147600, likes: 8234, comments: 2345, followers: 8234 },
        { platform: 'Рутуб', posts: 60, views: 62400, likes: 3456, comments: 987, followers: 3456 },
        { platform: 'YouTube', posts: 36, views: 41050, likes: 2742, comments: 434, followers: 2742 }
      ],
      topPosts: [
        { id: 1, title: 'Годовой обзор SMM трендов', platform: 'Вконтакте', views: 45600, likes: 2345, comments: 567, engagement: 6.4 },
        { id: 2, title: 'Как стать успешным блогером', platform: 'Telegram', views: 38900, likes: 1987, comments: 456, engagement: 6.3 },
        { id: 3, title: 'Секреты вирусного контента', platform: 'Дзен', views: 32400, likes: 1678, comments: 389, engagement: 6.4 },
        { id: 4, title: 'Монетизация в соцсетях', platform: 'Вконтакте', views: 29800, likes: 1543, comments: 345, engagement: 6.3 },
        { id: 5, title: 'Алгоритмы и продвижение', platform: 'Telegram', views: 26700, likes: 1389, comments: 312, engagement: 6.4 },
        { id: 6, title: 'Контент-стратегия года', platform: 'Дзен', views: 23400, likes: 1234, comments: 278, engagement: 6.5 },
        { id: 7, title: 'Инструменты для SMM', platform: 'Вконтакте', views: 21200, likes: 1123, comments: 245, engagement: 6.4 },
        { id: 8, title: 'Аналитика и метрики', platform: 'Telegram', views: 18900, likes: 987, comments: 223, engagement: 6.4 },
        { id: 9, title: 'Работа с аудиторией', platform: 'Дзен', views: 16700, likes: 876, comments: 198, engagement: 6.5 },
        { id: 10, title: 'Брендинг в соцсетях', platform: 'Вконтакте', views: 14500, likes: 765, comments: 178, engagement: 6.5 }
      ],
      audienceDemographics: {
        ageGroups: [
          { age: '18-24', percentage: 28 },
          { age: '25-34', percentage: 48 },
          { age: '35-44', percentage: 21 },
          { age: '45+', percentage: 3 }
        ],
        gender: [
          { gender: 'Женщины', percentage: 75 },
          { gender: 'Мужчины', percentage: 25 }
        ],
        locations: [
          { city: 'Москва', percentage: 38 },
          { city: 'Санкт-Петербург', percentage: 35 },
          { city: 'Новосибирск', percentage: 16 },
          { city: 'Екатеринбург', percentage: 11 }
        ]
      },
      growthMetrics: {
        followersGrowth: [
          { month: 'Январь', growth: 5234, percentage: 0 },
          { month: 'Февраль', growth: 656, percentage: 12.5 },
          { month: 'Март', growth: -434, percentage: -7.4 },
          { month: 'Апрель', growth: 778, percentage: 14.3 },
          { month: 'Май', growth: -338, percentage: -5.4 },
          { month: 'Июнь', growth: -767, percentage: -13.0 },
          { month: 'Июль', growth: 1000, percentage: 19.5 },
          { month: 'Август', growth: -445, percentage: -7.3 },
          { month: 'Сентябрь', growth: 556, percentage: 10.8 },
          { month: 'Октябрь', growth: -1000, percentage: -16.0 },
          { month: 'Ноябрь', growth: 656, percentage: 12.5 },
          { month: 'Декабрь', growth: -434, percentage: -7.4 }
        ],
        engagementTrends: [
          { month: 'Январь', rate: 6.8 },
          { month: 'Февраль', rate: 7.2 },
          { month: 'Март', rate: 6.9 },
          { month: 'Апрель', rate: 7.5 },
          { month: 'Май', rate: 7.1 },
          { month: 'Июнь', rate: 6.7 },
          { month: 'Июль', rate: 7.8 },
          { month: 'Август', rate: 7.3 },
          { month: 'Сентябрь', rate: 7.6 },
          { month: 'Октябрь', rate: 6.8 },
          { month: 'Ноябрь', rate: 7.2 },
          { month: 'Декабрь', rate: 6.9 }
        ]
      }
    },
    lastUpdated: new Date().toISOString()
  },
  trendingData: [
    { hashtag: 'Цветы', views: '+35%', trend: 'up' },
    { hashtag: 'Праздники', views: '+15%', trend: 'up' },
    { hashtag: 'Поздравления', views: '+5%', trend: 'up' }
  ],
  userPreferences: {
    autoSave: true,
    showTutorials: true,
    compactMode: false,
    darkMode: false
  },
  theme: 'light',
  language: 'ru',
  recentActivity: [],
  draftPosts: [],
  bookmarks: []
};

// Utility functions
const isLocalStorageAvailable = () => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

const getItem = (key, defaultValue = null) => {
  if (!isLocalStorageAvailable()) {
    console.warn('LocalStorage is not available');
    return defaultValue;
  }
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const setItem = (key, value) => {
  if (!isLocalStorageAvailable()) {
    console.warn('LocalStorage is not available');
    return false;
  }
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
    return false;
  }
};

const removeItem = (key) => {
  if (!isLocalStorageAvailable()) {
    return false;
  }
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
};

const clearAll = () => {
  if (!isLocalStorageAvailable()) {
    return false;
  }
  
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

// User Authentication
export const authStorage = {
  // Get current user
  getCurrentUser: () => getItem(STORAGE_KEYS.USER),
  
  // Set current user
  setCurrentUser: (user) => setItem(STORAGE_KEYS.USER, user),
  
  // Get auth token
  getAuthToken: () => getItem(STORAGE_KEYS.AUTH_TOKEN),
  
  // Set auth token
  setAuthToken: (token) => setItem(STORAGE_KEYS.AUTH_TOKEN, token),

  // Get users database
  getUsersDatabase: () => getItem(STORAGE_KEYS.USERS_DATABASE, []),

  // Set users database
  setUsersDatabase: (users) => setItem(STORAGE_KEYS.USERS_DATABASE, users),

  // Register new user
  registerUser: (userData) => {
    const users = authStorage.getUsersDatabase();
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует');
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: userData.password, // In real app, this should be hashed
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    // Add to database
    users.push(newUser);
    authStorage.setUsersDatabase(users);

    return newUser;
  },

  // Authenticate user
  authenticateUser: (email, password) => {
    const users = authStorage.getUsersDatabase();
    
    // Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('Пользователь с таким email не найден');
    }

    // Check password
    if (user.password !== password) {
      throw new Error('Неверный пароль');
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    authStorage.setUsersDatabase(users);

    return user;
  },

  // Check if user exists
  userExists: (email) => {
    const users = authStorage.getUsersDatabase();
    return users.some(user => user.email === email);
  },

  // Initialize demo user (for testing)
  initializeDemoUser: () => {
    const users = authStorage.getUsersDatabase();
    if (users.length === 0) {
      const demoUser = {
        id: 'demo_user_001',
        email: 'demo@example.com',
        firstName: 'Демо',
        lastName: 'Пользователь',
        password: '123456',
        createdAt: new Date().toISOString(),
        lastLogin: null
      };
      users.push(demoUser);
      authStorage.setUsersDatabase(users);
    }
  },
  
  // Check if user is logged in
  isLoggedIn: () => {
    const user = getItem(STORAGE_KEYS.USER);
    const token = getItem(STORAGE_KEYS.AUTH_TOKEN);
    return !!(user && token);
  },
  
  // Login user
  login: (user, token) => {
    setItem(STORAGE_KEYS.USER, user);
    setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    setItem(STORAGE_KEYS.RECENT_ACTIVITY, [
      { type: 'login', timestamp: new Date().toISOString() },
      ...getItem(STORAGE_KEYS.RECENT_ACTIVITY, []).slice(0, 9)
    ]);
  },
  
  // Logout user
  logout: () => {
    removeItem(STORAGE_KEYS.USER);
    removeItem(STORAGE_KEYS.AUTH_TOKEN);
    setItem(STORAGE_KEYS.RECENT_ACTIVITY, [
      { type: 'logout', timestamp: new Date().toISOString() },
      ...getItem(STORAGE_KEYS.RECENT_ACTIVITY, []).slice(0, 9)
    ]);
  }
};

// User Profile
export const profileStorage = {
  // Get user profile
  getUserProfile: () => getItem(STORAGE_KEYS.USER_PROFILE, DEFAULT_VALUES.userProfile),
  
  // Update user profile
  updateUserProfile: (updates) => {
    const currentProfile = getItem(STORAGE_KEYS.USER_PROFILE, DEFAULT_VALUES.userProfile);
    const updatedProfile = { ...currentProfile, ...updates, lastUpdated: new Date().toISOString() };
    setItem(STORAGE_KEYS.USER_PROFILE, updatedProfile);
    return updatedProfile;
  },
  
  // Reset user profile to defaults
  resetUserProfile: () => setItem(STORAGE_KEYS.USER_PROFILE, DEFAULT_VALUES.userProfile)
};

// Connected Accounts
export const accountsStorage = {
  // Get connected accounts
  getConnectedAccounts: () => getItem(STORAGE_KEYS.CONNECTED_ACCOUNTS, DEFAULT_VALUES.connectedAccounts),
  
  // Update connected account
  updateConnectedAccount: (platform, updates) => {
    const accounts = getItem(STORAGE_KEYS.CONNECTED_ACCOUNTS, DEFAULT_VALUES.connectedAccounts);
    const updatedAccounts = accounts.map(account => 
      account.platform === platform ? { ...account, ...updates } : account
    );
    setItem(STORAGE_KEYS.CONNECTED_ACCOUNTS, updatedAccounts);
    return updatedAccounts;
  },
  
  // Connect account
  connectAccount: (platform, username, accessToken) => {
    return accountsStorage.updateConnectedAccount(platform, {
      username,
      status: 'connected',
      accessToken,
      connectedAt: new Date().toISOString()
    });
  },
  
  // Disconnect account
  disconnectAccount: (platform) => {
    return accountsStorage.updateConnectedAccount(platform, {
      username: '',
      status: 'disconnected',
      accessToken: null,
      connectedAt: null
    });
  },
  
  // Get connected accounts count
  getConnectedCount: () => {
    const accounts = getItem(STORAGE_KEYS.CONNECTED_ACCOUNTS, DEFAULT_VALUES.connectedAccounts);
    return accounts.filter(account => account.status === 'connected').length;
  }
};

// Notifications
export const notificationsStorage = {
  // Get notification settings
  getNotificationSettings: () => getItem(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_VALUES.notifications),
  
  // Update notification settings
  updateNotificationSettings: (updates) => {
    const currentSettings = getItem(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_VALUES.notifications);
    const updatedSettings = { ...currentSettings, ...updates };
    setItem(STORAGE_KEYS.NOTIFICATIONS, updatedSettings);
    return updatedSettings;
  },
  
  // Toggle specific notification
  toggleNotification: (key) => {
    const settings = getItem(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_VALUES.notifications);
    const updatedSettings = { ...settings, [key]: !settings[key] };
    setItem(STORAGE_KEYS.NOTIFICATIONS, updatedSettings);
    return updatedSettings;
  }
};

// Security Settings
export const securityStorage = {
  // Get security settings
  getSecuritySettings: () => getItem(STORAGE_KEYS.SECURITY_SETTINGS, DEFAULT_VALUES.securitySettings),
  
  // Update security setting
  updateSecuritySetting: (settingName, enabled) => {
    const settings = getItem(STORAGE_KEYS.SECURITY_SETTINGS, DEFAULT_VALUES.securitySettings);
    const updatedSettings = settings.map(setting => 
      setting.name === settingName ? { ...setting, enabled } : setting
    );
    setItem(STORAGE_KEYS.SECURITY_SETTINGS, updatedSettings);
    return updatedSettings;
  }
};



// Trending Data
export const trendingStorage = {
  // Get trending data
  getTrendingData: () => getItem(STORAGE_KEYS.TRENDING_DATA, DEFAULT_VALUES.trendingData),
  
  // Update trending data
  updateTrendingData: (newData) => {
    setItem(STORAGE_KEYS.TRENDING_DATA, newData);
    return newData;
  },
  
  // Add new trending item
  addTrendingItem: (item) => {
    const currentData = getItem(STORAGE_KEYS.TRENDING_DATA, DEFAULT_VALUES.trendingData);
    const updatedData = [item, ...currentData.slice(0, 9)]; // Keep only 10 items
    setItem(STORAGE_KEYS.TRENDING_DATA, updatedData);
    return updatedData;
  }
};

// User Preferences
export const preferencesStorage = {
  // Get user preferences
  getUserPreferences: () => getItem(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_VALUES.userPreferences),
  
  // Update user preferences
  updateUserPreferences: (updates) => {
    const currentPrefs = getItem(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_VALUES.userPreferences);
    const updatedPrefs = { ...currentPrefs, ...updates };
    setItem(STORAGE_KEYS.USER_PREFERENCES, updatedPrefs);
    return updatedPrefs;
  },
  
  // Toggle preference
  togglePreference: (key) => {
    const prefs = getItem(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_VALUES.userPreferences);
    const updatedPrefs = { ...prefs, [key]: !prefs[key] };
    setItem(STORAGE_KEYS.USER_PREFERENCES, updatedPrefs);
    return updatedPrefs;
  }
};

// Theme
export const themeStorage = {
  // Get current theme
  getTheme: () => getItem(STORAGE_KEYS.THEME, DEFAULT_VALUES.theme),
  
  // Set theme
  setTheme: (theme) => setItem(STORAGE_KEYS.THEME, theme),
  
  // Toggle theme
  toggleTheme: () => {
    const currentTheme = getItem(STORAGE_KEYS.THEME, DEFAULT_VALUES.theme);
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setItem(STORAGE_KEYS.THEME, newTheme);
    return newTheme;
  }
};

// Language
export const languageStorage = {
  // Get current language
  getLanguage: () => getItem(STORAGE_KEYS.LANGUAGE, DEFAULT_VALUES.language),
  
  // Set language
  setLanguage: (language) => setItem(STORAGE_KEYS.LANGUAGE, language)
};

// Recent Activity
export const activityStorage = {
  // Get recent activity
  getRecentActivity: () => getItem(STORAGE_KEYS.RECENT_ACTIVITY, []),
  
  // Add activity
  addActivity: (type, details = {}) => {
    const activities = getItem(STORAGE_KEYS.RECENT_ACTIVITY, []);
    const newActivity = {
      type,
      timestamp: new Date().toISOString(),
      ...details
    };
    const updatedActivities = [newActivity, ...activities.slice(0, 19)]; // Keep only 20 items
    setItem(STORAGE_KEYS.RECENT_ACTIVITY, updatedActivities);
    return updatedActivities;
  },
  
  // Clear activity
  clearActivity: () => setItem(STORAGE_KEYS.RECENT_ACTIVITY, [])
};

// Draft Posts
export const draftStorage = {
  // Get draft posts
  getDraftPosts: () => getItem(STORAGE_KEYS.DRAFT_POSTS, []),
  
  // Save draft post
  saveDraftPost: (draft) => {
    const drafts = getItem(STORAGE_KEYS.DRAFT_POSTS, []);
    const newDraft = {
      id: draft.id || Date.now().toString(),
      ...draft,
      savedAt: new Date().toISOString()
    };
    
    let updatedDrafts;
    if (draft.id) {
      // Update existing draft
      updatedDrafts = drafts.map(d => d.id === draft.id ? newDraft : d);
    } else {
      // Add new draft
      updatedDrafts = [newDraft, ...drafts];
    }
    
    setItem(STORAGE_KEYS.DRAFT_POSTS, updatedDrafts);
    return updatedDrafts;
  },
  
  // Delete draft post
  deleteDraftPost: (draftId) => {
    const drafts = getItem(STORAGE_KEYS.DRAFT_POSTS, []);
    const updatedDrafts = drafts.filter(d => d.id !== draftId);
    setItem(STORAGE_KEYS.DRAFT_POSTS, updatedDrafts);
    return updatedDrafts;
  },
  
  // Get draft by ID
  getDraftById: (draftId) => {
    const drafts = getItem(STORAGE_KEYS.DRAFT_POSTS, []);
    return drafts.find(d => d.id === draftId);
  }
};

// Bookmarks
export const bookmarksStorage = {
  // Get bookmarks
  getBookmarks: () => getItem(STORAGE_KEYS.BOOKMARKS, []),
  
  // Add bookmark
  addBookmark: (item) => {
    const bookmarks = getItem(STORAGE_KEYS.BOOKMARKS, []);
    const newBookmark = {
      id: Date.now().toString(),
      ...item,
      bookmarkedAt: new Date().toISOString()
    };
    const updatedBookmarks = [newBookmark, ...bookmarks];
    setItem(STORAGE_KEYS.BOOKMARKS, updatedBookmarks);
    return updatedBookmarks;
  },
  
  // Remove bookmark
  removeBookmark: (bookmarkId) => {
    const bookmarks = getItem(STORAGE_KEYS.BOOKMARKS, []);
    const updatedBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
    setItem(STORAGE_KEYS.BOOKMARKS, updatedBookmarks);
    return updatedBookmarks;
  },
  
  // Check if item is bookmarked
  isBookmarked: (itemId) => {
    const bookmarks = getItem(STORAGE_KEYS.BOOKMARKS, []);
    return bookmarks.some(b => b.id === itemId);
  }
};

// General storage utilities
export const storageUtils = {
  // Initialize storage with defaults
  initialize: () => {
    Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
      if (getItem(storageKey) === null) {
        const defaultValue = DEFAULT_VALUES[key.toLowerCase()] || null;
        if (defaultValue !== null) {
          setItem(storageKey, defaultValue);
        }
      }
    });
  },
  
  // Export all data
  exportData: () => {
    const data = {};
    Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
      data[key] = getItem(storageKey);
    });
    return data;
  },
  
  // Import data
  importData: (data) => {
    Object.entries(data).forEach(([key, value]) => {
      const storageKey = STORAGE_KEYS[key];
      if (storageKey) {
        setItem(storageKey, value);
      }
    });
  },
  
  // Clear all data
  clearAll,
  
  // Get storage size
  getStorageSize: () => {
    if (!isLocalStorageAvailable()) return 0;
    
    let total = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        total += item.length;
      }
    });
    return total;
  }
};

// Export storage keys for external use
export { STORAGE_KEYS, DEFAULT_VALUES };

// Analytics Storage
export const analyticsStorage = {
  // Get analytics data
  getAnalyticsData: () => getItem(STORAGE_KEYS.ANALYTICS_DATA, DEFAULT_VALUES.analyticsData),

  // Set analytics data
  setAnalyticsData: (data) => setItem(STORAGE_KEYS.ANALYTICS_DATA, data),

  // Get analytics for specific period
  getAnalyticsForPeriod: (period) => {
    const data = analyticsStorage.getAnalyticsData();
    return data[period] || null;
  },

  // Update analytics data for specific period
  updateAnalyticsForPeriod: (period, newData) => {
    const data = analyticsStorage.getAnalyticsData();
    data[period] = { ...data[period], ...newData };
    data.lastUpdated = new Date().toISOString();
    return analyticsStorage.setAnalyticsData(data);
  },

  // Get summary for specific period
  getSummaryForPeriod: (period) => {
    const periodData = analyticsStorage.getAnalyticsForPeriod(period);
    return periodData?.summary || null;
  },

  // Get platform breakdown for specific period
  getPlatformBreakdownForPeriod: (period) => {
    const periodData = analyticsStorage.getAnalyticsForPeriod(period);
    return periodData?.platformBreakdown || [];
  },

  // Get top posts for specific period
  getTopPostsForPeriod: (period) => {
    const periodData = analyticsStorage.getAnalyticsForPeriod(period);
    return periodData?.topPosts || [];
  },

  // Get audience demographics for specific period
  getAudienceDemographicsForPeriod: (period) => {
    const periodData = analyticsStorage.getAnalyticsForPeriod(period);
    return periodData?.audienceDemographics || null;
  },

  // Get daily/weekly/monthly data for specific period
  getTimeSeriesDataForPeriod: (period) => {
    const periodData = analyticsStorage.getAnalyticsForPeriod(period);
    if (period === 'week') return periodData?.dailyData || [];
    if (period === 'month') return periodData?.weeklyData || [];
    if (period === 'year') return periodData?.monthlyData || [];
    return [];
  },

  // Get growth metrics for year
  getGrowthMetrics: () => {
    const data = analyticsStorage.getAnalyticsData();
    return data.year?.growthMetrics || null;
  },

  // Add new post data
  addPostData: (postData) => {
    const data = analyticsStorage.getAnalyticsData();
    
    // Update week data
    if (data.week) {
      data.week.summary.totalPosts += 1;
      data.week.summary.totalViews += postData.views || 0;
      data.week.summary.totalLikes += postData.likes || 0;
      data.week.summary.totalComments += postData.comments || 0;
      
      // Add to top posts if it's high performing
      if (postData.views > 1000) {
        data.week.topPosts.push({
          id: Date.now(),
          title: postData.title || 'Новый пост',
          platform: postData.platform || 'Вконтакте',
          views: postData.views || 0,
          likes: postData.likes || 0,
          comments: postData.comments || 0,
          engagement: ((postData.likes + postData.comments) / postData.views * 100).toFixed(1)
        });
        
        // Keep only top 3 posts
        data.week.topPosts = data.week.topPosts
          .sort((a, b) => b.views - a.views)
          .slice(0, 3);
      }
    }

    // Update month data
    if (data.month) {
      data.month.summary.totalPosts += 1;
      data.month.summary.totalViews += postData.views || 0;
      data.month.summary.totalLikes += postData.likes || 0;
      data.month.summary.totalComments += postData.comments || 0;
    }

    // Update year data
    if (data.year) {
      data.year.summary.totalPosts += 1;
      data.year.summary.totalViews += postData.views || 0;
      data.year.summary.totalLikes += postData.likes || 0;
      data.year.summary.totalComments += postData.comments || 0;
    }

    data.lastUpdated = new Date().toISOString();
    return analyticsStorage.setAnalyticsData(data);
  },

  // Initialize analytics data if not exists
  initializeAnalyticsData: () => {
    const existingData = analyticsStorage.getAnalyticsData();
    if (!existingData.week) {
      analyticsStorage.setAnalyticsData(DEFAULT_VALUES.analyticsData);
    }
  }
};

const storageManager = {
  authStorage,
  profileStorage,
  accountsStorage,
  notificationsStorage,
  securityStorage,
  analyticsStorage,
  trendingStorage,
  preferencesStorage,
  themeStorage,
  languageStorage,
  activityStorage,
  draftStorage,
  bookmarksStorage,
  storageUtils
};
export default storageManager;; 