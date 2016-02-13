/**
 * Created by Barnabeeeeee on 06/02/15.
 */

var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
}());

//Create the canvas
var canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.style.zIndex = 8;
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;
canvas.oncontextmenu = function () {                                                                                    // Disable right click on the canvas
    return false;
}

var xdiv = document.createElement("div");                                                                               // Create DOM Elements + Canvas...
var overlay = document.createElement("div");
var xscore = document.createElement("div");
var xhealth = document.createElement("div");
var xpowerup = document.createElement("div");
var pausediv = document.createElement("div");
var pausetext = document.createElement("div");
var volume = document.createElement("div");

xdiv.id = "canvas-wrap";
overlay.id = "overlay";
xscore.id = "xscore";
xhealth.id = "xhealth";
xpowerup.id = "xpowerup";
xscore.innerHTML = "Space Cash:  0";
xhealth.innerHTML = ("Space Health:  " + hero.health);
xpowerup.innerHTML = "";
pausediv.id = "pausediv";
pausetext.id = "pausetext";
pausetext.innerHTML = "";
volume.id = "controlz";
volume.innerHTML = ("<p>Volume<input id='gainSlider' type='range' min='0' max='1' step='0.05' value='1' oninput='updateVolume(this.value)'/></input></p>");
// Volumeometer
document.body.appendChild(xdiv);                                                                                        // Wrapper for canvas and overlay
xdiv.appendChild(canvas);                                                                                               // Add canvas and overlay to page
xdiv.appendChild(overlay);
xdiv.appendChild(pausediv);
xdiv.appendChild(volume);
pausediv.appendChild(pausetext);
overlay.appendChild(xscore);
overlay.appendChild(xhealth);
overlay.appendChild(xpowerup);

//  MAIN GAME LOOP  //
var lastTime;
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    update(dt);
    render();
    lastTime = now;
    requestAnimFrame(main);
}

function init() {
    loadSounds();

    timerWorker = new Worker("utils/metronomeworker.js");                                                               // Audio scheduling timer, ticks every beat
    timerWorker.onmessage = function (e) {
        if (e.data == "tick") {
            scheduler();
        }
        else
            console.log("message: " + e.data);
    };
    timerWorker.postMessage({"interval": lookahead});

    //   Event Listeners for movement and shooting     //
    window.addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);

    window.addEventListener("keyup", function (e) {
        delete keysDown[e.keyCode];
    }, false);

    window.addEventListener("keydown", function (e) {
        if ( e.keyCode === 32 ) {
            if (state === "playing") {                                                                                      // Set shoot to true if player is holding shoot button (spacebar)
                shootx = true;
            }
            if (paused === true) {
                paused = false;                                                                                             // Unpause the game and remove pause overlay if clicked
                pausetext.innerHTML = "";
            }
        }
    });

    window.addEventListener("keyup", function (e) {                                                                        // Stop shooting
        if ( e.keyCode === 32 ) {
            shootx = false;
        }
    });

    window.addEventListener("mousedown", function (e) {
        if (state === "startmenu" && readyforblastoff) {
            state = "playing";
            play();
        }
        if (state === "playing") {                                                                                      // Set shoot to true if player is holding shoot button (mouse click)
            shootx = true;
        }
        if (paused === true) {
            paused = false;
            pausetext.innerHTML = "";
        }
    });

    window.addEventListener("mouseup", function (e) {
        shootx = false;                                                                                                 // Stop shooting when it is released
    });
    // Updates x + y mouse positions to calculate where to shoot
    window.addEventListener("mousemove", function (event) {                                                             // Get the coordinates of the mouse to shoot towards
        bulletX = event.clientX;
        bulletY = event.clientY;
    });


    window.addEventListener('resize', resizeCanvas);                                                                    // Resizes the game if it is resized / zoomed
    // Get Browser-Specifc Prefix
    function getBrowserPrefix() {

        // Check for the unprefixed property.
        if ('hidden' in document) {
            return null;
        }
        // All the possible prefixes.
        var browserPrefixes = ['moz', 'ms', 'o', 'webkit'];

        for (var i = 0; i < browserPrefixes.length; i++) {
            var prefix = browserPrefixes[i] + 'Hidden';
            if (prefix in document) {
                return browserPrefixes[i];
            }
        }
        // The API is not supported in browser.
        return null;
    }

// Get Browser Specific Hidden Property  -- This code finds out if the tab is active or not
    function hiddenProperty(prefix) {
        if (prefix) {
            return prefix + 'Hidden';
        } else {
            return 'hidden';
        }
    }

// Get Browser Specific Visibility State
    function visibilityState(prefix) {
        if (prefix) {
            return prefix + 'VisibilityState';
        } else {
            return 'visibilityState';
        }
    }

