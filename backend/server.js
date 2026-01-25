const http = require("http");
const db = require("./db");

// Initialize database tables
db.query(`CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL
)`, (err) => {
  if (err) console.error('Error creating users table:', err);
  else {
    // Insert default users if not exist
    db.query(`INSERT IGNORE INTO users (email, password, role) VALUES
      ('admin@hospital.com', 'admin123', 'admin'),
      ('doctor@hospital.com', 'doctor123', 'doctor')`, (err) => {
      if (err) console.error('Error inserting default users:', err);
    });
  }
});

db.query(`CREATE TABLE IF NOT EXISTS doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
)`, (err) => {
  if (err) console.error('Error creating doctors table:', err);
});



const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.end();
    return;
  }

  if (req.url === "/api/login" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const { email, password } = JSON.parse(body);
      db.query("SELECT role FROM users WHERE email = ? AND password = ?", [email, password], (err, result) => {
        if (err) {
          res.writeHead(500, {"Content-Type":"application/json"});
          res.end(JSON.stringify({ message: "Database error" }));
        } else if (result.length > 0) {
          res.writeHead(200, {"Content-Type":"application/json"});
          res.end(JSON.stringify({ role: result[0].role }));
        } else {
          res.writeHead(401, {"Content-Type":"application/json"});
          res.end(JSON.stringify({ message: "Invalid credentials" }));
        }
      });
    });
  }

  else if (req.url === "/api/addAppointment" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const data = JSON.parse(body);
      const day = new Date(data.appointment_date).getDay();
      if (day === 0) {
        res.writeHead(400);
        res.end(JSON.stringify({ message: "Sunday not allowed" }));
        return;
      }
      const sql = `INSERT INTO appointments
      (patient_name,email,department,doctor,appointment_date,message)
      VALUES (?,?,?,?,?,?)`;
      db.query(sql, [
        data.patient_name,
        data.email,
        data.department,
        data.doctor,
        data.appointment_date,
        data.message
      ], (err, result) => {
        if (err) {
          console.error(err);
          res.writeHead(500, {"Content-Type":"application/json"});
          res.end(JSON.stringify({ message: "Error booking appointment" }));
        } else {
          res.writeHead(200, {"Content-Type":"application/json"});
          res.end(JSON.stringify({ message: "Appointment booked" }));
        }
      });
    });
  }

  else if (req.url === "/api/appointments" && req.method === "GET") {
    db.query("SELECT * FROM appointments", (err, result) => {
      res.writeHead(200, {"Content-Type":"application/json"});
      res.end(JSON.stringify(result));
    });
  }

  else if (req.url.startsWith("/api/confirm") && req.method === "PUT") {
    const id = req.url.split("/")[3];
    db.query("UPDATE appointments SET status='Confirmed' WHERE id=?", [id], () => {
      res.writeHead(200);
      res.end(JSON.stringify({ message: "Appointment Confirmed" }));
    });
  }

  else if (req.url.startsWith("/api/reject") && req.method === "PUT") {
    const id = req.url.split("/")[3];
    db.query("UPDATE appointments SET status='Rejected' WHERE id=?", [id], () => {
      res.writeHead(200);
      res.end(JSON.stringify({ message: "Appointment Rejected" }));
    });
  }

  else if (req.url === "/api/doctors" && req.method === "GET") {
    db.query("SELECT * FROM doctors", (err, result) => {
      if (err) {
        res.writeHead(500, {"Content-Type":"application/json"});
        res.end(JSON.stringify({ message: "Error fetching doctors" }));
      } else {
        res.writeHead(200, {"Content-Type":"application/json"});
        res.end(JSON.stringify(result));
      }
    });
  }

  else if (req.url === "/api/doctors" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const data = JSON.parse(body);
      const sql = `INSERT INTO doctors (name, department, email) VALUES (?,?,?)`;
      db.query(sql, [data.name, data.department, data.email], (err, result) => {
        if (err) {
          console.error(err);
          res.writeHead(500, {"Content-Type":"application/json"});
          res.end(JSON.stringify({ message: "Error adding doctor" }));
        } else {
          res.writeHead(200, {"Content-Type":"application/json"});
          res.end(JSON.stringify({ message: "Doctor added" }));
        }
      });
    });
  }

  else if (req.url.startsWith("/api/doctors/") && req.method === "DELETE") {
    const id = req.url.split("/")[3];
    db.query("DELETE FROM doctors WHERE id=?", [id], (err, result) => {
      if (err) {
        res.writeHead(500, {"Content-Type":"application/json"});
        res.end(JSON.stringify({ message: "Error deleting doctor" }));
      } else {
        res.writeHead(200, {"Content-Type":"application/json"});
        res.end(JSON.stringify({ message: "Doctor deleted" }));
      }
    });
  }

  else if (req.url.startsWith("/api/appointments/") && req.method === "DELETE") {
    const id = req.url.split("/")[3];
    db.query("DELETE FROM appointments WHERE id=?", [id], (err, result) => {
      if (err) {
        res.writeHead(500, {"Content-Type":"application/json"});
        res.end(JSON.stringify({ message: "Error deleting appointment" }));
      } else {
        res.writeHead(200, {"Content-Type":"application/json"});
        res.end(JSON.stringify({ message: "Appointment deleted" }));
      }
    });
  }

  else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
