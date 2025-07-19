import React from 'react';
import heroPageAnimationLeft from '../img/heroPageAnimationLeft.png';
import heroPageAnimationRight from '../img/heroPageAnimationRight.png';

const HeroPage = () => (
  <section className="hero-main-section">
    <div className="hero-main-text">
      <h1 className="hero-title">
        Отслеживай свои охваты<br />и статистику вместе с<br />
        <span className="hero-title-accent">On My Feed</span>
      </h1>
      <p className="hero-subtitle">Статистика о всех ваших<br />постах в реальном времени</p>
      <a href="/login" className="hero-login-main">Войти</a>
    </div>
    <div className="hero-main-images">
      <img src={heroPageAnimationLeft} alt="Hero 1" className="hero-img hero-img-animate1" />
      <img src={heroPageAnimationRight} alt="Hero 2" className="hero-img hero-img-animate2" />
    </div>
  </section>
);

export default HeroPage; 