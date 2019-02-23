const puppeteer = require('puppeteer');

function WaitFor(x) { 
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, x);
  });
}

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

  var isOnLastPage;
  do {
       // get all products on a page
      const productNameList = await page.evaluate( () => 
      Array.from(document.querySelectorAll('.inner-proizvod'), element => {
        var productName = element.querySelector(".ime-proizvoda");
        var priceExtension = element.querySelector(".decimalni-dio");
        var priceText = element.querySelector(".tekstualni-dio");
        var priceBase = element.querySelector(".cijena");
            priceBase.removeChild(priceExtension);
            priceBase.removeChild(priceText);
        return { 
          name: productName.innerText,
          priceBase: priceBase.innerText,
          priceExtension: priceExtension.innerText,
          priceText: priceText.innerText
        };
      })
    );
    productNameList.forEach(prod => {
      console.log(productNameList);
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