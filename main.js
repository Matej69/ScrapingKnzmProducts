const puppeteer = require('puppeteer');




/**
 * ***************************** UTILS FUNCTIONS ******************************
 */




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
      var lipe = element.querySelector(".decimalni-dio");
      var kn = element.querySelector(".cijena");
      kn.removeChild(lipe);
      kn.removeChild(element.querySelector(".tekstualni-dio"));
      return { 
        name: element.querySelector(".ime-proizvoda").innerText,
        //price: ChildrenToRemove(element.querySelector(".cijena"),[".cijena span"]).innerText
        //pricelp: element.querySelector(".cijena .decimalni-dio").innerText,
        priceBase: kn.innerText,
        priceExtension: lipe.innerText
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