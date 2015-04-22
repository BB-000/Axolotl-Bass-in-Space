//var timerID=null;
//var interval= 250;  // 100
//
//self.onmessage=function(e){
//    if (e.data=="start") {
//        console.log("starting");
//        timerID=setInterval(function(){postMessage("tick");},interval);
//    }
//    else if (e.data.interval) {
//        console.log("setting interval");
//        interval=e.data.interval;
//        console.log("interval="+interval);
//        if (timerID) {
//            clearInterval(timerID);
//            timerID=setInterval(function(){postMessage("tick");},interval);
//        }
//    }
//    else if (e.data=="stop") {
//        console.log("stopping");
//        clearInterval(timerID);
//        timerID=null;
//    }
//};
//
//postMessage('hi there');



var timerID = null;
var interval = 250;

function tickBack() {           // share callback for timer
    postMessage("tick");
}

function startTimer() {             // centralize start method
    stopTimer();                    // can be called with no consequence even if id=null
    timerID = setInterval(tickBack, interval);
}

function stopTimer() {              // centralize stop method
    console.log("stopping");
    clearInterval(timerID);
    timerID = null;
}

self.onmessage = function(e){

    if (e.data === "start") {
        console.log("starting");
        startTimer();
    }
    else if (e.data === "stop") {
        stopTimer();
    }
    else if (e.data.interval) {
        interval = e.data.interval;


        if (timerID !== null) {
            startTimer();
            console.log("starting----");
        }
    }
};