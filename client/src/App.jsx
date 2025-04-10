import { useState, useCallback } from 'react';

function App() {
  const [file, setFile] = useState(null);
  
  const handelClick = useCallback(async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (!file) return alert("Please upload a file");

    formData.append("fileName", file);

    try {
      const response = await fetch("http://localhost:3000/upload-video", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);  // log the server's response
        alert(data.message); // show success message
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);  // show error message from server
      }

    } catch (error) {
      console.log("%c Something Went Wrong", "font-size:25px;color:red", error);
      alert("Something went wrong during file upload.");
    }
  }, [file]);

  return (
    <div>
      <p>Choose your file</p>
      <input type="file" onChange={e => setFile(e.target.files[0])} name="fileName" id="fileName" />
      <button onClick={handelClick}>Submit</button>
      {response && <iframe
        src={response?.url}
        width="100%"
        height="600px"
        style={{ border: 'none' }}
        title="PDF Viewer"
      />}

      <video width="640" controls>
  <source src="http://localhost:3000/video/video1" type="video/mp4" />
  Your browser does not support the video tag.
</video>
    </div>
  );
}

export default App;
