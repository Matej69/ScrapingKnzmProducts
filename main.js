const puppeteer = require('puppeteer');

function WaitFor(x) { 
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, x);
  });
}

const assert = require('assert');
const fs = require('fs');
const getImageContent = async (page, url) => {
  const { content, base64Encoded } = await page._client.send(
    'Page.getResourceContent',
    { frameId: String(page.mainFrame()._id), url },
  );
  assert.equal(base64Encoded, true);
  return content;
};

async function run() {
  const browser = await puppeteer.launch({
    headless: true
  });
  console.log("Browser lunched");

  var page = await browser.newPage();
  console.log("Page initialized");

  page.on('response', async (response) => {
    //console.log(response.url());
  });

  console.log("Request sent for https://www.konzum.hr/klik/#!/offers");
  await page.goto('https://www.konzum.hr/klik/#!/offers', {"waitUntil" : "networkidle0"});

  var imgID = 0;
  var isOnLastPage;
  do {
       // get all products data on a page
      const productNameList = await page.evaluate( () => 
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
   //Save img to file and generate imgID for json
   try {
    console.log("Saving " + productNameList.length + " images to file");
    for (let i = 0; i < productNameList.length; i++) {
      productNameList[i].imgID = imgID++;
      const content = await getImageContent(page, productNameList[i].imgSrc);
      const contentBuffer = Buffer.from(content, 'base64');
      fs.writeFileSync(imgID + '.jpg', contentBuffer, 'base64');
    }
   }
   catch (e) {
    console.log(e);
  }
  console.log("Images saved");
  // print JSON product data
  productNameList.forEach(prod => {
    console.log(prod);
  });

    // go to next page
    isOnLastPage = await page.evaluate( () => {
      var nextPageLi = document.querySelector('.pagination-next');
      var nextPage = nextPageLi.querySelector('a');
      var isOnLastPage = nextPageLi.classList.contains('disabled');
      if(!isOnLastPage)
        nextPage.click();
      return isOnLastPage;
    });

    console.log("###################################### SCRAPED: " + page.url());
    // Wait for some time to prevent angular router bug when url is fastly switched
    await WaitFor(5000);
  }
  while (!isOnLastPage);
  
  
  //browser.close();
  console.log("closed");
  
}

run();