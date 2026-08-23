const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/projects/zepto');
  // wait 2s for hydration
  await new Promise(r => setTimeout(r, 2000));
  const links = await page.$$eval('a[href$=".pdf"]', els => els.map(e => {
    const parentNode = e.parentNode;
    const parentClass = parentNode ? parentNode.className : '';
    const isHidden = window.getComputedStyle(e).display === 'none' || (parentNode && window.getComputedStyle(parentNode).display === 'none');
    return {
      href: e.href,
      nextSiblingClass: e.nextElementSibling ? e.nextElementSibling.className : 'NONE',
      parentClass,
      isHidden,
      boundingWidth: e.getBoundingClientRect().width
    };
  }));
  console.log(JSON.stringify(links, null, 2));
  await browser.close();
})();
