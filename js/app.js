/**
 * Created by Barnabeeeeee on 06/04/15.
 */
var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
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
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//canvas.width = 600;
//canvas.height = 600;

document.body.appendChild(canvas);

//ctx.beginPath();  // path commands must begin with beginPath
//
//ctx.rect(100,100,500,500);
//ctx.strokeStyle= "white";
//ctx.stroke();


//  main game loop
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
    timerWorker = new Worker("utils/metronomeworker.js");

    timerWorker.onmessage = function (e) {
        if (e.data == "tick") {
            //console.log("tick!");
            scheduler();
        }
        else
            console.log("message: " + e.data);
    };
    timerWorker.postMessage({"interval": lookahead});


    window.addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);

    window.addEventListener("keyup", function (e) {
        delete keysDown[e.keyCode];
    }, false);

    window.addEventListener("mousedown", function (e) {

        if (state === "startmenu") {
            state = "playing";
        }

        if (state === "playing") {
            paused = false;
            shootx = true;
        }

    });

    window.addEventListener("mouseup", function (e) {
        shootx = false;
    });
    // Updates x + y mouse positions to calculate where to shoot
    window.addEventListener("mousemove", function (event) {
        bulletX = event.clientX;
        bulletY = event.clientY;
    });
    //
    //ctx.beginPath();  // path commands must begin with beginPath
    //
    //ctx.rect(10,10,150,150);
    //ctx.strokeStyle= "white";
    //ctx.stroke();


    ///////////////////////////////
    //starBackground = ctx.createPattern(resources.get('images/Stars.jpg'), 'repeat');
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

    //monsters.push(new PlanetMars());
    //setTimeout(loadSounds, 1000);
    loadSounds();

    //var jj = new Mosquito({x:2900,y:2900});
    //monsters.push(jj);
    //reset();
    lastTime = Date.now();
    //play();
    main();
}

resources.load([
    'images/background1.jpg',
    'images/Stars.jpg',
    'images/Hero.png',
    'images/Fish.png',
    'images/Prawn.png',
    'images/BeetleBlue.png',
    'images/Bug.png',
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
    'images/HeartGreenEyes.png',
    'images/HeartGreen.png',
    'images/Planet4.png',
    'images/Planet5.png',
    'images/Planet6.png',
    'images/Planet7.png',
    'images/Planet8.png',
    'images/Planet9.png',
    'images/Planet10.png',
    'images/PlanetPink2.png'

]);
resources.onReady(init);


//var starBackground;
var monsters = [];
var powers = [];
var planets = [];

var bulletX;
var bulletY;

var bulletpiercePower = false;

var paused = false;
var state = "startmenu";
var camera = {x: hero.x - canvas.width / 2, y: hero.y - canvas.height / 2};
var then;
var score = 0;
var ctx;
var spawnN = 0;
var shootx = false;
var play1 = false;
var gun = 0;
var gameTime = 0;
var gameOver = false;

// keyboard controls
var keysDown = {};


var rand = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var generateWeighedList = function (list, weight) {
    var weighed_list = [];

    // Loop over weights
    for (var i = 0; i < weight.length; i++) {
        var multiples = weight[i] * 100;

        // Loop over the list of items
        for (var j = 0; j < multiples; j++) {
            weighed_list.push(list[i]);
        }
    }
    return weighed_list;
};


//var random_num = rand(0, monsterlist_easy.length-1);

//console.log(monsterlist_easy[random_num]);


