import { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import ImageDisplay from '../Common/ImageDisplay';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (bookings.length > 0) {
      updateStatistics();
    }
  }, [bookings]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/booking/garage', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateStatistics = () => {
    const stats = bookings.reduce((acc, booking) => {
      acc.total++;
      acc[booking.status]++;
      return acc;
    }, {
      total: 0,
      pending: 0,
      accepted: 0,
      rejected: 0
    });
    setStatistics(stats);
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/booking/${bookingId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      
      // Update local state
      setBookings(bookings.map(booking =>
        booking.id === bookingId ? { ...booking, status } : booking
      ));

      if (selectedBooking?.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status });
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Invalid date';
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatTime = (timeString) => {
    try {
      if (!timeString) return 'Invalid time';
      return format(parseISO(`2000-01-01T${timeString}`), 'hh:mm a');
    } catch (error) {
      return 'Invalid time';
    }
  };

  const filteredBookings = bookings.filter(booking => 
    filter === 'all' ? true : booking.status === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mt-16">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Bookings', value: statistics.total, color: 'bg-gray-500' },
                { label: 'Pending', value: statistics.pending, color: 'bg-yellow-500' },
                { label: 'Accepted', value: statistics.accepted, color: 'bg-green-500' },
                { label: 'Rejected', value: statistics.rejected, color: 'bg-red-500' }
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-lg shadow p-6 border-l-4"
                  style={{ borderLeftColor: stat.color }}
                >
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="mb-6">
              <div className="flex space-x-4">
                {['all', 'pending', 'accepted', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      filter === status
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.customer_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.phone_number}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.booking_date)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTime(booking.booking_time)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(booking.id, 'accepted')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                                className="text-red-600 hover:text-red-900"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredBookings.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No bookings found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Booking Details
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Customer Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-500">Customer Information</h4>
                <div className="mt-2 bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-900">Name: {selectedBooking.customer_name}</p>
                  <p className="text-sm text-gray-900">Phone: {selectedBooking.phone_number}</p>
                </div>
              </div>

              {/* Booking Time */}
              <div>
                <h4 className="text-sm font-medium text-gray-500">Appointment Time</h4>
                <div className="mt-2 bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-900">
                    Date: {formatDate(selectedBooking.booking_date)}
                  </p>
                  <p className="text-sm text-gray-900">
                    Time: {formatTime(selectedBooking.booking_time)}
                  </p>
                </div>
              </div>

              {/* Damage Description */}
              {selectedBooking.damage_description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Damage Description</h4>
                  <div className="mt-2 bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-900">{selectedBooking.damage_description}</p>
                  </div>
                </div>
              )}

              {/* Damage Image */}
              {selectedBooking.damage_image && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Damage Image</h4>
                  <div className="mt-2">
                    <ImageDisplay imageData={selectedBooking.damage_image} />
                  </div>
                </div>
              )}

              {/* Status Actions */}
              {selectedBooking.status === 'pending' && (
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedBooking.id, 'rejected');
                      setSelectedBooking(null);
                    }}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedBooking.id, 'accepted');
                      setSelectedBooking(null);
                    }}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Accept
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
