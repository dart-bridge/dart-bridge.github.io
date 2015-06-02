//PR.registerLangHandler(
//    PR.createSimpleLexer([
//            ["pun", /^[:>?|]+/, a, ":|>?"],
//            ["dec", /^%(?:YAML|TAG)[^\n\r#]+/, a, "%"],
//            ["typ", /^&\S+/, a, "&"],
//            ["typ", /^!\S*/, a, "!"],
//            ["str", /^"(?:[^"\\]|\\.)*(?:"|$)/, a, '"'],
//            ["typ", /^'(?:[^']|'')*(?:'|$)/, a, "'"],
//            ["com", /^#[^\n\r]*/, a, "#"],
//            ["pln", /^\s+/, a, " \t\r\n"]
//        ],
//        [
//            ["dec", /^(?:---|\.\.\.)(?:[\n\r]|$)/],
//            ["pun", /^-/], ["kwd", /^\w+:[\n\r ]/],
//            ["pln", /^\w+/]
//        ]), ["bri", "bridge"]);
PR.registerLangHandler(
    PR.createSimpleLexer(
        [],
        [
            //[PR.PR_PLAIN,       /^(?:\\#|[^<?/#\\])+/],
            [PR.PR_PLAIN,       /^[^<?/\$\\]+/],
            [PR.PR_DECLARATION, /^<!\w[^>]*(?:>|$)/],
            [PR.PR_COMMENT,     /^\/\/.*/],
            [PR.PR_PUNCTUATION,     /^\\\$/],
            [PR.PR_LITERAL,     /^(?!\\)\$\{?[\w.]+}?/],
            // Unescaped content in an unknown language
            ['lang-',        /^<\?([\s\S]+?)(?:\?>|$)/],
            ['lang-',        /^<%([\s\S]+?)(?:%>|$)/],
            [PR.PR_PUNCTUATION, /^(?:<[%?]|[%?]>)/],
            ['lang-',        /^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i],
            // Unescaped content in javascript.  (Or possibly vbscript).
            ['lang-dart',      /^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i],
            // Contains unescaped stylesheet content
            ['lang-css',     /^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i],
            ['lang-in.tag-btl',  /^(<\/?[a-z][^<>]*>)/i]
        ]),
    ["bri", "bridge", "btl"]);
PR.registerLangHandler(
    PR.createSimpleLexer(
        [
            [PR.PR_PLAIN,        /^[\s]+/, null, ' \t\r\n'],
            [PR.PR_ATTRIB_VALUE, /^(?:\"[^\"]*\"?|\'[^\']*\'?)/, null, '\"\'']
        ],
        [
            [PR.PR_LITERAL,     /^=(?!\\)\$\{?[\w.]+}?/],
            [PR.PR_TAG,          /^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i],
            [PR.PR_ATTRIB_NAME,  /^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],
            ['lang-uq.val',   /^=\s*([^>\'\"\s]*(?:[^>\'\"\s\/]|\/(?=\s)))/],
            [PR.PR_PUNCTUATION,  /^[=<>\/]+/],
            ['lang-js',       /^on\w+\s*=\s*\"([^\"]+)\"/i],
            ['lang-js',       /^on\w+\s*=\s*\'([^\']+)\'/i],
            ['lang-js',       /^on\w+\s*=\s*([^\"\'>\s]+)/i],
            ['lang-css',      /^style\s*=\s*\"([^\"]+)\"/i],
            ['lang-css',      /^style\s*=\s*\'([^\']+)\'/i],
            ['lang-css',      /^style\s*=\s*([^\"\'>\s]+)/i]
        ]),
    ['in.tag-btl']);