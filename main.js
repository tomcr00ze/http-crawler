const {crawlPage} = require('./crawl.js');

function main() {
    // Here 3 is used because : 
    //      - the 1st argument is the interpreter(or compiler in case of compiled language).
    //      - the 2nd argument is the program file name(with location).
    // The first two arguments are for the shell not for the script point of view.
    // E.g. -> node main.js argv1 argv2 ...
    if(process.argv.length < 3) {
        console.error("No website provided");
        process.exit(1);
    }
    if(process.argv.length > 3) {
        console.error("Too many command line arguments");
        process.exit(1);
    }

    const baseURL = process.argv[2];
    console.log(`Starting Crawl of ${baseURL}`);
    crawlPage(baseURL);
}

main()