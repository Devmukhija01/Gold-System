// src/Components/NewEntry.js
import React, { useState } from 'react';
import axios from 'axios';
import './NewEntry.css';

function NewEntry({ language }) {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    interestRate: '',
    date: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/entries', formData);
    alert(language === 'en' ? 'Entry Saved!' : 'प्रवेश सहेजा गया!');
    setFormData({ name: '', amount: '', interestRate: '', date: '' }); // Reset form
  };

  return (
    <div className="new-entry-container">
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={language === 'en' ? 'Name' : 'नाम'} required />
        <input type="text" name="Type" value={formData.type} onChange={handleChange} placeholder={language === 'en' ? 'Type' :  'टाइप'} required/>
        <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder={language === 'en' ? 'Amount' : 'राशि'} required />
        <input type="number" name="interestRate" value={formData.interestRate} onChange={handleChange} placeholder={language === 'en' ? 'Interest Rate (%)' : 'ब्याज दर (%)'} required />
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        <button type="submit">{language === 'en' ? 'Save' : 'सहेजें'}</button>
      </form>
    </div>
  );
}

export default NewEntry;
