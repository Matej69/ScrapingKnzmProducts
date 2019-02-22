var webPage = require('webpage');
var page = webPage.create();
page.settings.loadImages = false;




page.open('https://www.konzum.hr/klik/#!/offers', function(status) {
  console.log('Status: ' + status);
  // Do other things here...
});

page.onResourceReceived = function(response) {
   // console.log('Response (#' + response.url);
};


setTimeout(function() {
  var html = JSON.stringify(page.content);
  var s = page.evaluate(function() {
    //return document.querySelector('.news-icon');

    return document.querySelector('.pagination');
    /*
    var e = document.createEvent('MouseEvents');
    e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
    */

  });
  console.log(JSON.stringify(s.innerHTML));
}, 10000)

