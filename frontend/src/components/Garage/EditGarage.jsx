import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditGarage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    garageName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    businessHours: '',
    isActive: true,
    repairTypes: []
  });
  const [error, setError] = useState('');

  const repairTypeOptions = [
    'bonnet-dent', 'boot-dent', 'doorouter-dent', 'fender-dent',
    'front-bumper-dent', 'Front-windscreen-damage', 'Headlight-damage',
    'quaterpanel-dent', 'rear-bumper-dent', 'Rear-windscreen-Damage',
    'roof-dent', 'Runningboard-Damage', 'Sidemirror-Damage', 'Taillight-Damage'
  ];

  useEffect(() => {
    const fetchGarage = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/garage/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const garage = response.data;
        setFormData({
          garageName: garage.garage_name,
          phone: garage.phone,
          email: garage.email,
          address: garage.address,
          city: garage.city,
          businessHours: garage.business_hours,
          isActive: garage.is_active,
          repairTypes: garage.repair_types
        });
      } catch (error) {
        setError('Failed to fetch garage details');
      }
    };

    fetchGarage();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/garage/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      navigate('/garage');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update garage');
    }
  };

  const handleRepairTypeChange = (type) => {
    if (formData.repairTypes.includes(type)) {
      setFormData({
        ...formData,
        repairTypes: formData.repairTypes.filter(t => t !== type)
      });
    } else {
      setFormData({
        ...formData,
        repairTypes: [...formData.repairTypes, type]
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Garage</h3>
          <p className="mt-1 text-sm text-gray-500">
            Update your garage information and services.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="garageName" className="block text-sm font-medium text-gray-700">
                      Garage Name
                    </label>
                    <input
                      type="text"
                      name="garageName"
                      id="garageName"
                      required
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.garageName}
                      onChange={(e) => setFormData({ ...formData, garageName: e.target.value })}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      required
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      required
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      required
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="businessHours" className="block text-sm font-medium text-gray-700">
                      Business Hours
                    </label>
                    <input
                      type="text"
                      name="businessHours"
                      id="businessHours"
                      required
                      placeholder="e.g., Mon-Fri: 9AM-6PM"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.businessHours}
                      onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Repair Types
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {repairTypeOptions.map((type) => (
                      <label key={type} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={formData.repairTypes.includes(type)}
                          onChange={() => handleRepairTypeChange(type)}
                        />
                        <span className="ml-2 text-sm text-gray-600">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active for booking
                  </label>
                </div>
              </div>

              {error && (
                <div className="px-4 py-3 bg-red-50 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="button"
                  onClick={() => navigate('/garage')}
                  className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditGarage;