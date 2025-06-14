import { BrowserRouter as Router, Route, Routes, Link, NavLink, useLocation } from 'react-router-dom';
import RegistrationForm from './pages/RegistrationForm';
import GenerateIdCard from './pages/GenerateIdCard';
import AdminPortal from './pages/AdminPortal';

import { FaUserGraduate, FaIdCard, FaUniversity } from 'react-icons/fa';


function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Show header and footer only if not on admin route */}
      {!isAdminRoute && (
            <header className="sticky top-0 z-50 bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center">
                    <FaUniversity className="text-white text-2xl" />
                  </div>
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Student Portal
                  </span>
                </Link>
              </div>
              
              <nav className="hidden md:flex items-center space-x-1">
                <NavLink 
                  to="/" 
                  className={({isActive}) => 
                    `px-5 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
                    }`
                  }
                >
                  <FaUserGraduate />
                  <span>Registration</span>
                </NavLink>
                <NavLink 
                  to="/idcard" 
                  className={({isActive}) => 
                    `px-5 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
                    }`
                  }
                >
                  <FaIdCard />
                  <span>ID Card</span>
                </NavLink>
              </nav>
              
              <div className="flex items-center md:hidden">
                {/* Mobile menu button */}
                <button className="text-gray-600 hover:text-indigo-700">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="flex-grow">
        <div className="mx-auto px-1 sm:px-1 lg:px-1">
          <Routes>
            <Route path="/" element={<RegistrationForm />} />
            <Route path="/idcard" element={<GenerateIdCard />} />
            <Route path="/admin" element={<AdminPortal />} />
          </Routes>
        </div>
      </main>

      {!isAdminRoute && (
        <footer className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FaUniversity className="mr-2" />
                  Student Portal
                </h3>
                <p className="text-indigo-200">
                  A modern platform for student registration and ID card generation.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className="text-indigo-200 hover:text-white transition">Registration</Link>
                  </li>
                  <li>
                    <Link to="/idcard" className="text-indigo-200 hover:text-white transition">Generate ID Card</Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                <p className="text-indigo-200">
                  <span className="font-medium">Email:</span> info@studentportal.edu
                </p>
                <p className="text-indigo-200 mt-1">
                  <span className="font-medium">Phone:</span> +1 (555) 123-4567
                </p>
              </div>
            </div>
            
            <div className="border-t border-indigo-500 mt-10 pt-6 text-center text-indigo-300">
              <p>© {new Date().getFullYear()} Student Portal. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
function App() {
  return (
    <Router>
           <AppContent />

    </Router>
  );
}

export default App;