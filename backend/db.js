const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.MYSQLHOST,      // 👈 Railway internal host
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL connection error:", err.message);
  } else {
    console.log("✅ MySQL connected");
    connection.release();
  }
});

module.exports = db;
