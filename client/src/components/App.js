import React, { useState } from 'react';

function App() {
  const [folderPath, setFolderPath] = useState('');
  const [outputMessage, setOutputMessage] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const [fileName, setFileName] = useState(''); // New state for filename
  const maxCharsPath = 255; // Max characters for path input
  const maxCharsFilename = 60;

  const handleInputChange = (event) => {
    const value = event.target.value.slice(0, maxCharsPath);
    setFolderPath(value);
  };

  const handleFileNameChange = (event) => {
    const value = event.target.value.slice(0, maxCharsFilename);
    setFileName(value);
  };

  const handleProcessFiles = async () => {
    try {
      const response = await fetch('http://localhost:3000/process_react_app', { // Use the correct port
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folderPath }),
      });

      const data = await response.json();
      setOutputMessage(data.message);
      setDownloadLink(data.fileName ? `http://localhost:3000/download/${data.fileName}` : ''); 
    } catch (error) {
      setOutputMessage('Error processing files');
      console.error(error);
    }
  };

  return (
    <div>
      <h1>React App to TXT Converter</h1>
      <input
        type="text"
        value={folderPath}
        onChange={handleInputChange}
        placeholder="Enter the folder path"
        maxLength={maxCharsPath}
      />

      <input // New input for filename
        type="text"
        value={fileName}
        onChange={handleFileNameChange}
        placeholder="Enter the filename (max 60 characters)"
        maxLength={maxCharsFilename}
      />

      <button onClick={handleProcessFiles}>Process Files</button>

      {outputMessage && ( // Display message when available
        <div>
        <h2>Message:</h2>
        <p>{outputMessage}</p>
        {downloadLink && (
          <a href={downloadLink} download>
            Download Project.txt
          </a>
        )}
      </div>
    )}
  </div>
);
}

export default App;