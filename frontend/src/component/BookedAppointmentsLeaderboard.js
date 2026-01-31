import { useState, useEffect } from 'react';

export default function BookedAppointmentsLeaderboard() {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    fetch('mysql-production-f6b3.up.railway.app')
      .then(res => res.json())
      .then(setAppointments);
  };

  const filteredAppointments = appointments.filter(a =>
    a.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.status || 'Pending').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4 mt-6">
          Booked Appointments Leaderboard
        </h2>
        <input
          type="text"
          placeholder="Search by appointment name, doctor, or status"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
        />
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-2 text-left">Appointment Name</th>
                <th className="p-2 text-left">Doctor Name</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map(a => (
                <tr key={a.id} className="border-t border-gray-300 dark:border-gray-600">
                  <td className="p-2">{a.patient_name}</td>
                  <td className="p-2">{a.doctor}</td>
                  <td className="p-2">{a.status || 'Pending'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
