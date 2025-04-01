import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Listings from './pages/Listings';
import Wishlist from './pages/Wishlist';
import AirbnbForm from './components/AirbnbForm';
import Signup from './components/Signup';
import Login from './components/Login';
import { useAuth } from './AuthContext';
import Property from './components/PropertyPage/Property';
import ReviewForm from './components/Reviews';
import EditForm from './components/EditForm';
import FilterListings from './components/FilterListings';
import Landmark from './components/Landmark';
import Bookings from './components/Bookings';
function App() {
  const {currentUser,setCurrentUser}=useAuth();
    useEffect(()=>{
        const userIdFromStorage=localStorage.getItem("userId");
        if(userIdFromStorage&&!currentUser){
            setCurrentUser(userIdFromStorage);
        }
    },[currentUser,setCurrentUser]);
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/newlisting" element={<AirbnbForm/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/property/:id" element={<Property/>}/>
            <Route path="/property/:id/review" element={<ReviewForm/>}/>
            <Route path="/property/:id/edit" element={<EditForm/>}/>
            <Route path="/listings/:location" element={<FilterListings />} />
            <Route path="/landmark/:landmark" element={<Landmark />} />
            <Route path="/oauth-callback" element={<Signup />} />
            <Route path="/bookings" element={<Bookings />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;