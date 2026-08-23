const fs = require('fs');
const html = fs.readFileSync('C:/Users/Lenovo/Videos/Portfolio/index.html', 'utf8');
const idx = html.indexOf("Masters' Union");
console.log(html.substring(Math.max(0, idx - 1500), idx + 2000));
