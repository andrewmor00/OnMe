import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import graphPhones from '../img/graphPhones.png';

const MoreInf = () => (
  <section className="moreinf-section">
    <div className="moreinf-content">
      <div className="moreinf-image-wrap">
        <img src={graphPhones} alt="Статистика телефоны" className="moreinf-image" />
      </div>
      <div className="moreinf-text-block">
        <h2 className="moreinf-title">Статистика и Охваты</h2>
        <div className="moreinf-desc">
          Подробная статистика и охваты на каждом посте, которые вы выкладываете. Наш сервис предоставляет графики завлеченности и подсказки для продвижения вашего контента!
        </div>
        <Link to="/login" className="moreinf-btn">Войти</Link>
      </div>
    </div>
  </section>
);

export default MoreInf; 