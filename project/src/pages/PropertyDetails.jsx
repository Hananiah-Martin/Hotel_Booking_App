import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaHeart, FaShare, FaUser } from 'react-icons/fa';
import axios from "axios";
function PropertyDetails() {
  const { id } = useParams();
  const [selectedDates, setSelectedDates] = useState({ checkIn: '', checkOut: '' });
  // Mock data for the property
  const property = {
    id,
    title: 'Luxury Villa with Ocean View',
    location: 'Malibu, California',
    price: 450,
    rating: 4.9,
    description: 'Experience luxury living in this stunning oceanfront villa. Featuring panoramic views, a private pool, and direct beach access. Perfect for families or groups looking for an unforgettable stay.',
    images: [
      'https://source.unsplash.com/random/1200x800?luxury,villa,1',
      'https://source.unsplash.com/random/1200x800?luxury,villa,2',
      'https://source.unsplash.com/random/1200x800?luxury,villa,3',
    ],
    amenities: ['Pool', 'WiFi', 'Kitchen', 'Free parking', 'Air conditioning', 'Beach access'],
    reviews: [
      {
        id: 1,
        user: 'John D.',
        rating: 5,
        comment: 'Amazing property with breathtaking views. Will definitely return!',
        date: 'March 2024'
      },
      {
        id: 2,
        user: 'Sarah M.',
        rating: 4.8,
        comment: 'Beautiful location and excellent amenities. Highly recommended.',
        date: 'February 2024'
      }
    ]
  };

  async function initiatePayment() {
    console.log("payment inititated");
    const amount = "<%=listing.price%>";
    try {
      // Create order
      const response = await fetch("/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: amount }),
      });

      const order = await response.json();

      // Razorpay options
      const options = {
        key: "<%= razorpay_key %>",
        amount: order.amount,
        currency: order.currency,
        name: "WanderLust",
        description: "<%=listing.price%>",
        image: "https://example.com/your_logo",
        order_id: order.id,
        handler: async function (response) {
          // Verify payment on the server
          const verifyResponse = await fetch("/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verificationResult = await verifyResponse.json();

          if (verificationResult.status === "success") {
            alert("Payment Successful!");
          } else {
            alert("Payment Failed");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9865789846",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      // Open Razorpay checkout
      const rzp1 = new Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Payment initiation failed");
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{listings.title}</h1>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaStar className="text-yellow-400 mr-1" />
          <span>{property.rating}</span>
          <span className="mx-2">·</span>
          <span>{property.reviews.length} reviews</span>
          <span className="mx-2">·</span>
          <span>{property.location}</span>
        </div>
        
        <div className="flex space-x-4">
          <button className="flex items-center text-gray-600 hover:text-black">
            <FaShare className="mr-2" />
            Share
          </button>
          <button className="flex items-center text-gray-600 hover:text-airbnb-primary">
            <FaHeart className="mr-2" />
            Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {property.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Property view ${index + 1}`}
            className={`w-full h-[400px] object-cover rounded-lg ${index === 0 ? 'col-span-2' : ''}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">About this place</h2>
          <p className="text-gray-600 mb-6">{property.description}</p>

          <h3 className="text-xl font-semibold mb-4">Amenities</h3>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {property.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center text-gray-600">
                <span className="mr-2">✓</span>
                {amenity}
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold mb-4">Reviews</h3>
          <div className="space-y-6">
            {property.reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-center mb-2">
                  <FaUser className="h-10 w-10 text-gray-400 bg-gray-100 rounded-full p-2" />
                  <div className="ml-4">
                    <p className="font-semibold">{review.user}</p>
                    <p className="text-gray-500">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span>{review.rating}</span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 border rounded-xl p-6 shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">${property.price} / night</h3>
            
            <form onSubmit={initiatePayment}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                  <input
                    type="date"
                    className="w-full border rounded-lg p-2"
                    value={selectedDates.checkIn}
                    onChange={(e) => setSelectedDates({ ...selectedDates, checkIn: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                  <input
                    type="date"
                    className="w-full border rounded-lg p-2"
                    value={selectedDates.checkOut}
                    onChange={(e) => setSelectedDates({ ...selectedDates, checkOut: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-airbnb-primary text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Reserve
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;