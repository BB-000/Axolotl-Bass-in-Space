/**
 * Created by Barnabeeeeee on 06/04/15.
 */
var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

//Create the canvas
var canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 40;
canvas.height = window.innerHeight - 30;

document.body.appendChild(canvas);

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

function init(){
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
    window.addEventListener("mousemove", function (e) {
        bulletX = e.clientX;
        bulletY = e.clientY;
    });

    ///////////////////////////////
    //starBackground = ctx.createPattern(resources.get('images/Stars.jpg'), 'repeat');
    spawnMonster(1, Fish);
    setTimeout(loadSounds, 1000);
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
    'images/Bug.png',
    'images/Shark.png',
    'images/Mosquito.png',
    'images/Boulder.png',
    'images/blt.png',
    'images/spawn.png'
]);
resources.onReady(init);


var starBackground;
var bullets = [];
var monsters = [];

var bulletX;
var bulletY;

var paused = false;
var state = "startmenu";
var camera = {x : 0, y : 0};
var then;
var score = 0;
var ctx;
var spawnN = 0;
var shootx = false;
var play1 = false;
var gun = 0;
var gameTime = 0;

// keyboard controls
var keysDown = {};


function loadSounds() {
//		soundContext = new AudioContext();
    bufferLoader = new BufferLoader(audioContext,
        [
            'sounds/1-KICK.mp3',      //0
            'sounds/2-BASS.mp3',      //1
            'sounds/3-BASS2.mp3',    //2
            'sounds/4-BASS4.mp3',      //3
            'sounds/cowbell1.wav',  //4
            'sounds/conga1.wav',    //5
            'sounds/conga2.wav',    //6
            'sounds/conga3.wav',    //7
            'sounds/suspense1.wav', //8
            'sounds/suspense2.wav', //9
            'sounds/10-AMBIENCE1.mp3', // 10
            'sounds/11-AMBIENCE2.mp3',     //11
            'sounds/rooster.wav',       //12
            'sounds/13-NPC-ZAP.wav',           //
            'sounds/14-NPC-CRASH1.mp3',       //
            'sounds/15-NPC-HIT1.mp3',     // 15
            'sounds/16-NPC-HIT2.mp3',
            'sounds/17-NPC-HIT3.wav',       //
            'sounds/18-NPC-BREAK1.mp3',     //
            'sounds/19-NPC-ZAP1.mp3',
            'sounds/20-NPC-ZAP2.mp3',       //  20
            'sounds/21-NPC-LOOP1.mp3',
            'sounds/22-NPC-LOOP2.mp3',      //  22
            'sounds/23-NPC-LOOP3.mp3'      // 23
        ],
        finishedLoading
    );
    bufferLoader.load();
}

function setNoteReady(obj) {
    obj.ready = true;
}

