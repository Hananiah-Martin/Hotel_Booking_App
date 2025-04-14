import React, { useState, useEffect} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaStar, FaRegCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import {useNavigate} from "react-router-dom";
const BookingCard = ({ details }) => {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (checkIn && checkOut) {
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      setNumberOfDays(days > 0 ? days : 0);
      setAmount(days * details?.listing?.price || 0);
    }
  }, [checkIn, checkOut, details]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates.");
      return;
    }
    try {
      setLoading(true);
      const orderResponse = await axios.post("https://hotel-booking-app-ohkw.onrender.com/create-order", { amount });
      const order = orderResponse.data;
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: `${details.listing.title}`,
        description: "Product/Service Description",
        order_id: order.id,
        handler: async function (response) {
          const paymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          const verifyResponse = await axios.post("https://hotel-booking-app-ohkw.onrender.com/verify-payment", paymentData);
          if (verifyResponse.data.status === "success") {
            const bookingData = {
              userId: localStorage.getItem("userId"),
              listingId: details?.listing._id,
              paymentId: response.razorpay_payment_id,
              checkInDate: checkIn,
              checkOutDate: checkOut,
            };
            const bookingResponse = await axios.post("https://hotel-booking-app-ohkw.onrender.com/create-booking", bookingData);
            if (bookingResponse.data.success) {
              alert("Payment successful! Your booking is confirmed.");
              navigate("/bookings");
            } else {
              alert("Booking failed. Please contact support.");
            }
          } else {
            alert("Payment verification failed. Please try again.");
          }
        },
        theme: { color: "#3399cd" },
      };

      const razorpayWindow = new window.Razorpay(options);
      razorpayWindow.open();

      razorpayWindow.on("payment.failed", function (response) {
        alert("Payment failed: " + response.error.description);
      });
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-2xl shadow-lg p-6 sticky top-8 bg-white hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <div>
          <span className="text-3xl font-bold text-gray-900">₹{details?.listing?.price}</span>
          <span className="text-gray-600"> / night</span>
        </div>
        <div className="flex items-center bg-rose-50 px-3 py-1 rounded-lg">
          <FaStar className="text-rose-500" />
          <span className="ml-1 font-medium text-gray-900">{Math.floor(details?.listing.reviews.reduce((acc, rev) => acc + parseInt(rev.rating), 0) / details?.listing.reviews.length)}</span>
          <span className="text-gray-600 ml-1">({details?.listing.reviews.length})</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-xl">
          <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
          <div className="relative">
            <DatePicker selected={checkIn} onChange={setCheckIn} className="w-full border rounded-lg p-2 pl-8 bg-white" placeholderText="Select date" />
            <FaRegCalendarAlt className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
          <div className="relative">
            <DatePicker selected={checkOut} onChange={setCheckOut} className="w-full border rounded-lg p-2 pl-8 bg-white" placeholderText="Select date" />
            <FaRegCalendarAlt className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="relative" onMouseEnter={() => !currentUser && setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
        <button
          className={`w-full bg-rose-500 text-white py-4 rounded-xl font-medium shadow-md transition-colors mt-4 ${
            currentUser ? 'hover:bg-rose-600 hover:shadow-lg active:scale-[0.99] transform transition-transform' : 'opacity-90 cursor-not-allowed'
          }`}
          onClick={currentUser ? handlePayment : undefined}
          disabled={numberOfDays <= 0 || !currentUser}
        >
          Reserve Now
        </button>
        {!currentUser && showTooltip && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap z-10">
            Sign in to continue
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-gray-900"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;