// This whole system is terribly hacky, but making Google Pretty Print
// work in NodeJS was harder than I expected

var page = require('webpage').create(), fs = require('fs'),
    system = require('system')
    address = "http://localhost:1337/" + system.args[1];

page.open(address, function (status) {
    setTimeout(function(){

    console.log(page.content
            .replace('<script src="/google-code-prettify/prettify.js"></script><script src="/google-code-prettify/lang-dart.js"><script src="/google-code-prettify/lang-css.js"></script><script src="/google-code-prettify/lang-yaml.js"></script><script>prettyPrint()</script></body></html>', '')
            .replace('<html><head></head><body>', '')
    );
    phantom.exit();
    }, 1000);
});