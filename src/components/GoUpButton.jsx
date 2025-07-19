import React, { useEffect, useState } from 'react';
import goUp from '../img/goUp.png';
import '../App.css';

const GoUpButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.7);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return visible ? (
    <button className="go-up-btn" onClick={handleClick} aria-label="Подняться">
      <img src={goUp} alt="Подняться" className="go-up-img" />
      <div className="go-up-label">Подняться</div>
    </button>
  ) : null;
};

export default GoUpButton; 