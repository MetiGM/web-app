const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'app.db');

// Initialize SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Helper function to run queries (INSERT, UPDATE, DELETE)
function runQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        console.error('Database Query Error:', err.message);
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}

// Helper function to fetch a single row (SELECT)
function getQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        console.error('Database Fetch Error:', err.message);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Helper function to fetch multiple rows (SELECT)
function allQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('Database Fetch Error:', err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Helper function to close the database connection
function closeDatabase() {
  db.close((err) => {
    if (err) {
      console.error('Error closing the database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
}

// Export database and helpers
module.exports = {
  db,
  runQuery,
  getQuery,
  allQuery,
  closeDatabase,
};
