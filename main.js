const puppeteer = require('puppeteer');
const util = require('./util');
const fs = require('fs');
const firebaseHelper = require('./firebaseHelper');

/**
 * Main function
 */
var productsForSaving = [];
async function main() {

  // ******************************** INITIALIZING PAGE *****************************
  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('https://www.konzum.hr/klik/#!/offers', {"waitUntil" : "networkidle0"});

  // ******************************** SCRAPING PAGE DATA *****************************
  console.log("Data scraping started......");
  var isOnLastPage;
  do {
    const productsData = await util.ExtractProductDataFromPage(page);
    productsForSaving.push(...productsData);
    console.log("Scraped " + productsData.length + " products from " + page.url());
    isOnLastPage = await util.GoToNextPage(page);

    // Wait for some time to prevent angular router bug when url is fastly switched
  }
  while (!isOnLastPage);
  console.log("######### ALL DATA SCRAPED #########");

  // **************************** SAVE SCRAPPED PRODUCT DATA TO DATABASE *************************
  firebaseHelper.SaveToFirebase(productsForSaving, "./accountKey.json", "https://scrapedproducts.firebaseio.com/");

}
main();



