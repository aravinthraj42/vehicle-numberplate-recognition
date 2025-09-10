import { useEffect, useState } from 'react';
import axios from 'axios';

function ReportTable() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/logs')
      .then(res => setRecords(res.data || []))
      .catch(console.error);
  }, []);

  return (
    <div className="mt-8 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Parking Records</h2>
      {records.length === 0 ? (
        <p>No records available.</p>
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
            {records.map((rec, index) => (
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
