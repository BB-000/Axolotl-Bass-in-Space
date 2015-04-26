//(function() {
var bullets = [];

var sharkShoot = false;
var bugShoot = false;
var jellyShoot = false;
var jellygreenShoot = false;

var planet1play = true;
var planet2play = true;
var planet3play = true;
var planet4play = true;
var planet5play = true;
var planet6play = true;
var planet7play = true;
var planet8play = true;
var planet9play = true;
var planet10play = true;
var planet11play = true;

var fishPlay = false;
var sharkPlay = false;
var wormPlay = false;
var prawnPlay = false;
var bugPlay = false;
var mosquitoPlay = false;
var mosquito2Play = false;
var jellyorangePlay = false;
var jellygreenPlay = false;
var boulderPlay = false;
var healthUpPlay = false;

//function PowerUp() {}
//PowerUp.prototype = {
//
//
//
//}

function Monster() {
}
Monster.prototype = {

    isDead: false,
    playing: false,
    barTiming: 1,
    follow: true,
    toRemove: false,
    channel: gainNode3,
    fx: "delay",
    shooter: false,
    barbulletTiming: 1,
    flockSize: 4,
    healthdrop: false,
    isPowerUp: false,
    isPowerDrop: false,

    update: function () {

        var that = this;

        if (this.health <= 0) {
            this.isDead = true;
        }

        if (this.isDead === false) {
            if (this.isPowerUp === false) {
                for (var x = 0, l = monsters.length; x < l; x++) {
                    var monst = monsters[x];
                    if (monst.isPowerUp === false) {
                        if (monst.x !== this.x && monst.y !== this.y && monst.isDead === false) {
                            collide(this, monst, true);
                        }
                    }
                }
            }

            collide(hero, this, true, function (collides) {
                if (collides === true) {
                    hero.health -= that.damage;
                    that.isDead = true;
                    //console.log("damage"+this.damage);
                    //console.log(collides);
                }
            });
        }

        //       ******  DEAD ENEMIES STACK  *******        //             //        ******  DEAD ENEMIES STACK  *******        //             //        ******  DEAD ENEMIES STACK  *******        //
        else if (this.isDead === true) {
            if (window[this.flag] === false) {
                //window[this.flag] = true;
                //console.log(window[this.flag]);
                if (barNumber % this.barTiming === 0) {
                    if (current16thNote % this.timing === 0) {
                        this.toRemove = true;

                        if (this.isPowerUp) {
                            this.powerUp();
                        }
                        //samplebb[this.sound].ready = false;
                        //if (this.Powerdrop) {
                        //    var powerup = new HealthPower();
                        //    powers.push(powerup);
                        //}
                        if (gameOver === false) {
                            score += this.points;
                            window[this.flag] = true;
                            if (this.isPowerDrop) {
                                var power = new HealthUp(this.x, this.y);
                                monsters.push(power);
                            }
                            //console.log("" + fishPlay);
                            setTimeout(function () {
                                window[that.flag] = false;
                            }, 100);
                            //console.log(fishPlay);
                            //this.resetToken();
                            //console.log(fishPlay);
                            if (this.fx === "delay") {
                                playSoundDelay(samplebb[this.sound], this.channel);
                            } else {
                                playSound(samplebb[this.sound], this.channel);
                            }
                        }
                    }
                }
            }

            if (this.shooter) {
                //this.playing = false;

                window[this.token] = false;

                //if (this.token === "shark") {
                //    sharkShoot = false;
                //}
                //else if (this.token === "eel") {
                //    eelShoot = false;
                //    //console.log(eelShoot + "eelshoot false/?");
                //}
            }
        }

        /////       ******   DEAD ENEMIES DON'T STACK    **********        ///     ///       ******   DEAD ENEMIES DON'T STACK    **********        ///    ///       ******   DEAD ENEMIES DON'T STACK    **********        ///
        //else if (this.isDead) {
        //    if (barNumber % this.barTiming === 0) {
        //        if (current16thNote % this.timing === 0) {
        //            //var index = monsters.indexOf(this);
        //            //monsters.splice(index, 1);
        //
        //            this.toRemove = true;
        //            //samplebb[this.sound].ready = false;
        //
        //            if (gameOver === false) {
        //                score += this.points;
        //                console.log("" + fishPlay);
        //
        //
        //                console.log(window[this.flag]);
        //                //this.resetToken();
        //                //console.log(fishPlay);
        //                if (window[this.flag] === false) {
        //                    window[this.flag] = true;
        //                    if (this.fx === "delay") {
        //                        playSoundDelay(samplebb[this.sound], this.channel);
        //                    } else {
        //                        playSound(samplebb[this.sound], this.channel);
        //                    }
        //
        //                    setTimeout(function () {
        //                        window[that.flag] = false;
        //                    }, 100);
        //                }
        //            }
        //        }
        //    }
        //}

    },

    render: function (ctx) {
        if (this.isDead === false) {
            ctx.drawImage(resources.get(this.monsterImage), this.x, this.y, this.sizex, this.sizey);
        } else if (this.isDead === true) {
            ctx.save();
            ctx.globalAlpha = 0.4;
            ctx.drawImage(resources.get(this.monsterImage), this.x, this.y, this.sizex, this.sizey);
            ctx.restore();
        }
    },

    getFlock: function () {
        return this.flockSize;
    },

    resetToken: function () {

        window[this.flag] = false;
    }

    //shoot: function () {
    //
    //    if (this.shooter === true) {
    //        var bullet = new Bullet(this.x, this.y, 1, "enemy");
    //        var vector = {x: hero.x - (this.x + 16), y: hero.y - (this.y + 16)};
    //        vector.length = Math.sqrt(vector.x * tector.x + vector.y * vector.y);
    //        bullet.velocity = [(vector.x / vector.length) * this.bbspeed, (vector.y / vector.length) * this.bbspeed];
    //        bullet.angle = Math.atan2(vector.y / vector.length, vector.x / vector.length);
    //        bullets.push(bullet);
    //
    //        this.playing = true;
    //        //sharkShoot = true;
    //
    //
    //        //function resset(){
    //        //    this.playing = true;
    //        //}
    //
    //        //if(this.playing === false) {
    //        //    this.playing = true;
    //        //    playSound(samplebb[this.shootSound], this.channel);
    //        //} else if(this.playing === true){
    //        //    setTimeout(this.resset(), 100);
    //        //}
    //
    //        //    }
    //        //}
    //    }
    //}
};

