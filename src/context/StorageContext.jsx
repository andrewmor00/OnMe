import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
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
} from '../utils/localStorage';

// Create context
const StorageContext = createContext();

// Initial state
const initialState = {
  // Auth
  user: null,
  isLoggedIn: false,
  authToken: null,
  
  // Profile
  userProfile: profileStorage.getUserProfile(),
  
  // Connected accounts
  connectedAccounts: accountsStorage.getConnectedAccounts(),
  
  // Settings
  notifications: notificationsStorage.getNotificationSettings(),
  securitySettings: securityStorage.getSecuritySettings(),
  userPreferences: preferencesStorage.getUserPreferences(),
  
  // Data
  analyticsData: analyticsStorage.getAnalyticsData(),
  trendingData: trendingStorage.getTrendingData(),
  
  // UI
  theme: themeStorage.getTheme(),
  language: languageStorage.getLanguage(),
  
  // Activity
  recentActivity: activityStorage.getRecentActivity(),
  
  // Content
  draftPosts: draftStorage.getDraftPosts(),
  bookmarks: bookmarksStorage.getBookmarks(),
  
  // Loading states
  loading: false,
  error: null
};

// Action types
const ACTION_TYPES = {
  // Auth actions
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  
  // Profile actions
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  RESET_PROFILE: 'RESET_PROFILE',
  
  // Account actions
  UPDATE_ACCOUNTS: 'UPDATE_ACCOUNTS',
  CONNECT_ACCOUNT: 'CONNECT_ACCOUNT',
  DISCONNECT_ACCOUNT: 'DISCONNECT_ACCOUNT',
  
  // Settings actions
  UPDATE_NOTIFICATIONS: 'UPDATE_NOTIFICATIONS',
  UPDATE_SECURITY: 'UPDATE_SECURITY',
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
  
  // Data actions
  UPDATE_ANALYTICS: 'UPDATE_ANALYTICS',
  UPDATE_TRENDING: 'UPDATE_TRENDING',
  
  // UI actions
  SET_THEME: 'SET_THEME',
  SET_LANGUAGE: 'SET_LANGUAGE',
  
  // Activity actions
  ADD_ACTIVITY: 'ADD_ACTIVITY',
  CLEAR_ACTIVITY: 'CLEAR_ACTIVITY',
  
  // Content actions
  UPDATE_DRAFTS: 'UPDATE_DRAFTS',
  UPDATE_BOOKMARKS: 'UPDATE_BOOKMARKS',
  
  // Utility actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  INITIALIZE_STORAGE: 'INITIALIZE_STORAGE'
};

// Reducer
const storageReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.LOGIN:
      return {
        ...state,
        user: action.payload.user,
        authToken: action.payload.token,
        isLoggedIn: true,
        error: null
      };
      
    case ACTION_TYPES.LOGOUT:
      return {
        ...state,
        user: null,
        authToken: null,
        isLoggedIn: false,
        error: null
      };
      
    case ACTION_TYPES.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
      
    case ACTION_TYPES.UPDATE_PROFILE:
      return {
        ...state,
        userProfile: { ...state.userProfile, ...action.payload }
      };
      
    case ACTION_TYPES.RESET_PROFILE:
      return {
        ...state,
        userProfile: profileStorage.getUserProfile()
      };
      
    case ACTION_TYPES.UPDATE_ACCOUNTS:
      return {
        ...state,
        connectedAccounts: action.payload
      };
      
    case ACTION_TYPES.CONNECT_ACCOUNT:
    case ACTION_TYPES.DISCONNECT_ACCOUNT:
      return {
        ...state,
        connectedAccounts: action.payload
      };
      
    case ACTION_TYPES.UPDATE_NOTIFICATIONS:
      return {
        ...state,
        notifications: { ...state.notifications, ...action.payload }
      };
      
    case ACTION_TYPES.UPDATE_SECURITY:
      return {
        ...state,
        securitySettings: action.payload
      };
      
    case ACTION_TYPES.UPDATE_PREFERENCES:
      return {
        ...state,
        userPreferences: { ...state.userPreferences, ...action.payload }
      };
      
    case ACTION_TYPES.UPDATE_ANALYTICS:
      return {
        ...state,
        analyticsData: { ...state.analyticsData, ...action.payload }
      };
      
    case ACTION_TYPES.UPDATE_TRENDING:
      return {
        ...state,
        trendingData: action.payload
      };
      
    case ACTION_TYPES.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };
      
    case ACTION_TYPES.SET_LANGUAGE:
      return {
        ...state,
        language: action.payload
      };
      
    case ACTION_TYPES.ADD_ACTIVITY:
      return {
        ...state,
        recentActivity: action.payload
      };
      
    case ACTION_TYPES.CLEAR_ACTIVITY:
      return {
        ...state,
        recentActivity: []
      };
      
    case ACTION_TYPES.UPDATE_DRAFTS:
      return {
        ...state,
        draftPosts: action.payload
      };
      
    case ACTION_TYPES.UPDATE_BOOKMARKS:
      return {
        ...state,
        bookmarks: action.payload
      };
      
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
      
    case ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case ACTION_TYPES.INITIALIZE_STORAGE:
      return {
        ...state,
        ...action.payload
      };
      
    default:
      return state;
  }
};

