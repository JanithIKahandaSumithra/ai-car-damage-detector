import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CustomerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.username}!</h1>
        <p className="mt-2 text-gray-600">What would you like to do today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          to="/customer/upload"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900">Upload New Image</h2>
          <p className="mt-2 text-gray-600">Upload a car damage photo for analysis and garage recommendations</p>
        </Link>
        <Link
          to="/customer/garages"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900">View All Garages</h2>
          <p className="mt-2 text-gray-600">Browse and search through our network of verified garages</p>
        </Link>
      </div>
    </div>
  );
};

export default CustomerDashboard;