//function MonsterMove() {}
//MonsterMove.prototype = Object.create(Monster.prototype);
//MonsterMove.prototype.move = function () {
//    if (this.health >= 0) {
//        // Vector between the monster and the player
//        var monstervector = {
//            x: Math.round(this.x - hero.x),
//            y: Math.round(this.y - hero.y)
//        };
//        // Length of the vector
//        monstervector.length = Math.sqrt((monstervector.x * monstervector.x) + (monstervector.y * monstervector.y));
//
//        if (monstervector.length < 10 && this.follow === true) {
//            // Run after the player!
//            this.x -= Math.round((monstervector.x / monstervector.length) * 2);
//            this.y -= Math.round((monstervector.y / monstervector.length) * 2);
//        } else if (monstervector.length > 10 && !(monstervector.length > this.test) && this.follow === true) {
//            this.x -= Math.round((monstervector.x / monstervector.length) * 1);
//            this.y -= Math.round((monstervector.y / monstervector.length) * 1);
//        }
//    }
//};

function MonsterMove2() {
}
MonsterMove2.prototype = Object.create(Monster.prototype);
MonsterMove2.prototype.move = function (dt) {

    //var monstervector = {
    //    x: Math.round(this.x - hero.x),
    //    y: Math.round(this.y - hero.y)
    //};
    //monstervector.length = Math.sqrt((monstervector.x * monstervector.x) + (monstervector.y * monstervector.y));  // Length of the vector

    //console.log(monstervector.length);
    this.UpdateAngle = function () {
        this.dx = hero.x - this.x;
        this.dy = hero.y - this.y;
        this.distance = Math.sqrt((this.dx * this.dx) + (this.dy * this.dy));
        this.angle = Math.atan2(this.dy, this.dx) * 180 / Math.PI;
    };
    this.UpdateSpeed = function () {
        this.speedX = this.speed * (this.dx / this.distance);
        this.speedY = this.speed * (this.dy / this.distance);
    };
    this.move = function () {
        this.UpdateAngle();
        this.UpdateSpeed();
        this.x += this.speedX * dt;
        this.y += this.speedY * dt;
    };
};

