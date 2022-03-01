var page = new WebPage();
var fs = require('fs');

var system = require('system');
var args = system.args;

if (args.length != 3)
{
   console.log("Usage: phantomjs export.js <url> <filename>");
   phantom.exit();
}
var url = args[1];
var filename = args[2];

function exportPage()
{
   console.log("Writing to " + filename);
   //page.render('export.png');
   fs.write(filename, page.content, 'w');
   phantom.exit();
}

page.onLoadFinished = function() {
  console.log("Page loaded, waiting 2 sec...");
  setTimeout(function() {
     exportPage();
  }, 2000);
};

console.log("Opening " + url);
page.open(url, function() {
  page.evaluate(function() {
  });
});

