import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./component/Navbar";
import Home from "./component/Home";
import Login from "./component/Login";
import Dashboard from "./component/Dashboard";
import BookedAppointmentsLeaderboard from "./component/BookedAppointmentsLeaderboard";

export default function App() {
  const [role, setRole] = useState(null);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setRole={setRole} />} />
            <Route path="/dashboard" element={<Dashboard role={role} />} />
            <Route path="/booked-appointments" element={<BookedAppointmentsLeaderboard />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}
