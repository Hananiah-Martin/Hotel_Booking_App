import React, { useState,useEffect} from 'react';
import ImageGallery from 'react-image-gallery';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import "react-image-gallery/styles/css/image-gallery.css";
import axios from 'axios';
import { useParams } from 'react-router-dom';
const images = [
  {
    original: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100',
  },
];

const ImageCarousel = ({details}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  images[0].original=details?.listing.image.url;
  images[0].thumbnail=details?.listing.image.url;
  return (
    <div className="relative">
      <ImageGallery 
        items={images}
        showPlayButton={false}
        showFullscreenButton={false}
        showNav={true}
      />
      <button
        onClick={() => setIsFavorite(!isFavorite)}
        className="absolute top-4 right-4 z-10 text-2xl text-white hover:scale-110 transition-transform"
      >
        {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
      </button>
    </div>
  );
};

export default ImageCarousel;