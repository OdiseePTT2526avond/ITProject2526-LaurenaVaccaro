const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpass',
  database: 'straatdieren'
});

db.connect((err) => {
  if (err) {
    console.log('Database verbinding mislukt:', err);
  } else {
    console.log('Database verbonden!');
  }
});

module.exports = db;