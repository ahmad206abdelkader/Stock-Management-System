// src/test.tsx

import { useEffect, useState } from 'react';

const Test = () => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [textData, setTextData] = useState<string>('');

  // Fetch JSON file
  useEffect(() => {
    fetch('/data.json') // موجود داخل مجلد public
      .then((res) => res.json())
      .then((data) => setJsonData(data))
      .catch((err) => console.error('Error loading JSON:', err));
  }, []);

  // Fetch text file
  useEffect(() => {
    fetch('/test.txt')
      .then((res) => res.text())
      .then((data) => setTextData(data))
      .catch((err) => console.error('Error loading TXT:', err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Testing File Fetch</h1>

      <h2>JSON File:</h2>
      {jsonData ? <pre>{JSON.stringify(jsonData, null, 2)}</pre> : <p>Loading JSON...</p>}

      <h2>Text File:</h2>
      <p>{textData || 'Loading text...'}</p>
    </div>
  );
};

export default Test;
