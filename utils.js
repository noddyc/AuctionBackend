// this is the end time of games end in the morning
let dayHour = 18; 
let dayMin = 35; 
let daySec = 40; 
// this is the hour of games end in the morning 
// of day light saving
let dayHourSaving = 17;

// this is the end time of games end in the evening
let nightHour = 3;
let nightMin = 17;
let nightSec = 40;
// this is the hour of games end in the evening
// of day light saving
let nightHourSaving = 2;

// calculate number of seconds in a day of current time
function calcInSec(H,M,S){
    return H*3600+M*60+S;
}

module.exports ={dayHour, dayMin, daySec, nightHour, nightMin, nightSec,
    dayHourSaving, nightHourSaving, calcInSec}