const http = require('http');


function sleep(ms) { // node.js >= 9.3 → blocks event loop
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
  }

function sumSync(arg1, arg2) {
  sleep(2000);
  return arg1 + arg2;
}

http.Server((req, res) => {
  console.log('request: ' + req.url);

  const s = sumSync(2,3);
  res.writeHead(200);
  res.end(s.toString());
}).listen(8000);