// Get Browser Specific Event
    function visibilityEvent(prefix) {
        if (prefix) {
            return prefix + 'visibilitychange';
        } else {
            return 'visibilitychange';
        }
    }

    // Get Browser Prefixl
    var prefix = getBrowserPrefix();
    var hidden = hiddenProperty(prefix);
    var visibilityState = visibilityState(prefix);
    var visibilityEvent = visibilityEvent(prefix);

    document.addEventListener(visibilityEvent, function (event) {
        if (document[hidden]) {
            paused = true;
        }
    });

    ///////////////////////////////      Spawn Planets
    spawnPlanet(1, PlanetMars);
    spawnPlanet(1, PlanetBlue1);
    spawnPlanet(1, PlanetBlue2);
    spawnPlanet(1, PlanetPinkMosaic);
    spawnPlanet(1, PlanetFlute);
    spawnPlanet(1, PlanetCoconut);
    spawnPlanet(1, PlanetBreakbeat);
    spawnPlanet(1, PlanetWarble);
    spawnPlanet(1, PlanetPlink);
    spawnPlanet(1, PlanetFlange);
    spawnPlanet(1, PlanetBlobby);
    spawnPlanet(1, Planet12);
    spawnPlanet(1, Planet13);
    spawnPlanet(1, Planet14);
    spawnPlanet(1, BlackHole);

    lastTime = Date.now();

    main();                                                                                                             // Call main game loop!
}

// Load all images, once done call init()
resources.load([
    'images/startscreenload.png',
    'images/startscreen.png',
    'images/Stars.jpg',
    'images/Hero.png',
    'images/Hero2.png',
    'images/Fish.png',
    'images/Prawn.png',
    'images/BeetleBlue.png',
    'images/PrawnYellow.png',
    'images/Shark.png',
    'images/Mosquito.png',
    'images/Boulder.png',
    'images/blt.png',
    'images/spawn.png',
    'images/Mosquito2.png',
    'images/PlanetMars.png',
    'images/PlanetBlueX.png',
    'images/PlanetBlueHex2.png',
    'images/JellyOrange.png',
    'images/PlanetPink.png',
    'images/JellyGreen.png',
    'images/JellyPurple.png',
    'images/HeartGreenEyes.png',
    'images/HeartGreen.png',
    'images/Planet4.png',
    'images/Planet5.png',
    'images/Planet6.png',
    'images/Planet7.png',
    'images/Planet8.png',
    'images/Planet9.png',
    'images/Planet10.png',
    'images/PlanetPink2.png',
    'images/Potion1.png',
    'images/Potion2.png',
    'images/Potion3.png',
    'images/Wizard.png',
    'images/WizardGreen.png',
    'images/WizardRed.png',
    'images/Planet11.png',
    'images/Planet12.png',
    'images/Planet13.png',
    'images/Planet14.png',
    'images/Planet15.png',
    'images/Planet16.png',
    'images/BlackHole.png',
    'images/MasterBlaster.png'

]);
resources.onReady(init);

// Various game variables, objects, arrays.
var monsters = [];
var planets = [];

var bulletX;
var bulletY;

var paused = false;
var state = "startmenu";
var score = 0;
var ctx;
var shootx = false;
var gun = 0;                                                                                                            // Weapon number
var gameTime = 0;
var gameOver = false;
var readyforblastoff = false;

var keysDown = {};                                                                                                      // object holding keys pressed
var camera = {x: hero.x - canvas.width / 2, y: hero.y - canvas.height / 2};                                             // Viewpowt position

var bulletDamageMod = 0;
var speedMod = 1;

var powerupText = "";

var rand = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
//var random_num = rand(0, monsterlist_easy.length-1);

//console.log(monsterlist_easy[random_num]);


