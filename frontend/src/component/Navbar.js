import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <nav className="fixed top-0 w-full z-10 flex justify-between items-center px-6 py-4 bg-blue-600 dark:bg-blue-800 text-white shadow-lg">
      <h1 className="text-xl font-bold">City Multispecialty Hospital</h1>
      <div className="flex items-center space-x-4">
        <Link to="/#appointment">
          <button className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition">
            Book Appointment
          </button>
        </Link>
        <Link to="/booked-appointments">
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
            Appointments Leaderboard
          </button>
        </Link>
        <Link to="/login">
          <button className="bg-blue-700 dark:bg-blue-900 px-4 py-2 rounded hover:bg-blue-800 dark:hover:bg-blue-950 transition">
            Admin Login
          </button>
        </Link>
        <button
          onClick={toggleDarkMode}
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {darkMode ? "Light" : "Dark"}
        </button>
      </div>
    </nav>
  );
}
