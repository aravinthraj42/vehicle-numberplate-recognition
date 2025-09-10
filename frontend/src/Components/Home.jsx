import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";


export default function Home() {
  const navigate = useNavigate();

  // Auto redirect to NumberPlateUploader after 5 seconds
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigate("/upload");
//     }, 5000);
//     return () => clearTimeout(timer);
//   }, [navigate]);

  return (
     <div
      className="min-h-[80vh] bg-cover bg-center flex flex-col items-center justify-center text-center px-6"
    >
      <h1 className="text-5xl font-bold text-green-700 drop-shadow-lg">
        Welcome to Smart Parking 🚗
      </h1>
      <p className="text-lg text-gray-400 mt-4 max-w-2xl">
        Upload your vehicle’s number plate, check parking fares instantly, and explore detailed reports.
      </p>

      {/* Navigation Links */}
      <div className="mt-8 flex flex-wrap gap-6 justify-center">
        <Link
          to="/upload"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition"
        >
          Upload Number Plate
        </Link>
        <Link
          to="/fare-details"
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition"
        >
          Fare Details
        </Link>
        <Link
          to="/reports"
          className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-purple-700 transition"
        >
          Reports
        </Link>
      </div>

      {/* <p className="mt-6 text-sm text-gray-300">
        Redirecting to <span className="font-semibold">Number Plate Upload</span> in 5 seconds...
      </p> */}
    </div>
  );
}