function MonsterRun() {
}
MonsterRun.prototype = Object.create(Monster.prototype);
MonsterRun.prototype.move = function (dt) {

    var monstervector = {
        x: Math.round(this.x - hero.x),
        y: Math.round(this.y - hero.y)
    };
    monstervector.length = Math.sqrt((monstervector.x * monstervector.x) + (monstervector.y * monstervector.y));  // Length of the vector
    //console.log(monstervector.length);

    this.UpdateAngle = function () {
        this.dx = hero.x - this.x;
        this.dy = hero.y - this.y;
        this.distance = Math.sqrt((this.dx * this.dx) + (this.dy * this.dy));
        this.angle = Math.atan2(this.dy, this.dx) * 180 / Math.PI;
    };
    this.UpdateSpeed = function () {
        this.speedX = this.speed * (this.dx / this.distance);
        this.speedY = this.speed * (this.dy / this.distance);
    };
    this.move = function () {
        this.UpdateAngle();
        this.UpdateSpeed();
        var monstervector = {
            x: Math.round(this.x - hero.x),
            y: Math.round(this.y - hero.y)
        };
        monstervector.length = Math.sqrt((monstervector.x * monstervector.x) + (monstervector.y * monstervector.y));  // Length of the vector

        if (monstervector.length < 800 && this.x > 0 && this.y > 0 && this.x < 5000 && this.y < 5000) {
            this.x -= this.speedX * dt;
            this.y -= this.speedY * dt;
        } else if (monstervector.length > 800) {
            this.x += this.speedX * dt;
            this.y += this.speedY * dt;
        }
    };
};


function MonsterShoot() {
}
MonsterShoot.prototype = Object.create(MonsterMove2.prototype);
MonsterShoot.prototype.shoot = function () {

    //var playerdist = {x: this.x - (hero.x + 20), y: this.y - (hero.y + 20)};
    //playerdist.length = Math.sqrt((playerdist.x * playerdist.x) + (playerdist.y * playerdist.y));

    //if (this.shooter === true) {

    var bullet = new Bullet(this.x + 16, this.y + 16, this.bbDamage, this.bbType);
    var vector = {x: hero.x - this.x, y: hero.y - this.y};
    vector.length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    bullet.velocity = [(vector.x / vector.length) * this.bbspeed, (vector.y / vector.length) * this.bbspeed];
    bullet.angle = Math.atan2(vector.y / vector.length, vector.x / vector.length);
    bullets.push(bullet);

    //this.playing = true;

    //}
};


function MonsterFly() {
}
MonsterFly.prototype = Object.create(Monster.prototype);
MonsterFly.prototype.move = function (dt) {

    this.speedX = this.speed * 6 + dt;
    this.speedY = this.speed * 2;
    this.x += this.speedX;
    this.y += this.speedY;

    var playerdist = {x: this.x - hero.x, y: this.y - hero.y};
    playerdist.length = Math.sqrt((playerdist.x * playerdist.x) + (playerdist.y * playerdist.y));

    if (playerdist.length > 6500) {
        //var index = monsters.indexOf(this);
        this.toRemove = true;
        //monsters.splice(index, 1);
    }
};

//Prawn.prototype = Object.create(Monster.prototype);

var Fish = function (position) {

    this.x = position.x;
    this.y = position.y;
    this.width = 32;
    this.height = 32;
    this.health = 20;
    this.damage = 50;
    this.points = 50;
    this.speed = Math.random() * (190 - 70) + 70;
    this.sizex = 32;
    this.sizey = 32;
    //?
    //this.monsterImage = new Image();
    this.monsterImage = 'images/Fish.png';
    //this.shooter = true,
    //    this.bulletTiming = 2,
    //?
    this.sound = Math.floor((Math.random() * 2) + 19);
    //this.shootSound = 0;
    this.timing = 4;
    this.flockSize = 5;
    this.flag = "fishPlay";
    //this.resolution = bar4Number;

};
Fish.prototype = Object.create(MonsterMove2.prototype);

var Beetle = function (position) {
    this.x = position.x;
    this.y = position.y;
    this.width = 25;
    this.height = 24;
    this.health = 300;
    this.damage = 100;
    this.points = 90;
    this.speed = Math.random() * (150 - 100) + 100;
    this.sizex = 25;
    this.sizey = 24;
    //this.monsterImage = new Image();
    this.monsterImage = "images/BeetleBlue.png";
    this.sound = 17;
    this.timing = 16;
    this.flag = "wormPlay";
    this.flockSize = 3;


};
Beetle.prototype = Object.create(MonsterMove2.prototype);


