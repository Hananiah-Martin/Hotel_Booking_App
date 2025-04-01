import React from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { useAuth } from "../../AuthContext";
const Reviews = ({ details }) => {
  const { currentUser } = useAuth();
  let sum = 0;
  for (let i = 0; i < details?.listing.reviews.length; i++) {
    let num = parseInt(details?.listing.reviews[i].rating);
    sum = sum + num;
  }
  let average = Math.floor(sum / details?.listing.reviews.length);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-8 bg-white rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-8 pb-4 border-b">
        <div className="flex items-center">
          {details?.listing.reviews.length === 0 ? (
            <span className="text-2xl font-semibold ml-2 text-gray-900">
              No Reviews Yet
            </span>
          ) : (
            <span className="text-2xl font-semibold ml-2 text-gray-900">
              {average}
            </span>
          )}
          <FaStar className="text-yellow-400 text-2xl" />
        </div>

        {currentUser!=null && <button
          onClick={() =>
            (window.location.href = `/property/${details?.listing._id}/review`)
          }
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Write a Review
      </button>}
      </div>

      <div className="grid gap-8">
        {details?.listing.reviews.map((review) => (
          <div
            key={review.id}
            className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <img
                src={
                  review.image ||
                  `https://ui-avatars.com/api/?name=${review.author.username.charAt(
                    0
                  )}&background=random&color=fff`
                }
                alt={review.author.username.charAt(0).toUpperCase()}
                className="w-14 h-14 rounded-full border-2 border-white shadow-md"
              />

              <div className="ml-4">
                <h3 className="font-medium text-gray-900">
                  {review?.author?.username
                    ? review.author.username.charAt(0).toUpperCase() +
                      review.author.username.slice(1)
                    : ""}
                </h3>

                <p className="text-gray-600">
                  {review?.createdAt?.slice(0, 10)}
                </p>
              </div>
            </div>
            <div className="flex items-center mb-3">
              {[...Array(Number(review.rating))].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 mr-1" />
              ))}
            </div>

            <div className="relative">
              <FaQuoteLeft className="text-gray-200 text-xl absolute -left-2 -top-2" />
              <p className="text-gray-700 italic pl-6">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