function loadSounds() {
    bufferLoader = new BufferLoader(audioContext,
        [
            ['sounds/1-KICK.mp3', 'sounds/1-KICK.ogg'],      //0
            ['sounds/2-BASS.mp3', 'sounds/2-BASS.ogg'],     //1
            ['sounds/3-BASS2.mp3', 'sounds/3-BASS2.ogg'],   //2
            ['sounds/4-BASS4.mp3', 'sounds/4-BASS4.ogg'],     //3
            ['sounds/FADEOUT-SOUND.mp3', 'sounds/FADEOUT-SOUND.ogg'], //4
            ['sounds/conga1.wav', 'sounds/conga1.ogg'],   //5
            ['sounds/conga2.wav', 'sounds/conga2.ogg'],   //6
            ['sounds/conga3.wav', 'sounds/conga3.ogg'],   //7
            ['sounds/hat1.wav', 'sounds/hat1.ogg'],     //8
            ['sounds/9-TICK1.mp3', 'sounds/9-TICK1.ogg'],//9
            ['sounds/10-AMBIENCE1.mp3', 'sounds/10-AMBIENCE1.ogg'],// 10   //
            ['sounds/11-AMBIENCE2.mp3', 'sounds/11-AMBIENCE2.ogg'],    //11
            ['sounds/31-NPC-HAT.mp3', 'sounds/31-NPC-HAT.ogg'],      //12
            ['sounds/13-NPC-ZAP.wav', 'sounds/13-NPC-ZAP.ogg'],          //
            ['sounds/14-NPC-CRASH1.mp3', 'sounds/14-NPC-CRASH1.ogg'],      //
            ['sounds/15-NPC-HIT1.mp3', 'sounds/15-NPC-HIT1.ogg'],    // 15
            ['sounds/16-NPC-HIT2.mp3', 'sounds/16-NPC-HIT2.ogg'],
            ['sounds/17-NPC-HIT3.wav', 'sounds/17-NPC-HIT3.ogg'],      //
            ['sounds/18-SHOOT3.mp3', 'sounds/18-SHOOT3.ogg'],    //
            ['sounds/19-NPC-ZAP1.mp3', 'sounds/19-NPC-ZAP1.ogg'],
            ['sounds/20-NPC-ZAP2.m4a', 'sounds/20-NPC-ZAP2.ogg'],      //  20
            ['sounds/21-NPC-LOOP1.mp3', 'sounds/21-NPC-LOOP1.ogg'],
            ['sounds/22-NPC-LOOP2.mp3', 'sounds/22-NPC-LOOP2.ogg'],     //  22
            ['sounds/23-NPC-LOOP3.mp3', 'sounds/23-NPC-LOOP3.ogg'],     // 23
            ['sounds/24-SHOOTLOOP1.mp3', 'sounds/24-SHOOTLOOP1.ogg'],      // 24
            ['sounds/25-NPC-CLAP1.mp3', 'sounds/25-NPC-CLAP1.ogg'],      // 25
            ['sounds/26-PLANET-LOOP1.mp3', 'sounds/26-PLANET-LOOP1.ogg'],      // 26
            ['sounds/27-PLANET-LOOP2A.mp3', 'sounds/27-PLANET-LOOP2A.ogg'],       // 27
            ['sounds/28-PLANET-LOOP2B.mp3', 'sounds/28-PLANET-LOOP2B.ogg'],       // 28
            ['sounds/29-PLANET-LOOP3.mp3', 'sounds/29-PLANET-LOOP3.ogg'],       // 29
            ['sounds/32-NPC-STUTTERA.mp3', 'sounds/32-NPC-STUTTERA.ogg'],       // 30
            ['sounds/31-SHOOT4.mp3', 'sounds/31-SHOOT4.ogg'],       // 31
            ['sounds/PLANET-LOOP4.mp3', 'sounds/PLANET-LOOP4.ogg'],       // 32
            ['sounds/BREAKBEAT1.mp3', 'sounds/BREAKBEAT1.ogg'],       // 33
            ['sounds/BREAKBEAT2.mp3', 'sounds/BREAKBEAT2.ogg'],       // 34
            ['sounds/BREAKBEAT3.mp3', 'sounds/BREAKBEAT3.ogg'],       // 35
            ['sounds/BREAKBEAT4.mp3', 'sounds/BREAKBEAT4.ogg'],       // 36
            ['sounds/BREAKBEAT5.mp3', 'sounds/BREAKBEAT5.ogg'],       // 37
            ['sounds/BREAKBEAT6.mp3', 'sounds/BREAKBEAT6.ogg'],       // 38
            ['sounds/BREAKBEAT7.mp3', 'sounds/BREAKBEAT7.ogg'],       // 39
            ['sounds/BREAKBEAT8.mp3', 'sounds/BREAKBEAT8.ogg'],      // 40
            ['sounds/BREAKBEAT9.mp3', 'sounds/BREAKBEAT9.ogg'],      // 41
            ['sounds/BREAKBEAT10.mp3', 'sounds/BREAKBEAT10.ogg'],      // 42
            ['sounds/BREAKBEAT11.mp3', 'sounds/BREAKBEAT11.ogg'],      // 43
            ['sounds/BREAKBEAT12.mp3', 'sounds/BREAKBEAT12.ogg'],      // 44
            ['sounds/BREAKBEAT13.mp3', 'sounds/BREAKBEAT13.ogg'],      // 45
            ['sounds/BREAKBEAT14.mp3', 'sounds/BREAKBEAT14.ogg'],      // 46
            ['sounds/BREAKBEAT15.mp3', 'sounds/BREAKBEAT15.ogg'],      // 47
            ['sounds/BREAKBEAT16.mp3', 'sounds/BREAKBEAT16.ogg'],      // 48
            ['sounds/PLANET-LOOP4A.mp3', 'sounds/PLANET-LOOP4A.ogg'],      // 49
            ['sounds/PLANET-LOOP4B.mp3', 'sounds/PLANET-LOOP4B.ogg'],      // 50
            ['sounds/PLANET-LOOP5A.mp3', 'sounds/PLANET-LOOP5A.ogg'],      // 51
            ['sounds/PLANET-LOOP5B.mp3', 'sounds/PLANET-LOOP5B.ogg'],      // 52
            ['sounds/PLANET-LOOP5C.mp3', 'sounds/PLANET-LOOP5C.ogg'],      // 53
            ['sounds/PLANET-LOOP5D.mp3', 'sounds/PLANET-LOOP5D.ogg'],      // 54
            ['sounds/PLANET-LOOP6A.mp3', 'sounds/PLANET-LOOP6A.ogg'],      // 55
            ['sounds/PLANET-LOOP7A.mp3', 'sounds/PLANET-LOOP7A.ogg'],      // 56
            ['sounds/PLANET-LOOP7B.mp3', 'sounds/PLANET-LOOP7B.ogg'],      // 57
            ['sounds/NPC-HITLONG9A.mp3', 'sounds/NPC-HITLONG9A.ogg'],      // 58
            ['sounds/NPC-HITLONG9B.mp3', 'sounds/NPC-HITLONG9B.ogg'],      // 59
            ['sounds/NPC-STUTTERB.mp3', 'sounds/NPC-STUTTERB.ogg'],     // 60
            ['sounds/IR-WAREHOUSE.wav', 'sounds/IR-WAREHOUSE.ogg'],     // 61
            ['sounds/IR-PARK.wav', 'sounds/IR-PARK.ogg'],      // 62
            ['sounds/NPC-HIT-8A.mp3', 'sounds/NPC-HIT-8A.ogg'],      // 63
            ['sounds/NPC-HIT-8B.mp3', 'sounds/NPC-HIT-8B.ogg'],      // 64
            ['sounds/PERC-DICE1.mp3', 'sounds/PERC-DICE1.ogg'],      // 65
            ['sounds/PERC-DICE2.mp3', 'sounds/PERC-DICE2.ogg'],      // 66
            ['sounds/PERC-DICE3.mp3', 'sounds/PERC-DICE3.ogg'],      // 67
            ['sounds/PERC-DICE4.mp3', 'sounds/PERC-DICE4.ogg'],      // 68
            ['sounds/NPC-STUTTERB.mp3', 'sounds/NPC-STUTTERB.ogg'],      // 69
            ['sounds/NPC-HIT-L2.mp3', 'sounds/NPC-HIT-L2.ogg'],      // 70
            ['sounds/NPC-SHOOT-LONG1.mp3', 'sounds/NPC-SHOOT-LONG1.ogg'],      // 71
            ['sounds/PLANET-LOOP8.mp3', 'sounds/PLANET-LOOP8.ogg'],      // 72
            ['sounds/PLANET-LOOP9.mp3', 'sounds/PLANET-LOOP9.ogg'],      // 73
            ['sounds/PLANET-LOOP10.mp3', 'sounds/PLANET-LOOP10.ogg'],      // 74
            ['sounds/NPC-ZAP-5.mp3', 'sounds/NPC-ZAP-5.ogg'],      // 75
            ['sounds/NPC-ZAP-6.mp3', 'sounds/NPC-ZAP-6.ogg'],      // 76
            ['sounds/NPC-ZAP-7.mp3', 'sounds/NPC-ZAP-7.ogg'],      // 77
            ['sounds/SHOOT-99.mp3', 'sounds/SHOOT-99.ogg'],      // 78
            ['sounds/PLANET-LOOP11.mp3', 'sounds/PLANET-LOOP11.ogg'],      // 79
            ['sounds/SHOOT88.mp3', 'sounds/SHOOT88.ogg'],      // 80
            ['sounds/NPCBOOM.mp3', 'sounds/NPCBOOM.ogg'],      // 81
            ['sounds/NPC-HIT10.mp3', 'sounds/NPC-HIT10.ogg'],      // 82
            ['sounds/NPC-HIT-9LONG.mp3', 'sounds/NPC-HIT-9LONG.ogg'],      // 83 **
            ['sounds/SWEEP1.mp3', 'sounds/SWEEP1.ogg'],      // 84
            ['sounds/8-RISE.mp3', 'sounds/8-RISE.ogg']      // 85
        ],
        finishedLoading
    );
    bufferLoader.load();
}

