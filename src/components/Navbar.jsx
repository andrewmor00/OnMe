import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStorage } from '../context/StorageContext';
import Logo from '../img/Logo.png';

const Navbar = () => {
  // const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout, addActivity } = useStorage();
  const [activeSection, setActiveSection] = useState('main');

  const handleLogout = () => {
    logout();
    addActivity('logout', { email: user?.email });
    navigate('/');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const updateActiveSection = () => {
    const sections = ['main', 'about', 'tariffs'];
    const windowHeight = window.innerHeight;
    
    for (const sectionId of sections) {
      const element = document.getElementById(sectionId);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
          setActiveSection(sectionId);
          break;
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', updateActiveSection);
    return () => window.removeEventListener('scroll', updateActiveSection);
  }, []);

  return (
    <header className="hero-header">
      <img src={Logo} alt="Логотип" className="hero-logo" />
      <nav className="hero-nav">
        <button 
          onClick={() => scrollToSection('main')} 
          className={`hero-link${activeSection === 'main' ? ' active' : ''}`}
        >
          Главная
        </button>
        <button 
          onClick={() => scrollToSection('about')} 
          className={`hero-link${activeSection === 'about' ? ' active' : ''}`}
        >
          О Нас
        </button>
        <button 
          onClick={() => scrollToSection('tariffs')} 
          className={`hero-link${activeSection === 'tariffs' ? ' active' : ''}`}
        >
          Тарифы
        </button>
      </nav>
      {isLoggedIn ? (
        <div className="hero-auth-buttons">
          <span className="hero-user-name">Привет, {user?.firstName || 'Пользователь'}!</span>
          <Link to="/profile" className="hero-profile-btn">Профиль</Link>
          
          <button onClick={handleLogout} className="hero-logout-btn">Выйти</button>
        </div>
      ) : (
        <Link to="/login" className="hero-login-top">Войти</Link>
      )}
    </header>
  );
};

export default Navbar; 