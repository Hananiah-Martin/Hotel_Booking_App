import { useState, useEffect } from 'react';
import { FaRupeeSign } from 'react-icons/fa';
import axios from 'axios';
function Listings() {
  const [listings, setListings] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('http://localhost:8080/listing');
        const data = await response.json();
        setListings(data.allListings);
      } catch (error) {
        console.error('Error while fetching listings:', error);
      }
    };
    fetchListings();
  }, []);

  const openWishlistModal = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleWishList = async () => {
    if (!selectedProperty) return;

    const userId = localStorage.getItem('userId');

    try {
      const response=await axios.post(`http://localhost:8080/listing/wishlist`,{userId,listingId:selectedProperty._id});
      setIsModalOpen(false);
      setSelectedProperty(null);
    } catch (error) {
      console.error('Error while adding to wishlist:', error);
      alert('Failed to add property to wishlist');
    }
  };

  const handlePropertyClick = (propertyId) => {
    // Simulated navigation
    window.location.href = `/property/${propertyId}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Properties</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((property) => (
          <div key={property._id} className="group relative">
            <div 
              onClick={() => handlePropertyClick(property._id)}
              className="cursor-pointer"
            >
              <div className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={property.image?.url || '/placeholder-image.png'}
                    alt={property.country || 'Property'}
                    className="w-full h-64 object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg group-hover:text-blue-500 transition-colors">
                      {property.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-500 mt-1">{property.location}</p>
    
                  <p className="mt-2 font-semibold">₹{property.price} / night</p>
                </div>
              </div>
            </div>

            {/* Wishlist Button */}
            <button 
              className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
              onClick={() => openWishlistModal(property)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-600 hover:text-red-500" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Tailwind CSS Modal */}
      {isModalOpen && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Add to Wishlist</h2>
            <p className="text-gray-600 mb-6">
              Do you want to add "{selectedProperty.title}" to your wishlist?
            </p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleWishList}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Listings;