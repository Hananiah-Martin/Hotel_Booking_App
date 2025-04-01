import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FaStar, FaHeart } from "react-icons/fa";
import axios from "axios";

function FilterListings() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]); // Separate state for filtered listings
  const { location } = useParams(); // Extract location from URL params

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get("http://localhost:8080/listing");
        setListings(response.data.allListings);
      } catch (error) {
        console.error("Error while fetching listings:", error);
      }
    };
    fetchListings();
  }, []);

  useEffect(() => {
    if (!location) {
      setFilteredListings(listings);
    } else {
      const filtered = listings.filter((listing) =>
        listing.location.toLowerCase().includes(location.toLowerCase())
      );
      setFilteredListings(filtered);
    }
  }, [location, listings]); // Depend on `location` and `listings`

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Properties</h1>

      {filteredListings.length === 0 ? (
        <p className="text-gray-600 text-center">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map((property) => (
            <Link
              to={`/property/${property._id}`}
              key={property._id} // Corrected key prop
              className="group"
            >
              <div className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={property.image.url}
                    alt={property.title}
                    className="w-full h-64 object-cover"
                  />
                  <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
                    <FaHeart className="h-5 w-5 text-gray-600 hover:text-airbnb-primary" />
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg group-hover:text-airbnb-primary transition-colors">
                      {property.title}
                    </h3>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span>{5}</span>
                    </div>
                  </div>

                  <p className="text-gray-500 mt-1">{property.location}</p>
                  <p className="mt-2 font-semibold">${property.price} / night</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterListings;