function loadSounds() {
//		soundContext = new AudioContext();
    bufferLoader = new BufferLoader(audioContext,
        [
            'sounds/1-KICK.mp3',      //0
            'sounds/2-BASS.mp3',      //1
            'sounds/3-BASS2.mp3',    //2
            'sounds/4-BASS4.mp3',      //3
            'sounds/FADEOUT-SOUND.mp3',  //4
            'sounds/conga1.wav',    //5
            'sounds/conga2.wav',    //6
            'sounds/conga3.wav',    //7
            'sounds/hat1.wav',      //8
            'sounds/9-TICK1.mp3', //9
            'sounds/10-AMBIENCE1.mp3', // 10   //  Planet
            'sounds/11-AMBIENCE2.mp3',     //11
            'sounds/31-NPC-HAT.mp3',       //12
            'sounds/13-NPC-ZAP.wav',           //
            'sounds/14-NPC-CRASH1.mp3',       //
            'sounds/15-NPC-HIT1.mp3',     // 15
            'sounds/16-NPC-HIT2.mp3',
            'sounds/17-NPC-HIT3.wav',       //
            'sounds/18-SHOOT3.mp3',     //
            'sounds/19-NPC-ZAP1.mp3',
            'sounds/20-NPC-ZAP2.m4a',       //  20
            'sounds/21-NPC-LOOP1.mp3',
            'sounds/22-NPC-LOOP2.mp3',      //  22
            'sounds/23-NPC-LOOP3.mp3',      // 23
            'sounds/24-SHOOTLOOP1.mp3',       // 24
            'sounds/25-NPC-CLAP1.mp3',       // 25
            'sounds/26-PLANET-LOOP1.mp3',       // 26
            'sounds/27-PLANET-LOOP2A.mp3',        // 27
            'sounds/28-PLANET-LOOP2B.mp3',        // 28
            'sounds/29-PLANET-LOOP3.mp3',        // 29
            'sounds/32-NPC-STUTTERA.mp3',        // 30
            'sounds/31-SHOOT4.mp3',        // 31
            'sounds/PLANET-LOOP4.mp3',        // 32
            'sounds/BREAKBEAT1.mp3',        // 33
            'sounds/BREAKBEAT2.mp3',        // 34
            'sounds/BREAKBEAT3.mp3',        // 35
            'sounds/BREAKBEAT4.mp3',        // 36
            'sounds/BREAKBEAT5.mp3',        // 37
            'sounds/BREAKBEAT6.mp3',        // 38
            'sounds/BREAKBEAT7.mp3',        // 39
            'sounds/BREAKBEAT8.mp3',       // 40
            'sounds/BREAKBEAT9.mp3',       // 41
            'sounds/BREAKBEAT10.mp3',       // 42
            'sounds/BREAKBEAT11.mp3',       // 43
            'sounds/BREAKBEAT12.mp3',       // 44
            'sounds/BREAKBEAT13.mp3',       // 45
            'sounds/BREAKBEAT14.mp3',       // 46
            'sounds/BREAKBEAT15.mp3',       // 47
            'sounds/BREAKBEAT16.mp3',       // 48
            'sounds/PLANET-LOOP4A.mp3',       // 49
            'sounds/PLANET-LOOP4B.mp3',       // 50
            'sounds/PLANET-LOOP5A.mp3',       // 51
            'sounds/PLANET-LOOP5B.mp3',       // 52
            'sounds/PLANET-LOOP5C.mp3',       // 53
            'sounds/PLANET-LOOP5D.mp3',       // 54
            'sounds/PLANET-LOOP6A.mp3',       // 55
            'sounds/PLANET-LOOP7A.mp3',       // 56
            'sounds/PLANET-LOOP7B.mp3',       // 57
            'sounds/NPC-HITLONG9A.mp3',       // 58
            'sounds/NPC-HITLONG9B.mp3',       // 59
            'sounds/NPC-STUTTERB.mp3'      // 60


        ],
        finishedLoading
    );
    bufferLoader.load();
}

function setNoteReady(obj) {
    obj.ready = true;
}

//////////////////////////////////////////////  !  i Must be size of Array!!  ******
function finishedLoading(bufferList) {
    for (var i = 0, l = bufferList.length; i < l; i += 1) {
        var source = audioContext.createBufferSource();
        source.buffer = bufferList[i];
        source.connect(audioContext.destination);
        var note = {
            note: source,
            ready: true,
            visual: $("#note" + i)
        };
        samplebb.push(note);
    }
    //start();
    setTimeout(play, 1000);
}


function playSound(obj, channel) {
    var source = audioContext.createBufferSource();
    source.buffer = obj.note.buffer;

    source.connect(channel);
    channel.connect(masterChannel);

    masterChannel.connect(audioContext.destination); //  CONNECT OUTPUT TO SPEAKERS

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
    delay.connect(channel);                    //  MAIN VOLUME
    channel.connect(masterChannel);
    masterChannel.connect(audioContext.destination); //  CONNECT OUTPUT TO SPEAKERS

    source.start(0);                           //  PLAY SOUND
    obj.ready = false;
}


