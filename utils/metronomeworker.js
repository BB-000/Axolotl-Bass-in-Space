var timerID = null;
var interval = 200;

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