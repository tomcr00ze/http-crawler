// Function to format the pages map(or Object) into beautiful report.
function printReport(pages) {
    console.log('====================================================');
    console.log('================== REPORT START ====================');
    console.log('====================================================');
    const sortedPages = sortPages(pages);
    for(const sortedPage of sortedPages) {
        const url = sortedPage[0];
        const freq = sortedPage[1];
        console.log(`Found ${freq} links to page: ${url}`);
    }
    console.log('==================================================');
    console.log('================== REPORT END ====================');
    console.log('==================================================');
}

// Sorts the pages according to decreasing order of their frequency.
function sortPages(pages) {
    const pagesArray = Object.entries(pages);
    pagesArray.sort((a,b) => {
        aFreq = a[1];
        bFreq = b[1];
        return bFreq-aFreq;
    });
    return pagesArray;
}

module.exports = {
    sortPages,
    printReport
};