function setNoteReady(obj) {
    obj.ready = true;
}

//////////////////////////////////////////////  Fill samplebb array with all sounds
function finishedLoading(bufferList) {
    for (var i = 0, l = bufferList.length; i < l; i += 1) {
        var source = audioContext.createBufferSource();
        source.buffer = bufferList[i];
        source.connect(audioContext.destination);
        var note = {
            note: source,
            ready: true
        };
        samplebb.push(note);
    }
    readyforblastoff = true;                                            // Set load screen to ready
}



// Various play methods - dry / wet
function playSound(obj, channel) {

    var source = audioContext.createBufferSource();
    source.buffer = obj.note.buffer;

    source.connect(channel);
    channel.connect(lowpassFilter);
    lowpassFilter.connect(masterDry);

    lowpassFilter.connect(convolverWarehouse);
    convolverWarehouse.connect(masterWet);
    masterWet.connect(masterChannel);

    masterDry.connect(masterChannel)
    //masterChannel.connect(audioContext.destination); //  CONNECT OUTPUT TO SPEAKERS

    source.start(0);                           //  PLAY SOUND
}

function playSoundDry(obj, channel) {
    var source = audioContext.createBufferSource();
    source.buffer = obj.note.buffer;
    source.connect(channel);
    channel.connect(lowpassFilter2);
    lowpassFilter2.connect(masterDry);
    masterDry.connect(masterChannel);
    //masterChannel.connect(audioContext.destination); //  CONNECT OUTPUT TO SPEAKERS

    source.start(0);                           //  PLAY SOUND
}

