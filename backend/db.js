const mysql = require("mysql2");

const dbConfig = {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const db = mysql.createPool(dbConfig);

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    return; // ✅ DO NOT crash the server
  }

  console.log("✅ MySQL Connected");
  connection.release();
});

module.exports = db;
