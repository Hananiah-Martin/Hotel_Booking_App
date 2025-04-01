import { Link, useNavigate } from 'react-router-dom';
import { FaAirbnb, FaUserCircle, FaUmbrellaBeach, FaTicketAlt, FaSwimmingPool, FaMountain, FaFortAwesome, FaBed, FaConciergeBell, FaCamera, FaTractor, FaCaravan, FaBars, FaBookmark, FaHotel, FaHome, FaCompass, FaHeart, FaCalendarAlt, FaSignOutAlt, FaPlus } from 'react-icons/fa';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useAuth } from '../AuthContext';
import { toast } from 'react-toastify';

function Navbar() {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  
  const categories = [
    { icon: FaUmbrellaBeach, label: 'Islands' },
    { icon: FaTicketAlt, label: 'Beach' },
    { icon: FaSwimmingPool, label: 'Amazing pools' },
    { icon: FaMountain, label: 'Top of the world' },
    { icon: FaFortAwesome, label: 'Castles' },
    { icon: FaBed, label: 'Rooms' },
    { icon: FaConciergeBell, label: 'Luxe' },
    { icon: FaCamera, label: 'Amazing views' },
    { icon: FaTractor, label: 'Farms' },
    { icon: FaCaravan, label: 'Camper vans' },
  ];

  async function handleSignOut(e) {
    e.preventDefault();
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/");
    setCurrentUser(null);
    toast.success("Logged out successfully!");
  }
  
  return (
    <div className="sticky top-0 z-50 bg-white">
      <nav className="border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <FaHotel className="h-8 w-8 text-blue-600" />
              <span className="text-blue-600 font-bold text-xl ml-2 hidden sm:inline">Book My Hotel</span>
            </Link>
            
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200 flex items-center">
                <FaHome className="mr-1 h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link to="/listings" className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200 flex items-center">
                <FaCompass className="mr-1 h-4 w-4" />
                <span>Explore</span>
              </Link>
              
              {currentUser && (
                <>
                <Link to="/wishlist" className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200 flex items-center">
                <FaHeart className="mr-1 h-4 w-4" />
                <span>Wishlist</span>
              </Link>
                  <Link to="/bookings" className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200 flex items-center">
                    <FaCalendarAlt className="mr-1 h-4 w-4" />
                    <span>Bookings</span>
                  </Link>
                  <Link to="/newlisting" className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200 flex items-center">
                    <FaPlus className="mr-1 h-4 w-4" />
                    <span>New Listing</span>
                  </Link>
                  <button 
                    onClick={handleSignOut} 
                    className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200 flex items-center"
                  >
                    <FaSignOutAlt className="mr-1 h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </>
              )}
              {!currentUser && (
                <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                  Signup
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2 rounded-full border p-2 hover:shadow-md transition-shadow duration-200">
                  <FaBars className="h-5 w-5 text-blue-600" />
                </Menu.Button>
                
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {/* Mobile Navigation Options */}
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link to="/" className={`${active ? 'bg-blue-50' : ''} text-blue-600 flex items-center px-4 py-2 text-sm`}>
                            <FaHome className="mr-3 h-4 w-4" />
                            Home
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link to="/listings" className={`${active ? 'bg-gray-50' : ''} text-red-600 flex items-center px-4 py-2 text-sm`}>
                            <FaCompass className="mr-3 h-4 w-4" />
                            Explore
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link to="/wishlist" className={`${active ? 'bg-blue-50' : ''} text-blue-600 flex items-center px-4 py-2 text-sm`}>
                            <FaHeart className="mr-3 h-4 w-4" />
                            Wishlist
                          </Link>
                        )}
                      </Menu.Item>
                      {/* Added Bookings to Mobile View */}
                      {currentUser && (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <Link to="/bookings" className={`${active ? 'bg-blue-50' : ''} text-blue-600 flex items-center px-4 py-2 text-sm`}>
                                <FaCalendarAlt className="mr-3 h-4 w-4" />
                                Bookings
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link to="/newlisting" className={`${active ? 'bg-blue-50' : ''} text-blue-600 flex items-center px-4 py-2 text-sm`}>
                                <FaPlus className="mr-3 h-4 w-4" />
                                New Listing
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button 
                                className={`${active ? 'bg-blue-50' : ''} text-blue-600 flex items-center px-4 py-2 text-sm w-full text-left`}
                                onClick={handleSignOut}
                              >
                                <FaSignOutAlt className="mr-3 h-4 w-4" />
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </>
                      )}
                      {!currentUser && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link to="/signup" className={`${active ? 'bg-blue-50' : ''} text-blue-600 flex items-center px-4 py-2 text-sm`}>
                              <FaUserCircle className="mr-3 h-4 w-4" />
                              Sign up
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </nav>

      {/* Category Navigation */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4 overflow-x-auto scrollbar-hide">
            <div className="flex space-x-8 md:space-x-12">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Link 
                    key={index}
                    to={"/landmark/" + category.label.toLowerCase()} 
                    className="flex flex-col items-center flex-shrink-0 group"
                  >
                    <div className="p-2 group-hover:bg-blue-50 rounded-lg transition-colors duration-200">
                      <Icon className="h-6 w-6 text-red-600 group-hover:text-blue-600" />
                    </div>
                    <span className="text-xs text-blue-600 group-hover:text-blue-700 mt-2 whitespace-nowrap">
                      {category.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;