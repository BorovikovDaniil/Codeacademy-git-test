import { useState } from 'react';
import './index.css';

function App() {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);

  const handleFiles = (e) => {
    setFiles([...e.target.files]);
  };

  const analyze = async () => {
    if (!files.length) return;
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    const res = await fetch('/api/analyze', { method: 'POST', body: formData });
    if (res.ok) {
      const data = await res.json();
      setResults(data.results || []);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Epicrisis Analyzer</h1>
      <input type="file" multiple onChange={handleFiles} className="mb-4" />
      <button onClick={analyze} className="px-4 py-2 bg-blue-500 text-white rounded">
        Analyze
      </button>
      <div className="mt-4">
        {results.map((r, idx) => (
          <div key={idx} className="border rounded p-2 mb-2">
            <h2 className="font-semibold">{r.name}</h2>
            <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(r, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
