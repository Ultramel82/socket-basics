var moment = require('moment');
var now = moment();

// console.log(now.format());

// console.log(now.format('X')); //display seconds since that moment - EPOCH Time/UNIX Timestamp
// console.log(now.format('x')); //milliseconds since Jan 1900 - Javascript Time Stamp
// console.log(now.valueOf());

var timestamp = 1475522657591;
var timestampMoment = moment.utc(timestamp); //view in local time

console.log(timestampMoment.local().format('h:mm a'))


// now.subtract(1, 'year')
// console.log(now.format());

// console.log(now.format('h:mm:ss a'));

// console.log(now.format('MMM Do YYYY, h:mm:ss a'));