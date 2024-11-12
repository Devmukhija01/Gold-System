// src/Components/NewEntry.js
import React, { useState } from 'react';
import axios from 'axios';
import './NewEntry.css';

function NewEntry({ language }) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    amount: '',
    interestRate: '',
    date: '',
  });
  const [showNotification, setShowNotification] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/entries', formData);
    
    // Show notification
    setShowNotification(true);

    // Automatically hide the notification after 3 seconds
    setTimeout(() => setShowNotification(false), 3000);

    // Reset form
    setFormData({ name: '', type: '', amount: '', interestRate: '', date: '' });
  };

  return (
    <div className="new-entry-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={language === 'en' ? 'Name' : 'नाम'}
          required
        />
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder={language === 'en' ? 'Type' : 'टाइप'}
          required
        />
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder={language === 'en' ? 'Amount' : 'राशि'}
          required
        />
        <input
          type="number"
          name="interestRate"
          value={formData.interestRate}
          onChange={handleChange}
          placeholder={language === 'en' ? 'Interest Rate (%)' : 'ब्याज दर (%)'}
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <button type="submit">{language === 'en' ? 'Save' : 'सहेजें'}</button>
      </form>

      {showNotification && (
        <div className="notification">
          <span>{language === 'en' ? 'Entry Saved!' : 'प्रवेश सहेजा गया!'}</span>
          <button className="close-btn" onClick={() => setShowNotification(false)}>&times;</button>
        </div>
      )}
    </div>
  );
}

export default NewEntry;
