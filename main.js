const puppeteer = require('puppeteer');

async function run() {
  console.log("started");
  const browser = await puppeteer.launch({
    headless: false
  });
  console.log("lunched");
  const page = await browser.newPage();
  console.log("paged");

  await page.goto('https://www.konzum.hr/klik/#!/offers');
  console.log("goto");

  const val = await page.$eval('.ukupno', (element) => {
    return element.innerText
  })
  console.log(val);
  
  //browser.close();
  console.log("closed");
}

run();