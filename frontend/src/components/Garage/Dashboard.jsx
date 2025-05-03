import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchGarages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/garage/user/${user.userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setGarages(response.data);
      } catch (error) {
        console.error('Error fetching garages:', error);
        setError('Failed to load garages');
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchGarages();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Garages</h1>
          <p className="mt-2 text-gray-600">Manage your garage listings and services</p>
        </div>
        <Link
          to="/garage/register"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Register New Garage
        </Link>
      </div>

      {garages.length === 0 ? (
        <div className="text-center py-12 bg-white shadow rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">No Garages Registered</h3>
          <p className="mt-2 text-gray-500">Start by registering your first garage</p>
          <div className="mt-6">
            <Link
              to="/garage/register"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Register a Garage
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {garages.map((garage) => (
              <li key={garage.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{garage.garage_name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{garage.address}</p>
                    </div>
                    <div className="flex space-x-4">
                      <Link
                        to={`/garage/edit/${garage.id}`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        garage.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {garage.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Phone: {garage.phone}</p>
                    <p className="text-sm text-gray-500">Hours: {garage.business_hours}</p>
                  </div>
                  {garage.repair_types && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-gray-700">Services:</h4>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {garage.repair_types.map((type, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;