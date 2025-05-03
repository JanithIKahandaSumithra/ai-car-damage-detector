import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const DamageHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [garages, setGarages] = useState({});
  const [expandedRecord, setExpandedRecord] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/damage/history', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(`http://localhost:5000/api/damage/history/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setHistory(history.filter(record => record.id !== id));
        // Clear garages data for deleted record
        if (garages[id]) {
          const updatedGarages = { ...garages };
          delete updatedGarages[id];
          setGarages(updatedGarages);
        }
        setExpandedRecord(null);
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  const handleViewDetails = async (recordId, damageTypes) => {
    if (expandedRecord === recordId) {
      setExpandedRecord(null); // Collapse if already expanded
      return;
    }

    try {
      // Only fetch if we don't already have the data
      if (!garages[recordId]) {
        const response = await axios.post(
          'http://localhost:5000/api/garage/recommend',
          { damageTypes },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
        );
        setGarages(prev => ({ ...prev, [recordId]: response.data }));
      }
      setExpandedRecord(recordId);
    } catch (error) {
      console.error('Error fetching garages:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Damage Detection History
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            View all your previous damage assessments
          </p>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No damage reports</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by uploading a photo of your car damage.
            </p>
            <div className="mt-6">
              <Link
                to="/customer/upload"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Upload Image
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 p-4">
            {history.map((record) => (
              <div
                key={record.id}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={`data:image/jpeg;base64,${record.image_url}`}
                        alt="Car Damage"
                        className="h-24 w-24 object-cover rounded-lg"
                      />
                      <div>
                        <span className="text-sm text-gray-500">
                          {format(new Date(record.date_recorded), 'MMM dd, yyyy')}
                        </span>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {record.damage_types.map((type, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-800"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleViewDetails(record.id, record.damage_types)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                      >
                        {expandedRecord === record.id ? (
                          <>
                            <span>Hide Details</span>
                            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </>
                        ) : (
                          <>
                            <span>View Details</span>
                            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
                      >
                        <span>Delete</span>
                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {expandedRecord === record.id && garages[record.id] && (
                    <div className="mt-4 border-t pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900">Recommended Garages</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {garages[record.id].map((garage) => (
                          <div 
                            key={garage.id} 
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                          >
                            <h5 className="font-medium text-gray-900">{garage.garage_name}</h5>
                            <p className="text-sm text-gray-600 mt-1">{garage.address}</p>
                            <p className="text-sm text-gray-600">{garage.phone}</p>
                            <p className="text-sm text-gray-600">Hours: {garage.business_hours}</p>
                            <div className="mt-2">
                              <span className="text-xs font-medium text-gray-500">Repair Types:</span>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {garage.repair_types.map((type, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
                                  >
                                    {type}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DamageHistory;