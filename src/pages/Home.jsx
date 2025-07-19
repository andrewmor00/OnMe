import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import HeroPage from '../components/HeroPage.jsx';
import Analitics from '../components/Analitics.jsx';
import AnaliticsHowItWorks from '../components/AnaliticsHowItWorks.jsx';
import MoreInf from '../components/MoreInf.jsx';
import Tariffs from '../components/Tariffs.jsx';


const Home = () => {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <Navbar onLoginClick={() => setAuthOpen(true)} />
      <div id="main">
        <HeroPage />
      </div>
      <div id="about">
        <Analitics />
        <AnaliticsHowItWorks />
        <MoreInf />
      </div>
      <div id="tariffs">
        <Tariffs />
      </div>
    </>
  );
};

export default Home; 