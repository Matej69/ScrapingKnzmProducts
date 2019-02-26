module.exports = { 
  WaitFor, 
  GetImageAsBase64, 
  NextPage, 
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
async function NextPage(page) {
  console.log("Trying to switch to next page...");
  return await page.evaluate( () => {
    var nextPageLi = document.querySelector('.pagination-next');
    var nextPageA = nextPageLi.querySelector('a');
    var isOnLastPage = nextPageLi.classList.contains('disabled');
    if(!isOnLastPage)
      nextPageA.click();
    return isOnLastPage;
  });
}

/**
 * Save img to file and generate imgID for json
 */
async function GetImageDataAsBase64(page, productNameList, imgID, fs) {
  var imagesBase64 = [];
  try {
    for (let i = 0; i < productNameList.length; i++) {
      productNameList[i].imgID = imgID.value++;
      const imgBase64 = await this.GetImageAsBase64(page, productNameList[i].imgSrc);
      imagesBase64.push(imgBase64);
      productNameList[i].imgBase64 = imgBase64;
    }
    console.log("All image data extracted");
    return imagesBase64;
  }
  catch (e) {
    console.log(e);
  }
}

/**
 * Get all products data from a current page
 */
async function ExtractProductDataFromPage(page) {
  return await page.evaluate( () => 
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
        imgSrc: imgSrc,
        imgID: '',
        imgBase64: ''
      };
    })
  );
}

/**
 * Print all scraped data to console
 */
function PrintScrapedData(productNameList) {
  productNameList.forEach(prod => {
    console.log(prod);
  });
}
