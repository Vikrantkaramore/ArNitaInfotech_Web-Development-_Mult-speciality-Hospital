import { useState } from "react";
import API_BASE from "../config";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    doctor: "",
    date: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/addAppointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_name: formData.name,
          email: formData.email,
          department: formData.department,
          doctor: formData.doctor,
          appointment_date: formData.date,
          message: formData.message,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setFormData({
          name: "",
          email: "",
          department: "",
          doctor: "",
          date: "",
          message: "",
        });
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to book appointment");
    }
  };

  const specialties = [
    { title: "Cardiology", desc: "Heart care specialists." },
    { title: "Neurology", desc: "Brain and nervous system." },
    { title: "Orthopedics", desc: "Bone and joint care." },
    { title: "Pediatrics", desc: "Children's health." },
    { title: "Dermatology", desc: "Skin care experts." },
  ];

  return (
    <div className="pt-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section
        className="relative py-20 px-6 text-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/banner.jpg')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Care You Can Trust. Health You Deserve.
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white">
            Providing comprehensive medical services with compassion and expertise.
          </p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              Book Appointment
            </button>
            <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Appointment Booking Section */}
      <section
        id="appointment"
        className="relative py-16 px-6 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/hospital photo.jpg')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">Book an Appointment</h2>
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Patient Name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 border rounded dark:bg-gray-600 dark:border-gray-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 border rounded dark:bg-gray-600 dark:border-gray-500"
              required
            />
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="p-3 border rounded dark:bg-gray-600 dark:border-gray-500"
              required
            >
              <option value="">Select Department</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Dermatology">Dermatology</option>
            </select>
            <input
              type="text"
              name="doctor"
              placeholder="Doctor Name"
              value={formData.doctor}
              onChange={handleChange}
              className="p-3 border rounded dark:bg-gray-600 dark:border-gray-500"
              required
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="p-3 border rounded dark:bg-gray-600 dark:border-gray-500"
              required
            />
            <textarea
              name="message"
              placeholder="Message (Optional)"
              value={formData.message}
              onChange={handleChange}
              className="p-3 border rounded dark:bg-gray-600 dark:border-gray-500 md:col-span-2"
              rows="4"
            ></textarea>
            <button
              type="submit"
              className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Submit Appointment
            </button>
          </form>
        </div>
      </section>

      {/* About Hospital Section */}
      <section className="py-16 px-6 bg-blue-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">About Our Hospital</h2>
          <p className="text-lg mb-6">
            City Multispecialty Hospital is dedicated to providing high-quality healthcare services to our community.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Mission</h3>
              <p>To deliver compassionate, patient-centered care with excellence and integrity.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Vision</h3>
              <p>To be the leading healthcare provider, setting standards in medical innovation and service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Specialties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {specialties.map((spec, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-semibold mb-2">{spec.title}</h3>
                <p>{spec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timings Section */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900 text-center">
        <h2 className="text-3xl font-bold mb-8">Hospital Timings</h2>
        <div className="max-w-md mx-auto bg-blue-50 dark:bg-gray-800 p-6 rounded-lg">
          <p className="text-lg">Monday – Saturday: 9:00 AM – 8:00 PM</p>
          <p className="text-lg text-red-600 dark:text-red-400">Sunday: Closed</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 dark:bg-blue-800 text-white py-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-bold mb-4">City Multispecialty Hospital</h3>
          <p className="mb-2">Contact: info@cityhospital.com | Phone: (123) 456-7890</p>
          <p>&copy; 2023 City Multispecialty Hospital. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
