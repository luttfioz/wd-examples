var username = process.env.SAUCE_USERNAME || "SAUCE_USERNAME";
var accessKey = process.env.SAUCE_ACCESS_KEY || "SAUCE_ACCESS_KEY";

require('colors');
var assert = require('assert');

var wd;
try {
  wd = require('wd');
} catch (err) {
  wd = require('../../lib/main');
}

var browser = wd.remote();

// optional extra logging
browser.on('status', function (info) {
  console.log(info.cyan);
});
browser.on('command', function (eventType, command, response) {
  console.log(' > ' + eventType.cyan, command, (response || '').grey);
});
browser.on('http', function (meth, path, data) {
  console.log(' > ' + meth.magenta, path, (data || '').grey);
});


browser.init({
  browserName: 'chrome'
  , tags: ["examples"]
  , name: "This is an example test"
}, function () {

  browser.get("http://admc.io/wd/test-pages/guinea-pig.html", function () {
    browser.title(function (err, title) {
      assert.ok(~title.indexOf('I am a page title - Sauce Labs'), 'Wrong title!');
      browser.elementById('i am a link', function (err, el) {
        browser.clickElement(el, function () {
          browser.eval("window.location.href", function (err, href) {
            assert.ok(~href.indexOf('guinea-pig2'));
            browser.quit();
          });
        });
      });
    });
  });

});