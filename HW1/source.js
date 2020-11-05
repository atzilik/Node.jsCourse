const events = require('events');

const NOTIFY_INTERVAL = 1000;

const evt = new events.EventEmitter();
const randomNum = ()=> Math.floor(Math.random() * 100);

function init(){
    setInterval(()=> {
        evt.emit('randomNumbersEvent', randomNum(), randomNum());
    }, NOTIFY_INTERVAL);
}

module.exports = {
    evt,
    init
}