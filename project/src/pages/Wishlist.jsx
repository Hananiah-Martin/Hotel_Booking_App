import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaHeart } from "react-icons/fa";
import axios from "axios";
function Wishlist() {
  const userId = localStorage.getItem("userId");
  const [wishlist, setWishList] = useState([]);
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/listing/fetchWishList/${userId}`
        );
        setWishList(response.data);
      } catch (error) {
        console.error("Error while fetching wishlist:", error);
      }
    };
    fetchWishlist();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-semibold mb-4">
            Your wishlist is empty
          </h2>
          <p className="text-gray-500">
            Add properties to your wishlist to see them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((property) => (
            <div key={property.id} className="relative">
              <Link to={`/property/${property._id}`}>
                <div className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={property.image.url}
                      alt={property.title}
                      className="w-full h-64 object-cover"
                    />
                    <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
                      <FaHeart className="h-5 w-5 text-airbnb-primary" />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">
                        {property.title}
                      </h3>
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span>{property.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-500 mt-1">{property.location}</p>
                    <p className="mt-2 font-semibold">
                      ${property.price} / night
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
