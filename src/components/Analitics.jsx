import React from 'react';
import analitics1 from '../img/AnaliticsStats.png';
import analitics2 from '../img/AnaliticsSearch.png';
import analitics3 from '../img/AnaliticsRocket.png';
import analitics4 from '../img/AnaliticsSuitcase.png';
import analitics5 from '../img/AnaliticsCalendar.png';
import analitics6 from '../img/AnaliticsGraphUp.png';

const cards = [
  {
    img: analitics1,
    title: 'Аналитика соцсетей',
    desc: 'Понимай, что работает, а что — нет. Подробные отчёты и метрики по каждой платформе.'
  },
  {
    img: analitics2,
    title: 'Анализ конкурентов',
    desc: 'Узнай, кто твои конкуренты, почему их смотрят — и как обойти их в борьбе за внимание.'
  },
  {
    img: analitics3,
    title: 'Поиск трендов',
    desc: 'Будь всегда в теме. Мы покажем, какие форматы и темы сейчас заходят лучше всего.'
  },
  {
    img: analitics4,
    title: 'Подбор партнёров',
    desc: 'Находи блогеров для совместных проектов. Расти быстрее с надёжными коллаборациями.'
  },
  {
    img: analitics5,
    title: 'Автопостинг',
    desc: 'Планируй и публикуй контент без стресса. Настрой график — и всё работает само.'
  },
  {
    img: analitics6,
    title: 'Рост охватов',
    desc: 'Повышай вовлечённость и подписки за счёт умной стратегии, основанной на данных.'
  },
];

const Analitics = () => (
  <section className="analitics-section">
    <h2 className="analitics-title">Сферы применения</h2>
    <div className="analitics-grid">
      {cards.map((card, i) => (
        <div className="analitics-card" key={i}>
          <img src={card.img} alt="" className="analitics-icon" />
          <div className="analitics-card-text">
            <div className="analitics-card-title">{card.title}</div>
            <div className="analitics-card-desc">{card.desc}</div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default Analitics; 