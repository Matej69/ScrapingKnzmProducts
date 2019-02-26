const puppeteer = require('puppeteer');
const util = require('./util');
const fs = require('fs');

/**
 * Main function
 */
var productsForSaving = [];
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
    const productNonImageData = await util.ExtractProductDataFromPage(page);
    await util.GetImageDataAsBase64(page, productNonImageData, imgIDObj, fs);

    util.PrintScrapedData(productNonImageData);
    isOnLastPage = await util.NextPage(page);

    productsForSaving.push(...productNonImageData);

    // Wait for some time to prevent angular router bug when url is fastly switched
    await util.WaitFor(5000);
  }
  while (!isOnLastPage);
  
  console.log("###################################### ALL DATA SCRAPED");




  var firebase = require("firebase-admin");

  var serviceAccount = require("./accountKey.json");
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://scrapedproducts.firebaseio.com/"
  });
  
  var ref = firebase.database().ref("products");
  console.log("########### SAVING TO DATABASE...... ");
  ref.set(productsForSaving);
  console.log("########### SAVED ");















}
main();



