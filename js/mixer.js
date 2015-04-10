/////////////Audio/////////////Audio/////////////Audio/////////////Audio/////////////Audio/////////////Audio

var audioContext = null;
var isPlaying = false;      // Are we currently playing?
var startTime;              // The start time of the entire sequence.

var current16thNote;        // What note is currently last scheduled?
var barNumber = 0;
var bar4Number = 0;
var bar16Number = 0;
var tempo = 145.0;          // tempo (in beats per minute)
var lookahead = 25.0;       // How frequently to call scheduling function
                            //(in milliseconds)
var scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
// This is calculated from lookahead, and overlaps
// with next interval (in case the timer is late)
var nextNoteTime = 0.0;     // when the next note is due.
var noteResolution = 0;     // 0 == 16th, 1 == 8th, 2 == quarter note
var noteLength = 0.05;      // length of "beep" (in seconds)
//var canvas,                 // the canvas element
//    canvasContext;          // canvasContext is the canvas' context 2D

//var last16thNoteDrawn = -1;
//var notesInQueue = [];      // the notes that have been put into the web audio,
                            // and may or may not have played yet. {note, time}
var timerWorker = null;     // The Web Worker used to fire timer messages


var bufferLoader;
var samplebb = [];


//audioContext = new AudioContext();

/////////////////   FX      /////////////////////////
audioContext = new AudioContext();
var masterChannel = audioContext.createGain();
var gainNode1 = audioContext.createGain();
var gainNode2 = audioContext.createGain();
var gainNode3 = audioContext.createGain();
var gainNode4 = audioContext.createGain();


var filterD = audioContext.createBiquadFilter();
var delay = audioContext.createDelay();
var feedback = audioContext.createGain();

masterChannel.gain.value = 0.5;          // MASTER VOLUME

gainNode1.gain.value = 0.8;
gainNode2.gain.value = 0.4;
gainNode3.gain.value = 0.2;
gainNode4.gain.value = 0.05;

delay.delayTime.value = 0.413;          // DELAY TIME
feedback.gain.value = 0.7;              // FEEDBACK AMOUNT
filterD.frequency.value = 1000;         // DELAY FEEDBACK FILTER

///////////////////////////////////////////////////