const cluster = require('cluster');
const http = require('http');

function sleep(ms) { // node.js >= 9.3 → blocks event loop
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function doWork() {
    sleep(2000);
    return 'Completed';
}

if (cluster.isMaster) {
    const numCPUs = 4;
    for (let i =0; i < numCPUs; i++) {
        cluster.fork({workerId: i});
    }

    console.log('[MASTER] Created ' + numCPUs + ' workers.');
} else {
    http.Server((req, res) => {
        console.log('request: ' + req.url);
      
        const s = doWork();
        res.writeHead(200);
        res.end(s.toString());
      }).listen(8000);
}
