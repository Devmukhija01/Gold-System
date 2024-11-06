// src/Components/PreviousEntries.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PreviousEntries.css';

function PreviousEntries({ language }) {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchAmount, setSearchAmount] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [sortDateAsc, setSortDateAsc] = useState(true);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch entries from API on initial load
    const fetchEntries = async () => {
      try {
        const response = await axios.get('http://localhost:5000/entries');
        setEntries(response.data);
        setFilteredEntries(response.data);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };
    fetchEntries();
  }, []);

  const handleDelete = async (id) => {
    const confirmationMessage = language === 'en'
      ? 'Do you want to delete this entry?'
      : 'क्या आप इस प्रविष्टि को हटाना चाहते हैं?';

    if (window.confirm(confirmationMessage)) {
      try {
        await axios.delete(`http://localhost:5000/entries/${id}`);
        setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
        setFilteredEntries((prevFiltered) => prevFiltered.filter((entry) => entry.id !== id));
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  const handleSearch = () => {
    let results = entries;
    if (searchName) results = results.filter(entry => entry.name.toLowerCase().includes(searchName.toLowerCase()));
    if (searchAmount) results = results.filter(entry => entry.amount.toString().includes(searchAmount));
    if (searchDate) results = results.filter(entry => new Date(entry.date).toLocaleDateString().includes(searchDate));

    setFilteredEntries(results);
  };

  const handleSortByDate = () => {
    const sortedEntries = [...filteredEntries].sort((a, b) =>
      sortDateAsc ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
    );
    setFilteredEntries(sortedEntries);
    setSortDateAsc(!sortDateAsc);
  };

  const handleCheckboxChange = (entry) => {
    setSelectedEntries((prevSelected) =>
      prevSelected.includes(entry)
        ? prevSelected.filter((e) => e !== entry)
        : [...prevSelected, entry]
    );
  };

  const openFullScreen = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const printSelectedEntries = () => {
    const printContent = document.getElementById('printContent').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Selected Entries</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .entry-details { padding: 20px; background-color: #ffffff; border-radius: 10px; color: #4a5568; font-size: 17px; line-height: 1.7; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    setTimeout(() => {
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  useEffect(() => {
    handleSearch();
  }, [searchName, searchAmount, searchDate]);

  return (
    <div className="previous-entries-container">
      <h2>{language === 'en' ? 'Previous Entries' : 'पिछले प्रवेश'}</h2>
      <div className="fullscreen-button-container">
        <button className="fullscreen-button" onClick={openFullScreen}>
          {language === 'en' ? 'Full Screen' : 'पूर्ण स्क्रीन'}
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder={language === 'en' ? 'Search by Name' : 'नाम से खोजें'}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder={language === 'en' ? 'Search by Amount' : 'राशि से खोजें'}
          value={searchAmount}
          onChange={(e) => setSearchAmount(e.target.value)}
        />
        <input
          type="date"
          placeholder={language === 'en' ? 'Search by Date' : 'तारीख से खोजें'}
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <button onClick={handleSortByDate}>
          {language === 'en' ? 'Sort by Date' : 'तारीख के अनुसार क्रमबद्ध करें'}
        </button>
      </div>

      {filteredEntries.length > 0 ? (
        <table className="entries-table">
          <thead>
            <tr>
              <th></th>
              <th>{language === 'en' ? 'Name' : 'नाम'}</th>
              <th>{language === 'en' ? 'Amount' : 'राशि'}</th>
              <th>{language === 'en' ? 'Interest Rate (%)' : 'ब्याज दर (%)'}</th>
              <th>{language === 'en' ? 'Date' : 'तारीख'}</th>
              <th>{language === 'en' ? 'Interest Amount' : 'ब्याज राशि'}</th>
              <th>{language === 'en' ? 'Total Amount' : 'कुल राशि'}</th>
              <th>{language === 'en' ? 'Type' : 'प्रकार'}</th>
              <th>{language === 'en' ? 'Actions' : 'क्रियाएँ'}</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry) => (
              <tr key={entry.id}>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(entry)}
                    checked={selectedEntries.includes(entry)}
                  />
                </td>
                <td>{entry.name}</td>
                <td>{entry.amount}</td>
                <td>{entry.interest_rate}</td>
                <td>{new Date(entry.date).toLocaleDateString()}</td>
                <td>{entry.interestAmount}</td>
                <td>{entry.totalAmount}</td>
                <td>{entry.type}</td>
                <td>
                  <button
                    className="exit-button"
                    onClick={() => handleDelete(entry.id)}
                  >
                    {language === 'en' ? 'Exit' : 'निकास'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{language === 'en' ? 'No entries found.' : 'कोई प्रवेश नहीं मिला।'}</p>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content" id="printContent">
            <button className="close-modal" onClick={closeModal}>X</button>
            <h3>{language === 'en' ? 'Selected Entries' : 'चयनित प्रविष्टियाँ'}</h3>
            {selectedEntries.map((entry, index) => (
              <div className="entry-details" key={index}>
                <p><strong>{language === 'en' ? 'Name:' : 'नाम:'}</strong> {entry.name}</p>
                <p><strong>{language === 'en' ? 'Amount:' : 'राशि:'}</strong> {entry.amount}</p>
                <p><strong>{language === 'en' ? 'Interest Rate:' : 'ब्याज दर:'}</strong> {entry.interest_rate}%</p>
                <p><strong>{language === 'en' ? 'Date:' : 'तारीख:'}</strong> {new Date(entry.date).toLocaleDateString()}</p>
                <p><strong>{language === 'en' ? 'Interest Amount:' : 'ब्याज राशि:'}</strong> {entry.interestAmount}</p>
                <p><strong>{language === 'en' ? 'Total Amount:' : 'कुल राशि:'}</strong> {entry.totalAmount}</p>
                <p><strong>{language === 'en' ? 'Type:' : 'प्रकार:'}</strong> {entry.type}</p>
              </div>
            ))}
            <button className="print-button" onClick={printSelectedEntries}>
              {language === 'en' ? 'Print' : 'प्रिंट'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PreviousEntries;
