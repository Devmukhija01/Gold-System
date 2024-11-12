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
  const [passkeyModalOpen, setPasskeyModalOpen] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [isPasskeyCorrect, setIsPasskeyCorrect] = useState(false);
  const correctPasskey = "12345";


  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    const fetchEntries = async () => {
      const response = await axios.get('http://localhost:5000/entries');
      setEntries(response.data);
      setFilteredEntries(response.data);
    };
    fetchEntries();
  }, []);


  

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      language === 'en'
        ? 'Do you want to delete this entry?'
        : 'क्या आप इस प्रविष्टि को हटाना चाहते हैं?'
    );

    if (confirmed) {
      try {
        await axios.delete(`http://localhost:5000/entries/${id}`);
        setEntries(entries.filter((entry) => entry.id !== id));
        setFilteredEntries(filteredEntries.filter((entry) => entry.id !== id));
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  const handleSearch = () => {
    let results = [...entries];
    if (searchName) {
      results = results.filter(entry =>
        entry.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    if (searchAmount) {
      results = results.filter(entry =>
        entry.amount.toString().includes(searchAmount)
      );
    }
    if (searchDate) {
      results = results.filter(entry =>
        new Date(entry.date).toLocaleDateString().includes(searchDate)
      );
    }
    setFilteredEntries(results);
  };

  const handleSortByDate = () => {
    const sortedEntries = [...filteredEntries].sort((a, b) => {
      return sortDateAsc
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    });
    setFilteredEntries(sortedEntries);
    setSortDateAsc(!sortDateAsc);
  };

  const handleCheckboxChange = (entry) => {
    setSelectedEntries(prev =>
      prev.includes(entry) ? prev.filter(e => e !== entry) : [...prev, entry]
    );
  };
  const handleUpdateClick = () => {
    setPasskeyModalOpen(true);
  };

  const handlePasskeyVerification = () => {
    if (passkey === correctPasskey) {
      setIsPasskeyCorrect(true);
      setPasskeyModalOpen(false);
    } else {
      alert(language === 'en' ? 'Incorrect passkey!' : 'गलत पासकी!');
    }
  };


  const handleSave = () => {
    // Logic to save updated details
    alert(language === 'en' ? 'Details updated successfully!' : 'विवरण सफलतापूर्वक अपडेट किया गया!');
    setIsPasskeyCorrect(false); // Close the update form after saving
  };

  const closePasskeyModal = () => {
    setPasskeyModalOpen(false);
  };

  const openFullScreen = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const printSelectedEntries = () => {
    const printContent = document.getElementById('printContent').innerHTML;
    const printWindow = window.open('', '_blank');

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Selected Entries</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            .entry-details {
              padding: 20px;
              background-color: #ffffff;
              border-radius: 10px;
              color: #4a5568;
              font-size: 17px;
              line-height: 1.7;
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
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
              {/* <th>{language === 'en' ? 'Interest Rate (%)' : 'ब्याज दर (%)'}</th> */}
              {/* <th>{language === 'en' ? 'Date' : 'तारीख'}</th> */}
              {/* <th>{language === 'en' ? 'Interest Amount' : 'ब्याज राशि'}</th> */}
              {/* <th>{language === 'en' ? 'Total Amount' : 'कुल राशि'}</th> */}
              {/* <th>{language === 'en' ? 'Type' : 'प्रकार'}</th> */}
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
                {/* <td>{entry.interest_rate}</td> */}
                {/* <td>{new Date(entry.date).toLocaleDateString()}</td> */}
                {/* <td>{entry.interestAmount}</td> */}
                {/* <td>{entry.totalAmount}</td> */}
                {/* <td>{entry.type}</td> */}
                <td>
                  <button
                    className="exit-button"
                    onClick={() => handleDelete(entry.id)}
                  >
                    {language === 'en' ? 'Exit' : 'निकास'}
                  </button>
                  <button className="update-button" onClick={handleUpdateClick}>
        {language === 'en' ? 'Update' : 'अपडेट'}
      </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{language === 'en' ? 'No entries found.' : 'कोई प्रवेश नहीं मिला।'}</p>
      )}
             {passkeyModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-modal" onClick={closePasskeyModal}>X</button>
            <p>{language === 'en' ? 'Enter Passkey' : 'जारी रखने के लिए पासकी दर्ज करें'}</p>
            <input
              type="password"
              placeholder={language === 'en' ? 'Enter passkey' : 'पासकी दर्ज करें'}
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              className="passkey-input"
            />
            <button className="verify-button" onClick={handlePasskeyVerification}>
              {language === 'en' ? 'Verify' : 'सत्यापित करें'}
            </button>
          </div>
        </div>
      )}

{isPasskeyCorrect && (
        <div className="update-form">
          <button className="close-update-form" onClick={() => setIsPasskeyCorrect(false)}>X</button>
          <h3>{language === 'en' ? 'Update Details' : 'विवरण अपडेट करें'}</h3>
          <input
            type="text"
            placeholder={language === 'en' ? 'Name' : 'नाम'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="update-input"
          />
          <input
            type="number"
            placeholder={language === 'en' ? 'Amount' : 'राशि'}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="update-input"
          />
          <input
            type="number"
            placeholder={language === 'en' ? 'Interest Rate' : 'ब्याज दर'}
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="update-input"
          />
          <input
            type="date"
            placeholder={language === 'en' ? 'Date' : 'तारीख'}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="update-input"
          />
          <input
            type="text"
            placeholder={language === 'en' ? 'Type' : 'प्रकार'}
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="update-input"
          />
          <button className="save-button" onClick={handleSave}>
            {language === 'en' ? 'Save' : 'सहेजें'}
          </button>
        </div>
      )}


      {isModalOpen && (
        <div className="modal">
          <div className="modal-content" id="printContent">
            <button className="close-modal" onClick={closeModal}>X</button>
            <h3>Selected Entries</h3>
            {selectedEntries.map((entry, index) => (
              <div className="entry-details" key={index}>
                <p><strong>Name:</strong> {entry.name}</p>
                <p><strong>Amount:</strong> {entry.amount}</p>
                <p><strong>Interest Rate:</strong> {entry.interest_rate}%</p>
                <p><strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}</p>
                <p><strong>Interest Amount:</strong> {entry.interestAmount}</p>
                <p><strong>Total Amount:</strong> {entry.totalAmount}</p>
                <p><strong>Type:</strong> {entry.type}</p>
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