// Provider component
export const StorageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storageReducer, initialState);

  // Initialize storage on mount
  useEffect(() => {
    storageUtils.initialize();
    
    // Check if user is logged in
    if (authStorage.isLoggedIn()) {
      const user = authStorage.getCurrentUser();
      const token = authStorage.getAuthToken();
      dispatch({ type: ACTION_TYPES.LOGIN, payload: { user, token } });
    }
  }, []);

  // Auth actions
  const login = useCallback((user, token) => {
    try {
      authStorage.login(user, token);
      dispatch({ type: ACTION_TYPES.LOGIN, payload: { user, token } });
      return true;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    try {
      authStorage.logout();
      dispatch({ type: ACTION_TYPES.LOGOUT });
      return true;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  const updateUser = useCallback((updates) => {
    try {
      authStorage.setCurrentUser({ ...state.user, ...updates });
      dispatch({ type: ACTION_TYPES.UPDATE_USER, payload: updates });
      return true;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return false;
    }
  }, [state.user]);

  // Profile actions
  const updateProfile = useCallback((updates) => {
    try {
      const updatedProfile = profileStorage.updateUserProfile(updates);
      dispatch({ type: ACTION_TYPES.UPDATE_PROFILE, payload: updatedProfile });
      return updatedProfile;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const resetProfile = useCallback(() => {
    try {
      profileStorage.resetUserProfile();
      dispatch({ type: ACTION_TYPES.RESET_PROFILE });
      return true;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Account actions
  const connectAccount = useCallback((platform, username, accessToken) => {
    try {
      const updatedAccounts = accountsStorage.connectAccount(platform, username, accessToken);
      dispatch({ type: ACTION_TYPES.CONNECT_ACCOUNT, payload: updatedAccounts });
      return updatedAccounts;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const disconnectAccount = useCallback((platform) => {
    try {
      const updatedAccounts = accountsStorage.disconnectAccount(platform);
      dispatch({ type: ACTION_TYPES.DISCONNECT_ACCOUNT, payload: updatedAccounts });
      return updatedAccounts;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Notification actions
  const updateNotifications = useCallback((updates) => {
    try {
      const updatedSettings = notificationsStorage.updateNotificationSettings(updates);
      dispatch({ type: ACTION_TYPES.UPDATE_NOTIFICATIONS, payload: updatedSettings });
      return updatedSettings;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const toggleNotification = useCallback((key) => {
    try {
      const updatedSettings = notificationsStorage.toggleNotification(key);
      dispatch({ type: ACTION_TYPES.UPDATE_NOTIFICATIONS, payload: updatedSettings });
      return updatedSettings;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Security actions
  const updateSecuritySetting = useCallback((settingName, enabled) => {
    try {
      const updatedSettings = securityStorage.updateSecuritySetting(settingName, enabled);
      dispatch({ type: ACTION_TYPES.UPDATE_SECURITY, payload: updatedSettings });
      return updatedSettings;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Preferences actions
  const updatePreferences = useCallback((updates) => {
    try {
      const updatedPrefs = preferencesStorage.updateUserPreferences(updates);
      dispatch({ type: ACTION_TYPES.UPDATE_PREFERENCES, payload: updatedPrefs });
      return updatedPrefs;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const togglePreference = useCallback((key) => {
    try {
      const updatedPrefs = preferencesStorage.togglePreference(key);
      dispatch({ type: ACTION_TYPES.UPDATE_PREFERENCES, payload: updatedPrefs });
      return updatedPrefs;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Analytics actions
  const updateAnalytics = useCallback((updates) => {
    try {
      const updatedData = analyticsStorage.updateAnalyticsData(updates);
      dispatch({ type: ACTION_TYPES.UPDATE_ANALYTICS, payload: updatedData });
      return updatedData;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const incrementAnalytics = useCallback((key, amount = 1) => {
    try {
      const updatedData = analyticsStorage.incrementAnalytics(key, amount);
      dispatch({ type: ACTION_TYPES.UPDATE_ANALYTICS, payload: updatedData });
      return updatedData;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Trending actions
  const updateTrending = useCallback((newData) => {
    try {
      const updatedData = trendingStorage.updateTrendingData(newData);
      dispatch({ type: ACTION_TYPES.UPDATE_TRENDING, payload: updatedData });
      return updatedData;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const addTrendingItem = useCallback((item) => {
    try {
      const updatedData = trendingStorage.addTrendingItem(item);
      dispatch({ type: ACTION_TYPES.UPDATE_TRENDING, payload: updatedData });
      return updatedData;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Theme actions
  const setTheme = useCallback((theme) => {
    try {
      themeStorage.setTheme(theme);
      dispatch({ type: ACTION_TYPES.SET_THEME, payload: theme });
      return true;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  const toggleTheme = useCallback(() => {
    try {
      const newTheme = themeStorage.toggleTheme();
      dispatch({ type: ACTION_TYPES.SET_THEME, payload: newTheme });
      return newTheme;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  // Language actions
  const setLanguage = useCallback((language) => {
    try {
      languageStorage.setLanguage(language);
      dispatch({ type: ACTION_TYPES.SET_LANGUAGE, payload: language });
      return true;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Activity actions
  const addActivity = useCallback((type, details = {}) => {
    try {
      const updatedActivity = activityStorage.addActivity(type, details);
      dispatch({ type: ACTION_TYPES.ADD_ACTIVITY, payload: updatedActivity });
      return updatedActivity;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const clearActivity = useCallback(() => {
    try {
      activityStorage.clearActivity();
      dispatch({ type: ACTION_TYPES.CLEAR_ACTIVITY });
      return true;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  // Draft actions
  const saveDraft = useCallback((draft) => {
    try {
      const updatedDrafts = draftStorage.saveDraftPost(draft);
      dispatch({ type: ACTION_TYPES.UPDATE_DRAFTS, payload: updatedDrafts });
      return updatedDrafts;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const deleteDraft = useCallback((draftId) => {
    try {
      const updatedDrafts = draftStorage.deleteDraftPost(draftId);
      dispatch({ type: ACTION_TYPES.UPDATE_DRAFTS, payload: updatedDrafts });
      return updatedDrafts;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const getDraftById = useCallback((draftId) => {
    return draftStorage.getDraftById(draftId);
  }, []);

  // Bookmark actions
  const addBookmark = useCallback((item) => {
    try {
      const updatedBookmarks = bookmarksStorage.addBookmark(item);
      dispatch({ type: ACTION_TYPES.UPDATE_BOOKMARKS, payload: updatedBookmarks });
      return updatedBookmarks;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const removeBookmark = useCallback((bookmarkId) => {
    try {
      const updatedBookmarks = bookmarksStorage.removeBookmark(bookmarkId);
      dispatch({ type: ACTION_TYPES.UPDATE_BOOKMARKS, payload: updatedBookmarks });
      return updatedBookmarks;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return null;
    }
  }, []);

  const isBookmarked = useCallback((itemId) => {
    return bookmarksStorage.isBookmarked(itemId);
  }, []);

  // Utility actions
  const setLoading = useCallback((loading) => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
  }, []);

  const exportData = useCallback(() => {
    return storageUtils.exportData();
  }, []);

  const importData = useCallback((data) => {
    try {
      storageUtils.importData(data);
      // Reinitialize state with imported data
      dispatch({
        type: ACTION_TYPES.INITIALIZE_STORAGE,
        payload: {
          userProfile: profileStorage.getUserProfile(),
          connectedAccounts: accountsStorage.getConnectedAccounts(),
          notifications: notificationsStorage.getNotificationSettings(),
          securitySettings: securityStorage.getSecuritySettings(),
          userPreferences: preferencesStorage.getUserPreferences(),
          analyticsData: analyticsStorage.getAnalyticsData(),
          trendingData: trendingStorage.getTrendingData(),
          theme: themeStorage.getTheme(),
          language: languageStorage.getLanguage(),
          recentActivity: activityStorage.getRecentActivity(),
          draftPosts: draftStorage.getDraftPosts(),
          bookmarks: bookmarksStorage.getBookmarks()
        }
      });
      return true;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  const clearAllData = useCallback(() => {
    try {
      storageUtils.clearAll();
      dispatch({ type: ACTION_TYPES.LOGOUT });
      return true;
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      return false;
    }
  }, []);

  const getStorageSize = useCallback(() => {
    return storageUtils.getStorageSize();
  }, []);

  // Context value
  const value = {
    // State
    ...state,
    
    // Auth actions
    login,
    logout,
    updateUser,
    
    // Profile actions
    updateProfile,
    resetProfile,
    
    // Account actions
    connectAccount,
    disconnectAccount,
    
    // Notification actions
    updateNotifications,
    toggleNotification,
    
    // Security actions
    updateSecuritySetting,
    
    // Preferences actions
    updatePreferences,
    togglePreference,
    
    // Analytics actions
    updateAnalytics,
    incrementAnalytics,
    
    // Trending actions
    updateTrending,
    addTrendingItem,
    
    // Theme actions
    setTheme,
    toggleTheme,
    
    // Language actions
    setLanguage,
    
    // Activity actions
    addActivity,
    clearActivity,
    
    // Draft actions
    saveDraft,
    deleteDraft,
    getDraftById,
    
    // Bookmark actions
    addBookmark,
    removeBookmark,
    isBookmarked,
    
    // Utility actions
    setLoading,
    setError,
    clearError,
    exportData,
    importData,
    clearAllData,
    getStorageSize
  };

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
};

// Custom hook to use storage context
export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};

// Export action types for external use
export { ACTION_TYPES }; 