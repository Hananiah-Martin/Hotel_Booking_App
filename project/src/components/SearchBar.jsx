import { useState } from 'react';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const [location, setLocation] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate=useNavigate();
  const handleSearch = (e) => {
    e.preventDefault();
    setIsExpanded(false);
    navigate(`/listings/${location}`);
  };
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Mobile Search Bar */}
      <div className="md:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between bg-white rounded-full shadow-lg border p-4 mb-4"
        >
          <div className="flex items-center">
            <FaSearch className="text-red-500 mr-3" />
            <span className="text-gray-500">{location || "Where to?"}</span>
          </div>
        </button>

        {isExpanded && (
          <div className="fixed inset-0 bg-white z-50 p-4">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Find your destination</h2>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-red-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    className="w-full bg-transparent focus:outline-none"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-red-500 text-white py-4 rounded-lg font-semibold hover:bg-red-600 transition-colors mt-4 flex items-center justify-center"
              >
                <FaSearch className="mr-2" />
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Desktop Search Bar */}
      <form onSubmit={handleSearch} className="hidden md:block">
        <div className="flex items-center bg-white rounded-full shadow-lg border p-2">
          <div className="flex-grow min-w-0 px-4 py-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-red-500 mr-2" />
              <input
                type="text"
                placeholder="Where are you going?"
                className="w-full focus:outline-none"
                color='black'
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="ml-4 px-6 py-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center"
          >
            <FaSearch className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;