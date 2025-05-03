import { Routes, Route } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Dashboard from '../components/Garage/Dashboard';
import RegisterGarage from '../components/Garage/RegisterGarage';
import EditGarage from '../components/Garage/EditGarage';
import BookingManagement from '../components/Garage/BookingManagement';

const GarageDashboard = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<RegisterGarage />} />
        <Route path="/edit/:id" element={<EditGarage />} />
        <Route path="/bookings" element={<BookingManagement />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default GarageDashboard;