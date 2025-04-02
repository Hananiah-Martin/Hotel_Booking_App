import React, { useState } from 'react';
import axios from 'axios';
import { useParams,useNavigate} from 'react-router-dom';
const ReviewForm = () => {
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    userId:'',
  });
  const navigate = useNavigate();
  const userId=localStorage.getItem('userId');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const {id}=useParams();
  // Handle star rating change
  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
    if (errors.rating) {
      const newErrors = { ...errors };
      delete newErrors.rating;
      setErrors(newErrors);
    }
  };

  // Handle comment change
  const handleCommentChange = (e) => {
    setFormData({ ...formData, comment: e.target.value });
    if (errors.comment && e.target.value.length >= 10) {
      const newErrors = { ...errors };
      delete newErrors.comment;
      setErrors(newErrors);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    if (formData.comment.length < 10) {
      newErrors.comment = 'Comment must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validateForm()) {
        formData.userId=userId;
      const response=await axios.post(`https://hotel-booking-app-ohkw.onrender.com/listing/${id}/reviews`,formData);
      navigate(`/property/${id}`);
      setSubmitted(true);
    }
  };

  // Get rating label based on selected rating
  const getRatingLabel = (rating) => {
    const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return labels[rating];
  };

  // Star rating component
  const StarRating = () => {
    return (
      <div className="flex flex-col items-start">
        <div className="flex items-center mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="w-10 h-10 focus:outline-none transform transition-all duration-200 hover:scale-110"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleRatingChange(star)}
                aria-label={`${star} stars`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={formData.rating >= star || hoverRating >= star ? '#FF385C' : '#DDDDDD'}
                  className="w-full h-full transition-all duration-200"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ))}
          </div>
          {(formData.rating > 0 || hoverRating > 0) && (
            <span className="ml-3 font-medium text-gray-700 transition-all duration-200">
              {getRatingLabel(hoverRating || formData.rating)}
            </span>
          )}
        </div>
      </div>
    );
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform transition-all duration-500 animate-fade-in">
        <div className="bg-green-50 p-4 rounded-full inline-block mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Thank you for your review!</h2>
        <p className="text-gray-600 mb-6">Your feedback helps us improve our service for everyone.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-6 py-3 bg-white border border-gray-200 hover:border-gray-300 rounded-lg text-gray-800 font-medium transition-all duration-200 hover:shadow-md"
        >
          Write another review
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
  <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md transform transition-all duration-300 hover:shadow-2xl">
    <div className="flex items-center mb-6">
      <div className="h-10 w-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center text-white mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Share your experience</h2>
    </div>
    
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          How would you rate your experience? <span className="text-red-500">*</span>
        </label>
        <StarRating />
        {errors.rating && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {errors.rating}
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
          Tell us about your stay <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <textarea
            id="comment"
            rows="4"
            className={`w-full px-4 py-3 text-gray-700 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.comment ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-pink-500'
            }`}
            placeholder="What did you like? What could have been better? (minimum 10 characters)"
            value={formData.comment}
            onChange={handleCommentChange}
          ></textarea>
          <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-white px-2 py-1 rounded-full border shadow-sm">
            {formData.comment.length} / 10+
          </div>
        </div>
        {errors.comment && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {errors.comment}
          </p>
        )}
      </div>
      
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-medium py-3 px-4 rounded-xl transition duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transform hover:scale-105 shadow-md"
      >
        Submit Review
      </button>
    </form>
  </div>
</div>

  );
};

export default ReviewForm;