function nextNote() {
    // Advance current note and time by a 16th note...
    var secondsPerBeat = 60.0 / tempo;    // Notice this picks up the CURRENT
                                          // tempo value to calculate beat length.
    nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time

    current16thNote++;    // Advance the beat number,wrap to zero
    current64thNote++;    // Advance the beat number, wrap to zero
    //console.log(current64thNote);
    if (current16thNote === 16) {
        current16thNote = 0;
        barNumber += 1;
        barNumberL += 1;
        console.log("bar number :  " + barNumber);

        //console.log("bar number : " + barNumber);
        //console.log("2 bar number l" + barNumberL);

    }
    if (current64thNote === 64) {
        current64thNote = 0;
        bar4Number += 1;
        //console.log("bar4 number" + bar4Number);

    }

    if (barNumberL % 4 === 0 && current16thNote === 0) {
        barNumberL = 0;
    }


    //if (barNumber % 4 === 0 && current16thNote === 0) {
    //    bar4Number += 1;
    //    console.log("bar4 number" + bar4Number);
    //    //console.log("bar 4 number : " + bar4Number);
    //}

    if (barNumber % 16 === 0 && current16thNote === 0) {
        bar16Number += 1;
        //console.log("bar 16 number : " + bar16Number);
    }

}

/////  ***  SCHEDULE EVERYTHING  ***
function scheduleNote(beatNumber, time) {
    // push the note on the queue, even if we're not playing.
    //notesInQueue.push({note: beatNumber, time: time});

    if ((noteResolution === 1) && (beatNumber % 2))
        return; // we're not playing non-8th 16th notes
    if ((noteResolution === 2) && (beatNumber % 4))
        return; // we're not playing non-quarter 8th notes

    // create an oscillator    //   create sample
    //var osc = audioContext.createOscillator();
    //osc.connect(audioContext.destination);
    //
    //var osc2 = audioContext.createOscillator();
    //osc2.connect(audioContext.destination);

    ///   PLAYER SHOOT      ///
    if (shootx) {
        //  Weapon 1
        if (gun === 0) {

            if (beatNumber === 2 || beatNumber === 6 || beatNumber === 10 || beatNumber === 14) {
                shoot(bulletX, bulletY);
                playSound(samplebb[3], gainNode2);
            }
        }
        // Weapon 2 ...
        else if (gun === 1) {
            if (beatNumber === 2 || beatNumber === 7 || beatNumber === 10 || beatNumber === 15) {
                shoot(bulletX, bulletY);
                playSound(samplebb[2], gainNode2);
            }
            else if (beatNumber % 4 !== 0) {
                shoot(bulletX, bulletY);
                playSound(samplebb[1], gainNode2);
            }
        }
        else if (gun === 2) {
            if (beatNumber % 4 !== 0) {
                shoot(bulletX, bulletY);
                playSound(samplebb[1], gainNode2);
            }
        }
        // Weapon 3...
    }


    // KICK
    if (beatNumber % 4 === 0) {
        playSound(samplebb[0], gainNode1);
        //if(barNumber > 8) {
        spawnBoulder(1, Boulder);
        //}
    }
    //if (score > 10 && score < 80000) {
    //    if (barNumber % 4 === 0 && beatNumber === 0) {
    //        playSound(samplebb[10], gainNode4);
    //    }
    //}
    //if (score > 20000) {
    //    if (beatNumber === 0) {
    //        playSound(samplebb[22], gainNode4);
    //    }
    //}

    //if (score > 20) {
    //    if (barNumber % 8 === 0 && beatNumber === 0) {
    //        playSound(samplebb[26], gainNode3);
    //    }
    //}


    //if (score > 90000) {
    //    if (beatNumber % 16 === 0) {
    //        playSound(samplebb[22], gainNode3);
    //    }
    //}
    //if (score > 70000) {
    //    if (bar4Number % 16 === 0) {
    //        playSound(samplebb[11], gainNode3);
    //    }
    //}
    if (score > 10000) {  // hihats
        if (barNumber % 4 === 0 && beatNumber === 0) {
            playSound(samplebb[23], gainNode3);
            //console.log("hihats");
        }
    }


    //if (planet1play === true) {
    //    if (barNumber % 8 === 0)
    //        if (current16thNote === 0) {
    //            playSound(samplebb[26], planet1gain);
    //            //console.log("xxxxx");
    //        }
    //}
    //
    //if (barNumber % 16 === 0 && current16thNote === 0){
    //    playSound(samplebb[27], planet2gain);
    //    //console.log("playeddd");
    //
    //}


    for (z in planets) {
        var planet = planets[z];
        if (window[planet.token] === true) {
            if (barNumber % planet.timing === 0 && current16thNote === 0) {
                if (!planet.planetDice) {
                    playSound(samplebb[planet.sound], planet.channel);
                } else {
                    playSound(samplebb[rand(planet.soundMin, planet.soundMax)], planet.channel);
                    console.log("planeplayed");
                }
                //console.log("played" + planet.monsterImage);
            }
        }
    }


    //SPAWN ENEMIES   //
    if (barNumber % 4 === 0 && beatNumber === 0) {
        //spawnMonster(5, monsterz[Math.floor(Math.random() * monsterz.length)]);
        //var monst = monsterlist_easy[2];

        if (bar4Number < 8) {
            //positions = {x: Math.floor((Math.random() * 5000) + 1), y: Math.floor((Math.random() * 5000) + 1)};
            var random_easy = rand(0, monsterlist_easy.length - 1);
            var monsta = new monsterlist_easy[random_easy]({
                x: Math.floor((Math.random() * 5000) + 1),
                y: Math.floor((Math.random() * 5000) + 1)
            });
            spawnMonster(monsta.getFlock(), monsterlist_easy[random_easy]);
            //monsterlist_easy[random_easy];
            console.log("spawned_easy");
            //console.log(monsta.getFlock());
            //console.log(monsterlist_easy[random_easy]);
            monsta = null;


        } else if (bar4Number > 8) {
            var random_med = rand(0, monsterlist_med.length - 1);
            var monsta = new monsterlist_med[random_med]({
                x: Math.floor((Math.random() * 5000) + 1),
                y: Math.floor((Math.random() * 5000) + 1)
            });
            spawnMonster(monsta.getFlock() + 1, monsterlist_med[random_med]);
            console.log("spawned_med" + monsta.getFlock());
            monsta = null;
            //if(bar4Number % 8 === 0 && barNumber % 16) {
            //    //spawnMonster(1, JellyOrange);
            //    //spawnMonster(2, JellyGreen);
            //    console.log("spawned shark");
            //}

        }


    }

    // Shark Shoot
    for (x in monsters) {
        var monster = monsters[x];
        if (monster.shooter === true && monster.isDead === false) {
            window[monster.token] = true;
            if (monster.shootRhythm()) {
                monster.shoot();
            }
        }
        //if (window[monster.token]){
        //    if (monster.shootTiming()) {
        //        window[monster.token] = false;
        //        setTimeout(function () {
        //            window[monster.token] = true;
        //        }, 100);
        //        playSound(samplebb[this.shootSound], gainNode3);
        //    }
        //}
    }
    if (sharkShoot === true) {
        if (current16thNote === 4 || current16thNote === 12) {
            playSound(samplebb[25], gainNode3);
        }
    }
    if (bugShoot === true) {
        if (barNumber % 2 === 0 && current16thNote === 0) {
            playSound(samplebb[24], gainNode3);
        }
    }
    if (jellyShoot === true) {
        if (bar4Number % 2 === 0 && current64thNote === 24) {
            playSound(samplebb[18], gainNode2);
        }
    }
    if (jellygreenShoot === true) {
        if (barNumber % 4 === 0 && current16thNote === 0) {
            playSound(samplebb[31], gainNode2);
        }
    }


    //if(sharkShoot){
    //    if (barNumber % 1 === 0) {
    //                    //if ((current16thNote + 2) % 4 === 0) {
    //                    if (current16thNote === 2 || current16thNote === 6 || current16thNote === 10 ||current16thNote === 14) {
    //                        playSound(samplebb[5], gainNode3);
    //                    }
    //                }
    //
    //}
}


