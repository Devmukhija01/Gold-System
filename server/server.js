// server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
app.use(cors());
app.use(express.json());

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Devmukhija@01',
  database: 'entriesDB'
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected...');
});

// Route to save a new entry
app.post('/entries', (req, res) => {
  const { name, amount, interestRate, date } = req.body;
  const query = 'INSERT INTO entries (name, amount, interest_rate, date) VALUES (?, ?, ?, ?)';
  db.query(query, [name, amount, interestRate, date], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, name, amount, interestRate, date });
  });
});

// Route to get all entries with calculated interest and total
app.get('/entries', (req, res) => {
  const query = 'SELECT * FROM entries';
  db.query(query, (err, results) => {
    if (err) throw err;

    const currentDate = new Date();
    const enrichedEntries = results.map((entry) => {
      const timeDiff = Math.abs(currentDate - new Date(entry.date));
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      const interestAmount = ((entry.amount * entry.interest_rate * daysDiff) / 36500).toFixed(2);
      const totalAmount = (parseFloat(entry.amount) + parseFloat(interestAmount)).toFixed(2);

      return {
        ...entry,
        interestAmount,
        totalAmount,
      };
    });

    res.json(enrichedEntries);
  });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
