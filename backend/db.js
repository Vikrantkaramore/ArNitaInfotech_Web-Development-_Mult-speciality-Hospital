const mysql = require("mysql2");

const dbConfig = {
  host: process.env.DB_HOST || "mysql.railway.internal",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "OxSvMqnsLzDkTOpAouhfcqDXKdzCPgLR",
  database: process.env.DB_NAME || "railway",
  port: process.env.DB_PORT || 3306
};

// Support for Heroku JawsDB DATABASE_URL
if (process.env.DATABASE_URL) {
  const { URL } = require('url');
  const url = new URL(process.env.DATABASE_URL);
  dbConfig.host = url.hostname;
  dbConfig.user = url.username;
  dbConfig.password = url.password;
  dbConfig.database = url.pathname.slice(1);
  dbConfig.port = url.port;
}

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
