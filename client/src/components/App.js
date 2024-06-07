import React, { useState } from 'react';

function App() {
  const [folderPath, setFolderPath] = useState('');
  const [outputText, setOutputText] = useState('');

  const handleInputChange = (event) => {
    setFolderPath(event.target.value);
  };

  const handleProcessFiles = async () => {
    try {
      const response = await fetch('/process_react_app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folderPath }),
      });

      const text = await response.text();
      setOutputText(text);
    } catch (error) {
      setOutputText('Error processing files');
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
      />
      <button onClick={handleProcessFiles}>Process Files</button>

      {outputText && (
        <div>
          <h2>Output:</h2>
          <pre>{outputText}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
