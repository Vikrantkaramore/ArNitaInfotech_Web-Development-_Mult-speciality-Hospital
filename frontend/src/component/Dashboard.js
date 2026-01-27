import { useState, useEffect } from 'react';

export default function Dashboard({ role }) {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: '', department: '', email: '' });

  useEffect(() => {
    fetchAppointments();
    if (role === 'admin') {
      fetchDoctors();
    }
  }, [role]);

  const fetchAppointments = () => {
    fetch(`${API_BASE}/api/appointments`)
      .then(res => res.json())
      .then(setAppointments);
  };

  const fetchDoctors = () => {
    fetch(`${API_BASE}/api/doctors`)
      .then(res => res.json())
      .then(setDoctors);
  };

  const deleteAppointment = (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      fetch(`${API_BASE}/api/appointments/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) {
            fetchAppointments();
          } else {
            alert('Error deleting appointment');
          }
        })
        .catch(() => alert('Network error'));
    }
  };

  const confirmAppointment = (id) => {
    fetch(`${API_BASE}/api/confirm/${id}`, { method: 'PUT' })
      .then(() => fetchAppointments());
  };

  const rejectAppointment = (id) => {
    fetch(`${API_BASE}/api/reject/${id}`, { method: 'PUT' })
      .then(() => fetchAppointments());
  };

  const deleteDoctor = (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      fetch(`${API_BASE}/api/doctors/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) {
            fetchDoctors();
          } else {
            alert('Error deleting doctor');
          }
        })
        .catch(() => alert('Network error'));
    }
  };

  const addDoctor = (e) => {
    e.preventDefault();
    fetch('http://localhost:5001/api/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDoctor)
    })
      .then(() => {
        fetchDoctors();
        setNewDoctor({ name: '', department: '', email: '' });
        setShowAddDoctor(false);
      });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4 mt-6">
          {role === "admin" ? "Admin Dashboard" : "Doctor Dashboard"}
        </h2>

        {role === "admin" ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Total Doctors</h4>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{doctors.length}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-green-800 dark:text-green-200">Total Appointments</h4>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{appointments.length}</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">Pending Appointments</h4>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{appointments.filter(a => !a.status || a.status === 'Pending').length}</p>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Doctors</h3>
            <div className="overflow-x-auto mb-4">
              <table className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Department</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map(d => (
                    <tr key={d.id} className="border-t border-gray-300 dark:border-gray-600">
                      <td className="p-2">{d.name}</td>
                      <td className="p-2">{d.department}</td>
                      <td className="p-2">{d.email}</td>
                      <td className="p-2 text-center">
                        <button onClick={() => deleteDoctor(d.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => setShowAddDoctor(!showAddDoctor)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
              {showAddDoctor ? 'Cancel' : 'Add Doctor'}
            </button>
            {showAddDoctor && (
              <form onSubmit={addDoctor} className="space-y-2 mb-4">
                <input type="text" placeholder="Name" value={newDoctor.name} onChange={e => setNewDoctor({...newDoctor, name: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700" required />
                <input type="text" placeholder="Department" value={newDoctor.department} onChange={e => setNewDoctor({...newDoctor, department: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700" required />
                <input type="email" placeholder="Email" value={newDoctor.email} onChange={e => setNewDoctor({...newDoctor, email: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700" required />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add</button>
              </form>
            )}

            <h3 className="text-xl font-semibold mb-2">All Appointments</h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="p-2 text-left">Patient</th>
                    <th className="p-2 text-left">Doctor</th>
                    <th className="p-2 text-left">Department</th>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Message</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a.id} className="border-t border-gray-300 dark:border-gray-600">
                      <td className="p-2">{a.patient_name}</td>
                      <td className="p-2">{a.doctor}</td>
                      <td className="p-2">{a.department}</td>
                      <td className="p-2">{a.appointment_date}</td>
                      <td className="p-2">{a.status || 'Pending'}</td>
                      <td className="p-2">{a.message}</td>
                      <td className="p-2 text-center">
                        <button onClick={() => deleteAppointment(a.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-green-800 dark:text-green-200">Total Appointments</h4>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{appointments.length}</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">Pending Appointments</h4>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{appointments.filter(a => !a.status || a.status === 'Pending').length}</p>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">My Appointments</h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="p-2 text-left">Patient</th>
                    <th className="p-2 text-left">Department</th>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Message</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a.id} className="border-t border-gray-300 dark:border-gray-600">
                      <td className="p-2">{a.patient_name}</td>
                      <td className="p-2">{a.department}</td>
                      <td className="p-2">{a.appointment_date}</td>
                      <td className="p-2">{a.status || 'Pending'}</td>
                      <td className="p-2">{a.message}</td>
                      <td className="p-2 text-center">
                        <button onClick={() => confirmAppointment(a.id)} className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600">Confirm</button>
                        <button onClick={() => rejectAppointment(a.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
