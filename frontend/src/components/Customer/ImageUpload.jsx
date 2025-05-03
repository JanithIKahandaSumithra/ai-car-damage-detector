import { useState } from 'react';
import axios from 'axios';
import BookingModal from './BookingModal';
import { useNavigate } from 'react-router-dom';


const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGarage, setSelectedGarage] = useState(null);
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setPredictions(null);
    setGarages([]);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/damage/predict', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setPredictions(response.data.predictions);
      setGarages(response.data.recommendedGarages);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate(); // Add this import and hook

const startChat = async (garage) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/chat',
      { garage_id: garage.id },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    );
    navigate(`/customer/chat/${response.data.id}`);
  } catch (error) {
    console.error('Error starting chat:', error);
  }
};

  

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Upload Car Damage Photo
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Upload a clear photo of the damaged area of your car.</p>
            </div>
            <form onSubmit={handleSubmit} className="mt-5">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Photo
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {preview ? (
                        <div>
                          <img
                            src={preview}
                            alt="Preview"
                            className="mx-auto h-64 w-auto object-contain"
                          />
                          <button
                            type="button"
                            onClick={resetForm}
                            className="mt-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Choose Different Image
                          </button>
                        </div>
                      ) : (
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                            <span>Upload a file</span>
                            <input
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                              accept="image/*"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!file || loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                >
                  {loading ? 'Processing...' : 'Analyze Damage'}
                </button>
              </div>
            </form>

            {predictions && (
              <div className="mt-8 border-t border-gray-200 pt-8">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Detection Results
                </h4>
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h5 className="text-md font-medium text-gray-900 mb-4">
                    Detected Damages:
                  </h5>
                  <ul className="space-y-3">
                    {predictions.map((damage, index) => (
                      <li key={index} className="flex items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-indigo-600 text-sm font-medium">{index + 1}</span>
                        </div>
                        <span className="text-gray-700 font-medium">{damage}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {garages.length > 0 && (
  <div>
    <h5 className="text-md font-medium text-gray-900 mb-4">
      Recommended Garages:
    </h5>
    <div className="space-y-4">
      {garages.map((garage) => (
        <div
          key={garage.id}
          className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <h6 className="font-medium text-gray-900">
                {garage.garage_name}
              </h6>
              <p className="text-sm text-gray-600 mt-1">{garage.address}</p>
              <p className="text-sm text-gray-600">{garage.phone}</p>
              <p className="text-sm text-gray-600">Hours: {garage.business_hours}</p>
              <div className="mt-2">
                <span className="text-xs font-medium text-gray-500">
                  Repair Types:
                </span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {garage.repair_types.map((type, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => startChat(garage)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg 
                  className="mr-2 h-5 w-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
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
        </div>
      ))}
    </div>
  </div>
)}


                {/* Upload Another Image Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <svg 
                      className="mr-2 h-5 w-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Upload Another Image
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedGarage && (
        <BookingModal
          garage={selectedGarage}
          isOpen={!!selectedGarage}
          onClose={() => setSelectedGarage(null)}
          damageImage={preview}
          damageDescription={predictions?.join(', ')}
        />
      )}
    </div>
  );
};

export default ImageUpload;