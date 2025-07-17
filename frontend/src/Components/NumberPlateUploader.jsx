import { useState } from 'react';
import axios from 'axios';

function NumberPlateUploader() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');
  const [entryTime, setEntryTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file.');
      return;
    }
    setLoading(true);
    setError('');
    setResult('');
    setEntryTime('');
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post('http://localhost:5000/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.plate_number) {
        setResult(res.data.plate_number);
        setEntryTime(res.data.entry_time);
      } else {
        setError(res.data.error || 'Failed to detect plate.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to upload image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-8">
      <h2 className="text-2xl font-bold mb-4">Upload Vehicle Image</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col justify-center">
          <input
            type="file"
            accept="image/*"
            onChange={e => setFile(e.target.files[0])}
            className="mb-4 p-2 border rounded w-full"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 w-full"
          >
            {loading ? 'Processing...' : 'Detect Plate'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        {result && (
        <div className="mt-4 p-4 border rounded bg-gray-50 text-black">
          <p><strong>Plate Number:</strong> {result}</p>
          <p><strong>Entry Time:</strong> {entryTime}</p>
        </div>
        )}

        </div>

        {file && (
          <div className="flex justify-center">
            <img
              src={URL.createObjectURL(file)}
              alt="Uploaded Preview"
              className="rounded shadow max-h-96"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default NumberPlateUploader;
