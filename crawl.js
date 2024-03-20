const {JSDOM} = require('jsdom')

// Function which actually crawls the page, given the URL from command line args.
async function crawlPage(currentURL) {
    console.log(`actively crawling: ${currentURL}`);
    try {
        const resp = await fetch(currentURL);
        // when the website is not reachable
        if (resp.status > 399) {
            console.error(`Error in fetch with status code: ${resp.status} on page: ${currentURL}`);
            return
        }
        const contentType = resp.headers.get('content-type');
        // when the website gives response other than 'text/html'
        if (!contentType.includes('text/html')) {
            console.error(`Non HTML response, Content-Type: ${contentType} on page: ${currentURL}`);
            return
        }
        console.log(await resp.text());
    } catch(err) {
        console.error(`Error in fetching: ${err.message}, on page: ${currentURL}`);
    }
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