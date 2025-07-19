import React from 'react';
import Logo from '../img/Logo.png';
import '../App.css';

const Footer = () => (
  <footer className="footer-section">
    <div className="footer-top-line" />
    <div className="footer-content">
      <div className="footer-left">
        <img src={Logo} alt="OnMyFeed" className="footer-logo" />
        <div className="footer-slogan">Статистика о всех ваших постах в реальном времени</div>
        <button className="footer-btn">Связаться с нами</button>
      </div>
      <div className="footer-links">
        <div className="footer-col">
          <div>Главная</div>
          <div>Как работает ON MY FEED</div>
          <div>Статистика</div>
          <div>Тарифы</div>
          <div>FAQ</div>
        </div>
        <div className="footer-col">
          <div>О нас</div>
          <div>Команда разработчиков</div>
          <div>Наша история</div>
        </div>
        <div className="footer-col">
          <div>Контакты</div>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      OnMyFeed 2025, Все права защищены
    </div>
  </footer>
);

export default Footer; 