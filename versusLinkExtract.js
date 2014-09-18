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
	console.log("Load Versus Top Headphones page");
	page.open(address);
},

function() {

	page.evaluate(function() {
		console.log("Getting top link");
		var x = document.getElementById('winnerContainer');
		var firstLink = x.getAttribute('href');

		console.log('Top link: http://versus.com' + firstLink);

		var b = document.getElementById('list');
		//var c = b.getElementsByClassName(' object  top3 ');
		var c = b.getElementsByClassName(' object ');

		for (var i = 0; i < c.length; i++) {
			var link = c[i].getElementsByTagName('a')[0].getAttribute('href');
			console.log('Link: http://versus.com' + link);

		}

	});

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