//////////////////////////////////////////////  !  i Must be size of Array!!
function finishedLoading(bufferList) {
    for (var i = 0; i < 24; i++) {
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
    play();
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

    current16thNote++;    // Advance the beat number, wrap to zero
    if (current16thNote === 16) {
        current16thNote = 0;
        barNumber += 1;
        //console.log("bar number : " + barNumber);
    }

    if (barNumber % 4 === 0 && current16thNote === 0) {
        bar4Number += 1;
        //console.log("bar4 number" + bar4Number);
        console.log("bar 4 number : " + bar4Number);
    }

    if (barNumber % 16 === 0 && current16thNote === 0) {
        bar16Number += 1;
        console.log("bar 16 number : " + bar16Number);
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
    var osc = audioContext.createOscillator();
    osc.connect(audioContext.destination);

    var osc2 = audioContext.createOscillator();
    osc2.connect(audioContext.destination);

    ///   PLAYER SHOOT      ///
    if (shootx) {
        //  Weapon 1
        if (gun === 0) {
            if (beatNumber % 4 !== 0) {
                shoot2(bulletX, bulletY);
                playSound(samplebb[1], gainNode2);
            }
        }
        // Weapon 2 ...
        else if (gun === 1) {
            if (beatNumber === 2 || beatNumber === 7 || beatNumber === 10 || beatNumber === 15) {
                shoot2(bulletX, bulletY);
                playSound(samplebb[2], gainNode2);
            }
            else if (beatNumber % 4 !== 0) {
                shoot2(bulletX, bulletY);
                playSound(samplebb[1], gainNode2);
            }
        }
        // Weapon 3...
    }


    // KICK
    if (beatNumber % 4 === 0) {
        playSound(samplebb[0], gainNode1);
        spawnBoulder(1, Boulder);
    }
    if (score > 500 && score < 80000) {
        if (barNumber % 4 === 0 && beatNumber === 0) {
            playSound(samplebb[10], gainNode3);
        }
    }
    if (score < 50000) {
        if (barNumber % 4 === 0 && beatNumber === 0) {
            playSound(samplebb[21], gainNode4);
        }
    }
    if (score > 90000){
        if (beatNumber % 16 === 0) {
            playSound(samplebb[22],gainNode3);
        }
    }
    if (score > 70000) {
        if (bar4Number % 16 === 0) {
            playSound(samplebb[11], gainNode3);
        }
    }
    if (score > 20000) {
        if (barNumber % 4 === 0 && beatNumber === 0) {
            playSound(samplebb[23], gainNode3);
            console.log("hihats");
        }
    }
    if(barNumber >= 4) {
        if (barNumber % 4 === 0 && beatNumber === 0) {
            spawnMonster(5, monsterz[Math.floor(Math.random() * monsterz.length)]);
            console.log("spawned");
        }
    }
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
        return "stop";
    } else {
        timerWorker.postMessage("stop");
        return "play";
    }
}

var spawnMonster = function (amount, monster) {
    for (i = 0; i < amount; i++) {
        positions = {x: Math.floor((Math.random() * 1500) + 1), y: Math.floor((Math.random() * 1500) + 1)};
        var sentity = new monster(positions);
        monsters.push(sentity);
    }
};

var spawnBoulder = function (amount, monster) {
    for (i = 0; i < amount; i++) {
        positions = {x: -50, y: Math.floor((Math.random() * 2800) + 50)};
        var sentity = new monster(positions);
        monsters.push(sentity);
    }
};

var Bullet = function (eX, eY, damage) {

    this.damage = typeof damage !== 'undefined' ? damage : 10,
    this.x = hero.x + 32,
        this.y = hero.y - 8,
        this.velocity = [0, 0],
        this.angle = 0,
        this.type = "spear",
        this.speed = 100,
        this.eX = eX,
        this.eY = eY
        //this.damage = damage
};


var shoot = function (x, y) {

    bullet = new Bullet(x, y);

    // Create a vector between the center of the player and the current mouse position..
    var vector = {x: (bullet.eX + camera.x) - (hero.x + 16), y: (bullet.eY + camera.y) - (hero.y + 16)};
    // Use the Pythagorean theorem to discover the length of the vector...
    vector.length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    // Set the velocity of the bullet to the components of the vector divided by it's length times the desired speed (10).
    bullet.velocity = [(vector.x / vector.length) * 10, (vector.y / vector.length) * 10];
    bullet.angle = Math.atan2(vector.y / vector.length, vector.x / vector.length);
    bullet.type = "bullet1";   // Active weapon.bullet
    // Push the bullet into the bullets array.
    bullets.push(bullet);
};

var shoot2 = function (x, y) {

    bullet = new Bullet(x, y);
    bullet3 = new Bullet(x, y);
    bullet2 = new Bullet(x, y);

    // Create a vector between the center of the player and the current mouse position..
    var vector = {x: (bullet.eX + camera.x) - (hero.x + 16), y: (bullet.eY + camera.y) - (hero.y + 16)};

    // Use the Pythagorean theorem to discover the length of the vector...
    vector.length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

    // Set the velocity of the bullet to the components of the vector divided by it's length times the desired speed (10).
    bullet.velocity = [(vector.x / vector.length) * 10, (vector.y / vector.length) * 10];
    bullet3.velocity = [(vector.x / vector.length) * 10, (vector.y / vector.length) * 10];
    bullet2.velocity = [(vector.x / vector.length) * 10, (vector.y / vector.length) * 10];
    //bullet1.velocity, bullet2.velocity
    bullet.angle = Math.atan2(vector.y / vector.length, vector.x / vector.length);
    bullet3.angle = Math.atan2(vector.y / vector.length + 10, vector.x / vector.length + 10);
    bullet2.angle = Math.atan2(vector.y / vector.length - 10, vector.x / vector.length - 10);
    //bullet1.angle = Math.atan2(vector.y / vector.length, vector.x / vector.length);
    //bullet2.angle = Math.atan2(vector.y  / vector.length, vector.x / vector.length);

    bullet.type = "bullet1";   // Active weapon.bullet
    bullet3.type = "bullet1";   // Active weapon.bullet
    bullet2.type = "bullet1";   // Active weapon.bullet

    // Push the bullet into the bullets array.
    bullets.push(bullet);
    bullets.push(bullet3);
    bullets.push(bullet2);

};



function handleInput(dt) {
    var keys = {W: false, A: false, S: false, D: false, howManyPressed: 0};

    if (87 in keysDown) { // Player holding up
        keys.W = true;
        keys.howManyPressed += 1;
    }
    if (83 in keysDown) { // Player holding down
        keys.S = true;
        keys.howManyPressed += 1;
    }
    if (65 in keysDown) { // Player holding left
        keys.A = true;
        keys.howManyPressed += 1;
    }
    if (68 in keysDown) { // Player holding right
        keys.D = true;
        keys.howManyPressed += 1;
    }
    if (27 in keysDown) {
        paused = !paused;
        play();
    }

    if (90 in keysDown) {
        spawnBoulder(1, Boulder);
    }
    if (88 in keysDown) {
        spawnMonster(1, Worm);
    }
    if (67 in keysDown) {
        spawnMonster(1, Prawn);
    }
    if (86 in keysDown) {
        spawnMonster(1, Bug);
    }
    if (66 in keysDown) {
        spawnMonster(1, Shark);
    }
    if (78 in keysDown) {
        spawnMonster(1, Mosquito);
    }
    if (191 in keysDown) {
        console.log(monsters.length);
    }


    if (keys.howManyPressed > 1) {
        hero.speed = hero.speed / 1.25;
    }

    if (keys.W === true) hero.y -= hero.speed * dt;
    if (keys.S === true) hero.y += hero.speed * dt;
    if (keys.A === true) hero.x -= hero.speed * dt;
    if (keys.D === true) hero.x += hero.speed * dt;

    if (keys.howManyPressed >= 2) {
        hero.speed = hero.speed * 1.25;   //  ****
    }
}


function updateEntities(dt) {

    for (var x=0; x < monsters.length; x++) {
        var monster = monsters[x];
        monster.update();
        //monster.move();
        if (typeof monster.move === 'function') {
            if (!monster.isDead) {
                monster.move(dt);
            }
        }
        if (monster.toRemove){
            monsters.splice(x,1);
            //monster = null;
        }
    }

    for (var x=0; x < bullets.length; x++) {
        var bullet = bullets[x];
        if (bullet !== undefined) {
            //Increase it's position by it's velocity...
            bullet.x += bullet.velocity[0];
            bullet.y += bullet.velocity[1];

            for (var y in monsters)  //
            {
                // bullet-entity collision
                var collides;
                var monst = monsters[y];
                if (
                    bullet.x > monst.x + monst.width ||
                    bullet.x + monst.width / 2 < monst.x ||
                    bullet.y > monst.y + monst.height ||
                    bullet.y + monst.height / 2 < monst.y
                ) {
                    collides = false;
                }
                else {
                    collides = true;
                }

                if (collides === true && monst.isDead === false) {
                    monst.health -= bullet.damage;
                    var index = bullets.indexOf(bullet);
                    bullets.splice(index, 1);
                }
            }

            var playerdist = {x: bullet.x - hero.x, y: bullet.y - hero.y};
            playerdist.length = Math.sqrt((playerdist.x * playerdist.x) + (playerdist.y * playerdist.y));

            // BULLET DISAPPEAR WHEN FAR AWAY
            if (playerdist.length > 800) {
                var index = bullets.indexOf(bullet);
                bullets.splice(index, 1);
            }
        }
    }
}

function cameraFollow(){
    var followplayer = {
        x: (window.innerWidth / 2 + camera.x) - hero.x,
        y: (window.innerHeight / 2 + camera.y) - hero.y
    };
    followplayer.length = Math.sqrt((followplayer.x * followplayer.x) + (followplayer.y * followplayer.y));
    if (followplayer.length > 200)   //   ***
    {
        camera.x -= (followplayer.x / followplayer.length) * 6;  //  (choppy*?)
        camera.y -= (followplayer.y / followplayer.length) * 6;  //  (choppy*?)
    }
}

var collide = function(obj1,obj2,separate,callback)
{
    var colliding;
    if(obj1.x > obj2.x + obj2.width ||
        obj1.x + 32 < obj2.x ||
        obj1.y > obj2.y + obj2.height ||
        obj1.y + 32 < obj2.y
    )
    {
        colliding = false;
    }

    else
    {
        colliding = true;
    }

    if(colliding === true && separate === true)
    {

        var penetration = {x : obj1.x - obj2.x, y : obj1.y - obj2.y};
        if(Math.abs(penetration.x) > Math.abs(penetration.y))
        {
            if(obj1.x > obj2.x) obj1.x = obj2.x + obj2.width;
            else obj1.x = obj2.x - obj1.width;
        }

        else
        {
            if(obj1.y > obj2.y) obj1.y = obj2.y + obj2.height;
            else obj1.y = obj2.y - obj1.height;
        }

    }

    if(callback !== undefined) callback(colliding);

};


function updateStates(){
    if (hero.health <= 0) {
        reset();
    }

    if(score >= 12000 ){
        gun = 1;
    }
}

function reset(){

    score = 0;
    monsters = [];
    bullets = [];
    spawnN = 0;
    hero.x = 500;
    hero.y = 500;
    camera.x = 0;
    camera.y = 0;
    hero.health = 100;

    gun = 0;
    current16thNote = 0;
    barNumber = 0;
    bar4Number = 0;
    bar16Number = 0;
    gameTime = 0;
    tempo = 145;
}


var render = function () {
        // Clear the screen
        //ctx.fillStyle = starBackground;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //ctx.clearRect(0, 0, 1200, 750);
        ctx.save();
        ctx.translate(-camera.x, -camera.y);

        ctx.drawImage(resources.get("images/Hero.png"), hero.x, hero.y, hero.width, hero.height);

        // Draw monsters
        for (var x in monsters) {
            var monster = monsters[x];
            monster.render(ctx);
        }

        // Draw bullets...
        for (var x in bullets) {
            var bullet = bullets[x];
            ctx.save();
            ctx.translate(bullet.x + 8, bullet.y + 8);  // +8?
            ctx.rotate(bullet.angle);

            if (bullet.type === "bullet1") {
                ctx.drawImage(resources.get("images/blt.png"), -8, -8);         // -8?
            }
            //else {
            //    ctx.drawImage(bullet2,-8,-8);
            //}
            ctx.restore();
        }

        ctx.fillStyle = "white";
        ctx.restore();
        // Score
        ctx.fillStyle = "red";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        //ctx.textBaseline = "top";
        ctx.fillText("Space Cash: " + score, 32, 32);
        //ctx.fillText("DT: " + dt, 50, 50);


        //If the game is running...
        if (state === "playing") {
            ctx.fillStyle = "red";
            ctx.fillRect(canvas.width - 70, 10, 5, 20);
            ctx.fillRect(canvas.width - 58, 10, 5, 20);
        }
        //Otherwise...
        if (paused === true) {
            // Draw grey "pause" button
            ctx.fillStyle = "grey";
            ctx.fillRect(canvas.width - 70, 10, 5, 20);
            ctx.fillRect(canvas.width - 58, 10, 5, 20);
        }
};

function update(dt) {
    gameTime += dt;

    handleInput(dt);
    //updateEntities(dt);
    updateEntities(0.016);
    updateStates();
    cameraFollow();
    //console.log(dt);
}