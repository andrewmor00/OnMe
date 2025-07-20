import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../context/StorageContext';
import { authStorage } from '../utils/localStorage';
import LoadingScreen from '../components/LoadingScreen';
import TelegramLinkModal from '../components/TelegramLinkModal';
import Logo from '../img/Logo.png';
import objectsAuth from '../img/objectsAuth.png';
import manAuth from '../img/manAuth.png';
import '../App.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, updateProfile, addActivity, isLoggedIn } = useStorage();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [telegramLinked, setTelegramLinked] = useState(false);
  const [telegramData, setTelegramData] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/profile');
    }
  }, [isLoggedIn, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleFormSwitch = (isRegisterForm) => {
    setIsRegister(isRegisterForm);
    setError('');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      rememberMe: false
    });
    // Reset Telegram status when switching forms
    setTelegramLinked(false);
    setTelegramData(null);
  };

  const handleLoadingComplete = () => {
    setShowLoadingScreen(false);
    navigate('/profile');
  };

  const handleTelegramSuccess = (accountData) => {
    console.log('Telegram account linked:', accountData);
    setTelegramLinked(true);
    setTelegramData(accountData);
    setShowTelegramModal(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.email || !formData.password) {
        throw new Error('Пожалуйста, заполните все поля');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Пожалуйста, введите корректный email');
      }

      // Validate password length
      if (formData.password.length < 6) {
        throw new Error('Пароль должен содержать минимум 6 символов');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Authenticate user
      const user = authStorage.authenticateUser(formData.email, formData.password);
      
      // Create user object without password
      const userForStorage = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      };

      const token = `token_${Date.now()}`;

      // Login user
      const success = login(userForStorage, token);
      
      if (success) {
        // Update profile with basic info
        updateProfile({
          name: `${user.firstName} ${user.lastName}`.trim() || 'Пользователь',
          email: user.email,
          createdAt: user.createdAt
        });

        // Add activity
        addActivity('login', { email: user.email });

        // Clear form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          rememberMe: false
        });

        navigate('/profile');
      } else {
        throw new Error('Ошибка входа в систему');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        throw new Error('Пожалуйста, заполните все поля');
      }



      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Пожалуйста, введите корректный email');
      }

      // Validate password length
      if (formData.password.length < 6) {
        throw new Error('Пароль должен содержать минимум 6 символов');
      }

      // Validate name length
      if (formData.firstName.length < 2 || formData.lastName.length < 2) {
        throw new Error('Имя и фамилия должны содержать минимум 2 символа');
      }

      // Validate Telegram linking
      if (!telegramLinked) {
        throw new Error('Привязка Telegram аккаунта обязательна для регистрации');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Register new user
      const user = authStorage.registerUser({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password
      });

      // Create user object without password
      const userForStorage = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      };

      const token = `token_${Date.now()}`;

      // Login user after registration
      const success = login(userForStorage, token);
      
      if (success) {
        // Update profile with registration info
        updateProfile({
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          createdAt: user.createdAt
        });

        // Add activity
        addActivity('register', { email: user.email });

        // Clear form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          rememberMe: false
        });
        // Reset Telegram status
        setTelegramLinked(false);
        setTelegramData(null);

        // Show loading screen instead of immediate navigation
        setShowLoadingScreen(true);
      } else {
        throw new Error('Ошибка регистрации');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading screen if needed
  if (showLoadingScreen) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="login2-page">
      {/* Background forms layer */}
      <div className="login2-forms-background">
        {/* Registration form (hidden behind) */}
        <div className={`login2-registration-form ${isRegister ? 'mobile-active' : ''}`}>
          <img src={Logo} alt="OnMyFeed" className="login2-logo" />
          <h2 className="login2-title">Регистрация</h2>
          {error && <div className="login2-error" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
          <div style={{ 
            background: 'rgba(124, 42, 232, 0.1)', 
            border: '1px solid rgba(124, 42, 232, 0.3)', 
            borderRadius: '8px', 
            padding: '10px', 
            marginBottom: '15px', 
            textAlign: 'center',
            fontSize: '14px',
            color: '#7c2ae8'
          }}>
            ⚠️ Привязка Telegram аккаунта обязательна для регистрации
          </div>
          <form className="login2-form" onSubmit={handleRegister}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                name="lastName"
                placeholder="Фамилия" 
                className="login2-input" 
                style={{ flex: 1 }}
                value={formData.lastName}
                onChange={handleInputChange}
              />
              <input 
                type="text" 
                name="firstName"
                placeholder="Имя" 
                className="login2-input" 
                style={{ flex: 1 }}
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <input 
              type="email" 
              name="email"
              placeholder="Email" 
              className="login2-input"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input 
              type="password" 
              name="password"
              placeholder="Пароль" 
              className="login2-input"
              value={formData.password}
              onChange={handleInputChange}
            />

            <button 
              type="submit" 
              className="login2-btn" 
              disabled={loading || !telegramLinked}
              style={{
                opacity: !telegramLinked ? 0.6 : 1,
                cursor: !telegramLinked ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>

            {/* Telegram Link Button */}
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              {telegramLinked ? (
                <div style={{
                  background: 'linear-gradient(135deg, #28a745, #20c997)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%'
                }}>
                  <span style={{ fontSize: '16px' }}>✅</span>
                  Telegram привязан: {telegramData?.username || 'Аккаунт'}
                </div>
              ) : (
                <button 
                  type="button" 
                  className="telegram-link-btn"
                  onClick={() => setShowTelegramModal(true)}
                  style={{
                    background: 'linear-gradient(135deg, #0088cc, #00a8ff)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>✈️</span>
                  Привязать Telegram аккаунт (обязательно)
                </button>
              )}
            </div>
          </form>
          
          
          <div className="login2-register" style={{ textAlign: 'center', marginTop: '10px' }}>
            Есть аккаунт?{' '}
            <button type="button" className="login2-link" style={{ background: 'none', border: 'none', color: '#7c2ae8', cursor: 'pointer', padding: 0 }} onClick={() => handleFormSwitch(false)}>
              Войти
            </button>
          </div>
        </div>
        
        {/* Login form (visible initially) */}
        <div className={`login2-login-form ${!isRegister ? 'mobile-active' : ''}`}>
          <img src={Logo} alt="OnMyFeed" className="login2-logo" />
          <h2 className="login2-title">Войти</h2>
          {error && <div className="login2-error" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
          <form className="login2-form" onSubmit={handleLogin}>
            <input 
              type="text" 
              name="email"
              placeholder="Email" 
              className="login2-input"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input 
              type="password" 
              name="password"
              placeholder="Пароль" 
              className="login2-input"
              value={formData.password}
              onChange={handleInputChange}
            />
            <div className="login2-form-row">
              <label className="login2-checkbox-label">
                <input 
                  type="checkbox" 
                  name="rememberMe"
                  className="login2-checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                /> Запомнить меня
              </label>
              <button type="button" className="login2-link login2-link-forgot" style={{ background: 'none', border: 'none', color: '#7c2ae8', cursor: 'pointer', padding: 0 }}>Забыли пароль?</button>
            </div>
            <button type="submit" className="login2-btn" disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
          <div className="login2-register">
            Нет аккаунта?{' '}
            <button type="button" className="login2-link" style={{ background: 'none', border: 'none', color: '#7c2ae8', cursor: 'pointer', padding: 0 }} onClick={() => handleFormSwitch(true)}>
              Зарегистрироваться
            </button>
          </div>
        </div>
      </div>

      {/* Sliding cover with objects and man */}
      <div className={`login2-sliding-cover ${isRegister ? 'slide-to-right' : ''}`}>
        <div className="login2-images-container">
          <img src={manAuth} alt="man" className="auth-img login2-man" />
          <img src={objectsAuth} alt="objects" className="auth-img login2-objects" />
        </div>
      </div>

      {/* Telegram Link Modal */}
      <TelegramLinkModal
        isOpen={showTelegramModal}
        onClose={() => setShowTelegramModal(false)}
        onSuccess={handleTelegramSuccess}
      />

    </div>
  );
};

export default Login; 