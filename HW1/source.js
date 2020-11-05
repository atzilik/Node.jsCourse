const events = require('events');

const NOTIFY_INTERVAL = 1000;

const evt = new events.EventEmitter();



//const getRandomIntFrom0To100 = (max) => Math.floor(Math.random() * 100);


function init(){
    setInterval(()=> {
        const num1 = Math.floor(Math.random() * 100);
        const num2 = Math.floor(Math.random() * 100);
        evt.emit('randomNumbersEvent', num1, num2);
    }, NOTIFY_INTERVAL);
}

module.exports = {
    evt,
    init
}