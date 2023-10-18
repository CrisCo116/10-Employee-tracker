const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Create a MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'employee_tracker_db',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err);
    return;
  }
  console.log('Connected to the database');
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Example route to get all departments
app.get('/departments', (req, res) => {
  const query = 'SELECT * FROM department';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database: ' + err);
      res.status(500).send('Error querying database');
    } else {
      res.json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});