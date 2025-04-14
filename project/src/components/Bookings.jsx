import React, { useEffect, useState } from "react";
import { Calendar, Clock, CheckCircle, MapPin } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Bookings = () => {
  const userId = localStorage.getItem("userId");
  const [bookings, setBookings] = useState();
  const [showModal, setShowModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `https://hotel-booking-app-ohkw.onrender.com/bookings/${userId}`
      );
      setBookings(response.data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const calculateDuration = (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (isNaN(checkInDate) || isNaN(checkOutDate)) return 0;
    const differenceInTime = checkOutDate.getTime() - checkInDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return Math.ceil(differenceInDays);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const handleCancelClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowModal(true);
  };

  const confirmCancellation = async () => {
    try {
      await axios.put(
        `https://hotel-booking-app-ohkw.onrender.com/cancel-booking/${selectedBookingId}`
      );
      toast.success("Booking cancelled successfully!", {
        position: "top-right",
      });
      setShowModal(false);
      setSelectedBookingId(null);
      fetchBookings();
    } catch (error) {
      toast.error("Failed to cancel booking.", {
        position: "top-right",
      });
      console.error("Error cancelling booking:", error);
    }
  };

  const BookingCard = ({ booking }) => (
    <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden border border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 mb-4">
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
        <div className="p-4 w-full">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-medium text-gray-900 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              #{booking._id.substring(booking._id.length - 5)}
            </div>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                booking.status
              )}`}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>

          <div className="mb-3">
            <h3 className="text-sm font-bold text-gray-800 truncate">
              {booking?.listingId.title}
            </h3>
            <div className="flex items-center text-gray-500 mt-0.5">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="text-xs truncate">
                {booking.listingId.location}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 rounded p-2 mb-3 border border-blue-100 grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <div className="rounded-full bg-pink-100 p-1 mr-2">
                <Calendar className="h-3 w-3 text-pink-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-700">
                  Check-in
                </div>
                <div className="text-xs text-gray-600">
                  {formatDate(booking.checkInDate)}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="rounded-full bg-indigo-100 p-1 mr-2">
                <Calendar className="h-3 w-3 text-indigo-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-700">
                  Check-out
                </div>
                <div className="text-xs text-gray-600">
                  {formatDate(booking.checkOutDate)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center text-xs text-purple-700">
              <Clock className="h-3 w-3 text-purple-600 mr-1" />
              <span>
                {calculateDuration(booking.checkInDate, booking.checkOutDate)}{" "}
                nights
              </span>
            </div>
            {booking.status === "confirmed" && (
              <button
                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-gradient-to-r from-red-500 to-red-500 hover:from-red-600 hover:to-red-600 focus:outline-none transition-all duration-300"
                onClick={() => handleCancelClick(booking._id)}
              >
                Cancel
              </button>
            )}
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
          {bookings?.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Cancel Booking?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to cancel this booking?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={confirmCancellation}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Bookings;
