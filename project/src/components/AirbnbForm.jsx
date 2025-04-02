import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateListingForm = () => {
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    country: '',
    price: '',
    description: '',
    location: '',
    landmark: '',
    userId: userId,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageFilename, setImageFilename] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for price to allow empty string or valid numbers only
    if (name === 'price') {
      if (value === '' || !isNaN(parseFloat(value))) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle image upload and store filename and preview URL
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageFilename(file.name); // Save the filename

      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate required fields
    if (!formData.title || !formData.landmark || !formData.price || !image) {
      setError('Title, landmark, price, and image are required.');
      setIsSubmitting(false);
      return;
    }

    // Convert price to a number and validate conversion
    const priceNumber = parseFloat(formData.price);
    if (isNaN(priceNumber)) {
      setError('Please enter a valid price.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Create FormData object to send multipart/form-data
      const listingFormData = new FormData();

      // Append nested fields
      Object.keys(formData).forEach((key) => {
        listingFormData.append(`listing[${key}]`, formData[key]);
      });

      // Append the image file
      listingFormData.append('listing[image]', image);

      // Append the filename and preview URL (image URL)
      listingFormData.append('listing[filename]', imageFilename);
      listingFormData.append('listing[url]', preview);

      // Send the request to the backend endpoint
      const response = await axios.post('https://hotel-booking-app-ohkw.onrender.com/listing/newlisting', listingFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Redirect after successful creation
      navigate('/');
    } catch (err) {
      console.error('Error creating listing:', err);
      setError(err.response?.data?.error || 'Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-2xl border border-gray-100 my-10">
      <div className="flex items-center mb-8">
        <div className="w-2 h-8 bg-red-500 rounded mr-3"></div>
        <h1 className="text-3xl font-bold text-gray-800">Create Your Listing</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-md">
          <div className="flex">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Title */}
          <div className="col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Listing Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 shadow-sm hover:shadow"
              placeholder="What makes your place special?"
            />
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 shadow-sm hover:shadow"
              placeholder="Country"
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price per Night
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 text-lg">$</span>
              </div>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full pl-8 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 shadow-sm hover:shadow"
                placeholder="0.00"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">Set a competitive price to attract guests</p>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 shadow-sm hover:shadow"
              placeholder="City, State"
            />
          </div>

          {/* Landmark */}
          <div>
            <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-2">
              Nearby Landmark
            </label>
            <input
              type="text"
              id="landmark"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 shadow-sm hover:shadow"
              placeholder="What's nearby?"
            />
          </div>

          {/* Image Upload */}
          <div className="col-span-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Upload Photos
            </label>
            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg transition-all duration-300 ${preview ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
              <div className="space-y-1 text-center">
                {preview ? (
                  <div className="mb-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="mx-auto h-60 w-auto object-cover rounded-lg shadow-md"
                    />
                    <p className="mt-2 text-sm text-gray-600">Looking good! Click below to change.</p>
                  </div>
                ) : (
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <div className="flex justify-center text-sm text-gray-600">
                  <label
                    htmlFor="image-upload"
                    className="relative cursor-pointer bg-white py-2 px-4 rounded-md font-medium text-red-600 hover:text-red-700 hover:bg-gray-100 focus-within:outline-none transition-colors duration-200 shadow-sm"
                  >
                    <span>Upload photos</span>
                    <input
                      id="image-upload"
                      name="image-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                      required
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 shadow-sm hover:shadow"
              placeholder="Describe what makes your place unique and why guests will love staying there..."
            ></textarea>
            <p className="mt-2 text-xs text-gray-500">Be descriptive! Help guests imagine their stay.</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mr-4 px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:-translate-y-1 ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </div>
            ) : (
              'Publish Your Listing'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListingForm;