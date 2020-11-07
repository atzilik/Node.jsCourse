const { count } = require('console');
const http = require('http');

const COUNT = 10;
let completed = 0;
let time;

function timer() {
    const start = process.hrtime();

    return {
        timeEnd() {
            const [seconds, nanoseconds] = process.hrtime(start);
            return Math.round(seconds * 1e3 + nanoseconds / 1e6);
        },
    };
}

function call(){
    http.get('http://localhost:8000', function(resp) {
        let data = '';

        // A chunk of data has been recieved
        resp.on('data', (chunk) => {
            data += chunk;
        });
      
        //The whole response has been received. Print out the result.

        resp.on('end', () => {
            console.log('Response: ' + data);
            if (++completed === COUNT) {
                console.log(`SEQUENCE ENDED! ${time.timeEnd()}ms`);
            }
        }); 
    })
    .on('error', (err)=> console.log(err));
}

time = timer();

for (let i = 0; i < COUNT; i++) {
    console.log(`Initiating call ${i+1}`);
    call();
}

console.log('Initiated HTTP calls', COUNT);