import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ImageCarousel from './ImageCarousel'
import PropertyDetails from "./PropertyDetails"
import Reviews from "./Reviews"
import AdditionalInfo from './AdditionalInfo'
import BookingCard from "./BookingCard"
import { useParams } from 'react-router-dom'
import axios from 'axios'

const Property = () => {
  const listingId = useParams().id;
  const navigate = useNavigate();
  const [property, setProperty] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHoveringEdit, setIsHoveringEdit] = useState(false);
  const [isHoveringDelete, setIsHoveringDelete] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const userId = localStorage.getItem('userId') 

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/listing/${listingId}`);        
        setProperty(response.data);        
      } catch (error) {
        console.error('Error while fetching listings:', error);
      }
    };
    fetchListings();
  }, [listingId]);

  const handleEdit = () => {
    navigate(`/property/${listingId}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:8080/listing/${listingId}`);
      setShowDeleteModal(false);
      // Custom success notification could be added here
      setTimeout(() => {
        navigate('/listings'); // Redirect to listings page after deletion
      }, 500);
    } catch (error) {
      console.error('Error deleting property:', error);
      setShowDeleteModal(false);
      // Custom error notification could be added here
    } finally {
      setIsDeleting(false);
    }
  };
  const isOwner = property && 
                  property.listing && 
                  property.listing.owner && 
                  property.listing.owner._id === userId;
  const DeleteConfirmationModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full mx-auto overflow-hidden shadow-2xl transform transition-all animate-fadeIn">
          <div className="bg-red-50 p-6 text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Property</h3>
            <div className="mb-6 text-gray-600">
              <p>Are you sure you want to delete this property?</p>
              <p className="mt-2 text-sm">This action cannot be undone.</p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showDeleteModal && <DeleteConfirmationModal />}
      
      <div className="mb-8">
        <ImageCarousel details={property}/>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Admin Actions Row - Only shown if user is the owner */}
        {isOwner && (
          <div className="flex justify-end gap-4 mb-6">
            <button 
              onClick={handleEdit}
              onMouseEnter={() => setIsHoveringEdit(true)}
              onMouseLeave={() => setIsHoveringEdit(false)}
              className={`px-5 py-2.5 rounded-lg font-medium text-white transition-all duration-300 transform shadow-md ${
                isHoveringEdit 
                  ? 'bg-blue-600 -translate-y-1 shadow-lg scale-105' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-300 active:bg-blue-700`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Property
            </button>
            
            <button 
              onClick={() => setShowDeleteModal(true)}
              onMouseEnter={() => setIsHoveringDelete(true)}
              onMouseLeave={() => setIsHoveringDelete(false)}
              className={`px-5 py-2.5 rounded-lg font-medium text-white transition-all duration-300 transform shadow-md ${
                isHoveringDelete 
                  ? 'bg-red-600 -translate-y-1 shadow-lg scale-105' 
                  : 'bg-red-500 hover:bg-red-600'
              } flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-300 active:bg-red-700`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Property
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PropertyDetails details={property} />
            <Reviews details={property}/>
            <AdditionalInfo />
          </div>
          <div className="lg:col-span-1">
            <BookingCard details={property}/>
          </div>
        </div>
      </div>
      
      {/* Add this to your CSS or as a style tag */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default Property