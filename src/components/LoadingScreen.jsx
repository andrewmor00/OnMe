import React, { useState, useEffect } from 'react';
import '../App.css';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    'Проверяем данные...',
    'Настраиваем профиль...',
    'Загружаем аналитику...',
    'Подготавливаем дашборд...',
    'Завершаем настройку...'
  ];

  useEffect(() => {
    const duration = 7000; // 7 секунд
    const interval = 100; // Обновляем каждые 100мс
    const totalSteps = duration / interval;
    let currentStepCount = 0;

    const timer = setInterval(() => {
      currentStepCount++;
      const newProgress = (currentStepCount / totalSteps) * 100;
      setProgress(newProgress);

      // Обновляем текущий шаг
      const stepIndex = Math.floor((newProgress / 100) * steps.length);
      setCurrentStep(Math.min(stepIndex, steps.length - 1));

      if (currentStepCount >= totalSteps) {
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 500); // Небольшая задержка перед переходом
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="loading-screen">
      <div className="loading-container">
        <div className="loading-logo">
          <div className="logo-animation">
            <div className="logo-circle"></div>
            <div className="logo-circle"></div>
            <div className="logo-circle"></div>
          </div>
        </div>
        
        <h2 className="loading-title">Добро пожаловать в OnMe!</h2>
        <p className="loading-subtitle">Настраиваем ваш аккаунт</p>
        
        <div className="loading-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">{Math.round(progress)}%</div>
        </div>
        
        <div className="loading-steps">
          <div className="current-step">{steps[currentStep]}</div>
          <div className="step-dots">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`step-dot ${index <= currentStep ? 'active' : ''}`}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="loading-tips">
          <div className="tip-item">
            <span className="tip-icon">💡</span>
            <span className="tip-text">Подключите социальные сети для получения аналитики</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">📊</span>
            <span className="tip-text">Изучите детальную статистику в разделе аналитики</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">📅</span>
            <span className="tip-text">Планируйте публикации с помощью календаря</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 