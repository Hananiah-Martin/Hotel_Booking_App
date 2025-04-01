import SearchBar from '../components/SearchBar';
import { FaStar } from 'react-icons/fa';
import Listings from './Listings';

function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-gradient-to-r from-rose-500 to-purple-500">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-black p-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Find your next stay
            </h1>
            <p className="text-xl mb-8">
              Search deals on hotels, homes, and much more...
            </p>
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Featured Sections */}
      <Listings/>
    </div>
  );
}

export default Home;