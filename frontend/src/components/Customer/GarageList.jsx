import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BookingModal from './BookingModal';

const GarageList = () => {
  const [garages, setGarages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRepairTypes, setSelectedRepairTypes] = useState([]);
  const [selectedGarage, setSelectedGarage] = useState(null);
  const navigate = useNavigate();
  const [repairTypes] = useState([
    'bonnet-dent', 'boot-dent', 'doorouter-dent', 'fender-dent',
    'front-bumper-dent', 'Front-windscreen-damage', 'Headlight-damage',
    'quaterpanel-dent', 'rear-bumper-dent', 'Rear-windscreen-Damage',
    'roof-dent', 'Runningboard-Damage', 'Sidemirror-Damage', 'Taillight-Damage'
  ]);

  useEffect(() => {
    const fetchGarages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/garage', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setGarages(response.data);
      } catch (error) {
        console.error('Error fetching garages:', error);
      }
    };

    fetchGarages();
  }, []);

  const filteredGarages = garages.filter(garage => {
    const matchesSearch = garage.garage_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         garage.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRepairTypes = selectedRepairTypes.length === 0 ||
      selectedRepairTypes.every(type => garage.repair_types.includes(type));

    return matchesSearch && matchesRepairTypes;
  });

  const handleStartChat = async (garage) => {
    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        garage_id: garage.id
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      navigate(`/customer/chat/${response.data.id}`);
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find a Garage</h1>
        <p className="mt-2 text-gray-600">Browse through our network of verified repair shops</p>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            type="text"
            id="search"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search by name or city"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Filter by Repair Types
          </label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {repairTypes.map((type) => (
              <label key={type} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  checked={selectedRepairTypes.includes(type)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRepairTypes([...selectedRepairTypes, type]);
                    } else {
                      setSelectedRepairTypes(selectedRepairTypes.filter(t => t !== type));
                    }
                  }}
                />
                <span className="ml-2 text-sm text-gray-600">{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {filteredGarages.map((garage) => (
            <li key={garage.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{garage.garage_name}</h3>
                    <p className="text-sm text-gray-500">{garage.city}</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleStartChat(garage)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg 
                        className="mr-2 h-5 w-5 text-gray-400" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                        />
                      </svg>
                      Message
                    </button>
                    <button
                      onClick={() => setSelectedGarage(garage)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">{garage.address}</p>
                  <p className="text-sm text-gray-600">{garage.phone}</p>
                  <p className="text-sm text-gray-600">Hours: {garage.business_hours}</p>
                </div>
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-700">Repair Types:</h4>
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
              </div>
            </li>
          ))}
        </ul>

        {filteredGarages.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No matching garages</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {garages.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {selectedGarage && (
        <BookingModal
          garage={selectedGarage}
          isOpen={!!selectedGarage}
          onClose={() => setSelectedGarage(null)}
          damageImage=""
          damageDescription=""
        />
      )}

      {selectedRepairTypes.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-4 py-2 flex items-center space-x-2">
          {selectedRepairTypes.map((type) => (
            <span
              key={type}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              {type}
              <button
                onClick={() => setSelectedRepairTypes(selectedRepairTypes.filter(t => t !== type))}
                className="ml-2 inline-flex items-center justify-center rounded-full h-4 w-4 text-indigo-400 hover:bg-indigo-200"
              >
                <span className="sr-only">Remove filter for {type}</span>
                ×
              </button>
            </span>
          ))}
          {selectedRepairTypes.length > 1 && (
            <button
              onClick={() => setSelectedRepairTypes([])}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default GarageList;