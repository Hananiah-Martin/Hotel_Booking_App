import React from 'react';
import { FaStar, FaUserCircle, FaMedal } from 'react-icons/fa';

const PropertyDetails = ({details}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white rounded-2xl shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold mb-2 text-gray-900">{details?.listing.title}</h1>
          <p className="text-gray-600 mb-4 flex items-center">
            <span className="mr-2">{details?.listing.location}.</span>
            <span className="mr-2">{details?.listing.country}</span>
          </p>
          <p className="mr-2">{details?.listing.description}</p>
        </div>
        <div className="flex items-center bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <img
                src={
                  `https://ui-avatars.com/api/?name=${details?.listing.owner.username.charAt(
                    0
                  )}&background=random&color=fff`
                }
  
                className="w-14 h-14 rounded-full border-2 border-white shadow-md"
              />
          <div className="ml-3">
            <div className="flex items-center">
              <p className="font-medium text-gray-900">Hosted by  {details?.listing.owner.username}</p>
              <FaMedal className="ml-2 text-rose-500" />
            </div>
            <p className="text-rose-500 font-medium">Superhost</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6 mt-8 border-y py-8">
        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <p className="font-medium text-gray-900 text-lg">4 guests</p>
          <p className="text-gray-600">Maximum capacity</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <p className="font-medium text-gray-900 text-lg">2 bedrooms</p>
          <p className="text-gray-600">2 queen beds</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <p className="font-medium text-gray-900 text-lg">2 bathrooms</p>
          <p className="text-gray-600">Both ensuite</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;