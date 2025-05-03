import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import GarageDashboard from './pages/GarageDashboard';
import PrivateRoute from './components/PrivateRoute';
import CustomerProfile from './components/Profile/CustomerProfile';  
import GarageOwnerProfile from './components/Profile/GarageOwnerProfile';
import BookingHistory from './components/Customer/BookingHistory';
import BookingManagement from './components/Garage/BookingManagement';
import ChatPage from './components/Chat/ChatPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer Routes */}
          <Route
            path="/customer/*"
            element={
              <PrivateRoute userType="customer">
                <CustomerDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/customer/profile"
            element={
              <PrivateRoute userType="customer">
                <CustomerProfile />
              </PrivateRoute>
            }
          />

          <Route
            path="/customer/bookings"
            element={
              <PrivateRoute userType="customer">
                <BookingHistory />
              </PrivateRoute>
            }
          />

          {/* Garage Owner Routes */}
          <Route
            path="/garage/*"
            element={
              <PrivateRoute userType="garage_owner">
                <GarageDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/garage/profile"
            element={
              <PrivateRoute userType="garage_owner">
                <GarageOwnerProfile />
              </PrivateRoute>
            }
          />

          <Route
            path="/garage/bookings"
            element={
              <PrivateRoute userType="garage_owner">
                <BookingManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer/chat"
            element={
              <PrivateRoute userType="customer">
                <ChatPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer/chat/:chatId"
            element={
              <PrivateRoute userType="customer">
                <ChatPage />
              </PrivateRoute>
            }
          />

          {/* Add this route for garage owner chat */}
          <Route
            path="/garage/chat"
            element={
              <PrivateRoute userType="garage_owner">
                <ChatPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/garage/chat/:chatId"
            element={
              <PrivateRoute userType="garage_owner">
                <ChatPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;