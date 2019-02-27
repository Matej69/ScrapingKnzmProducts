module.exports = {
  GoToNextPage,
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
    await WaitFor(10000);
  return isOnLastPage;
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
        imgSrc: imgSrc
      };
    })
  );
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