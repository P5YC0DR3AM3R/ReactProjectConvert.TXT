const express = require('express');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../../dist')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/process_react_app', async (req, res) => {
  const { folderPath } = req.body;
  try {
    const scriptPath = path.join(__dirname, 'react_to_txt.py');
    const outputFile = path.join(__dirname, 'appOutput.txt');

    console.log(`Executing script: python3 ${scriptPath} ${folderPath} ${outputFile}`);

    exec(`python3 ${scriptPath} ${folderPath} ${outputFile}`, async (err, stdout, stderr) => {
      if (err) {
        console.error(`Error: ${stderr}`);
        res.status(500).send(`Error processing files: ${stderr}`);
        return;
      }

      console.log(`Script executed successfully: ${stdout}`);

      try {
        const outputText = await fs.readFile(outputFile, 'utf-8');
        res.send(outputText);
      } catch (readError) {
        console.error(`Error reading output file: ${readError}`);
        res.status(500).send(`Error reading output file: ${readError}`);
      }
    });
  } catch (error) {
    console.error(`Server error: ${error}`);
    res.status(500).send(`Server error: ${error}`);
  }
});

app.listen(PORT, () => console.log(`Now listening on port: ${PORT}`));
