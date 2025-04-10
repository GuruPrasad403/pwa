import { useState, useCallback } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [url, setResponse] = useState(null);

  const handleClick = useCallback(async (e) => {
    e.preventDefault();

    if (!file) return alert("Please upload a file");

    const formData = new FormData();
    formData.append("fileName", file);

    try {
      const response = await fetch("https://pwa-be-five.vercel.app/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResponse(data.pdfUrl); // use the Cloudinary PDF URL        
        alert(data.message);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Something went wrong:", error);
      alert("Something went wrong during file upload.");
    }
  }, [file]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <p className="mb-2">Choose your file</p>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        name="fileName"
        id="fileName"
        className="mb-4"
      />
      <br />
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Submit
      </button>
      {url && (
  <div className="mt-8">
    <h2 className="text-lg font-semibold mb-2">This is your PDF:</h2>
    <iframe
      src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
      width="100%"
      height="600px"
      style={{ border: 'none' }}
      title="PDF Viewer"
    />
  </div>
)}

    </div>
  );
}

export default App;
