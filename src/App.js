// App.js
import React, { useState } from 'react';
import NewEntry from './NewEntry';
import PreviousEntries from './PreviousEntries';

const App = () => {
  const [language, setLanguage] = useState('en');
  const [view, setView] = useState('newEntry');

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'en' ? 'hi' : 'en'));
  };

  return (
    <div>
      <button onClick={toggleLanguage}>
        {language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
      </button>
      <button onClick={() => setView('newEntry')}>New Entry</button>
      <button onClick={() => setView('previousEntries')}>Check Previous Entries</button>

      {view === 'newEntry' ? <NewEntry language={language} /> : <PreviousEntries language={language} />}
    </div>
  );
};

export default App;