function scheduler() {
    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
        scheduleNote(current16thNote, nextNoteTime);
        nextNote();
    }
}

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


var spawnMonster = function (amount, monster) {
    for (i = 0; i < amount; i += 1) {
        positions = {x: Math.floor((Math.random() * 5000) + 1), y: Math.floor((Math.random() * 5000) + 1)};
        var sentity = new monster(positions);
        monsters.push(sentity);
    }
};

var spawnBoulder = function (amount, monster) {
    for (i = 0; i < amount; i += 1) {
        positions = {x: -500, y: Math.floor((Math.random() * 2800) + 50)};
        var sentity = new monster(positions);
        monsters.push(sentity);
    }
};

var spawnPlanet = function (amount, planett) {
    for (i = 0; i < amount; i += 1) {
        var planet = new planett();
        planets.push(planet);
    }
};


var shoot = function () {

    var bullet = new Bullet(hero.x, hero.y, 60);

    // Create a vector between the center of the player and the current mouse position..
    var vector = {x: (bulletX + camera.x) - (hero.x + 16), y: (bulletY + camera.y) - (hero.y + 16)};
    // Use the Pythagorean theorem to discover the length of the vector...
    vector.length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    // Set the velocity of the bullet to the components of the vector divided by it's length times the desired speed (10).
    bullet.velocity = [(vector.x / vector.length) * 10, (vector.y / vector.length) * 10];
    bullet.angle = Math.atan2(vector.y / vector.length, vector.x / vector.length);
    //bullet.type = "bullet1";   // Active weapon.bullet
    // Push the bullet into the bullets array.
    bullets.push(bullet);
};