var Prawn = function (position) {

    this.x = position.x;
    this.y = position.y;
    this.width = 32;
    this.height = 32;
    this.health = 100;
    this.damage = 100;
    this.points = 150;
    this.speed = Math.random() * (220 - 180) + 180;
    this.sizex = 32;
    this.sizey = 32;
    //this.monsterImage = new Image();
    this.monsterImage = "images/Prawn.png";
    this.sound = 7;
    this.timing = 3;
    this.flockSize = 4;
    this.flag = "prawnPlay";


};
Prawn.prototype = Object.create(MonsterMove2.prototype);


var Bug = function (position) {

    var xx = Math.floor(Math.random() * (82 - 12 + 1) + 12);
    //var yy = Math.floor(Math.random() * (6 - 5 + 1) + 5);
    this.x = position.x;
    this.y = position.y;
    this.width = xx;
    this.height = xx;
    this.health = Math.floor(Math.random() * (125 - 50 + 1) + 50);
    this.damage = 100;
    this.points = 400;
    this.speed = Math.floor(Math.random() * (180 - 100 + 1) + 100);
    this.sizex = xx;
    this.sizey = xx;
    //this.monsterImage = new Image();
    this.monsterImage = "images/Bug.png";
    this.sound = Math.floor(Math.random() * (6 - 5) + 1) + 5;
    this.shootSound = 24;

    this.timing = 1;
    //this.token = "eel";
    this.name = "bug";
    this.shooter = true;
    this.bbspeed = 5;
    this.bbDamage = 15;
    this.bbType = "enemy2";
    this.flockSize = 4;
    this.flag = "bugPlay";
    this.token = "bugShoot";
    this.shootTiming = function () {
        return !!(barNumber % 2 === 0 && current16thNote === 0);
    };
    this.shootRhythm = function () {
        if (barNumberL === 0 || barNumberL === 2) {
            if (current16thNote === 0 || current16thNote === 1 || current16thNote === 2 || current16thNote === 3 || current16thNote === 4 || current16thNote === 5) {
                return true;
            }
        } else if (barNumberL === 1 || barNumberL === 3) {
            if (current16thNote === 0 || current16thNote === 2 || current16thNote === 3) {
                return true;
            }
        } else {
            return false;
        }
    };

};
Bug.prototype = Object.create(MonsterShoot.prototype);


var Shark = function (position) {

    this.x = position.x;
    this.y = position.y;
    this.width = 64;
    this.height = 64;
    this.health = 1500;
    this.damage = 300;
    this.points = 1500;
    this.speed = Math.random() * (120 - 50) + 50;
    this.sizex = 92;
    this.sizey = 128;
    this.shooter = true;
    this.bbspeed = 7;
    this.monsterImage = "images/Shark.png";
    this.token = "sharkShoot";
    this.name = "shark";
    this.sound = 14;
    this.shootSound = 25;
    this.timing = 16;
    this.barTiming = 4;
    this.bbspeed = 9;
    this.bbDamage = 40;
    this.bbType = "enemy1";
    this.flockSize = 1;
    this.flag = "sharkPlay";
    this.shootTiming = function () {
        return !!(current16thNote === 4 || current16thNote === 12);
    };
    this.shootRhythm = function () {
        return !!(current16thNote === 4 || current16thNote === 12);
    };

};
Shark.prototype = Object.create(MonsterShoot.prototype);


var JellyOrange = function (position) {

    this.x = position.x;
    this.y = position.y;
    this.width = 40;
    this.height = 24;
    this.health = 1000;
    this.damage = 200;
    this.points = 1000;
    this.speed = Math.random() * (60 - 10) + 10;
    this.sizex = 40;
    this.sizey = 42;
    this.shooter = true;
    this.bbspeed = 5;
    this.monsterImage = "images/JellyOrange.png";
    this.token = "jellyShoot";
    this.sound = 30;
    this.timing = 16;
    this.barTiming = 4;
    this.bbspeed = 6;
    this.bbDamage = 30;
    this.bbType = "enemy2";
    this.flockSize = 1;
    this.flag = "jellyorangePlay";
    this.channel = gainNode5;
    this.shootRhythm = function () {

        return !!((bar4Number % 2 === 0) && (current64thNote === 29 || current64thNote === 30 || current64thNote === 31 || current64thNote === 32 || current64thNote === 33 ||
        current64thNote === 34 || current64thNote === 36 || current64thNote === 36 || current64thNote === 38 || current64thNote === 39 || current64thNote === 40 ||
        current64thNote === 41 || current64thNote === 42 || current64thNote === 43 || current64thNote === 45 || current64thNote === 47));
    };
};
JellyOrange.prototype = Object.create(MonsterShoot.prototype);


