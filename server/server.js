const express = require('express');
const path = require('path');
const { createTxtFromReactApp } = require('./react_to_txt');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname,)));

app.post('/process_react_app', (req, res) => {
  const { folderPath } = req.body;

  try {
    const outputFile = path.join(__dirname, 'Project.txt');

    console.log(`Processing folder: ${folderPath}`);

    createTxtFromReactApp(folderPath, outputFile);
    res.json({ message: 'Project.txt created successfully!', fileName: 'Project.txt' });
  } catch (error) {
    console.error(`Server error: ${error}`);
    res.status(500).json({ message: `Server error: ${error}` });
  }
});
//This function creates the download route for the user after the file is successfully created.
app.get('/download/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const file = path.join(__dirname, fileName);
  res.download(file, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
});

app.listen(PORT, () => console.log(`Now listening on port: ${PORT}`));
