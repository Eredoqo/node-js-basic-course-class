const mathUtils = require("./math-utils");

console.log("Now, I'm able to do other works");

request1(200000, (response1) => {
    console.log("**prime numbers**", response1);
});

otherRequests();

function otherRequests() {
    setInterval(() => {
        console.log("other requests...");
    }, 50);
}

function request1(n, callback) {
    console.log("**calc prime numbers...**");
    const start = new Date();

    const chunkSize = 5;
    let current = 2;
    let primes = [];

    let segment = 100;

    function processChunk() {
        if((Math.min(current + chunkSize - 1)) < segment) {
            console.log(`calc prime numbers 2-100 ${current}...${Math.min(current + chunkSize - 1, n)}`);
            primes = primes.concat(mathUtils.getPrimeNumbersWithinRange(current, Math.min(current + chunkSize - 1, n)));
            current += chunkSize;
        } else {
            return
        }
       
        if (current <= n) {
            setTimeout(processChunk, 1000);  
        } else {
            const end = new Date();
            console.log("**end calc prime numbers**. Elapsed ms: ", end.getTime() - start.getTime());
            callback(primes);  
        }
    }

    processChunk();
}