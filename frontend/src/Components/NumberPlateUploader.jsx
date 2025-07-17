// frontend/src/components/UploadForm.jsx
import { useState } from 'react';
import axios from 'axios';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post('http://localhost:5000/detect', formData);
    setResult(res.data.plate_number || res.data.error);
  };

  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      <p>Result: {result}</p>
    </div>
  );
}

export default UploadForm;
