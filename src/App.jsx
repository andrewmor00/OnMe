import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { StorageProvider } from './context/StorageContext';
import { authStorage, analyticsStorage } from './utils/localStorage';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import CSVPage from './pages/CSVPage.jsx';
import TelegramTest from './components/TelegramTest.jsx';
import TelegramChatIdFinder from './components/TelegramChatIdFinder.jsx';
import TelegramVerification from './components/TelegramVerification.jsx';
import GoUpButton from './components/GoUpButton.jsx';
import Footer from './components/Footer.jsx';
import './App.css';

function FooterWrapper() {
  const location = useLocation();
  if (location.pathname === '/login' || location.pathname.startsWith('/profile')) return null;
  return <Footer />;
}

function App() {
  useEffect(() => {
    // Initialize demo user for testing
    authStorage.initializeDemoUser();
    // Initialize analytics data
    analyticsStorage.initializeAnalyticsData();
  }, []);

  return (
    <StorageProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/*" element={<Profile />} />
            <Route path="/csv-manager" element={<CSVPage />} />
            <Route path="/telegram-test" element={<TelegramTest />} />
            <Route path="/telegram-chat-id" element={<TelegramChatIdFinder />} />
            <Route path="/telegram-verification" element={<TelegramVerification />} />
          </Routes>
          <GoUpButton />
          <FooterWrapper />
        </div>
      </Router>
    </StorageProvider>
  );
}

export default App;
