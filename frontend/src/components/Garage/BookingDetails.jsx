import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BookingDetails = ({ booking, onClose, onStatusUpdate }) => {
 const { user } = useAuth();

 return (
   <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
     <div className="relative top-20 mx-auto p-5 border w-full max-w-xl shadow-lg rounded-md bg-white">
       <div className="flex justify-between items-center mb-4">
         <h3 className="text-lg font-medium text-gray-900">
           Booking Details
         </h3>
         <button
           onClick={onClose}
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
             <p className="text-sm text-gray-900">Name: {booking.customer_name}</p>
             <p className="text-sm text-gray-900">Phone: {booking.phone_number}</p>
           </div>
         </div>

         {/* Booking Time */}
         <div>
           <h4 className="text-sm font-medium text-gray-500">Appointment Time</h4>
           <div className="mt-2 bg-gray-50 p-3 rounded-md">
             <p className="text-sm text-gray-900">
               Date: {format(new Date(booking.booking_date), 'MMMM dd, yyyy')}
             </p>
             <p className="text-sm text-gray-900">
               Time: {format(new Date(`2000-01-01 ${booking.booking_time}`), 'hh:mm a')}
             </p>
           </div>
         </div>

         {/* Message Button */}
         <div className="mt-4">
           <Link 
             to={`/${user.userType}/chat?bookingId=${booking.id}`}
             className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
           >
             <svg 
               className="h-5 w-5 mr-2" 
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
           </Link>
         </div>

         {/* Damage Information */}
         {booking.damage_description && (
           <div>
             <h4 className="text-sm font-medium text-gray-500">Damage Description</h4>
             <div className="mt-2 bg-gray-50 p-3 rounded-md">
               <p className="text-sm text-gray-900">{booking.damage_description}</p>
             </div>
           </div>
         )}

         {/* Damage Image */}
         {booking.damage_image && (
           <div>
             <h4 className="text-sm font-medium text-gray-500">Damage Image</h4>
             <div className="mt-2">
               <img
                 src={`data:image/jpeg;base64,${booking.damage_image}`}
                 alt="Damage"
                 className="w-full h-auto rounded-md"
               />
             </div>
           </div>
         )}

         {/* Status Actions */}
         {booking.status === 'pending' && (
           <div className="mt-6 flex justify-end space-x-3">
             <button
               onClick={() => {
                 onStatusUpdate(booking.id, 'rejected');
                 onClose();
               }}
               className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
             >
               Reject
             </button>
             <button
               onClick={() => {
                 onStatusUpdate(booking.id, 'accepted');
                 onClose();
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
 );
};

export default BookingDetails;