//var shoot2 = function () {
//
//    var bullet = new Bullet(hero.x, hero.y, 10);
//    var bullet2 = new Bullet(hero.x, hero.y, 10);
//    var bullet3 = new Bullet(hero.x, hero.y, 10);
//
//    // Create a vector between the center of the player and the current mouse position..
//    var vector = {x: (bulletX + camera.x) - (hero.x + 16), y: (bulletY + camera.y) - (hero.y + 16)};
//    var vector2 = {x: (bulletX + camera.x) - (hero.x + 16), y: (bulletY + camera.y) - (hero.y + 16)};
//    var vector3 = {x: (bulletX + camera.x) - (hero.x + 16), y: (bulletY + camera.y) - (hero.y + 16)};
//
//    // Use the Pythagorean theorem to discover the length of the vector...
//    vector.length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
//    vector2.length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
//    vector3.length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
//
//    // Set the velocity of the bullet to the components of the vector divided by it's length times the desired speed (10).
//    bullet.velocity = [(vector.x / vector.length) * 10, (vector.y / vector.length) * 10];
//    bullet2.velocity = [(vector2.x / vector2.length) * 10, (vector2.y / vector2.length) * 10];
//    bullet3.velocity = [(vector3.x / vector3.length) * 10, (vector3.y / vector3.length) * 10];
//
//    //bullet.angle = Math.atan2(vector.y / vector.length, vector.x / vector.length);
//    //bullet2.angle = Math.atan2(vector.y / vector.length, vector.x / vector.length);
//    //bullet3.angle = Math.atan2(vector.y / vector.length, vector.x / vector.length);
//
//    // Push the bullet into the bullets array.
//    bullets.push(bullet);
//    bullets.push(bullet2);
//    bullets.push(bullet3);
//};


function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}


var randomN = function (minimum, maximum, precision) {
    minimum = minimum === undefined ? 0 : minimum;
    maximum = maximum === undefined ? 9007199254740992 : maximum;
    precision = precision === undefined ? 0 : precision;

    var random = Math.random() * (maximum - minimum) + minimum;

    return parseFloat(random.toFixed(precision));
};


//var list = [
//    function() { spawnMonster(5, Fish) },
//    function() { spawnMonster(5,Beetle) },
//    function() { spawnMonster(5, Prawn) },
//    function() {spawnMonster(3,Bug) },
//    function() {spawnMonster(1, Shark) },
//    function() {spawnMonster(5, Mosquito) },
//    function() {spawnMonster(5, Mosquito2) }];
var list = [Fish, Beetle, Prawn, Bug, Shark, Mosquito, Mosquito2, JellyGreen, JellyOrange];
var list2 = [Fish, Beetle, Prawn, Bug, Shark, JellyOrange, Mosquito, Mosquito2, JellyGreen, JellyOrange];
var weight_easy = [0.35, 0.17, 0.2, 0.05, 0.05, 0.09, 0.05, 0.0, 0.04];
var weight_med = [0.02, 0.03, 0.02, 0.18, 0.16, 0.26, 0.05, 0.08, 0.1, 0.1];
//var weight_easy = [0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0];
var monsterlist_easy = generateWeighedList(list, weight_easy);
var monsterlist_med = generateWeighedList(list2, weight_med);


