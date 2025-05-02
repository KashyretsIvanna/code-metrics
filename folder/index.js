// analyzer.js
const fs = require('fs');
const path = require('path');
const { analyzeFile } = require('./metrics');

function walkDirectory(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walkDirectory(filepath, filelist);
    } else if (filepath.endsWith('.js')) {
      filelist.push(filepath);
    }
  }
  return filelist;
}

function analyzeProject(dir) {
  const files = walkDirectory(dir);
  let totals = {
    totalLines: 0,
    emptyLines: 0,
    commentLines: 0,
    physicalLines: 0,
    logicalLines: 0,
  };/**/

  for (const file of files) { const result = analyzeFile(file);
    Object.keys(totals).forEach(key => {
      totals[key] += result[key];
    });
  }

  const commentRate = ((totals.commentLines / totals.physicalLines) * 100).toFixed(2);
  console.log(`📊 Results for ${dir}:`);
  console.log(`Total lines: ${totals.totalLines}`);
  console.log(`Empty lines: ${totals.emptyLines}`);
  console.log(`Comment lines: ${totals.commentLines}`);
  console.log(`Physical lines: ${totals.physicalLines}`);
  console.log(`Logical lines: ${totals.logicalLines}`);
  console.log(`Comment rate: ${commentRate}%`);
}

analyzeProject('./folder'); // вкажи шлях до своєї бібліотеки
