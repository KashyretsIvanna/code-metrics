const fs = require('fs');

function analyzeFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const lines = content.split('\n');

  let totalLines = lines.length;
  let emptyLines = 0;
  let commentLines = 0;
  let logicalLines = 0;
  let inBlockComment = false;

  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') {
      emptyLines++;
    } else if (inBlockComment) {
      commentLines++;
      if (trimmed.endsWith('*/')) inBlockComment = false;
    } else if (trimmed.startsWith('//')) {
      commentLines++;
    } else if (trimmed.startsWith('/*')) {
      commentLines++;
      if (!trimmed.endsWith('*/')) inBlockComment = true;
    } else {
      // Approximate logical line
      logicalLines += (trimmed.match(/;|{|}/g) || []).length;
    }
  }

  const physicalLines = totalLines - emptyLines - commentLines;

  return {
    totalLines,
    emptyLines,
    commentLines,
    physicalLines,
    logicalLines,
  };
}

module.exports = { analyzeFile };