function handleInput(dt) {
    var keys = {W: false, A: false, S: false, D: false, howManyPressed: 0};

    if (87 in keysDown || 38 in keysDown) { // Player holding up
        //keys.W = true;
        keys.UP = true;
        keys.howManyPressed += 1;
    }
    if (83 in keysDown || 40 in keysDown) { // Player holding down
        //keys.S = true;
        keys.DOWN = true;
        keys.howManyPressed += 1;
    }
    if (65 in keysDown || 37 in keysDown) { // Player holding left
        //keys.A = true;
        keys.LEFT = true;
        keys.howManyPressed += 1;
    }
    if (68 in keysDown || 39 in keysDown) { // Player holding right
        //keys.D = true;
        keys.RIGHT = true;
        keys.howManyPressed += 1;
    }
    if (27 in keysDown) {
        paused = !paused;
        //play();
    }

    if (90 in keysDown) {
        spawnMonster(1, JellyOrange);
    }
    if (88 in keysDown) {
        spawnMonster(1, JellyGreen);
    }
    if (67 in keysDown) {
        spawnMonster(1, Beetle);
    }
    if (86 in keysDown) {
        spawnMonster(1, Bug);
    }
    if (66 in keysDown) {
        spawnMonster(1, Shark);
    }
    if (78 in keysDown) {
        spawnMonster(1, Mosquito2);
    }
    if (191 in keysDown) {
        console.log(monsters.length);
    }


    if (keys.howManyPressed > 1) {
        hero.speed = hero.speed / 1.25;
    }

    //if(isInXrange(hero.x) && isInYrange(hero.y)){
    if (keys.UP === true && hero.y >= 0) {
        hero.y -= hero.speed * dt;
        //hero.velY--;
    }
    //}
    if (keys.DOWN === true && hero.y <= 5000) {
        hero.y += hero.speed * dt;
        //hero.velY++;
    }
    if (keys.LEFT === true && hero.x >= 0) {
        hero.x -= hero.speed * dt;
        //hero.velX--;
    }
    if (keys.RIGHT === true && hero.x <= 5000) {
        hero.x += hero.speed * dt;
        //hero.velX++;
    }

    if (keys.howManyPressed >= 2) {
        hero.speed = hero.speed * 1.25;   //  ****
    }
}


function updateEntities(dt) {

    //for (var x = 0, m = monsters.length; x < m; ++x) {
    for (var x in monsters) {
        var monster = monsters[x];
        monster.update();

        //collide(this,)

        //monster.shoot();
        //monster.move();
        if (typeof monster.move === 'function') {
            if (!monster.isDead) {
                monster.move(dt);
            }
        }
        //if (typeof monster.playLoop === 'function') {
        //        monster.playLoop();
        //}
        if (monster.toRemove) {
            monsters.splice(x, 1);
            //monster = null;
        }
    }

    for (var x in planets) {
        var planet = planets[x];
        planet.update();
        planet.playLoop();
        //planet.render();
        //collide(hero, planet, true);
        collide(hero, planet, true);

        for (var x in monsters) {
            var monster = monsters[x];
            collide(monster, planet, true);
        }
    }

    for (var z in bullets) {
        //var bullet = bullets[z];
        //var index = bullets.indexOf(bullet);
        //if (bullet !== undefined) {
        //    //Increase it's position by it's velocity...
        //    bullet.x += bullet.velocity[0];
        //    bullet.y += bullet.velocity[1];
        //
        //    if (bullet.type !== "hero") {
        //        //var collides1;
        //        //if (
        //        //    bullet.x > hero.x + hero.width ||
        //        //    bullet.x + hero.width / 2 < hero.x ||
        //        //    bullet.y > hero.y + hero.height ||
        //        //    bullet.y + hero.height / 2 < hero.y
        //        //) {
        //        //    collides1 = false;
        //        //}
        //        //else {
        //        //    collides1 = true;
        //        //}
        //        //
        //        //
        //        //if (collides1 === true) {
        //        //    hero.health -= bullet.damage;
        //        //    //var index = bullets.indexOf(bullet);
        //        //    bullets.splice(index, 1);
        //        //}
        //
        //        collide(bullet, hero, true, function (collides) {
        //            if (collides === true) {
        //                hero.health -= bullet.damage;
        //                //var index = bullets.indexOf(bullet);
        //                bullets.splice(index, 1);
        //            }
        //        }, 2);
        //    }
        //
        //    for (var y = 0, m = monsters.length; y < m; ++y) {
        //        // bullet-entity collision
        //        var collides;
        //        var monst = monsters[y];
        //        if (bullet.type === "hero") {
        //            //if (
        //            //    bullet.x > monst.x + monst.width ||
        //            //    bullet.x + monst.width / 2 < monst.x ||
        //            //    bullet.y > monst.y + monst.height ||
        //            //    bullet.y + monst.height / 2 < monst.y
        //            //) {
        //            //    collides = false;
        //            //}
        //            //else {
        //            //    collides = true;
        //            //}
        //            //
        //            //if (collides === true && monst.isDead === false) {
        //            //    monst.health -= bullet.damage;
        //            //    //var index = bullets.indexOf(bullet);
        //            //    bullets.splice(index, 1);
        //            //}
        //
        //            collide(bullet, monst, true, function (collides) {
        //                if (collides === true) {
        //                    monst.health -= bullet.damage;
        //                    //var index = bullets.indexOf(bullet);
        //                    bullets.splice(index, 1);
        //                }
        //            }, 2);
        //        }

        var bullet = bullets[z];
        bullet.update();

    }

    //        var playerdist = {x: bullet.x - hero.x, y: bullet.y - hero.y};
    //        playerdist.length = Math.sqrt((playerdist.x * playerdist.x) + (playerdist.y * playerdist.y));
    //
    //        // BULLET DISAPPEAR WHEN FAR AWAY
    //        if (playerdist.length > 1000) {
    //            //var index = bullets.indexOf(bullet);
    //            bullets.splice(index, 1);
    //        }
    //    }
    //}
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

    //
    //var viewVector = {
    //    x: Math.round(this.x - hero.x),
    //    y: Math.round(this.y - hero.y)
    //};
    //viewVector.length = Math.sqrt((viewVector.x * viewVector.x) + (viewVector.y * viewVector.y));  // Length of the vector

    ////if(this.follow === true) {
    //this.UpdateAngle = function () {
    //    this.dx = hero.x - this.x;
    //    this.dy = hero.y - this.y;
    //    this.distance = Math.sqrt((this.dx * this.dx) + (this.dy * this.dy));
    //    this.angle = Math.atan2(this.dy, this.dx) * 180 / Math.PI;
    //};
    //this.UpdateSpeed = function () {
    //    this.speedX = this.speed * (this.dx / this.distance);
    //    this.speedY = this.speed * (this.dy / this.distance);
    //};
    //this.move = function () {
    //    this.UpdateAngle();
    //    this.UpdateSpeed();
    //    this.x += this.speedX * dt;
    //    this.y += this.speedY * dt;
    //};
    //

    //followplayer.length = Math.sqrt((followplayer.x * followplayer.x) + (followplayer.y * followplayer.y));
    //if (followplayer.length > 200)   //   ***
    //
    //    monstervector.length = Math.sqrt((monstervector.x * monstervector.x) + (monstervector.y * monstervector.y));


    //this.dx = (hero.x - canvas.width / 2) - camera.x;
    //this.dy = (hero.y - canvas.height / 2) - camera.y;
    //this.distance = Math.sqrt((this.dx * this.dx) + (this.dy * this.dy));
    ////this.angle = Math.atan2(this.dy, this.dx) * 180 / Math.PI;
    //this.speedX = 3 * (this.dx / this.distance);
    //this.speedY = 3 * (this.dy / this.distance);
    //
    //if (this.distance > 25) {
    //    camera.x += this.speedX;
    //    camera.y += this.speedY;
    //}


    //camera.x = hero.x - window.innerWidth / 2;
    //camera.y = hero.y - window.innerHeight / 2;

}