function playSoundDelay(obj, channel) {
    var source = audioContext.createBufferSource();
    source.buffer = obj.note.buffer;

    delay.connect(feedback);                  //  FEEDBACK DELAY LOOP
    feedback.connect(filterD);                //
    filterD.connect(delay);                   //

    source.connect(delay);
    source.connect(channel);
    delay.connect(channel);

    channel.connect(lowpassFilter);
    lowpassFilter.connect(masterDry);
    lowpassFilter.connect(convolverWarehouse);
    convolverWarehouse.connect(masterWet);

    masterDry.connect(masterChannel);
    masterWet.connect(masterChannel);
    //masterChannel.connect(audioContext.destination); //  CONNECT OUTPUT TO SPEAKERS

    source.start(0);                           //  PLAY SOUND
    obj.ready = false;
}


function nextNote() {
    // Advance current note and time by a 16th note...
    var secondsPerBeat = 60.0 / tempo;
    nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time

    current16thNote++;    // Advance the beat number,wrap to zero
    current64thNote++;    // Advance the beat number, wrap to zero
    if (current16thNote === 16) {
        current16thNote = 0;
        barNumber += 1;
        barNumberL += 1;
    }
    if (current64thNote === 64) {
        current64thNote = 0;
        if (!paused) {
            bar4Number += 1;
            console.log("bar4 number  :  " + bar4Number);
        }
    }
    if (barNumberL % 4 === 0 && current16thNote === 0) {
        barNumberL = 0;
    }
    if (barNumber % 16 === 0 && current16thNote === 0) {
        bar16Number += 1;
    }
}

/////  ***  SCHEDULE EVERYTHING!  ***
function audioSchedule(beatNumber) {
    // push the note on the queue, even if we're not playing.
    //notesInQueue.push({note: beatNumber, time: time});

    ///   PLAYER SHOOT      ///
    if (shootx) {
        //  Weapon 1
        if (gun === 0) {
            if (beatNumber === 2 || beatNumber === 6 || beatNumber === 10 || beatNumber === 14) {
                shoot();
                playSoundDry(samplebb[3], gainNode2);
            }
        }
        // Weapon 2 ...
        else if (gun === 1) {
            if (beatNumber === 2 || beatNumber === 3 || beatNumber === 6 || beatNumber === 7 || beatNumber === 10 || beatNumber === 11 || beatNumber === 14 || beatNumber === 15) {
                shoot();
                playSoundDry(samplebb[1], gainNode2);
            }
        }
        // Weapon 3...
        else if (gun === 2) {
            if (beatNumber === 2 || beatNumber === 7 || beatNumber === 10 || beatNumber === 15) {
                shoot();
                playSoundDry(samplebb[2], gainNode2);
            }
            else if (beatNumber % 4 !== 0) {
                shoot();
                playSoundDry(samplebb[1], gainNode2);
            }
        }
    }


    // KICK
    if (beatNumber % 4 === 0) {
        playSoundDry(samplebb[0], gainNode1);
        if (!paused && barNumber > 8) {
            spawnBoulder(1, Boulder);
        }
    }

    if (score > 20000) {  // hihats
        if (barNumber % 4 === 0 && beatNumber === 0) {
            playSound(samplebb[23], gainNode3);
        }
    }

    if (barNumber % 2 === 0 && beatNumber === 0) {
        playSound(samplebb[rand(65, 68)], gainNode3);                                                                       // Percussion
    }

    // Play the planets sounds
    for (var z in planets) {
        var planet = planets[z];
        if (planet.loop) {
            if (!planet.isDead) {                                                                                            // IF THE PLANET IS ALIVE
                if (barNumber % planet.timing === 0 && current16thNote === 0) {                                              // SPECIFIES HOW LONG THE LOOP IS
                    if (!planet.planetDice) {
                        playSound(samplebb[planet.sound], planet.channel);                                                   // PLAY THE PLANETS SOUND
                    } else {
                        playSound(samplebb[rand(planet.soundMin, planet.soundMax)], planet.channel);                         // IF THE PLANET HAS MULTIPLE LOOPS, CHOOSE ONE AT RANDOM
                    }
                }
            }
        }
    }


    //SPAWN ENEMIES EVERY 4 BARS   //
    if (!paused) {
        if (barNumber % 4 === 0 && beatNumber === 0) {

            if (bar4Number >= 8){
                if (barNumber % 32 === 0) {
                    spawnMonster(1, HealthFlyUp);
                    spawnMonster(1, GunUp);
                    spawnMonster(1, SlowPotion);
                    //console.log("spawned Powers");
                }
            }

            if (bar4Number < 8) {
                var random_easy = rand(0, monsterlist_easy.length - 1);
                var monsta = new monsterlist_easy[random_easy](0, 0);
                spawnMonster(monsta.getFlock(), monsterlist_easy[random_easy]);
                monsta = null;
                if (barNumber % 16 === 0) {
                    spawnMonster(1, GunUp);
                    //console.log("spawned Powers");
                    if (barNumber !== 0) {
                        spawnMonster(1, HealthFlyUp);
                    }
                }
            } else if (bar4Number >= 8 && bar4Number < 16) {
                var random_med = rand(0, monsterlist_med.length - 1);
                var monsta = new monsterlist_med[random_med](0, 0);
                spawnMonster(monsta.getFlock(), monsterlist_med[random_med]);
                monsta = null;
            } else if (bar4Number >= 16 && bar4Number < 24) {
                var random_med = rand(0, monsterlist_med.length - 1);
                var monsta = new monsterlist_med[random_med](0, 0);
                if (monsta.token === "jellygreenShoot") {
                    spawnMonster(monsta.getFlock(), monsterlist_med[random_med]);
                } else {
                    spawnMonster(monsta.getFlock() + rand(0, 1), monsterlist_med[random_med]);
                }
                monsta = null;
            } else if (bar4Number >= 24) {
                var random_hard = rand(0, monsterlist_hard.length - 1);
                var monsta = new monsterlist_hard[random_hard](0, 0);
                spawnMonster(monsta.getFlock(), monsterlist_hard[random_hard]);
                monsta = null;
            }
        }
    }

    //  MONSTERS SHOOTING
    if (!paused) {
        for (var x in monsters) {
            var monster = monsters[x];
            if (monster.shooter === true && monster.isDead === false) {                                                     // IF THE MONSTER SHOOTS
                window[monster.token] = true;                                                                               // MAKE SURE ONLY ONE OF EACH SHOOT SOUND IS PLAYED AT A TIME
                if (monster.shootRhythm()) {                                                                                // IF THE MONSTER SHOOTS ON THIS BEAT.
                    monster.shoot();                                                                                        // SHOOT A BULLET TOWARDS THE PLAYER
                }
            }
        }
    }
    if (sharkShoot === true && (current16thNote === 4 || current16thNote === 12)) {
        playSound(samplebb[25], gainNode3);
    }
    if (bugShoot === true && barNumber % 2 === 0 && current16thNote === 0) {
        playSound(samplebb[24], gainNode3);
    }
    if (jellyShoot === true && bar4Number % 2 === 0 && current64thNote === 24) {
        playSound(samplebb[18], gainNode3);
    }
    if (jellygreenShoot === true && barNumber % 4 === 0 && current16thNote === 0) {
        playSound(samplebb[31], gainNode3);
    }
    if (jellypurpleShoot === true && barNumber % 4 === 0 && current16thNote === 0) {
        playSound(samplebb[78], gainNode3B);
    }
    if (wizardShoot === true) {
        if (current64thNote === 0) {
            playSound(samplebb[63], gainNode3);
        }
        if (current64thNote === 16) {
            playSound(samplebb[64], gainNode3);
        }
    }
    if (wizardgreenShoot === true && bar4Number % 4 === 0 && barNumberL % 4 === 0 && current64thNote === 0) {
        playSound(samplebb[71], gainNode3C);
    }
    if (masterblasterShoot === true && bar4Number % 4 === 0 && barNumberL % 4 === 0 && current64thNote === 0) {
        playSound(samplebb[80], gainNode3B);
    }
}


