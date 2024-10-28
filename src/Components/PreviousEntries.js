// src/Components/PreviousEntries.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PreviousEntries.css';

function PreviousEntries({ language }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      const response = await axios.get('http://localhost:5000/entries');
      setEntries(response.data);
    };
    fetchEntries();
  }, []);

  return (
    <div className="previous-entries-container">
      <h2>{language === 'en' ? 'Previous Entries' : 'पिछले प्रवेश'}</h2>
      {entries.length > 0 ? (
        <table className="entries-table">
          <thead>
            <tr>
              <th>{language === 'en' ? 'Name' : 'नाम'}</th>
              <th>{language === 'en' ? 'Amount' : 'राशि'}</th>
              <th>{language === 'en' ? 'Interest Rate (%)' : 'ब्याज दर (%)'}</th>
              <th>{language === 'en' ? 'Date' : 'तारीख'}</th>
              <th>{language === 'en' ? 'Interest Amount' : 'ब्याज राशि'}</th>
              <th>{language === 'en' ? 'Total Amount' : 'कुल राशि'}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.name}</td>
                <td>{entry.amount}</td>
                <td>{entry.interestRate}</td>
                <td>{new Date(entry.date).toLocaleDateString()}</td>
                <td>{entry.interestAmount}</td>
                <td>{entry.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{language === 'en' ? 'No entries found.' : 'कोई प्रवेश नहीं मिला।'}</p>
      )}
    </div>
  );
}

export default PreviousEntries;
