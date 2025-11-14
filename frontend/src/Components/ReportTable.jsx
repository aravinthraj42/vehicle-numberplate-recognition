import { useEffect, useState } from 'react';
import axios from 'axios';

function ReportTable() {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/logs')
      .then(res => {
        const data = res.data || [];
        setRecords(data);
        setFilteredRecords(data);
      })
      .catch(console.error);
  }, []);

  // Filter records based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRecords(records);
    } else {
      const filtered = records.filter(record =>
        record.plate_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecords(filtered);
    }
  }, [searchTerm, records]);

  return (
    <div className="mt-8 p-6 bg-white shadow rounded">
      <div className="flex flex-col mb-4">
        <h2 className="text-xl font-bold mb-2">Parking Records</h2>
        <div className="flex flex-start space-x-2">
          <input
            type="text"
            placeholder="Search by plate number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      
      {records.length === 0 ? (
        <p>No records available.</p>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-gray-600 text-lg">No matching records found</p>
          <p className="text-gray-500 text-sm">Try searching with a different plate number</p>
        </div>
      ) : (
        <table className="w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Plate</th>
              <th className="p-2 border">Entry Time</th>
              <th className="p-2 border">Exit Time</th>
              <th className="p-2 border">Fare</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((rec, index) => (
              <tr key={index} className="text-center">
                <td className="p-2 border">{rec.plate_number}</td>
                <td className="p-2 border">{rec.entry_time}</td>
                <td className="p-2 border">{rec.exit_time || '-'}</td>
                <td className="p-2 border">₹{rec.fee ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ReportTable;
