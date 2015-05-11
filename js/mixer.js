/////////////Audio/////////////Audio/////////////Audio/////////////Audio/////////////Audio/////////////Audio

// Audio / Timing Variables
var isPlaying = false;      // Are we currently playing?
var current16thNote;        // What note is currently last scheduled?
var current64thNote = 0;        // What note is currently last scheduled?
var barNumber = 0;              // Timing Variables
var barNumberL = 0;
var bar4Number = 0;
var bar16Number = 0;
var tempo = 145.0;          // tempo (in beats per minute)
var lookahead = 25;       // How frequently to call scheduling function (in milliseconds)
var scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
// calculated from lookahead, and overlaps with next interval (in case the timer is late)
var nextNoteTime = 0.0;     // when the next note is due.
//var last16thNoteDrawn = -1;
//var notesInQueue = [];      // {note, time}
var timerWorker = null;     // The Web Worker used to fire timer messages

var bufferLoader;
var samplebb = [];          // Sounds Array

/////////////////   FX      /////////////////////////
var audioContext = new AudioContext();

//  Impulse response
function impulseResponse(duration, decay, reverse) {
    var sampleRate = audioContext.sampleRate;
    var length = sampleRate * duration;
    var impulse = audioContext.createBuffer(2, length, sampleRate);
    var impulseL = impulse.getChannelData(0);
    var impulseR = impulse.getChannelData(1);

    if (!decay)
        decay = 2.0;
    for (var i = 0; i < length; i++) {
        var n = reverse ? length - i : i;
        impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
        impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    }
    return impulse;
}
var impulseBuffer = impulseResponse(4, 4, false);
var impulseBufferReverse = impulseResponse(1, 4, true);

var compressor = audioContext.createDynamicsCompressor();
compressor.threshold.value = -30;
compressor.knee.value = 40;
compressor.ratio.value = 12;
compressor.reduction.value = 0;
compressor.attack.value = 0;
compressor.release.value = 0.25;

var masterChannel = audioContext.createGain();
var gainNode1 = audioContext.createGain();
var gainNode2 = audioContext.createGain();
var gainNode3 = audioContext.createGain();
var gainNode3B = audioContext.createGain();
var gainNode3C = audioContext.createGain();
var gainNode3D = audioContext.createGain();
var gainNode3E = audioContext.createGain();
var gainNode4 = audioContext.createGain();
var gainNode5 = audioContext.createGain();

var masterDry = audioContext.createGain();
var masterWet = audioContext.createGain();

var planet1gain = audioContext.createGain();
var planet2gain = audioContext.createGain();
var planet3gain = audioContext.createGain();
var planet4gain = audioContext.createGain();
var planet5gain = audioContext.createGain();
var planet6gain = audioContext.createGain();
var planet7gain = audioContext.createGain();
var planet8gain = audioContext.createGain();
var planet9gain = audioContext.createGain();
var planet10gain = audioContext.createGain();
var planet11gain = audioContext.createGain();
var planet12gain = audioContext.createGain();
var planet13gain = audioContext.createGain();
var planet14gain = audioContext.createGain();


var convolverWarehouse = audioContext.createConvolver();
convolverWarehouse.buffer = impulseBuffer;

var lowpassFilter = audioContext.createBiquadFilter();
var lowpassFilter2 = audioContext.createBiquadFilter();
lowpassFilter.frequency.value = 20000;
lowpassFilter2.frequency.value = 20000;

var filterD = audioContext.createBiquadFilter();
var delay = audioContext.createDelay();
var feedback = audioContext.createGain();

masterChannel.gain.value = 1;            // MASTER VOLUME

gainNode1.gain.value = 0.9;
gainNode2.gain.value = 0.37;
gainNode3.gain.value = 0.3;

gainNode3D.gain.value = 0.13;           //
gainNode3B.gain.value = 0.19;           // No Delay entities

gainNode3E.gain.value = 0.05;
gainNode3C.gain.value = 0.12;

gainNode4.gain.value = 0.22;
gainNode5.gain.value = 0.15;            // Quieter Entities

masterWet.gain.value = 0.2;
masterDry.gain.value = 1;

// Individual Planet Channels
planet1gain.gain.value = 0.0;
planet2gain.gain.value = 0.0;
planet3gain.gain.value = 0.0;
planet4gain.gain.value = 0.0;
planet5gain.gain.value = 0.0;
planet6gain.gain.value = 0.0;
planet7gain.gain.value = 0.0;
planet8gain.gain.value = 0.0;
planet9gain.gain.value = 0.0;
planet10gain.gain.value = 0.0;
planet11gain.gain.value = 0.0;
planet12gain.gain.value = 0.0;
planet13gain.gain.value = 0.0;
planet14gain.gain.value = 0.0;

// Feedback Delay Nodes
delay.delayTime.value = 0.413;          // DELAY TIME
feedback.gain.value = 0.6;              // FEEDBACK AMOUNT
filterD.frequency.value = 3000;         // DELAY FEEDBACK FILTER

///////////////////////////////////////////////////
masterChannel.connect(compressor);              //  Main Mix > Compressor
compressor.connect(audioContext.destination);   //  Compressor > Speakers
/////////////////////////////////////////////////