import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, Github, Chrome, Eye, EyeOff} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate=useNavigate();
  const {setCurrentUser}=useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("https://hotel-booking-app-ohkw.onrender.com/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      setCurrentUser(response.data.userId);
      navigate("/listings");
      alert("Login successful!");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Signup failed!");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-rose-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500">Choose your preferred sign-in method</p>
          </div>

          {/* Custom Tabs */}
          <div className="w-full">
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setActiveTab('email')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === 'email'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Email
              </button>
              <button
                onClick={() => setActiveTab('social')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === 'social'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Social
              </button>
            </div>

            <div className="mt-6">
              {activeTab === 'email' && (
                <div className="space-y-4 animate-fadeIn">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 transition-all duration-200"
                >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-2.5 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center ${
                        isLoading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing in...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          Sign in
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </button>
                  </form>

                  <div className="flex items-center justify-between">
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                      Forgot password?
                    </a>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                      Create account
                    </a>
                  </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div className="space-y-4 animate-fadeIn">
                  <button
                    onClick={() => {}}
                    className="w-full py-2.5 px-4 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
                  >
                    <Chrome className="mr-2 h-4 w-4" />
                    Continue with Google
                  </button>
                  <button
                    onClick={() => {}}
                    className="w-full py-2.5 px-4 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Continue with GitHub
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
