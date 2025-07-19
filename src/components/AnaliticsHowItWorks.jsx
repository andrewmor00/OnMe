import React from 'react';
import '../App.css';

const cards = [
  {
    title: '1. Сбор данных',
    text: 'Наш сервис собирает данные по нескольким соцсетям и анализирует тренды и статистикеe',
  },
  {
    title: '2. Анализ конкурентов',
    text: 'Платформа анализирует и показывает блогеров с похожими метриками и тематикой, анализирует охваты и частоту публикаций.',
  },
  {
    title: '3. AI-рекомендации',
    text: 'Искусственный интеллект подсказывает, как расти быстрее: от времени публикаций до анализа фейковой активности.',
  },
  {
    title: '4. Рекламные предложения',
    text: 'Раздел с блогерами, готовыми к коллаборациям: общий формат, совпадение интересов и актуальность.',
  },
  {
    title: '5. Аналитика',
    text: 'Метрики твоих аккаунтов на разных платформах (VK, Telegram, Дзен и др.) — охваты, лайки, комментарии, рост аудитории.',
  },
  {
    title: '6. Трендовые предложения',
    text: 'Самые обсуждаемые темы и запросы по дням и платформам — для быстрого создания актуального контента.',
  },
  {
    title: '7. Автопостинг',
    text: 'Возможность выкладывать посты в разное время на разных площадках — с одного окна.',
  },
  {
    title: '8. “Живость” аудитории',
    text: 'Система распознаёт накрутку и даёт объективную оценку вовлечённости блогера.',
  },
];

const AnaliticsHowItWorks = () => (
  <section className="howitworks-section">
    <h2 className="howitworks-title">Как работает <span>ON MY FEED</span></h2>
    <div className="howitworks-flex">
      <div className="howitworks-row">
        {cards.slice(0, 3).map((card, idx) => (
          <div className="howitworks-card" key={idx}>
            <div className="howitworks-card-title">{card.title}</div>
            <div className="howitworks-card-text">{card.text}</div>
          </div>
        ))}
      </div>
      <div className="howitworks-row howitworks-row-center2">
        {cards.slice(3, 5).map((card, idx) => (
          <div className="howitworks-card" key={idx+3}>
            <div className="howitworks-card-title">{card.title}</div>
            <div className="howitworks-card-text">{card.text}</div>
          </div>
        ))}
      </div>
      <div className="howitworks-row">
        {cards.slice(5, 8).map((card, idx) => (
          <div className="howitworks-card" key={idx+5}>
            <div className="howitworks-card-title">{card.title}</div>
            <div className="howitworks-card-text">{card.text}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AnaliticsHowItWorks; 