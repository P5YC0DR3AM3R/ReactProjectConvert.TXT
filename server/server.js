const express = require('express');
const path = require('path');
const fs = require('fs'); 
const { createTxtFromReactApp } = require('./react_to_txt');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname,)));

app.post('/process_react_app', async (req, res) => {
  const { folderPath, fileName } = req.body;

  try {
    const downloadsDir = path.join(__dirname, 'downloads'); 
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir);
    }

    const outputFile = path.join(downloadsDir, fileName + ".txt"); 

    console.log(`Processing folder: ${folderPath}`);

    await createTxtFromReactApp(folderPath, outputFile);
    res.json({ message: '.txt created successfully!', fileName: fileName + ".txt" });
  } catch (error) {
    console.error(`Server error: ${error}`);
    res.status(500).json({ message: `Server error: ${error}` });
  }
});
//This function creates the download route for the user after the file is successfully created.
app.get('/download/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, "downloads", fileName);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  res.download(filePath, (err) => {
    if (err) {
      console.error(`Error downloading file: ${err.message}`);
      res.status(500).json({
        message: "Could not download the file.",
        error: err.message,
      });
    }
  });
});

app.listen(PORT, () => console.log(`Now listening on port: ${PORT}`));