function scheduler() {
    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
        audioSchedule(current16thNote, nextNoteTime);
        nextNote();
    }
}

// Starts main audio brain ticking
function play() {
    var currentTime = audioContext.currentTime;
    isPlaying = !isPlaying;
    if (isPlaying) { // start playing
        current16thNote = 0;
        nextNoteTime = currentTime;
        timerWorker.postMessage("start");
        console.log("play() play()");
        return "stop";
    } else {
        timerWorker.postMessage("stop");
        return "play";
    }
}
// Used for user main Vol control
function updateVolume(amt) {
    masterChannel.gain.value = amt;
}

var spawnMonster = function (amount, monster) {
    for (var i = 0; i < amount; i += 1) {

        var spawnOffMap = [
            {x: rand(0, 5000), y: -10},
            {x: rand(0, 5000), y: 5010},
            {x: -10, y: rand(0, 5000)},
            {x: 5010, y: rand(0, 5000)}
        ];
        var positions = spawnOffMap[rand(0, 3)];
        var sentity = new monster(positions);
        monsters.push(sentity);
    }
};

var spawnBoulder = function (amount, monster) {
    for (var i = 0; i < amount; i += 1) {
        var positions = {x: -500, y: rand(50, 4200)};
        var sentity = new monster(positions);
        monsters.push(sentity);
    }
};

var spawnPlanet = function (amount, planett) {
    for (var i = 0; i < amount; i += 1) {
        var planet = new planett();
        planets.push(planet);
    }
};


var shoot = function () {

    var bullet = new Bullet(hero.x + 16, hero.y + 6, 60);

    // Create a vector between the center of the player and the current mouse position..
    var vector = {x: (bulletX + camera.x) - (hero.x + 16), y: (bulletY + camera.y) - (hero.y + 6)};
    // Use the Pythagorean theorem to discover the length of the vector...
    vector.length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    // Set the velocity of the bullet to the components of the vector divided by it's length times the desired speed (10).
    bullet.velocity = [(vector.x / vector.length) * 10, (vector.y / vector.length) * 10];
    bullet.angle = Math.atan2(vector.y / vector.length, vector.x / vector.length);
    //bullet.type = "bullet1";   // Active weapon.bullet
    // Push the bullet into the bullets array.
    bullets.push(bullet);
};

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

