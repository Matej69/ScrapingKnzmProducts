module.exports = {

  WaitFor: function(x) { 
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, x);
    });
  },


GetImageContent: async function(page, url) {
  const assert = require('assert');

  const { content, base64Encoded } = await page._client.send(
    'Page.getResourceContent',
    { frameId: String(page.mainFrame()._id), url },
  );
  assert.equal(base64Encoded, true);
  return content;
},

/**
 * Tries to go to the next page and returns isOnLastPage info about current page(before switching).
 */
 NextPage: async function(page) {
  console.log("Trying to switch to next page...");
  return await page.evaluate( () => {
    var nextPageLi = document.querySelector('.pagination-next');
    var nextPageA = nextPageLi.querySelector('a');
    var isOnLastPage = nextPageLi.classList.contains('disabled');
    if(!isOnLastPage)
      nextPageA.click();
    return isOnLastPage;
  });
},

/**
 * Save img to file and generate imgID for json
 */
ExtractImageData: async function(page, productNameList, imgID, fs) {
  try {
    for (let i = 0; i < productNameList.length; i++) {
      productNameList[i].imgID = imgID.value++;
      const content = await this.GetImageContent(page, productNameList[i].imgSrc);
      const contentBuffer = Buffer.from(content, 'base64');
      fs.writeFileSync("./images/" + imgID.value + '.jpg', contentBuffer, 'base64');
    }
  }
  catch (e) {
    console.log(e);
  }
  console.log("All image data extracted");
},

/**
 * Get all products data from a current page
 */
ExtractProductDataFromPage: async function(page) {
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
        imgID: ''
      };
    })
  );
},

/**
 * Print all scraped data to console
 */
PrintScrapedData: function(productNameList) {
  productNameList.forEach(prod => {
    console.log(prod);
  });
}

}