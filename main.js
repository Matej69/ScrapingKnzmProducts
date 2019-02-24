const puppeteer = require('puppeteer');

function WaitFor(x) { 
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, x);
  });
}

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


  try {
    const tree = await page._client.send('Page.getResourceTree');
    for (const resource of tree.frameTree.resources) {
      console.log(resource);
    }
  } catch (e) {
    console.log(e);
  }

  


/*
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
  */
  
  //browser.close();
  console.log("closed");
  
}

run();