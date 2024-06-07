const fs = require('fs');
const path = require('path');

const createTxtFromReactApp = (rootFolder, outputFile = 'appOutput.txt') => {
  const output = fs.createWriteStream(outputFile, { encoding: 'utf-8' });

  const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
      const filepath = path.join(dir, file);
      if (fs.statSync(filepath).isDirectory()) {
        filelist = walkSync(filepath, filelist);
      } else {
        filelist.push(filepath);
      }
    });
    return filelist;
  };

  const files = walkSync(rootFolder);

  files.forEach(filepath => {
    if (filepath.includes('node_modules') || filepath.includes('.git') || filepath.includes('build') || filepath.includes('Node') || filepath.includes('dist')) {
      return;
    }
    if (path.basename(filepath).startsWith('._')) {
      return;
    }

    const relativePath = path.relative(rootFolder, filepath);
    output.write(`\n\n${relativePath}\n\n`); // Two line breaks before

    const fileContent = fs.readFileSync(filepath, 'utf-8');
    fileContent.split('\n').forEach(line => {
      output.write(` ${line}\n`); // Space before each line of code
    });
  });

  output.end();
};

module.exports = { createTxtFromReactApp };
