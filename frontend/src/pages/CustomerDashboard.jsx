import { Routes, Route } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Dashboard from '../components/Customer/Dashboard';
import ImageUpload from '../components/Customer/ImageUpload';
import DamagePrediction from '../components/Customer/DamagePrediction';
import GarageList from '../components/Customer/GarageList';
import DamageHistory from '../components/Customer/DamageHistory';
import BookingHistory from '../components/Customer/BookingHistory';
import ChatPage from '../components/Chat/ChatPage';

const CustomerDashboard = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<ImageUpload />} />
        <Route path="/prediction/:id" element={<DamagePrediction />} />
        <Route path="/garages" element={<GarageList />} />
        <Route path="/history" element={<DamageHistory />} />
        <Route path="/bookings" element={<BookingHistory />} />
        <Route path="/chat" element={<ChatPage />} /> 
      </Routes>
      <Footer />
    </div>
  );
};

export default CustomerDashboard;