var generateWeighedList = function (list, weight) {
    var weighed_list = [];

    // Loop over weights
    for (var i = 0; i < weight.length; i++) {
        var multiples = weight[i] * 100;
        // Create array of objects
        for (var j = 0; j < multiples; j++) {
            weighed_list.push(list[i]);
        }
    }
    return weighed_list;
};

// Monster Spawn Probabilities
var list = [Fish, Beetle, Prawn, Bug, Shark, Mosquito, Mosquito2, JellyGreen, JellyOrange, JellyPurple, Wizard, WizardGreen, MasterBlaster];
var weight_easy = [0.35, 0.24, 0.2, 0.05, 0.02, 0.04, 0.04, 0.0, 0.03, 0.01, 0.01, 0.01, 0.0];
var weight_med = [0.03, 0.04, 0.03, 0.19, 0.16, 0.12, 0.08, 0.15, 0.14, 0.02, 0.01, 0.02, 0.01];  // .26 20  10  6 4 2
var weight_hard = [0.02, 0.02, 0.02, 0.10, 0.08, 0.03, 0.04, 0.12, 0.13, 0.15, 0.16, 0.03, 0.10];  //  .03
var monsterlist_easy = generateWeighedList(list, weight_easy);
var monsterlist_med = generateWeighedList(list, weight_med);
var monsterlist_hard = generateWeighedList(list, weight_hard);


function handleInput(dt) {
    var keys = {UP: false, LEFT: false, DOWN: false, RIGHT: false, howManyPressed: 0};

    if (87 in keysDown || 38 in keysDown) { // Player holding up
        keys.UP = true;
        keys.howManyPressed += 1;
    }
    if (83 in keysDown || 40 in keysDown) { // Player holding down
        keys.DOWN = true;
        keys.howManyPressed += 1;
    }
    if (65 in keysDown || 37 in keysDown) { // Player holding left
        keys.LEFT = true;
        keys.howManyPressed += 1;

    }
    if (68 in keysDown || 39 in keysDown) { // Player holding right
        keys.RIGHT = true;
        keys.howManyPressed += 1;
    }
    if (27 in keysDown) {
        paused = !paused;
    }

    if (191 in keysDown) {
        console.log(monsters.length);
    }

    if (keys.howManyPressed > 1) {
        hero.speed = hero.speed / 1.25;
    }
    if (keys.UP === true && hero.y >= 0) {
        hero.y -= hero.speed * dt;
    }
    if (keys.DOWN === true && hero.y <= 5000) {
        hero.y += hero.speed * dt;
    }
    if (keys.LEFT === true && hero.x >= 0) {
        hero.x -= hero.speed * dt;
        hero.image = "images/Hero2.png";
    }
    if (keys.RIGHT === true && hero.x <= 5000) {
        hero.x += hero.speed * dt;
        hero.image = "images/Hero.png";
    }
    if (keys.howManyPressed >= 2) {
        hero.speed = hero.speed * 1.25;   //  ****
    }
}

function updateEntities(dt) {

    for (var x in monsters) {
        var monster = monsters[x];
        monster.update();

        if (typeof monster.move === 'function') {
            if (!monster.isDead) {
                monster.move(dt);
            }
        }
        if (typeof monster.playLoop === 'function') {
            if (!monster.isDead) {
                monster.playLoop();
            }
        }
        if (monster.toRemove) {
            monsters.splice(x, 1);
        }
    }

    for (var x in planets) {
        var planet = planets[x];
        planet.update();
        planet.playLoop();
        collide(hero, planet, true);
        for (var x in monsters) {
            var monster = monsters[x];
            collide(monster, planet, true);
        }
    }

    for (var z in bullets) {
        var bullet = bullets[z];
        bullet.update();
    }
}

function cameraFollow() {
    var followplayer = {
        x: (canvas.width / 2 + camera.x) - hero.x,
        y: (canvas.height / 2 + camera.y) - hero.y
    };
    followplayer.length = Math.sqrt((followplayer.x * followplayer.x) + (followplayer.y * followplayer.y));
    if (followplayer.length > 60)   //   ***
    {
        camera.x -= (followplayer.x / followplayer.length) * 5;  //  (choppy*?)
        camera.y -= (followplayer.y / followplayer.length) * 5;  //  (choppy*?)
    }
}

var collide = function (obj1, obj2, separate, callback) {

    var colliding;
        if (obj1.x > obj2.x + obj2.width ||
            obj1.x + obj1.width < obj2.x ||
            obj1.y > obj2.y + obj2.height ||
            obj1.y + obj1.height < obj2.y
        ) {
            colliding = false;
        } else {
            colliding = true;
        }

    if (colliding === true && separate === true) {

        var penetration = {x: obj1.x - obj2.x, y: obj1.y - obj2.y};
        if (Math.abs(penetration.x) > Math.abs(penetration.y)) {
            if (obj1.x > obj2.x) obj1.x = obj2.x + obj2.width;
            else obj1.x = obj2.x - obj1.width;
        }

        else {
            if (obj1.y > obj2.y) obj1.y = obj2.y + obj2.height;
            else obj1.y = obj2.y - obj1.height;
        }

    }
    if (callback !== undefined) callback(colliding);
};


