const app = require('./app');
const source = require('./source');

source.init();

source.evt.on('randomNumbersEvent',(a, b)=>{
    app.sum(a,b).then(s=>console.log(s));
});