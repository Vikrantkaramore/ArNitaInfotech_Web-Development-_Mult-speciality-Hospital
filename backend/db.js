const mysql = require("mysql2");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Pass@2026",
  database: process.env.DB_NAME || "hospital_db",
  port: process.env.DB_PORT || 3306
};

let db;

function connectWithRetry() {
  db = mysql.createConnection(dbConfig);
  db.connect(err => {
    if (err) {
      console.error("MySQL connection failed, retrying in 5 seconds...", err.message);
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log("MySQL Connected");
    }
  });
  db.on('error', err => {
    console.error("MySQL connection error", err);
    // For mysql, reconnect
    connectWithRetry();
  });
}

connectWithRetry();

module.exports = db;