var Mosquito = function (position) {

    //var choose = ["images/Mosquito.png", "images/Mosquito2.png"];

    this.x = position.x;
    this.y = position.y;
    this.width = 32;
    this.height = 32;
    this.health = 70;
    this.damage = 100;
    this.points = 100;
    this.speed = Math.random() * (260 - 220) + 220;
    this.sizex = 32;
    this.sizey = 32;
    //this.monsterImage = new Image();
    this.monsterImage = "images/Mosquito.png";

    this.timing = 1;
    this.sound = 13;
    this.flag = "mosquitoPlay";
    this.flockSize = 5;



};
Mosquito.prototype = Object.create(MonsterMove2.prototype);


var Mosquito2 = function (position) {

    //var choose = ["images/Mosquito.png", "images/Mosquito2.png"];

    this.x = position.x;
    this.y = position.y;
    this.width = 20;
    this.height = 20;
    this.health = 80;
    this.damage = 100;
    this.points = 70;
    this.speed = Math.random() * (290 - 260) + 260;
    this.sizex = 32;
    this.sizey = 32;
    this.flockSize = 6;
    //this.monsterImage = new Image();
    this.monsterImage = "images/Mosquito2.png";

    this.timing = 1;
    this.sound = 13;
    this.flag = "mosquito2Play";
    this.flockSize = 5;


};
Mosquito2.prototype = Object.create(MonsterMove2.prototype);


var JellyGreen = function (position) {

    this.x = position.x;
    this.y = position.y;
    this.width = 50;
    this.height = 34;
    this.health = 1600;
    this.damage = 300;
    this.points = 1000;
    this.speed = Math.random() * (30 - 10) + 10;
    this.sizex = 50;
    this.sizey = 47;
    this.shooter = true;
    this.bbspeed = 9;
    this.monsterImage = "images/JellyGreen.png";
    this.token = "jellygreenShoot";
    this.sound = 30;
    this.timing = 16;
    this.barTiming = 4;
    this.bbspeed = 6;
    this.bbDamage = 30;
    this.bbType = "enemy1";
    this.flockSize = 3;
    this.flag = "jellygreenPlay";
    this.channel = gainNode5;
    this.isPowerDrop = true;

    this.shootRhythm = function () {
        return !!((barNumberL === 0 || barNumberL === 1) && (current16thNote === 5));
    };
};
JellyGreen.prototype = Object.create(MonsterShoot.prototype);


var Boulder = function (position) {

    var xx = Math.random() * (86 - 16) + 16;
    this.x = position.x;
    this.y = position.y;
    this.width = xx;
    this.height = xx;
    this.health = 40;
    this.damage = 2;
    this.points = 1;
    this.speed = Math.random() * (4 - 1) + 1;
    //this.speed = 200;
    this.sizex = xx;
    this.sizey = xx;
    //this.monsterImage = new Image();
    this.monsterImage = "images/Boulder.png";

    this.timing = 1;
    this.sound = 8;
    this.flag = "boulderPlay";


};
Boulder.prototype = Object.create(MonsterFly.prototype);

//var monsterz = [Fish, Beetle, Prawn, Bug, Shark, Mosquito];


function Planet() {
}
Planet.prototype = {

    isDead: false,
    fx: "delay",
    hitSound: 9,
    dieSound: 18,
    maxGain: 0.17,
    midGain: 0.05,
    health: 15000,
    radius: 64,
    points: 50000,
    height: 128,
    width: 128,
    sizex: 128,
    sizey: 128,
    planetDice: false,

    //xcenter: this.x + (this.width / 2),
    //ycenter: this.y + (this.height / 2),


    update: function () {

        if (this.health <= 0) {
            this.isDead = true;
            window[this.token] = false;
            //console.log("planet1 :  " + planet1play + "  " + "planet2 :  " + planet2play + "  " + "planet3 :  " + planet3play + "  ");
        }


        if (this.isDead) {
            if (barNumber % this.timing === 0) {
                if (current16thNote === 0) {
                    score += this.points;
                    var index = planets.indexOf(this);
                    planets.splice(index, 1);
                    playSound(samplebb[this.dieSound], this.channel);
                }
            }
        }
    },

    render: function (ctx) {
        if (this.isDead === false) {
            ctx.drawImage(resources.get(this.monsterImage), this.x, this.y, this.sizex, this.sizey);
        } else if (this.isDead === true) {
            ctx.save();
            ctx.globalAlpha = 0.4;
            ctx.drawImage(resources.get(this.monsterImage), this.x, this.y, this.sizex, this.sizey);
            ctx.restore();
        }
    },

    xCenter: function () {
        return this.x + this.width / 2;
    },

    yCenter: function () {
        return this.y + this.height / 2;
    }


};


