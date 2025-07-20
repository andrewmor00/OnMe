import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useStorage } from '../context/StorageContext';
import Logo from '../img/Logo.png';
import ProfileHome from '../components/ProfileHome.jsx';
import ProfileBloggers from '../components/ProfileBloggers.jsx';
import ProfileAnalytics from '../components/ProfileAnalytics.jsx';
import ProfilePosting from '../components/ProfilePosting.jsx';
import ProfileTrends from '../components/ProfileTrends.jsx';
import Tariffs from '../components/Tariffs.jsx';
import ProfileSettings from '../components/ProfileSettings.jsx';
import Bell from '../img/Bell.png';
import ProfileMain from '../img/ProfileMain.png';
import ProfileBlogs from '../img/ProfileBlogs.png';
import ProfileAnalytic from '../img/ProfileAnalytic.png';
import ProfilePost from '../img/ProfilePost.png';
import ProfileTrend from '../img/ProfileTrend.png';
import ProfileTariffs from '../img/ProfileTariffs.png';
import ProfileSetting from '../img/ProfileSettings.png';

import '../App.css';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout, addActivity } = useStorage();

  // Check if user is authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
  }, [isLoggedIn, navigate]);

  // If not logged in, don't render anything
  if (!isLoggedIn) {
    return null;
  }

  const isActive = (path) => {
    return location.pathname === `/profile${path}`;
  };

  const handleLogout = () => {
    logout();
    addActivity('logout', { email: user?.email });
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <img 
          src={Logo} 
          alt="Logo" 
          className="sidebar-logo" 
          style={{width: '70px', height: '70px', marginLeft: '20px', cursor: 'pointer'}}
          onClick={handleLogoClick}
        />
        
        <nav className="sidebar-nav">
          <Link 
            to="/profile"
            className={`sidebar-nav-item ${isActive('') ? 'active' : ''}`}
          >
            <img className="nav-icon" src={ProfileMain} alt="Main" />
            Главная
          </Link>
          <Link 
            to="/profile/bloggers"
            className={`sidebar-nav-item ${isActive('/bloggers') ? 'active' : ''}`}
          >
            <img className="nav-icon" src={ProfileBlogs} alt="ProfileBlogs" />
            Блогеры
          </Link>
          <Link 
            to="/profile/analytics"
            className={`sidebar-nav-item ${isActive('/analytics') ? 'active' : ''}`}
          >
            <img className="nav-icon" src={ProfileAnalytic} alt="ProfileAnalytic" />
            Аналитика
          </Link>
          <Link 
            to="/profile/posting"
            className={`sidebar-nav-item ${isActive('/posting') ? 'active' : ''}`}
          >
            <img className="nav-icon" src={ProfilePost} alt="ProfilePost" />
            Постинг
          </Link>
          <Link 
            to="/profile/trends"
            className={`sidebar-nav-item ${isActive('/trends') ? 'active' : ''}`}
          >
            <img className="nav-icon" src={ProfileTrend} alt="ProfileTrend" />
            Тренды
          </Link>

        </nav>

        <div className="sidebar-bottom">
          <Link 
            to="/profile/tariffs"
            className={`sidebar-nav-item ${isActive('/tariffs') ? 'active' : ''}`}
          >
            <img className="nav-icon" src={ProfileTariffs} alt="ProfileTariffs" />
            Тарифы
          </Link>
          <Link 
            to="/profile/settings"
            className={`sidebar-nav-item ${isActive('/settings') ? 'active' : ''}`}
          >
            <img className="nav-icon" src={ProfileSetting} alt="ProfileSettings" />
            Профиль
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div className="header-user-info">
            <span className="user-name">{user?.firstName || 'Пользователь'}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Выйти
            </button>
          </div>
          <div className="header-notifications">
            <button className="notification-btn"><img src={Bell} alt="Bell" /></button>
          </div>
        </div>
        
        <Routes>
          <Route path="/" element={<ProfileHome />} />
          <Route path="/bloggers" element={<ProfileBloggers />} />
          <Route path="/analytics" element={<ProfileAnalytics />} />
          <Route path="/posting" element={<ProfilePosting />} />
          <Route path="/trends" element={<ProfileTrends />} />
          <Route path="/tariffs" element={<Tariffs />} />
          <Route path="/settings" element={<ProfileSettings />} />
        </Routes>
      </div>

      {/* Mobile Navigation */}
      <nav className="mobile-nav">
        <Link 
          to="/profile"
          className={`mobile-nav-item ${isActive('') ? 'active' : ''}`}
        >
          <img className="mobile-nav-icon" src={ProfileMain} alt="Main" />
          Главная
        </Link>
        <Link 
          to="/profile/bloggers"
          className={`mobile-nav-item ${isActive('/bloggers') ? 'active' : ''}`}
        >
          <img className="mobile-nav-icon" src={ProfileBlogs} alt="Bloggers" />
          Блогеры
        </Link>
        <Link 
          to="/profile/analytics"
          className={`mobile-nav-item ${isActive('/analytics') ? 'active' : ''}`}
        >
          <img className="mobile-nav-icon" src={ProfileAnalytic} alt="Analytics" />
          Аналитика
        </Link>
        <Link 
          to="/profile/posting"
          className={`mobile-nav-item ${isActive('/posting') ? 'active' : ''}`}
        >
          <img className="mobile-nav-icon" src={ProfilePost} alt="Posting" />
          Постинг
        </Link>
        <Link 
          to="/profile/trends"
          className={`mobile-nav-item ${isActive('/trends') ? 'active' : ''}`}
        >
          <img className="mobile-nav-icon" src={ProfileTrend} alt="Trends" />
          Тренды
        </Link>

      </nav>
    </div>
  );
};

export default Profile; 