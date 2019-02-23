const puppeteer = require('puppeteer');

async function run() {
  console.log("started");
  const browser = await puppeteer.launch({
    headless: true
  });
  console.log("lunched");
  const page = await browser.newPage();
  console.log("paged");

  await page.goto('https://www.konzum.hr/klik/#!/offers', {"waitUntil" : "networkidle0"});
  console.log("goto");

  const val = await page.$eval('.ime-proizvoda', (element) => {
    return element.innerHTML
  })
  console.log(val);
  
  //browser.close();
  console.log("closed");
}

run();