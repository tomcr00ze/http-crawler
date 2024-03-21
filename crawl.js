const {JSDOM} = require('jsdom')

// A Recursive function which actually crawls the website, given the baseURL from command line args.
// baseURL    -> home page of the website (starting point).
// currentURL -> page that we are actively crawling.
// pages      -> object that keeps track of pages that we have crawled so far.
//               It is a map[normalizedURLs, frequency(of normalizedURLs)].           
async function crawlPage(baseURL, currentURL, pages) {
    const baseURLObj = new URL(baseURL);
    const currentURLObj = new URL(currentURL);

    // Make sure that currentURL is on the same domain as baseURL.
    // We don't want to crawl the entire internet here.
    // So, whenever we encounter a link that links out to external site, we ignore it.
    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages;
    }

    // Checks whether we have already crawled currentURL page.
    // If yes, then increment its frequency in pages map.
    // It helps in finding how many times a certain page is links back to the site.
    // We will use this info in the report shared to the user.
    const normalizedCurrentURl = normalizeURL(currentURL);
    if (pages[normalizedCurrentURl] > 0) {
        pages[normalizedCurrentURl]++;
        return pages;
    }
    pages[normalizedCurrentURl] = 1;

    console.log(`actively crawling: ${currentURL}`);

    //Started fetching(or crawling) the currentURL.
    try {
        // when the website is not reachable
        const resp = await fetch(currentURL);
        if (resp.status > 399) {
            console.error(`Error in fetch with status code: ${resp.status} on page: ${currentURL}`);
            return pages;
        }

        // when the website gives response other than 'text/html'
        const contentType = resp.headers.get('content-type');
        if (!contentType.includes('text/html')) {
            console.error(`Non HTML response, Content-Type: ${contentType} on page: ${currentURL}`);
            return pages;
        }

        const htmlBody = await resp.text();

        // Extract all the links from the htmlBody, then recursively crawls over them.
        const nextURLs = getURLsFromHTML(htmlBody, baseURL);
        for(const nextURL of nextURLs) {
            pages = await crawlPage(baseURL, nextURL, pages);
        }
    } catch(err) {
        console.error(`Error in fetching: ${err.message}, on page: ${currentURL}`);
    }

    return pages;
}

// This function takes two arguments - 
//      (string) : htmlBody -> contains the html code where we will find the URLs.
//      (string) : baseURL  -> contains the URL of the website that we will crawl.
// Gets all URLs and links embedded in the webpage (htmlBody) and returns an array of URLs.
function getURLsFromHTML(htmlBody, baseURL) {
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll('a');
    for (const linkElement of linkElements) {
        if (linkElement.href.slice(0,1) === '/') {
            // relative url
            try {
                const urlObj = new URL(`${baseURL}${linkElement.href}`);
                urls.push(urlObj.href);
            } catch(err) {
                console.error(err.message);
            }
        } else {
            // absolute url
            try {
                const urlObj = new URL(linkElement.href);
                urls.push(urlObj.href);
            } catch(err) {
                console.error(err.message);
            }
        }
    }
    return urls;
}

// This file will contain code to normalize the url
function normalizeURL(urlString) {
    const urlObj = new URL(urlString);
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
    if(hostPath.length > 0 && hostPath.slice(-1) === '/') {
        return hostPath.slice(0,-1);
    }

    return hostPath;
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
};