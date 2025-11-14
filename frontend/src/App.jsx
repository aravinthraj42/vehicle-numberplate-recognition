import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Home from "./Components/Home";
import NumberPlateUploader from "./Components/NumberPlateUploader";
import FareDetails from "./Components/FareDetails";
import ReportTable from "./Components/ReportTable";
import Login from "./Components/Login";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on the login page
  const isOnLoginPage = location.pathname === '/login';

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    navigate('/'); // Redirect to home after successful login
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };
  console.log(user)
console.log(user?.email)
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">🚗 Smart Parking System</h1>
            <p className="text-gray-600">Your intelligent parking assistant</p>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-green-600 font-semibold">
                  Hello {user?.user?.email?.split('@')[0]?.charAt(0).toUpperCase() + user?.user?.email?.split('@')[0]?.slice(1)}
                  </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : !isOnLoginPage ? (
              <button
                onClick={handleLoginClick}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-medium"
              >
                Login
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {/* Page Routes */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
          <Route path="/upload" element={<NumberPlateUploader />} />
          <Route path="/fare-details" element={<FareDetailsLayout />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/reports" element={
            isAuthenticated ? <ReportTable /> : <UnauthorizedMessage />
          } />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow px-8 py-4 text-center text-sm text-gray-500">
        © 2025 Smart Parking System. All rights reserved.
      </footer>
    </div>
  );
}

// Layout wrapper for FareDetails to show it on right side
function FareDetailsLayout() {
  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto p-8 gap-8">
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Parking Information</h2>
        <p className="text-gray-600">
          Here you can check fare calculation, vehicle type charges and more.
        </p>
      </div>
      <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-6">
        <FareDetails />
      </div>
    </div>
  );
}

// Login page component
function LoginPage({ onLoginSuccess }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-gray-50">
      <div className="w-full max-w-md">
        <Login onLoginSuccess={onLoginSuccess} />
      </div>
    </div>
  );
}

// Component to show when user is not authenticated
function UnauthorizedMessage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Restricted</h2>
        <p className="text-gray-600 mb-6">
          This page is only accessible to authenticated administrators. 
          Please log in to view parking reports.
        </p>
        <div className="text-sm text-gray-500">
          Contact your system administrator for access.
        </div>
      </div>
    </div>
  );
}

export default App;
