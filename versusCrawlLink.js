var page = new WebPage(), testindex = 0, loadInProgress = false;
var system = require('system'), address;

page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.onLoadStarted = function() {
    loadInProgress = true;
    console.log("load started");
};

page.onLoadFinished = function() {
    loadInProgress = false;
    console.log("load finished");
};

if (system.args.length === 1) {
    console.log('Usage: <filename>.js <some URL>');
    phantom.exit();
}

address = system.args[1];

//spoof it as normal browser
page.settings.userAgent = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/34.0.1847.116 Chrome/34.0.1847.116 Safari/537.36";

var steps = [
function() {
    console.log("Loading Versus Headphones page:" + address);
    page.open(address);
},

function() {

    var jsonUrl = page.evaluate(function() {
        console.log("Getting necessary details");

        var b = document.getElementById('stage');
        var stage = b.getElementsByClassName('stage-title')[0];
        var title = stage.getElementsByTagName('h1')[0].innerText
        var points = stage.getElementsByTagName('h2')[0].innerText

        console.log('Title: ' + title);
        console.log('Points: ' + points);

        var c = document.getElementById('propsList');
        var d = c.getElementsByClassName('prop');
        for (var i = 0; i < d.length; i++) {
            var propString = d[i].getElementsByClassName('info')[0].innerHTML;
            if (propString.indexOf('active noise canceling') > -1) {
                console.log(propString);
            } else if (propString.indexOf('noise canceling microphone') > -1) {
                console.log(propString);
            }
        }

        var title1 = title.replace(' ', '%20');
        jsonUrlvar = 'http://versus.com/amazon/search?keywords=' + title1 + '&country=IN&category=headphone';
        return jsonUrlvar;

    });

    console.log('Opening json page for price: ' + jsonUrl);
    page.open(jsonUrl);
},
function() {
    var jsonSource = page.plainText;
    page.evaluate(function(jsonSourceVar) {
        var b = JSON.parse(jsonSourceVar);
        var c = b.lowestPrice || b.offerPrice || b.listPrice;
        console.log('Price: ' + c);
    }, jsonSource);
}];

interval = setInterval(function() {
    if (!loadInProgress && typeof steps[testindex] == "function") {
        console.log("step " + (testindex + 1));
        steps[testindex]();
        testindex++;
    }
    if ( typeof steps[testindex] != "function") {
        console.log("test complete!");
        phantom.exit();
    }
}, 4000);
