module.exports = { 
  WaitFor, 
  GetImageAsBase64, 
  GoToNextPage, 
  GetImageDataAsBase64, 
  ExtractProductDataFromPage,
  PrintScrapedData  
};



function WaitFor(x) { 
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, x);
  });
}


async function GetImageAsBase64(page, url) {
  const assert = require('assert');

  const { content, base64Encoded } = await page._client.send(
    'Page.getResourceContent',
    { frameId: String(page.mainFrame()._id), url },
  );
  assert.equal(base64Encoded, true);
  return content;
}

/**
 * Tries to go to the next page and returns isOnLastPage info about current page(before switching).
 */
async function GoToNextPage(page) {
  console.log("Trying to switch to next page...");
  var isOnLastPage = await page.evaluate( () => {
    var nextPageLi = document.querySelector('.pagination-next');
    var nextPageA = nextPageLi.querySelector('a');
    var isOnLastPage = nextPageLi.classList.contains('disabled');
    if(!isOnLastPage)
      nextPageA.click();
    return isOnLastPage;
  });
  // Wait for some time to prevent angular router bug when url is fastly switched
  if (!isOnLastPage)
    await WaitFor(5000);
  return isOnLastPage;
}

/**
 * Save img to file and generate imgID for json
 */
async function GetImageDataAsBase64(page, imgSrc) {
  try {
    const imageBase64 = await GetImageAsBase64(page, imgSrc);
    return imageBase64;
  }
  catch (e) {
    console.log(e);
  }
}

/**
 * Get all products data from a current page
 */
async function ExtractProductDataFromPage(page) {
  var productsData = await page.evaluate( () => 
    Array.from(document.querySelectorAll('.inner-proizvod'), element => {
      var productName = element.querySelector(".ime-proizvoda");
      var priceExtension = element.querySelector(".decimalni-dio");
      var priceText = element.querySelector(".tekstualni-dio");
      var priceBase = element.querySelector(".cijena");
          priceBase.removeChild(priceExtension);
          priceBase.removeChild(priceText);
      var imgSrc = element.querySelector(".image img").src;
      return { 
        name: productName.innerText,
        priceBase: priceBase.innerText,
        priceExtension: priceExtension.innerText,
        priceText: priceText.innerText,
        //imgSrc: imgSrc,
        imgBase64: ''
      };
    })
  );

  for(var i = 0; i < productsData.length; ++i)
    productsData[i].imgBase64 = await GetImageDataAsBase64(page, productsData[i].imgSrc);
  return productsData;
}












/**
 * ############################################## DEBUGING FUNCTIONS #################################################
 */

/**
 * Print all scraped data to console
 */
function PrintScrapedData(productNameList) {
  productNameList.forEach(prod => {
    console.log(prod);
  });
}