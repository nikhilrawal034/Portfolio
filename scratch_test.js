import fs from 'fs';
const html = fs.readFileSync('index.html', 'utf-8');

const regex = /href=["']([^"']*)["']/gi;
let m;
const hrefs = new Set();
while ((m = regex.exec(html)) !== null) {
  if (m[1].includes('project') || m[1].includes('zepto') || m[1].includes('book') || m[1].includes('myntra')) {
    hrefs.add(m[1]);
  }
}
console.log("Found project hrefs:", Array.from(hrefs));

// Check framer routes data in HTML
const routeRegex = /"path":"([^"]+)"/g;
let r;
const paths = new Set();
while ((r = routeRegex.exec(html)) !== null) {
  paths.add(r[1]);
}
console.log("Framer route paths in HTML:", Array.from(paths));
