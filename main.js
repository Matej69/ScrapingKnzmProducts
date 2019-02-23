const puppeteer = require('puppeteer');


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
  /*
  productNameList.forEach(prod => {
    console.log(prod);
  });
  */
 console.log(productNameList[0]);
  
  //browser.close();
  console.log("closed");
}

run();