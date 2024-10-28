// src/Components/HomePage.js
import './HomePage.css';
import React, { useState } from 'react';
import NewEntry from './NewEntry';
import PreviousEntries from './PreviousEntries';

function HomePage() {
  const [language, setLanguage] = useState('en'); // 'en' for English, 'hi' for Hindi
  const [showNewEntry, setShowNewEntry] = useState(false); // Toggle between NewEntry and PreviousEntries

  // Handler to toggle language
  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'en' ? 'hi' : 'en'));
  };

  return (
    <div className="home-container">
      <header>
        <button onClick={toggleLanguage} className="language-toggle">
          {language === 'en' ? 'Switch to Hindi' : 'अंग्रेजी में स्विच करें'}
        </button>
      </header>

      <div className="button-group">
        <button onClick={() => setShowNewEntry(true)}>
          {language === 'en' ? 'New Entry' : 'नया प्रवेश'}
        </button>
        <button onClick={() => setShowNewEntry(false)}>
          {language === 'en' ? 'Check Previous Entry' : 'पिछला प्रवेश देखें'}
        </button>
      </div>

      <main>
        {showNewEntry ? (
          <NewEntry language={language} />
        ) : (
          <PreviousEntries language={language} />
        )}
      </main>
    </div>
  );
}

export default HomePage;
