const fs = require('fs');
const { CucumberHtmlStream } = require('@cucumber/html-formatter');

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  console.error('Usage: node ndjson-to-html.js <input.ndjson> <output.html>');
  process.exit(2);
}

const input = fs.createReadStream(inputPath, { encoding: 'utf8' });
const out = fs.createWriteStream(outputPath, { encoding: 'utf8' });

const transform = new CucumberHtmlStream();

let buffer = '';
input.on('data', (chunk) => {
  buffer += chunk;
  let idx;
  while ((idx = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, idx);
    buffer = buffer.slice(idx + 1);
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      transform.write(obj);
    } catch (e) {
      console.error('JSON parse error:', e.message);
    }
  }
});
input.on('end', () => transform.end());

transform.pipe(out);

transform.on('end', () => {
  console.log('HTML report written to', outputPath);
});
