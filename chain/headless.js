const puppeteer = require('puppeteer');

const MAIN_URL = "http://localhost:8080/#main";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => {
    console.log(msg._text);
  });

  await page.goto(MAIN_URL);
})();
