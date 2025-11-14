const mockFareData = [
  { duration: '1 hour', rate: '₹10' },
  { duration: '2 hours', rate: '₹15' },
  { duration: '3 hours', rate: '₹20' },
  { duration: '6 hours', rate: '₹35' },
  { duration: '1 day', rate: '₹40' },
  { duration: '2 days', rate: '₹65' },
  { duration: '3 days', rate: '₹90' },
  { duration: '7 days', rate: '₹190' },
];


function FareDetails() {
  return (
    <div className="mt-8 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Fare Details</h2>
      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Duration</th>
            <th className="p-2 border">Fare</th>
          </tr>
        </thead>
        <tbody>
          {mockFareData.map((row, idx) => (
            <tr key={idx} className="text-center">
              <td className="p-2 border">{row.duration}</td>
              <td className="p-2 border">{row.rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FareDetails;
