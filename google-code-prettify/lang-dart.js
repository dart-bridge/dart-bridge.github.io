PR.registerLangHandler(
    PR.createSimpleLexer([
            ["pln", /^[\t\n\r \xa0]+/, null, "\t\n\r \u00a0"]
        ],
        [
            ["com", /^#!.*/],
            ["kwd", /^\b(?:import|export|library|part of|part|as|show|hide)\b/i],
            ["com", /^\/\/.*/],
            ["com", /^\/\*[^*]*\*+(?:[^*/][^*]*\*+)*\//],
            ["kwd", /^\b(?:class|async|await)\b/i],
            ["kwd", /^\b(?:assert|break|case|catch|continue|default|do|else|finally|for|if|in|is|new|return|super|switch|this|throw|try|while)\b/i],
            ["kwd", /^\b(?:abstract|const|extends|factory|final|get|implements|native|operator|set|static|typedef|var)\b/i],
            ["lit", /^@\w+\b/i],

            ["typ", /^\b(?:bool|double|dynamic|int|num|object|string|void)\b/i],
            ["typ", /^\b[A-Z][A-Za-z]+\b/],
            ["kwd", /^\b(?:false|null|true)\b/i],
            ["str", /^r?'''[\S\s]*?[^\\]'''/],
            ["str", /^r?"""[\S\s]*?[^\\]"""/],
            ["str", /^r?'('|[^\n\f\r]*?[^\\]')/],
            ["str", /^r?"("|[^\n\f\r]*?[^\\]")/],
            ["pun", /^[!%&*+/:<-?^|~-]/],
            ["lit", /^\b0x[\da-f]+/i],
            ["lit", /^\b\d+(?:\.\d*)?(?:e[+-]?\d+)?/i],
            ["lit", /^\b\.\d+(?:e[+-]?\d+)?/i],
            ["pln", /^[$_a-z]\w*/i],
            ["pun", /^[(),.;[\]{}]/]
        ]),
    ["dart"]
);
