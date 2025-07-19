import React from 'react';
import '../App.css';

const tariffs = [
  {
    name: 'Free',
    title: 'Бесплатный пробный период',
    options: [
      { text: 'Аналитика', check: true },
      { text: 'Отчеты по соц.сетям', check: true },
      { text: 'Трендовые предложения', check: false },
      { text: 'Рекламное сотрудничество', check: true },
      { text: 'Умные рекомендации', check: false },
      { text: 'Сборник статей', check: true },
    ],
    button: 'Попробовать 7 дней за 1₽',
    buttonClass: 'tariff-btn-free',
  },
  {
    name: 'Pro+',
    title: 'Продвинутый доступ',
    subtitle: 'Полный доступ к сервису и всей аналитике',
    options: [
      { text: 'Аналитика', check: true },
      { text: 'Отчеты по соц.сетям', check: true },
      { text: 'Трендовые предложения', check: true },
      { text: 'Рекламное сотрудничество', check: true },
      { text: 'Умные рекомендации', check: true },
      { text: 'Сборник статей', check: true },
    ],
    button: 'Оформить за 449₽ в мес',
    buttonClass: 'tariff-btn-free',
  },
];

const Tariffs = () => (
  <section className="tariffs-section">
    <h2 className="tariffs-title">Тарифы</h2>
    <div className="tariffs-cards">
      {tariffs.map((tariff, idx) => (
        <div className="tariff-card" key={idx}>
          <div className="tariff-name">{tariff.name}</div>
          <div className="tariff-title">{tariff.title}</div>
          {tariff.subtitle && <div className="tariff-subtitle">{tariff.subtitle}</div>}
          <ul className="tariff-options">
            {tariff.options.map((opt, i) => (
              <li key={i} className={opt.check ? 'option-yes' : 'option-no'}>
                {opt.check ? (
                  <span className="option-icon">✔</span>
                ) : (
                  <span className="option-icon">✖</span>
                )}
                {opt.text}
              </li>
            ))}
          </ul>
          <button className={`tariff-btn ${tariff.buttonClass}`}>{tariff.button}</button>
        </div>
      ))}
    </div>
  </section>
);

export default Tariffs; 