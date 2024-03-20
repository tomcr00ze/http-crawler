const {normalizeURL, getURLsFromHTML} = require('./crawl.js');
const {test, expect} = require('@jest/globals');

// testing url with https://
test('normalizeURL strip https', () => {
    const input = 'https://blog.tomcrooze.dev/path';
    const actual = normalizeURL(input);
    const expected = 'blog.tomcrooze.dev/path';
    expect(actual).toEqual(expected);
});

// testing url with http://
test('normalizeURL strip http', () => {
    const input = 'http://blog.tomcrooze.dev/path';
    const actual = normalizeURL(input);
    const expected = 'blog.tomcrooze.dev/path';
    expect(actual).toEqual(expected);
});

// testing url with trailing '/'
test('normalizeURL strip trailing slash', () => {
    const input = 'https://blog.tomcrooze.dev/path/';
    const actual = normalizeURL(input);
    const expected = 'blog.tomcrooze.dev/path';
    expect(actual).toEqual(expected);
});

// testing url with capitals
test('normalizeURL strip http', () => {
    const input = 'http://BLOG.tomcrooze.dev/path';
    const actual = normalizeURL(input);
    const expected = 'blog.tomcrooze.dev/path';
    expect(actual).toEqual(expected);
});

// testing getURLsFromHTML absolute path
test('getURLsFromHTML absolute', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="https://blog.tomcrooze.dev/">
                tomcr00ze.dev Blog
            </a>
        </body>
    </html>
    `
    const inputBaseURL = "https://blog.tomcrooze.dev";
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = ["https://blog.tomcrooze.dev/"];
    expect(actual).toEqual(expected);
});

// testing getURLsFromHTML relative path
test('getURLsFromHTML relative', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="/path/">
                tomcr00ze.dev Blog
            </a>
        </body>
    </html>
    `
    const inputBaseURL = "https://blog.tomcrooze.dev";
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = ["https://blog.tomcrooze.dev/path/"];
    expect(actual).toEqual(expected);
});

// testing getURLsFromHTML both paths
test('getURLsFromHTML both', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="https://blog.tomcrooze.dev/path1/">
                tomcr00ze.dev Blog 1
            </a>
            <a href="/path2/">
                tomcr00ze.dev Blog 2
            </a>
        </body>
    </html>
    `
    const inputBaseURL = "https://blog.tomcrooze.dev";
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = ["https://blog.tomcrooze.dev/path1/", "https://blog.tomcrooze.dev/path2/"];
    expect(actual).toEqual(expected);
});

// testing getURLsFromHTML invalid URL
test('getURLsFromHTML invalid url', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="http.invalid.url">
                Invalid URL
            </a>
        </body>
    </html>
    `
    const inputBaseURL = "https://blog.tomcrooze.dev";
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = [];
    expect(actual).toEqual(expected);
});