function MonsterPlay() {
}
MonsterPlay.prototype = Object.create(Planet.prototype);
MonsterPlay.prototype.playLoop = function () {

    var that = this;

    var monstervector = {
        x: Math.round(this.x - hero.x),
        y: Math.round(this.y - hero.y)
    };
    monstervector.length = Math.sqrt((monstervector.x * monstervector.x) + (monstervector.y * monstervector.y));

    //console.log(monstervector.length);

    if (monstervector.length > 1500) {
        that.channel.gain.value = 0;
    }
    else if (monstervector.length < 1500 && monstervector.length > 500) {
        that.channel.gain.value = map_range(monstervector.length, 500, 1500, this.midGain, 0);
        //console.log(planet1gain.gain.value);
    } else if (monstervector.length < 500) {
        that.channel.gain.value = map_range(monstervector.length, 0, 500, this.maxGain, this.midGain);
        //console.log(planet1gain.gain.value);
    }
};


var PlanetMars = function () {
    this.x = 2900;
    this.y = 2900;
    this.monsterImage = 'images/PlanetMars.png';
    this.sound = 26;
    this.timing = 8;
    this.maxGain = 0.17;
    this.midGain = 0.05;
    this.channel = planet1gain;
    this.token = "planet1play";
};
PlanetMars.prototype = Object.create(MonsterPlay.prototype);

var PlanetBlue1 = function () {
    this.x = 3500;
    this.y = 3500;
    this.monsterImage = 'images/PlanetBlueX.png';
    this.sound = 27;
    this.timing = 16;
    this.channel = planet2gain;
    this.token = "planet2play";

};
PlanetBlue1.prototype = Object.create(MonsterPlay.prototype);

var PlanetBlue2 = function () {
    this.x = 3400;
    this.y = 4000;
    this.monsterImage = 'images/PlanetBlueHex2.png';
    this.sound = 29;
    this.timing = 16;
    this.channel = planet3gain;
    this.maxGain = 0.25;
    this.midGain = 0.10;
    this.token = "planet3play";
};
PlanetBlue2.prototype = Object.create(MonsterPlay.prototype);

var PlanetPinkMosaic = function () {
    this.x = 600;
    this.y = 4600;
    this.monsterImage = 'images/PlanetPink.png';
    this.sound = 10;
    this.timing = 4;
    this.channel = planet4gain;
    this.maxGain = 0.25;
    this.midGain = 0.10;
    this.token = "planet4play";
};
PlanetPinkMosaic.prototype = Object.create(MonsterPlay.prototype);

var PlanetFlute = function () {
    this.x = 2300;
    this.y = 2000;
    this.monsterImage = 'images/Planet6.png';
    this.sound = 32;
    this.timing = 8;
    this.channel = planet5gain;
    this.maxGain = 0.25;
    this.midGain = 0.10;
    this.token = "planet5play";
};
PlanetFlute.prototype = Object.create(MonsterPlay.prototype);

var PlanetCoconut = function () {
    this.x = 1400;
    this.y = 3500;
    this.monsterImage = 'images/PlanetPink2.png';
    this.sound = 22;
    this.timing = 1;
    this.channel = planet6gain;
    this.maxGain = 0.25;
    this.midGain = 0.10;
    this.token = "planet6play";
};
PlanetCoconut.prototype = Object.create(MonsterPlay.prototype);

var PlanetBreakbeat = function () {
    this.x = 2900;
    this.y = 4500;
    this.monsterImage = 'images/Planet9.png';
    this.soundMin = 33;
    this.soundMax = 40;
    this.timing = 2;
    this.channel = planet7gain;
    this.maxGain = 0.25;
    this.midGain = 0.10;
    this.token = "planet7play";
    this.planetDice = true;
};
PlanetBreakbeat.prototype = Object.create(MonsterPlay.prototype);