function circleCollide(c, r) {
    var rHalfWidth = r.width / 2,
        rHalfHeight = r.height / 2,
        cx = Math.abs(c.xCenter() - r.x - rHalfWidth),
        cy, distX, distY, distXSq, distYSq, maxDist;

    if (cx > rHalfWidth + c.radius) {
        return false;
    }

    cy = Math.abs(c.yCenter() - r.y - rHalfHeight);

    if (cy > rHalfHeight + c.radius) {
        return false;
    }
    if (cx <= rHalfWidth || cy <= rHalfHeight) {
        return true;
    }

    distX = cx - rHalfWidth;
    distY = cy - rHalfHeight;
    distXSq = distX * distX;
    distYSq = distY * distY;
    maxDist = c.radius * c.radius;

    return distXSq + distYSq <= maxDist;
}


function updateStates() {
    if (hero.health <= 0) {
        tempo = 72.5;
        reset();
    }
}

var reset = function () {
    if (!gameOver) {
        gameOver = true;
        playSound(samplebb[4], gainNode3);
        setTimeout(initStats, 6000);
    }
};

// Reset everything
function initStats() {
    play();
    setTimeout(play, 8000);

    gameOver = false;
    paused = false;
    tempo = 145;
    score = 0;
    monsters = [];
    planets = [];
    bullets = [];
    hero.x = 2196;
    hero.y = 3328;

    camera.x = hero.x - canvas.width / 2;
    camera.y = hero.y - canvas.width / 2;
    hero.health = 420;

    bulletDamageMod = 0;
    //bulletSizeMod = 0;

    sharkShoot = false;
    bugShoot = false;
    jellyShoot = false;
    jellygreenShoot = false;
    wizardShoot = false;
    wizardgreenShoot = false;
    jellypurpleShoot = false;
    masterblasterShoot = false;

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

    lowpassFilter.frequency.value = 20000;
    lowpassFilter2.frequency.value = 20000;

    gun = 0;
    current16thNote = 0;
    current64thNote = 0;
    barNumber = 0;
    barNumberL = 0;
    bar4Number = 0;
    bar16Number = 0;
    gameTime = 0;

    xscore.innerHTML = "Space Cash:  0";
    xhealth.innerHTML = ("Space Health:  " + hero.health);
    xpowerup.innerHTML = "";
    pausetext.innerHTML = "";

    spawnPlanet(1, PlanetMars);
    spawnPlanet(1, PlanetBlue1);
    spawnPlanet(1, PlanetBlue2);
    spawnPlanet(1, PlanetPinkMosaic);
    spawnPlanet(1, PlanetFlute);
    spawnPlanet(1, PlanetCoconut);
    spawnPlanet(1, PlanetBreakbeat);
    spawnPlanet(1, PlanetWarble);
    spawnPlanet(1, PlanetPlink);
    spawnPlanet(1, PlanetFlange);
    spawnPlanet(1, PlanetBlobby);
    spawnPlanet(1, Planet12);
    spawnPlanet(1, Planet13);
    spawnPlanet(1, Planet14);
    spawnPlanet(1, BlackHole);

}

function resizeCanvas() {
    var width = window.innerWidth - 20;
    var height = window.innerHeight - 20;
    if (canvas.width != width ||
        canvas.height != height) {
        canvas.width = width;
        canvas.height = height;
    }
}


var render = function () {

    if (state === "playing") {
        // Clear the screen
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        cameraFollow();
        ctx.save();
        ctx.translate(-camera.x, -camera.y);

        for (var x in planets) {
            var planet = planets[x];
            planet.render(ctx);
        }
        // Draw monsters
        for (var x = 0, l = monsters.length; x < l; x++) {
            var monster = monsters[x];
            monster.render(ctx);
        }

        // Draw Hero
        ctx.drawImage(resources.get(hero.image), hero.x, hero.y, hero.width, hero.height);

        // Draw bullets
        for (var x = 0, l = bullets.length; x < l; x++) {
            var bullet = bullets[x];
            bullet.render();
        }

        ctx.beginPath();  // path commands must begin with beginPath
        ctx.rect(0, 0, 5000, 5000);
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.restore();
    } else {
        if (!readyforblastoff) {
            ctx.drawImage(resources.get("images/startscreenload.png"), canvas.width / 2 - 400, canvas.height / 2 - 225, 800, 450);
        } else {
            ctx.drawImage(resources.get("images/startscreen.png"), canvas.width / 2 - 400, canvas.height / 2 - 225, 800, 450);

        }
    }
};

function update(dt) {
    if (!paused) {
        if (dt > 0.02) {
            dt = 0.02;
        }
        gameTime += dt;

        handleInput(dt);
        updateEntities(dt);
        updateStates();
    } else {
        if (state === "playing") {
            document.getElementById("pausetext").innerHTML = ("PAUSED <br/> click to resume");
        }
    }
}


