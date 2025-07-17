import './App.css'
import NumberPlateUploader from './Components/NumberPlateUploader';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow px-8 py-4">
        <h1 className="text-3xl font-bold text-blue-600">🚗 Smart Parking System</h1>
        <p className="text-gray-600">Upload an image to detect your vehicle number plate</p>
      </header>

      <main className="flex-grow px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <NumberPlateUploader />
        </div>
      </main>

      <footer className="bg-white shadow px-8 py-4 text-center text-sm text-gray-500">
        © 2025 Smart Parking System. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
