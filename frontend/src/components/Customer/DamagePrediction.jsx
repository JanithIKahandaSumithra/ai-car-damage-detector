import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DamagePrediction = () => {
  const { id } = useParams();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/damage/history/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setPrediction(response.data);
      } catch (err) {
        setError('Failed to fetch prediction details');
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Damage Assessment Results
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Analyzed on {new Date(prediction.date_recorded).toLocaleDateString()}
          </p>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Uploaded Image</h4>
                <div className="mt-2">
                  <img
                    src={`data:image/jpeg;base64,${prediction.image_url}`}
                    alt="Car Damage"
                    className="max-w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Detected Damages</h4>
                <div className="mt-2 space-y-2">
                  {prediction.damage_types.map((type, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-2 mb-2"
                    >
                      {type}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DamagePrediction;