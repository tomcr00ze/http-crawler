const {normalizeURL} = require('./crawl.js');
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