var collide = function (obj1, obj2, separate, callback, type) {

    this.type = typeof type !== 'undefined' ? type : 1;
    var colliding;

    if (this.type === 1) {
        if (obj1.x > obj2.x + obj2.width ||
            obj1.x + obj1.width < obj2.x ||
            obj1.y > obj2.y + obj2.height ||
            obj1.y + obj1.height < obj2.y
        ) {
            colliding = false;
        } else {
            colliding = true;
        }
    }

    else if (this.type === 2) {
        if (obj1.x > obj2.x + obj2.width ||
            obj1.x + obj2.width / 2 < obj2.x ||
            obj1.y > obj2.y + obj2.height ||
            obj1.y + obj2.height / 2 < obj2.y
        ) {
            colliding = false;
        } else {
            colliding = true;
        }
    }

    //if (
    //    bullet.x > hero.x + hero.width ||
    //    bullet.x + hero.width / 2 < hero.x ||
    //    bullet.y > hero.y + hero.height ||
    //    bullet.y + hero.height / 2 < hero.y
    //) {

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
        //setTimeout(reset, 5000);
    }

    if (score >= 1500) {
        gun = 2;
    }
    if (score >= 4000) {
        gun = 1;
    }

}

var reset = function () {

    //var executed = false;
    //return function () {
    //    if (!executed) {
    //        executed = true;
    //        // do something
    //        setTimeout(initStats, 5000);
    //    }
    //};

    if (!gameOver) {
        gameOver = true;
        playSound(samplebb[4], gainNode3);

        setTimeout(initStats, 6000);

    }


};

