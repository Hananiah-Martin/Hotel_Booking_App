import React from 'react';
import { Calendar, Clock, CheckCircle, MapPin } from 'lucide-react';
import {useEffect, useState} from 'react';
import axios from 'axios';
const Bookings = () => {
  // Sample data from your backend - now as an array
  const userId=localStorage.getItem("userId");
  const [bookings,setBookings]=useState();
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`https://hotel-booking-app-ohkw.onrender.com/bookings/${userId}`);
        setBookings(response.data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
  
    if (userId) {
      fetchBookings();
    }
  }, [userId]); 
  // Format dates nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Convert string to Date object
    if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid dates
  
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };
  
  // Calculate duration of stay
  const calculateDuration = (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);  // Convert string to Date object
    const checkOutDate = new Date(checkOut);
  
    if (isNaN(checkInDate) || isNaN(checkOutDate)) return 0; // Handle invalid dates
  
    const differenceInTime = checkOutDate.getTime() - checkInDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  
    return Math.ceil(differenceInDays); // Always round up
  };
  
  
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  const handleCancelBooking = async (bookingId) => {
    try { 
      const response = await axios.put(`https://hotel-booking-app-ohkw.onrender.com/cancel-booking/${bookingId}`);
    }catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  // Individual Booking Card Component
  const BookingCard = ({ booking }) => (
    <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden border border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 mb-4">
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
        <div className="p-4 w-full">
          {/* Header with ID and Status */}
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-medium text-gray-900 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">#{booking._id.substring(booking._id.length - 5)}</div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
              <CheckCircle className="h-3 w-3 mr-1" />
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
          
          {/* Property Title and Location */}
          <div className="mb-3">
            <h3 className="text-sm font-bold text-gray-800 truncate">{booking?.listingId.title}</h3>
            <div className="flex items-center text-gray-500 mt-0.5">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="text-xs truncate">{booking.listingId.location}</span>
            </div>
          </div>
          
          {/* Check-in/Check-out Section */}
          <div className="bg-blue-50 rounded p-2 mb-3 border border-blue-100 grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <div className="rounded-full bg-pink-100 p-1 mr-2">
                <Calendar className="h-3 w-3 text-pink-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-700">Check-in</div>
                <div className="text-xs text-gray-600">{formatDate(booking.checkInDate)}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="rounded-full bg-indigo-100 p-1 mr-2">
                <Calendar className="h-3 w-3 text-indigo-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-700">Check-out</div>
                <div className="text-xs text-gray-600">{formatDate(booking.checkOutDate)}</div>
              </div>
            </div>
          </div>
          
          {/* Footer with Duration and Button */}
          <div className="flex justify-between items-center">
            <div className="flex items-center text-xs text-purple-700">
              <Clock className="h-3 w-3 text-purple-600 mr-1" />
              <span>{calculateDuration(booking.checkInDate, booking.checkOutDate)} nights</span>
            </div>
            {booking.status === 'confirmed' && <button className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-gradient-to-r from-red-500 to-red-500 hover:from-red-600 hover:to-red-600 focus:outline-none transition-all duration-300" onClick={handleCancelBooking(booking._id)}>
              Cancel
            </button>}
            
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Your Bookings</h2>
      
      {bookings?.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No bookings found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings?.map(booking => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;