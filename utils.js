let dayHour = 7; // should put in est time according to utc
let dayMin = 25; // utc
let daySec = 40; // utc

// need to convert to utc or not
let nightHour = 21;
let nightMin = 17;
let nightSec = 40;


function calcInSec(H,M,S){
    return H*3600+M*60+S;
}

module.exports ={dayHour, dayMin, daySec, nightHour, nightMin, nightSec,
calcInSec}