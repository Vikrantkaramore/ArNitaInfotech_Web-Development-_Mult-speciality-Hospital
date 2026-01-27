import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../config";

export default function Login({ setRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setRole(data.role);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url('/hospital photo.jpg')` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">
          Login
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={submitHandler} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border p-2 rounded dark:bg-gray-700"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border p-2 rounded dark:bg-gray-700"
            required
          />
          <button
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
