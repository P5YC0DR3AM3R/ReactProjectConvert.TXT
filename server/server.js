const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { createTxtFromReactApp } = require('./react_to_txt');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../../client/dist')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/process_react_app', async (req, res) => {
  const { folderPath } = req.body;
  try {
    const outputFile = path.join(__dirname, 'appOutput.txt');

    console.log(`Processing folder: ${folderPath}`);

    createTxtFromReactApp(folderPath, outputFile);

    const outputText = await fs.readFile(outputFile, 'utf-8');
    res.send(outputText);
  } catch (error) {
    console.error(`Server error: ${error}`);
    res.status(500).send(`Server error: ${error}`);
  }
});

app.listen(PORT, () => console.log(`Now listening on port: ${PORT}`));