function initStats() {


    //location.reload(true);   // Refresh


    play();
    setTimeout(play, 8000);

    gameOver = false;
    tempo = 145;
    score = 0;
    monsters = [];
    planets = [];
    bullets = [];
    //spawnN = 0;
    hero.x = 3000;
    hero.y = 3000;
    camera.x = hero.x - canvas.width / 2;
    camera.y = hero.y - canvas.width / 2;
    hero.health = 2000;

    sharkShoot = false;
    bugShoot = false;
    jellyShoot = false;

    planet1play = true;
    planet2play = true;
    planet3play = true;
    planet4play = true;
    planet5play = true;
    planet6play = true;
    planet7play = true;
    planet8play = true;
    planet9play = true;

    planet1gain.gain.value = 0.0;
    planet2gain.gain.value = 0.0;
    planet3gain.gain.value = 0.0;
    planet4gain.gain.value = 0.0;
    planet5gain.gain.value = 0.0;
    planet6gain.gain.value = 0.0;
    planet7gain.gain.value = 0.0;
    planet8gain.gain.value = 0.0;
    planet9gain.gain.value = 0.0;


    bulletpiercePower = false;

    gun = 0;
    current16thNote = 0;
    current64thNote = 0;
    barNumber = 0;
    barNumberL = 0;
    bar4Number = 0;
    bar16Number = 0;
    gameTime = 0;


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



}


var render = function () {
    // Clear the screen
    //ctx.fillStyle = starBackground;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //ctx.clearRect(0, 0, 1200, 750);
    ctx.save();
    ctx.translate(-camera.x, -camera.y);


    //ctx.drawImage((resources.get("images/background1.jpg")),0,0);


    for (var x in planets) {
        var planet = planets[x];
        planet.render(ctx);
        //ctx.scale(0.5,0.5);

    }

    // Draw monsters
    for (var x = 0, l = monsters.length; x < l; x++) {
        var monster = monsters[x];
        monster.render(ctx);
    }

    ctx.drawImage(resources.get("images/Hero.png"), hero.x, hero.y, hero.width, hero.height);


    // Draw bullets...
    for (var x = 0, l = bullets.length; x < l; x++) {
        var bullet = bullets[x];
        ctx.save();
        ctx.translate(bullet.x + 8, bullet.y + 8);  // +8?
        ctx.rotate(bullet.angle);

        if (bullet.type === "hero") {
            ctx.drawImage(resources.get("images/blt.png"), 0, 0);         // -8?
        } else if (bullet.type === "enemy1") {
            ctx.drawImage(resources.get("images/spawn.png"), 0, 0, 30, 8);
        } else if (bullet.type === "enemy2") {
            ctx.drawImage(resources.get("images/spawn.png"), 0, 0, 8, 6);
        }

        ctx.restore();
    }

    cameraFollow();

    ctx.beginPath();  // path commands must begin with beginPath

    ctx.rect(0, 0, 5000, 5000);
    ctx.strokeStyle = "white";

    ctx.stroke();


    ctx.fillStyle = "white";
    ctx.restore();
    // Score
    ctx.fillStyle = "red";
    ctx.font = "22px Helvetica";
    ctx.textAlign = "left";
    //ctx.textBaseline = "top";
    ctx.fillText("Space Cash: " + score + "   " + "Space Health: " + hero.health, 32, 32);
    //ctx.fillText("Space Cash: " + score + "   " + "Space Health: " + hero.health + "planet1gain - " + planet1gain.gain.value + "  - jellyshoot" + jellyShoot , 32, 32);
    //ctx.fillText("DT: " + dt, 50, 50);


    //ctx.beginPath();  // path commands must begin with beginPath
    //
    //ctx.rect(10,10,3000,3000);
    //ctx.strokeStyle= "white";
    //ctx.stroke();
    //
    //ctx.beginPath();  // path commands must begin with beginPath
    //
    //ctx.rect(10,10,100,100);
    //ctx.strokeStyle= "white";
    //ctx.stroke();


    ////If the game is running...
    //if (state === "playing") {
    //    ctx.fillStyle = "red";
    //    ctx.fillRect(canvas.width - 70, 10, 5, 20);
    //    ctx.fillRect(canvas.width - 58, 10, 5, 20);
    //
    //}
    ////Otherwise...
    //if (paused === true) {
    //    // Draw grey "pause" button
    //    ctx.fillStyle = "grey";
    //    ctx.fillRect(canvas.width - 70, 10, 5, 20);
    //    ctx.fillRect(canvas.width - 58, 10, 5, 20);
    //}
};

function update(dt) {
    gameTime += dt;

    handleInput(dt);
    //updateEntities(dt);
    updateEntities(0.016);
    updateStates();

    //console.log(camera);
    //console.log(hero.x);
    //var shark = new Shark({x:2000,y:2000});
    //console.log(shark.health);
}


