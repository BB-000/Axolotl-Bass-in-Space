//(function() {
var bullets = [];

var sharkShoot = false;
var eelShoot = false;
var planet1play = true;


function Monster() {}
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
    flockSize : 5,

    update: function () {

        var that = this;

        if (this.health <= 0) {
            this.isDead = true;
        }

        if (this.isDead === false) {

            for (var x = 0, l = monsters.length; x < l; x++) {
                var monst = monsters[x];
                if (monst.x !== this.x && monst.y !== this.y && monst.isDead === false) {
                    collide(this, monst, true);
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

        else if (this.isDead === true) {
            if (this.shooter) {
                //this.playing = false;
                if (this.token === "shark") {
                    sharkShoot = false;
                }
                else if (this.token === "eel") {
                    eelShoot = false;
                    //console.log(eelShoot + "eelshoot false/?");
                }
            }

            if (barNumber % this.barTiming === 0)
                if (current16thNote % this.timing === 0) {
                    //var index = monsters.indexOf(this);
                    //monsters.splice(index, 1);

                    this.toRemove = true;
                    //samplebb[this.sound].ready = false;

                    if (gameOver === false) {
                        score += this.points;
                        if (this.fx === "delay") {
                            playSoundDelay(samplebb[this.sound], this.channel);
                        } else {
                            playSound(samplebb[this.sound], this.channel);
                        }
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

    getFlock: function() {
        return this.flockSize;
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

function MonsterMove2() {}
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
//MonsterMove2.prototype.getFlock = function () {
//
//    return this.flockSize;
//};






function MonsterShoot() {}
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


function MonsterFly() {}
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
    this.flockSize = 3;
    //this.resolution = bar4Number;

};
Fish.prototype = Object.create(MonsterMove2.prototype);

var Worm = function (position) {

    this.x = position.x;
    this.y = position.y;
    this.width = 100;
    this.height = 24;
    this.health = 300;
    this.damage = 100;
    this.points = 90;
    this.speed = Math.random() * (150 - 100) + 100;
    this.sizex = 100;
    this.sizey = 24;
    //this.monsterImage = new Image();
    this.monsterImage = "images/Hero.png";
    this.sound = 17;
    this.timing = 16;
};
Worm.prototype = Object.create(MonsterMove2.prototype);


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
    this.flockSize = 8;

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
    this.timing = 1;
    this.token = "eel";
    this.shooter = true;
    this.bbspeed = 5;
    this.bbDamage = 20;
    this.bbType = "enemy2";
    this.flockSize = 8;

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
    this.token = "shark";
    this.sound = 14;
    this.timing = 16;
    this.barTiming = 4;
    this.bbspeed = 11;
    this.bbDamage = 50;
    this.bbType = "enemy1";
    this.flockSize = 1;
};
Shark.prototype = Object.create(MonsterShoot.prototype);


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

};
Mosquito.prototype = Object.create(MonsterMove2.prototype);


var Mosquito2 = function (position) {

    //var choose = ["images/Mosquito.png", "images/Mosquito2.png"];

    this.x = position.x;
    this.y = position.y;
    this.width = 20;
    this.height = 20;
    this.health = 100;
    this.damage = 100;
    this.points = 125;
    this.speed = Math.random() * (250 - 210) + 210;
    this.sizex = 32;
    this.sizey = 32;
    //this.monsterImage = new Image();
    this.monsterImage = "images/Mosquito2.png";

    this.timing = 1;
    this.sound = 13;

};
Mosquito2.prototype = Object.create(MonsterMove2.prototype);


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

};
Boulder.prototype = Object.create(MonsterFly.prototype);

//var monsterz = [Fish, Worm, Prawn, Bug, Shark, Mosquito];



function Planet() {}
Planet.prototype = {

    isDead: false,
    fx : "delay",
    //playing: false,
    //barTiming: 1,
    //follow: true,
    //toRemove: false,
    //channel: gainNode3,
    //fx: "delay",
    //shooter: false,
    //barbulletTiming: 1,
    //flockSize : 5,


    update: function () {



        //if (this.isDead === false) {
        //
        //    //this.shoot();
        //
        //    for (var x = 0, l = monsters.length; x < l; x++) {
        //        var monst = monsters[x];
        //        if (monst.x !== this.x && monst.y !== this.y && monst.isDead === false) {
        //            collide(this, monst, true);
        //        }
        //    }
        //
        //}


        //if (barNumber % this.barTiming === 0)
        //    if (current16thNote % this.timing === 0) {
        //        score += this.points;
        //        var index = planets.indexOf(this);
        //        planets.splice(index, 1);
        //        //this.toRemove = true;
        //        //samplebb[this.sound].ready = false;
        //        if (this.fx === "delay") {
        //            playSoundDelay(samplebb[this.sound], this.channel);
        //        } else {
        //            playSound(samplebb[this.sound], this.channel);
        //        }
        //    }


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
    }

};




function MonsterPlay() {}
MonsterPlay.prototype = Object.create(Planet.prototype);
MonsterPlay.prototype.playLoop = function () {

    var monstervector = {
        x: Math.round(this.x - hero.x),
        y: Math.round(this.y - hero.y)
    };
    monstervector.length = Math.sqrt((monstervector.x * monstervector.x) + (monstervector.y * monstervector.y));

    //console.log(monstervector.length);

    //if(monstervector.length > 1500){
    //    planet1gain.gain.value = 0;
     if(monstervector.length < 1500 && monstervector.length > 500) {
        planet1gain.gain.value = map_range(monstervector.length, 500, 1500, 0.04, 0);
        //console.log(planet1gain.gain.value);
    } else if(monstervector.length < 500){
        planet1gain.gain.value = map_range(monstervector.length, 0, 500, 0.15, 0.04);
        //console.log(planet1gain.gain.value);
    }
};


var PlanetMars = function () {

    this.x = 2900;
    this.y = 2900;
    this.width = 128;
    this.height = 128;
    this.health = 1000;
    this.damage = 50;
    this.points = 50000;
    this.speed = Math.random() * (190 - 70) + 70;
    this.sizex = 128;
    this.sizey = 128;
    //this.monsterImage = new Image();
    this.monsterImage = 'images/PlanetMars.png';
    //this.shooter = true,
    //    this.bulletTiming = 2,
    //?
    this.sound = 9;
    //this.shootSound = 0;
    this.timing = 4;
    this.flockSize = 1;
    //this.resolution = bar4Number;

};
PlanetMars.prototype = Object.create(MonsterPlay.prototype);






function Powerup() {}
Powerup.prototype = {

    isDead: false,
    fx : "delay",

    update: function () {

        var that = this;

        if (this.health <= 0) {
            this.isDead = true;
        }

        if (this.isDead === false) {

            //this.shoot();

            for (var x = 0, l = powers.length; x < l; x++) {
                var monst = powers[x];
                if (monst.x !== this.x && monst.y !== this.y && monst.isDead === false) {
                    collide(this, monst, true);
                }
            }

            collide(hero, this, true, function (collides) {
                if (collides === true) {
                    that.powerup();
                    that.isDead = true;
                    //console.log("damage"+this.damage);
                    //console.log(collides);
                }
            });
        }

            if (barNumber % this.barTiming === 0)
                if (current16thNote % this.timing === 0) {
                    score += this.points;
                    var index = powers.indexOf(this);
                    powers.splice(index, 1);

                    //this.toRemove = true;
                    //samplebb[this.sound].ready = false;
                    if (this.fx === "delay") {
                        playSoundDelay(samplebb[this.sound], this.channel);
                    } else {
                        playSound(samplebb[this.sound], this.channel);
                    }
                }


    },

    render: function (ctx) {
        if (this.isDead === false) {
            ctx.drawImage(resources.get(this.powerImage), this.x, this.y, this.sizex, this.sizey);
        } else if (this.isDead === true) {
            ctx.save();
            ctx.globalAlpha = 0.4;
            ctx.drawImage(resources.get(this.powerImage), this.x, this.y, this.sizex, this.sizey);
            ctx.restore();
        }
    }

};






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



        for(var i in planets) {
            var planet = planets[i];
            collide(this, planet, true, function (collides) {
                if (collides === true) {
                    planet.health -= that.damage;
                    var index = bullets.indexOf(that);
                    bullets.splice(index, 1);
                    if(that.type === "hero") {
                        playSound(samplebb[planet.sound], gainNode4);
                    }
                }
            }, 2);
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
                }  else {
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
                    if(bulletpiercePower === false) {
                        bullets.splice(index, 1);
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
    width: 60,
    height: 20,
    health: 1000,
    speed: 250 // pixels per second
};

//function damagePlayer(amt) {
//    hero.health -= amt;
//}
//})();
