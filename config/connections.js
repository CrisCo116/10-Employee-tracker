//connect to mysql database
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  
  password: 'root',  
  database: 'employee_tracker_db'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);  
    }
    console.log('Connected to the database!');
});

module.exports = connection;