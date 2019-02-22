var webPage = require('webpage');
var page = webPage.create();



/*
page.open('https://www.konzum.hr/klik/#!/offers', function(status) {
  console.log('Status: ' + status);
  // Do other things here...
});
*/

/**
 * Bad way but shit works
 */
/*
var urlWithInfoRerturned = false;
var urlWithInfo = "https://www.konzum.hr/klik/v2/offers?per_page=48&page=&filter%5Bsort%5D=soldStatisticsDesc";
var productsContent;
var parsingDone = false;
page.onResourceReceived = function(response) {
  urlWithInfoRerturned = (response.url.indexOf(urlWithInfo) !== -1) ? true : urlWithInfoRerturned;
  if (urlWithInfoRerturned) {
    var isThisUrlWithInfo = (response.url == urlWithInfo);
    if (urlWithInfoRerturned && !isThisUrlWithInfo && !parsingDone) {
      productsContent = JSON.stringify(page.plainText);
      console.log(productsContent);
      parsingDone = true;
    }
      //productsContent = JSON.stringify(page.plainText);
    // console.log("\n\n ***************************************" + response.url + "**************************************\n" + JSON.stringify(page.plainText));
  }
};
*/



/**
 * Better way
 */
/*
var urlWithInfo = "https://www.konzum.hr/klik/v2/offers?per_page=48&page=&filter%5Bsort%5D=soldStatisticsDesc";
var productsContent;
page.onResourceReceived = function(response) {
  if (response.url.indexOf("https://www.konzum.hr/klik/v2/offers?per_page=48&page=&filter%5Bsort%5D=soldStatisticsDesc") !== -1) {
    page.render('google_home.jpeg', {format: 'jpeg', quality: '100'});

      productsContent = JSON.stringify(page.plainText);
      console.log(productsContent);
  }
};
*/



/*
var settings = {
  method: "GET"
};
var url = "https://www.konzum.hr/klik/v2/offers?per_page=48&page=&filter%5Bsort%5D=soldStatisticsDesc";
page.open(url, settings, function(status) {
  console.log('Status: ' + status);
});

page.onResourceReceived = function(response) {
  console.log(JSON.stringify(page));
};
*/


/**
 * ********************************** MAIN PROGRAM *********************************
 */
var casper = require('casper').create();
var url = 'https://www.konzum.hr/klik/v2/offers?per_page=48&page=&filter%5Bsort%5D=soldStatisticsDesc';

casper.start();

casper.thenOpen(url, function() {
    this.open(url, {
        method: 'get',
        headers: {
            'Accept': 'application/json'
        }
    });
});

casper.then(function () {
  var res = JSON.parse(this.getPageContent());
  var reducedRes = res.products;
  console.log(JSON.stringify(reducedRes));
  this.exit();
});

// must be the last one so it can scan for all thne/promise calls and initialise casper tasks stack
casper.run();






/**
 * ********************************** UTIL FUNCTION *********************************
 */









  

  