require("dotenv").config();
const http = require("http");
const db = require("./db");

/* =======================
   DATABASE INITIALIZATION
======================= */

const initTables = () => {
  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL
    )
  `);

  db.query(`
    INSERT IGNORE INTO users (email, password, role) VALUES
    ('admin@hospital.com', 'admin123', 'admin'),
    ('doctor@hospital.com', 'doctor123', 'doctor')
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS doctors (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      department VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL
    )
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      patient_name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      department VARCHAR(100),
      doctor VARCHAR(100),
      appointment_date DATE,
      message TEXT,
      status ENUM('Pending','Confirmed','Rejected') DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("✅ Database tables ready");
};

initTables();

/* =======================
   HELPERS
======================= */

const sendJSON = (res, status, data) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

const parseBody = (req, callback) => {
  let body = "";
  req.on("data", chunk => body += chunk);
  req.on("end", () => {
    try {
      callback(JSON.parse(body));
    } catch {
      callback(null);
    }
  });
};

/* =======================
   SERVER
======================= */

const server = http.createServer((req, res) => {

  // 🔓 CORS (Netlify friendly)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  /* ===== LOGIN ===== */
  if (req.url === "/api/login" && req.method === "POST") {
    return parseBody(req, (data) => {
      if (!data) return sendJSON(res, 400, { message: "Invalid JSON" });

      db.query(
        "SELECT role FROM users WHERE email=? AND password=?",
        [data.email, data.password],
        (err, result) => {
          if (err) return sendJSON(res, 500, { message: "Database error" });
          if (result.length === 0)
            return sendJSON(res, 401, { message: "Invalid credentials" });

          sendJSON(res, 200, { role: result[0].role });
        }
      );
    });
  }

  /* ===== ADD APPOINTMENT ===== */
  if (req.url === "/api/addAppointment" && req.method === "POST") {
    return parseBody(req, (data) => {
      if (!data) return sendJSON(res, 400, { message: "Invalid JSON" });

      const day = new Date(data.appointment_date).getDay();
      if (day === 0)
        return sendJSON(res, 400, { message: "Sunday not allowed" });

      db.query(
        `INSERT INTO appointments 
        (patient_name,email,department,doctor,appointment_date,message)
        VALUES (?,?,?,?,?,?)`,
        [
          data.patient_name,
          data.email,
          data.department,
          data.doctor,
          data.appointment_date,
          data.message
        ],
        (err) => {
          if (err) return sendJSON(res, 500, { message: "Booking failed" });
          sendJSON(res, 200, { message: "Appointment booked" });
        }
      );
    });
  }

  /* ===== GET APPOINTMENTS ===== */
  if (req.url === "/api/appointments" && req.method === "GET") {
    return db.query("SELECT * FROM appointments", (err, result) => {
      if (err) return sendJSON(res, 500, { message: "Fetch failed" });
      sendJSON(res, 200, result);
    });
  }

  /* ===== CONFIRM / REJECT ===== */
  if (req.url.startsWith("/api/confirm/") && req.method === "PUT") {
    const id = req.url.split("/")[3];
    return db.query(
      "UPDATE appointments SET status='Confirmed' WHERE id=?",
      [id],
      () => sendJSON(res, 200, { message: "Appointment Confirmed" })
    );
  }

  if (req.url.startsWith("/api/reject/") && req.method === "PUT") {
    const id = req.url.split("/")[3];
    return db.query(
      "UPDATE appointments SET status='Rejected' WHERE id=?",
      [id],
      () => sendJSON(res, 200, { message: "Appointment Rejected" })
    );
  }

  /* ===== DOCTORS ===== */
  if (req.url === "/api/doctors" && req.method === "GET") {
    return db.query("SELECT * FROM doctors", (err, result) => {
      if (err) return sendJSON(res, 500, { message: "Fetch failed" });
      sendJSON(res, 200, result);
    });
  }

  if (req.url === "/api/doctors" && req.method === "POST") {
    return parseBody(req, (data) => {
      if (!data) return sendJSON(res, 400, { message: "Invalid JSON" });

      db.query(
        "INSERT INTO doctors (name, department, email) VALUES (?,?,?)",
        [data.name, data.department, data.email],
        (err) => {
          if (err) return sendJSON(res, 500, { message: "Insert failed" });
          sendJSON(res, 200, { message: "Doctor added" });
        }
      );
    });
  }

  if (req.url.startsWith("/api/doctors/") && req.method === "DELETE") {
    const id = req.url.split("/")[3];
    return db.query(
      "DELETE FROM doctors WHERE id=?",
      [id],
      () => sendJSON(res, 200, { message: "Doctor deleted" })
    );
  }

  /* ===== DELETE APPOINTMENT ===== */
  if (req.url.startsWith("/api/appointments/") && req.method === "DELETE") {
    const id = req.url.split("/")[3];
    return db.query(
      "DELETE FROM appointments WHERE id=?",
      [id],
      () => sendJSON(res, 200, { message: "Appointment deleted" })
    );
  }

  /* ===== FALLBACK ===== */
  sendJSON(res, 404, { message: "Route not found" });
});

/* =======================
   START SERVER
======================= */

const PORT = process.env.PORT || 5001;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
