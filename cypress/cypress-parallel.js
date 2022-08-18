// scripts/cypress-parallel.js

const fs = require('fs');
const path = require('path');

const NODE_INDEX = Number(process.env.CI_NODE_INDEX || 1);
const NODE_TOTAL = Number(process.env.CI_NODE_TOTAL || 1);
const TEST_FOLDER = './cypress/e2e';

function walk(dir) {
  let files = fs.readdirSync(dir);
  files = files.map((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) return walk(filePath);
    if (stats.isFile()) return filePath;
  });

  return files
    .reduce((all, folderContents) => all.concat(folderContents), []);
}

function getSpecFiles() {
  const allSpecFiles = walk(TEST_FOLDER);

  return allSpecFiles.sort()
    .filter((_, index) => (index % NODE_TOTAL) === (NODE_INDEX - 1));
}

// This log will be printed out to the console
// so that cypress will know which files will be run.
// Also, since getSpecFiles returns an array, the paths are
// joined with comma
console.log(getSpecFiles().join(','));
