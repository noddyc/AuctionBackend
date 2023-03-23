let dayHour = 9; // should put in est time according to utc
let dayMin = 50; // utc
let daySec = 40; // utc

let dayHourSaving = 10;
let dayMinSaving = 0;
let daySecSaving = 0;

// need to convert to utc or not
let nightHour = 21;
let nightMin = 17;
let nightSec = 40;


function calcInSec(H,M,S){
    return H*3600+M*60+S;
}

module.exports ={dayHour, dayMin, daySec, nightHour, nightMin, nightSec,
    dayHourSaving, dayMinSaving, daySecSaving, calcInSec}