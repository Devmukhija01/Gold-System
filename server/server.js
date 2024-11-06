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

// Route to delete an entry by ID
app.delete('/entries/:id', (req, res) => {
  const entryId = req.params.id;
  const deleteQuery = 'DELETE FROM entries WHERE id = ?';

  db.query(deleteQuery, [entryId], (err, result) => {
    if (err) {
      console.error('Error deleting entry:', err);
      res.status(500).send('Error deleting entry');
    } else {
      if (result.affectedRows > 0) {
        res.status(200).send('Entry deleted successfully');
      } else {
        res.status(404).send('Entry not found');
      }
    }
  });
});

// Route to get all entries with calculated interest and total
app.get('/entries', (req, res) => {
  const query = 'SELECT * FROM entries';
  db.query(query, (err, results) => {
    if (err) throw err;

    const currentDate = new Date();
    const enrichedEntries = results.map((entry) => {
      const entryDate = new Date(entry.date);

      // Calculate months and days difference
      let monthsDiff = (currentDate.getFullYear() - entryDate.getFullYear()) * 12 + (currentDate.getMonth() - entryDate.getMonth());
      let daysDiff = currentDate.getDate() - entryDate.getDate();

      // Adjust if daysDiff is negative
      if (daysDiff < 0) {
        monthsDiff -= 1;
        daysDiff += new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
      }

      // Calculate interest
      const monthlyInterest = (0.01 * entry.amount * entry.interest_rate) * monthsDiff;
      const dailyInterest = (0.01 * entry.amount * entry.interest_rate) / 30 * daysDiff;
      const interestAmount = (monthlyInterest + dailyInterest).toFixed(2);
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

app.listen(5000, '0.0.0.0', () => {
  console.log('Server is running on port 5000');
});
