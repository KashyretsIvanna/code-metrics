/** @format */

const fs = require('fs');

function stripStrings(line) {
  return line.replace(
    /(["'`])(?:\\.|(?!\1).)*\1/g,
    '',
  ); // remove content inside string literals
}
function analyzeFile(filepath) {
  const content = fs.readFileSync(
    filepath,
    'utf-8',
  );
  const lines = content.split('\n');

  let totalLines = lines.length;
  let emptyLines = 0;
  let commentLines = 0;
  let logicalLines = 0;
  let inBlockComment = false;

  for (let line of lines) {
    const trimmed = line.trim();
    let code = stripStrings(trimmed); 
    
    if (trimmed === '') {
      emptyLines++;
    } else if (inBlockComment) {
      commentLines++;
      hasComment = true;
      if (code.includes('*/'))
        inBlockComment = false;
    } else if (code.includes('/*')) {
      commentLines++;
      hasComment = true;
      if (!code.includes('*/'))
        inBlockComment = true;
    } else if (code.includes('//')) {
      commentLines++;
      hasComment = true;
    } else {
      // Approximate logical line
      logicalLines += (
        trimmed.match(/;|{|}/g) || []
      ).length;
    }
  }

  const physicalLines =
    totalLines - emptyLines - commentLines;

  return {
    totalLines,
    emptyLines,
    commentLines,
    physicalLines,
    logicalLines,
  };
}

module.exports = { analyzeFile };