var PlanetWarble = function () {
    this.x = 1700;
    this.y = 700;
    this.monsterImage = 'images/Planet10.png';
    this.soundMin = 49;
    this.soundMax = 50;
    this.timing = 8;
    this.channel = planet8gain;
    this.maxGain = 0.25;
    this.midGain = 0.10;
    this.token = "planet8play";
    this.planetDice = true;
};
PlanetWarble.prototype = Object.create(MonsterPlay.prototype);

var PlanetPlink = function () {
    this.x = 700;
    this.y = 1000;
    this.monsterImage = 'images/Planet4.png';
    this.soundMin = 51;
    this.soundMax = 54;
    this.timing = 4;
    this.channel = planet9gain;
    this.maxGain = 0.4;
    this.midGain = 0.2;
    this.token = "planet9play";
    this.planetDice = true;
};
PlanetPlink.prototype = Object.create(MonsterPlay.prototype);

var PlanetFlange = function () {
    this.x = 4500;
    this.y = 1000;
    this.monsterImage = 'images/Planet8.png';
    this.sound = 55;
    this.timing = 8;
    this.channel = planet10gain;
    this.maxGain = 0.4;
    this.midGain = 0.2;
    this.token = "planet10play";
};
PlanetFlange.prototype = Object.create(MonsterPlay.prototype);

var PlanetBlobby = function () {
    this.x = 450;
    this.y = 1900;
    this.monsterImage = 'images/Planet5.png';
    this.soundMin = 56;
    this.soundMax = 57;
    this.timing = 4;
    this.channel = planet11gain;
    this.maxGain = 0.4;
    this.midGain = 0.2;
    this.token = "planet11play";
    this.planetDice = true;
};
PlanetBlobby.prototype = Object.create(MonsterPlay.prototype);


//function Powerup() {
//}
//Powerup.prototype = {
//
//    isDead: false,
//    fx: "delay",
//
//    update: function () {
//
//        var that = this;
//
//        if (this.health <= 0) {
//            this.isDead = true;
//        }
//
//        if (this.isDead === false) {
//
//            collide(hero, this, true, function (collides) {
//                if (collides === true) {
//                    that.powerUp();
//                    that.isDead = true;
//                }
//            });
//        }
//
//        if (barNumber % this.barTiming === 0)
//            if (current16thNote % this.timing === 0) {
//                score += this.points;
//                var index = powers.indexOf(this);
//                powers.splice(index, 1);
//                //this.toRemove = true;
//                //samplebb[this.sound].ready = false;
//                if (this.fx === "delay") {
//                    playSoundDelay(samplebb[this.sound], this.channel);
//                } else {
//                    playSound(samplebb[this.sound], this.channel);
//                }
//            }
//
//    },
//
//    render: function (ctx) {
//        if (this.isDead === false) {
//            ctx.drawImage(resources.get(this.powerImage), this.x, this.y, this.sizex, this.sizey);
//        } else if (this.isDead === true) {
//            ctx.save();
//            ctx.globalAlpha = 0.4;
//            ctx.drawImage(resources.get(this.powerImage), this.x, this.y, this.sizex, this.sizey);
//            ctx.restore();
//        }
//    }
//
//};


var HealthUp = function (x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.health = 10;
    this.damage = 0;
    this.points = 0;
    this.speed = 0;
    this.sizex = 32;
    this.sizey = 32;
    this.monsterImage = "images/HeartGreen.png";
    this.sound = 17;
    this.timing = 1;
    this.flag = "healthUpPlay";
    this.isPowerUp = true;
    this.powerUp = function () {
        hero.health += 200;
    };
};
HealthUp.prototype = Object.create(Monster.prototype);


var Bullet = function (x, y, damage, type) {

    this.damage = typeof damage !== 'undefined' ? damage : 10;
    this.x = x;
    this.y = y;
    this.velocity = [0, 0];
    this.angle = 0;
    this.type = typeof type !== 'undefined' ? type : "hero";
    //this.type = "spear",
    //this.speed = 1000
    //this.eX = eX,
    //this.eY = eY
    //this.damage = damage
};

