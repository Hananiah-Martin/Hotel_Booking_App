import React, { useEffect } from 'react';
import { FaWifi, FaSwimmingPool, FaUtensils, FaDoorClosed, FaInfoCircle } from 'react-icons/fa';

const AdditionalInfo = () => {
  const amenities = [
    { icon: <FaWifi />, name: 'High-speed WiFi' },
    { icon: <FaSwimmingPool />, name: 'Pool access' },
    { icon: <FaUtensils />, name: 'Fully equipped kitchen' },
    { icon: <FaDoorClosed />, name: 'Private entrance' },
  ];
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-8 bg-white rounded-2xl shadow-sm">
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center">
          <span className="bg-rose-100 p-2 rounded-lg mr-3">
            <FaInfoCircle className="text-rose-500" />
          </span>
          Amenities
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center bg-gray-50 p-4 rounded-xl hover:shadow-md transition-shadow">
              <span className="text-rose-500 text-xl mr-3">{amenity.icon}</span>
              <span className="text-gray-700 font-medium">{amenity.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">House Rules</h2>
        <div className="bg-gray-50 p-6 rounded-xl">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-rose-500 rounded-full mr-3"></span>
              Check-in after 3:00 PM
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-rose-500 rounded-full mr-3"></span>
              Checkout before 11:00 AM
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-rose-500 rounded-full mr-3"></span>
              No smoking
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-rose-500 rounded-full mr-3"></span>
              No pets
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AdditionalInfo;