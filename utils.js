let dayHour = 18; // should put in est time according to utc
let dayMin = 35; // utc
let daySec = 40; // utc

let dayHourSaving = 17;


// need to convert to utc or not
let nightHour = 3;
let nightMin = 17;
let nightSec = 40;

let nightHourSaving = 2;



function calcInSec(H,M,S){
    return H*3600+M*60+S;
}

module.exports ={dayHour, dayMin, daySec, nightHour, nightMin, nightSec,
    dayHourSaving, nightHourSaving, calcInSec}