Bullet.prototype = {

    width: 8,
    height: 8,

    update: function () {

        var that = this;


        this.x += this.velocity[0];
        this.y += this.velocity[1];
        //for(var i in planets) {
        //    var planet = planets[i];
        //    collide(this, planet, true, function (collides) {
        //        if (collides === true) {
        //            planet.health -= that.damage;
        //            var index = bullets.indexOf(that);
        //            bullets.splice(index, 1);
        //            playSound(samplebb[planet.sound], gainNode5);
        //        }
        //    }, 2);
        //}
        //
        //if (this.type !== "hero") {
        //    collide(this, hero, true, function (collides) {
        //        if (collides === true) {
        //            hero.health -= that.damage;
        //            var index = bullets.indexOf(that);
        //            bullets.splice(index, 1);
        //        }
        //    }, 2);
        //}
        //else if (this.type === "hero") {
        //    for (var y = 0, m = monsters.length; y < m; ++y) {
        //        var monst = monsters[y];
        //
        //        collide(this, monst, true, function (collides) {
        //            if (collides === true) {
        //                monst.health -= that.damage;
        //                var index = bullets.indexOf(that);
        //                bullets.splice(index, 1);
        //            }
        //        }, 2);
        //    }
        //}

        for (var i in planets) {
            var planet = planets[i];
            //var collides;
            //if (
            //    this.x > planet.x + planet.width ||
            //    this.x + planet.width / 2 < planet.x ||
            //    this.y > planet.y + planet.height ||
            //    this.y + planet.height / 2 < planet.y
            //) {
            //    collides1 = false;
            //} else {
            //    collides1 = true;
            //}
            //if (collides1 === true) {
            //    var index = bullets.indexOf(this);
            //    bullets.splice(index, 1);
            //    if (this.type === "hero") {
            //        planet.health -= this.damage;
            //        playSound(samplebb[planet.hitSound], gainNode4);
            //
            //    }
            //}

            //collide(this, planet, true, function (collides) {
            //    if (collides === true) {
            //
            //        var index = bullets.indexOf(this);
            //        bullets.splice(index, 1);
            //        if (this.type === "hero") {
            //            playSound(samplebb[planet.hitSound], gainNode4);
            //            planet.health -= 100;
            //
            //        }
            //    }
            //}, 2);

            if (circleCollide(planet, this)) {
                var index = bullets.indexOf(this);
                bullets.splice(index, 1);
                if (this.type === "hero") {
                    playSound(samplebb[planet.hitSound], gainNode4);
                    planet.health -= 100;
                }
            }
        }

        if (this.type !== "hero") {
            var collides1;
            if (
                this.x > hero.x + hero.width ||
                this.x + hero.width / 2 < hero.x ||
                this.y > hero.y + hero.height ||
                this.y + hero.height / 2 < hero.y
            ) {
                collides1 = false;
            } else {
                collides1 = true;
            }
            if (collides1 === true) {
                hero.health -= this.damage;
                var index = bullets.indexOf(this);
                bullets.splice(index, 1);
            }
        }

        else if (this.type === "hero") {
            for (var y = 0, m = monsters.length; y < m; ++y) {
                var monst = monsters[y];
                if (!monst.isPowerUp) {
                    if (
                        this.x > monst.x + monst.width ||
                        this.x + monst.width / 2 < monst.x ||
                        this.y > monst.y + monst.height ||
                        this.y + monst.height / 2 < monst.y
                    ) {
                        collides = false;
                    }
                    else {
                        collides = true;
                    }
                    if (collides === true && monst.isDead === false) {
                        monst.health -= this.damage;
                        var index = bullets.indexOf(this);
                        if (bulletpiercePower === false) {
                            bullets.splice(index, 1);
                        }
                    }
                }
            }
        }


        var playerdist = {x: this.x - hero.x, y: this.y - hero.y};
        playerdist.length = Math.sqrt((playerdist.x * playerdist.x) + (playerdist.y * playerdist.y));

        // BULLET DISAPPEAR WHEN FAR AWAY
        if (playerdist.length > 1000) {
            var index = bullets.indexOf(this);
            bullets.splice(index, 1);
        }
    }
}


// Game objects
var hero = {
    x: 3000,
    y: 3000,

    velY: 0,
    velX: 0,
    //speed: 50,
    friction: 0.8,


    width: 60,
    height: 20,
    health: 2000,
    speed: 300 // pixels per second
    //
    //update: function () {
    //
    //    this.velY *= this.friction;
    //    this.y += this.velY;
    //    this.velX *= this.friction;
    //    this.x += this.velX;
    //}
};

//function damagePlayer(amt) {
//    hero.health -= amt;
//}
//})();
