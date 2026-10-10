const fs = require('fs');
const html = fs.readFileSync('nazaverse-prototype.html', 'utf8');
const start = html.indexOf('<svg id="psvg"');
const end = html.indexOf('</svg>', start) + 6;
const svg = html.substring(start, end);
fs.writeFileSync('src/pet/pet.svg', svg);

