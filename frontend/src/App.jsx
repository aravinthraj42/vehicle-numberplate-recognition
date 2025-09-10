import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import NumberPlateUploader from "./Components/NumberPlateUploader";
import FareDetails from "./Components/FareDetails";
import ReportTable from "./Components/ReportTable";


function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow px-8 py-4">
        <h1 className="text-3xl font-bold text-blue-600">🚗 Smart Parking System</h1>
        <p className="text-gray-600">Your intelligent parking assistant</p>
      </header>

      {/* Page Routes */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<NumberPlateUploader />} />
          <Route path="/fare-details" element={<FareDetailsLayout />} />
          <Route path="/reports" element={<ReportTable />} />
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

export default App;
