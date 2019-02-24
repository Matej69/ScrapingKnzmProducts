const puppeteer = require('puppeteer');
const util = require('./util');
const fs = require('fs');

/**
 * Main function
 */
async function main() {

  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('https://www.konzum.hr/klik/#!/offers', {"waitUntil" : "networkidle0"});
  console.log(page.url() + " loaded \n Data scraping started...");

  var imgIDObj = {value: 0};
  var isOnLastPage;

  do {
    const productNameList = await util.ExtractProductDataFromPage(page);
    await util.ExtractImageData(page, productNameList, imgIDObj, fs);
    util.PrintScrapedData(productNameList);
    isOnLastPage = await util.NextPage(page);

    // Wait for some time to prevent angular router bug when url is fastly switched
    await util.WaitFor(5000);
  }
  while (!isOnLastPage);
  
  console.log("###################################### ALL DATA SCRAPED: ");
}
main();