var bullets = [];

var sharkShoot = false;
var bugShoot = false;
var jellyShoot = false;
var jellygreenShoot = false;
var wizardShoot = false;
var wizardgreenShoot = false;
var jellypurpleShoot = false;
var masterblasterShoot = false;

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
var gunUpPlay = false;
var slowPotionPlay = false;
var wizardPlay = false;
var wizardgreenPlay = false;
var jellypurplePlay = false;
var masterblasterPlay = false;

var enemyKillCount = 0;

function Npc() {}
Npc.prototype = {

    isDead: false,
    playing: false,
    barTiming: 1,
    follow: true,
    toRemove: false,
    channel: gainNode3D,
    fx: "delay",
    shooter: false,
    barbulletTiming: 1,
    flockSize: 4,
    healthdrop: false,
    isPowerUp: false,
    isPowerDrop: false,
    spriteAnim: false,

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

            collide(this, hero, true, function (collides) {
                if (collides === true) {
                    hero.health -= that.damage;
                    that.isDead = true;
                    xhealth.innerHTML = ("Space Health: " + hero.health);
                }
            });
        }

        //       ******  DEAD ENEMIES STACK  *******        //
        else if (this.isDead === true) {
            if(this.spriteAnim === true){
                // set sprite frames to new ones
                this.sprite.frames = this.dieFrames;
            }
            if (window[this.flag] === false) {
                if (this.timing()) {                                                                                    // Wait for cue...
                    this.toRemove = true;


                    if (this.isPowerUp) {
                        this.powerUp();                                                                                 // Apply powerup if powerup
                    }
                    // Update counter ( not boulders )
                    if (this.points > 2) {
                        enemyKillCount += 1;
                    }
                    if (gameOver === false) {
                        score += this.points;
                        xscore.innerHTML = ("Space Cash: " + score);
                        window[this.flag] = true;                                                                       // Stop other duplicate sounds
                        if (this.isPowerDrop) {
                            var power = new HealthUp(this.x, this.y);                                                   // Drop Health?
                            monsters.push(power);
                        }
                        setTimeout(function () {
                            window[that.flag] = false;                                                                  // Set same entities ready to play
                        }, 200);

                        if (this.fx === "delay") {
                            playSoundDelay(samplebb[this.sound], this.channel);
                        } else {
                            playSound(samplebb[this.sound], this.channel);
                        }
                    }
                }
            }

            if (this.shooter) {
                window[this.token] = false;                                                                             // Stop shootsound if dead
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
        

    if(this.spriteAnim === false) {

        if (this.isDead === false) {
            ctx.mozImageSmoothingEnabled = false;                                                                       // Stop browsers Anti Aliasing pixel art!
            ctx.webkitImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;

            ctx.drawImage(resources.get(this.monsterImage), this.x, this.y, this.width, this.height);
        } else if (this.isDead === true) {
            ctx.save();
            ctx.globalAlpha = 0.4;
            ctx.drawImage(resources.get(this.monsterImage), this.x, this.y, this.width, this.height);
            ctx.restore();
        }
    } else {    

          if (this.isDead === false) {
            ctx.mozImageSmoothingEnabled = false;                                                                       // Stop browsers Anti Aliasing pixel art!
            ctx.webkitImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;

            ctx.save();
            ctx.translate(this.x, this.y);
            // console.log(this.x, this.y);
            this.sprite.render(ctx, this.sizex, this.sizey);
            ctx.restore();
          } else if (this.isDead === true) {
              ctx.save();
              ctx.globalAlpha = 0.5;
              ctx.translate(this.x, this.y);
              // Make this work // Push to explosions? 
              this.sprite.render(ctx, this.sizex, this.sizey);
              ctx.restore();
          }  
    }
    },

    getFlock: function () {
        return this.flockSize;
    }


};

function MonsterChase() {}
MonsterChase.prototype = Object.create(Npc.prototype);
MonsterChase.prototype.move = function (dt) {

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
        this.x += this.speedX * dt * speedMod;
        this.y += this.speedY * dt * speedMod;
    };
};

function MonsterRun() {
}
MonsterRun.prototype = Object.create(Npc.prototype);
MonsterRun.prototype.move = function (dt) {

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
        var monstervector = {x: Math.round(this.x - hero.x), y: Math.round(this.y - hero.y)};
        monstervector.length = Math.sqrt((monstervector.x * monstervector.x) + (monstervector.y * monstervector.y));  // Length of the vector
        if (monstervector.length < 200 && this.x > 0 && this.y > 0 && this.x < 5000 && this.y < 5000) {
            this.x -= this.speedX * dt;
            this.y -= this.speedY * dt;
        } else if (monstervector.length > 200 && monstervector.length < 600 && this.x > 0 && this.y > 0 && this.x < 5000 && this.y < 5000) {
            this.x -= (this.speedX / 2) * dt;
            this.y -= (this.speedY / 2) * dt;
        } else if (monstervector.length > 600) {
            this.x += this.speedX * dt;
            this.y += this.speedY * dt;
        }
    };
};


function MonsterShoot() {}
MonsterShoot.prototype = Object.create(MonsterChase.prototype);
MonsterShoot.prototype.shoot = function () {

    var monstervector = {x: Math.round(this.x - hero.x), y: Math.round(this.y - hero.y)};
    monstervector.length = Math.sqrt((monstervector.x * monstervector.x) + (monstervector.y * monstervector.y));  // Length of the vector

    if (monstervector.length < 1000) {
        var bullet = new Bullet(this.x + this.width / 2, this.y + this.height / 2, this.bbDamage, this.bbType);
        var vector = {x: hero.x - this.x, y: hero.y - this.y};
        vector.length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        bullet.velocity = [(vector.x / vector.length) * this.bbspeed, (vector.y / vector.length) * this.bbspeed];
        bullet.angle = Math.atan2(vector.y / vector.length, vector.x / vector.length);
        bullets.push(bullet);
        //console.log("shot!!");
    }
};


function MonsterFly() {}
MonsterFly.prototype = Object.create(Npc.prototype);
MonsterFly.prototype.move = function (dt) {

    this.speedX = this.speed * 6 * speedMod;
    this.speedY = this.speed * 2 * speedMod;
    this.x += this.speedX;
    this.y += this.speedY;

    var playerdist = {x: this.x - hero.x, y: this.y - hero.y};
    playerdist.length = Math.sqrt((playerdist.x * playerdist.x) + (playerdist.y * playerdist.y));

    if (playerdist.length > 6000) {
        this.toRemove = true;
    }
};

//Prawn.prototype = Object.create(Npc.prototype);

var Fish = function (position) {
    this.x = position.x;
    this.y = position.y;
    this.width = 32;
    this.height = 32;
    this.health = 20;
    this.damage = 100;
    this.points = 50;
    this.speed = Math.random() * (190 - 70) + 70;
    this.sizex = 32;
    this.sizey = 32;
    this.monsterImage = 'images/Fish.png';
    this.sound = Math.floor((Math.random() * 2) + 19);
    this.flockSize = 5;
    this.flag = "fishPlay";
    this.channel = gainNode3E;
    this.timing = function () {
        return !!current16thNote % 4 === 0;
    };

};
Fish.prototype = Object.create(MonsterChase.prototype);

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
    this.monsterImage = "images/BeetleBlue.png";
    this.sound = 17;
    this.timing = 16;
    this.flag = "wormPlay";
    this.flockSize = 3;
    this.timing = function () {
        return !!current16thNote % 16 === 0;
    };
};
Beetle.prototype = Object.create(MonsterChase.prototype);


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
    this.monsterImage = "images/Prawn.png";
    this.sound = 83;
    this.flockSize = 3;
    this.flag = "prawnPlay";
    this.fx = "none";
    this.channel = gainNode3B;
    this.timing = function () {
        return !!(barNumber % 4 === 0 && current16thNote % 16 === 0);
    };
};
Prawn.prototype = Object.create(MonsterChase.prototype);


var Bug = function (position) {
    var xx = Math.floor(Math.random() * (82 - 12 + 1) + 12);
    this.x = position.x;
    this.y = position.y;
    this.width = xx;
    this.height = xx;
    this.health = Math.floor(Math.random() * (160 - 50 + 1) + 50);
    this.damage = 100;
    this.points = 400;
    this.speed = Math.floor(Math.random() * (180 - 100 + 1) + 100);
    this.sizex = xx;
    this.sizey = xx;
    this.monsterImage = "images/PrawnYellow.png";
    this.spriteAnim = true,
    this.sprite = new Sprite('Spritesheets/YellowBeetle-Wiggle-Var2-flash2__8fps-long.png', [0, 0], [19, 16], 8, [0,1,2,3,4,5,6,7]);
    this.spriteDie = new Sprite('Spritesheets/YellowBeetle-Wiggle-Var2-flash2__8fps-long.png', [0, 0], [19, 16], 8, [0,1,2,3,4,5,6,7]);
    this.sound = rand(5, 7);
    this.name = "bug";
    this.shooter = true;
    this.bbspeed = 5;
    this.bbDamage = 25;
    this.bbType = "enemy2";
    this.flockSize = 4;
    this.flag = "bugPlay";
    this.token = "bugShoot";
    this.timing = function () {
        return !!current16thNote % 1 === 0;
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
    this.health = 1900;
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
    this.bbspeed = 8;
    this.bbDamage = 50;
    this.bbType = "enemy1";
    this.flockSize = 1;
    this.flag = "sharkPlay";
    this.timing = function () {
        return !!(barNumber % 4 === 0 && current16thNote % 16 === 0);
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
    this.damage = 300;
    this.points = 1000;
    this.speed = Math.random() * (60 - 10) + 10;
    this.sizex = 40;
    this.sizey = 42;
    this.shooter = true;
    this.monsterImage = "images/JellyOrange.png";
    this.token = "jellyShoot";
    this.sound = 30;
    this.bbspeed = 6;
    this.bbDamage = 25;
    this.bbType = "enemy2";
    this.flockSize = 2;
    this.flag = "jellyorangePlay";
    this.channel = gainNode5;
    this.timing = function () {
        return !!(barNumber % 4 === 0 && current16thNote % 16 === 0);
    };
    this.shootRhythm = function () {
        return !!((bar4Number % 2 === 0) && (current64thNote === 29 || current64thNote === 30 || current64thNote === 31 || current64thNote === 32 || current64thNote === 33 ||
        current64thNote === 34 || current64thNote === 36 || current64thNote === 36 || current64thNote === 38 || current64thNote === 39 || current64thNote === 40 ||
        current64thNote === 41 || current64thNote === 42 || current64thNote === 43 || current64thNote === 45 || current64thNote === 47));
    };
};
JellyOrange.prototype = Object.create(MonsterShoot.prototype);


var Mosquito = function (position) {
    this.x = position.x;
    this.y = position.y;
    this.width = 16;
    this.height = 16;
    this.health = 50;
    this.damage = 50;
    this.points = 100;
    this.speed = rand(220, 280);
    this.sizex = 16;
    this.sizey = 16;
    this.monsterImage = "images/Mosquito.png";
    this.sound = 13;
    this.flag = "mosquitoPlay";
    this.flockSize = 6;
    this.timing = function () {
        return !!current16thNote % 1 === 0;
    };
};
Mosquito.prototype = Object.create(MonsterChase.prototype);


var Mosquito2 = function (position) {
    this.x = position.x;
    this.y = position.y;
    this.width = 32;
    this.height = 32;
    this.health = 80;
    this.damage = 80;
    this.points = 100;
    this.speed = rand(250, 270);
    this.sizex = 32;
    this.sizey = 32;
    this.monsterImage = "images/Mosquito2.png";
    this.timing = function () {
        return !!current16thNote % 2 === 0;
    };
    this.sound = rand(76, 77);
    this.flag = "mosquito2Play";
    this.flockSize = 4;
    this.channel = gainNode3E;

};
Mosquito2.prototype = Object.create(MonsterChase.prototype);


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
    this.monsterImage = "images/JellyGreen.png";
    this.token = "jellygreenShoot";
    this.sound = 70;
    this.timing = function () {
        return !!(barNumber % 4 === 0 && current16thNote % 16 === 0);
    };
    this.bbspeed = 9;
    this.bbDamage = 50;
    this.bbType = "enemy1";
    this.flockSize = 1;
    this.flag = "jellygreenPlay";
    this.channel = gainNode5;
    this.isPowerDrop = true;
    this.shootRhythm = function () {
        return !!((barNumberL === 0 || barNumberL === 1) && (current16thNote === 5));
    };
};
JellyGreen.prototype = Object.create(MonsterShoot.prototype);


var JellyPurple = function (position) {

    this.x = position.x;
    this.y = position.y;
    this.width = 50;
    this.height = 34;
    this.health = 650;
    this.damage = 180;
    this.points = 1000;
    this.speed = rand(120, 200);
    this.sizex = 50;
    this.sizey = 47;
    this.shooter = true;
    this.monsterImage = "images/JellyPurple.png";
    this.token = "jellypurpleShoot";
    this.sound = 75;
    this.timing = function () {
        return !!current16thNote % 16 === 0;
    };
    this.bbspeed = 6;
    this.bbDamage = 30;
    this.bbType = "enemy1";
    this.flockSize = 5;
    this.flag = "jellypurplePlay";
    this.channel = gainNode3D;
    this.shootRhythm = function () {
        return !!((barNumberL === 0 || barNumberL === 1) && (current64thNote < 32 && current64thNote % 4 === 0));
    };
};
JellyPurple.prototype = Object.create(MonsterShoot.prototype);


var Wizard = function (position) {

    this.x = position.x;
    this.y = position.y;
    this.width = 28;
    this.height = 88;
    this.health = 2000;
    this.damage = 200;
    this.points = 1500;
    this.speed = rand(50, 150);
    this.sizex = 28;
    this.sizey = 88;
    this.shooter = true;
    this.monsterImage = "images/wizard.png";
    this.token = "wizardShoot";
    this.sound = 69;
    this.timing = function () {
        return !!(barNumber % 4 === 0 && current16thNote % 16 === 0);
    };
    this.bbspeed = 6;
    this.bbDamage = 50;
    this.bbType = "enemy1";
    this.flockSize = 2;
    this.flag = "wizardPlay";
    this.channel = gainNode5;
    this.filter = true;

    this.shootRhythm = function () {
        return !!((barNumberL === 0 || barNumberL === 1) && current16thNote <= 4);
    };
};
Wizard.prototype = Object.create(MonsterShoot.prototype);


var WizardGreen = function (position) {

    this.x = position.x;
    this.y = position.y;
    this.width = 56;
    this.height = 196;
    this.health = 5000;
    this.damage = 200;
    this.points = 6000;
    this.speed = rand(30, 50);
    this.sizex = 56;
    this.sizey = 196;
    this.shooter = true;
    this.monsterImage = "images/WizardGreen.png";
    this.token = "wizardgreenShoot";
    this.sound = 85;
    this.timing = function () {
        return !!(barNumber % 4 === 0 && current16thNote % 16 === 0);
    };
    this.bbspeed = 9;
    this.bbDamage = 50;
    this.bbType = "enemy2";
    this.flockSize = 1;
    this.fx = "none";
    this.flag = "wizardgreenPlay";
    this.channel = gainNode3B;
    this.isPowerDrop = true;
    this.shootRhythm = function () {
        return !!((bar4Number % 4 === 0) && (barNumberL === 0 || barNumberL === 1));
    };
};
WizardGreen.prototype = Object.create(MonsterShoot.prototype);


var MasterBlaster = function (position) {
    this.x = position.x;
    this.y = position.y;
    this.width = 64;
    this.height = 64;
    this.health = 4500;
    this.damage = 200;
    this.points = 5000;
    this.speed = rand(50, 120);
    this.sizex = 64;
    this.sizey = 64;
    this.shooter = true;
    this.bbspeed = 9;
    this.spriteAnim = true;
    // this.sprite = new Sprite('Spritesheets/MasterBlaster-blink__24fps.png', [0,0], [24, 22], 24, [0,1,2,3,4,5,6,7,8,9,10]);
    this.sprite = new Sprite('Spritesheets/MasterBlaster-Explode__24fps-short.png', [0,0], [24, 22], 24, [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,5,6,5,4,3,2,1,0]);
    this.dieFrames = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];
    this.monsterImage = "images/MasterBlaster.png";
    this.token = "masterblasterShoot";
    this.sound = 84;
    this.timing = function () {
        return !!(barNumber % 4 === 0 && current16thNote % 16 === 0);
    };
    this.bbspeed = 4;
    this.bbDamage = 25;
    this.bbType = "enemy2";
    this.flockSize = 2;
    this.flag = "masterblasterPlay";
    this.channel = gainNode5;
    this.shootRhythm = function () {
        return !!((bar4Number % 4 === 0) && (barNumberL === 0 || barNumberL === 1));
    };
};
MasterBlaster.prototype = Object.create(MonsterShoot.prototype);


var Boulder = function (position) {
    var xx = Math.random() * (112 - 16) + 16;
    this.x = position.x;
    this.y = position.y;
    this.width = xx;
    this.height = xx;
    this.health = 40;
    this.damage = 20;
    this.points = 1;
    this.speed = Math.random() * (4 - 1) + 1;
    this.sizex = xx;
    this.sizey = xx;
    this.monsterImage = "images/Boulder.png";
    this.timing = function () {
        return !!current16thNote % 1 === 0;
    };
    this.sound = 8;
    this.flag = "boulderPlay";
};
Boulder.prototype = Object.create(MonsterFly.prototype);


function Planet() {}
Planet.prototype = {

    isDead: false,
    fx: "delay",
    hitSound: 9,
    dieSound: 18,
    maxGain: 0.17,
    midGain: 0.05,
    health: 10000,
    radius: 64,
    points: 50000,
    height: 128,
    width: 128,
    planetDice: false,
    loop: true,

    update: function () {

        if (this.health <= 0) {
            this.isDead = true;
            window[this.token] = false;
        }

        if (this.isDead) {
            if (barNumber % this.timing === 0) {
                if (current16thNote === 0) {
                    score += this.points;
                    xscore.innerHTML = ("Space Cash: " + score);
                    var index = planets.indexOf(this);
                    planets.splice(index, 1);
                    playSound(samplebb[this.dieSound], this.channel);
                }
            }
        }
    },

    render: function (ctx) {
     
        if (this.isDead === false) {
            ctx.drawImage(resources.get(this.monsterImage), this.x, this.y, this.width, this.height);
        } else if (this.isDead === true) {
            ctx.save();
            ctx.globalAlpha = 0.4;
            ctx.drawImage(resources.get(this.monsterImage), this.x, this.y, this.width, this.height);
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


function PlanetPlay() {}
PlanetPlay.prototype = Object.create(Planet.prototype);
PlanetPlay.prototype.playLoop = function () {

    var that = this;

    var monstervector = {x: Math.round(this.x - hero.x), y: Math.round(this.y - hero.y)};
    monstervector.length = Math.sqrt((monstervector.x * monstervector.x) + (monstervector.y * monstervector.y));

    if (monstervector.length > 1500) {
        that.channel.gain.value = 0;
    } else if (monstervector.length < 1500 && monstervector.length > 500) {
        that.channel.gain.value = map_range(monstervector.length, 500, 1500, this.midGain, 0);
    } else if (monstervector.length < 500) {
        that.channel.gain.value = map_range(monstervector.length, 0, 500, this.maxGain, this.midGain);
    }
};


function PlanetFilter() {
}
PlanetFilter.prototype = Object.create(Planet.prototype);
PlanetFilter.prototype.playLoop = function () {

    var monstervector = {
        x: Math.round(this.xCenter() - hero.x),
        y: Math.round(this.yCenter() - hero.y)
    };
    monstervector.length = Math.sqrt((monstervector.x * monstervector.x) + (monstervector.y * monstervector.y));

    if (monstervector.length > 400) {
        lowpassFilter.frequency.value = 20000;
        lowpassFilter2.frequency.value = 20000;
    } else if (monstervector.length < 400) {
        lowpassFilter.frequency.value = map_range(monstervector.length, 0, 400, 0, 5000);
        lowpassFilter2.frequency.value = map_range(monstervector.length, 0, 400, 0, 5000);
    }
};

var BlackHole = function () {
    this.x = 2200;
    this.y = 3350;
    this.monsterImage = 'images/BlackHole.png';
    this.loop = false;
    this.width = 64;
    this.height = 64;
    this.radius = 32;
};
BlackHole.prototype = Object.create(PlanetFilter.prototype);

var PlanetMars = function () {
    this.x = 2900;
    this.y = 2900;
    this.monsterImage = 'images/PlanetMars.png';
    this.sound = 26;
    this.timing = 8;
    this.maxGain = 0.17;
    this.midGain = 0.05;
    this.channel = planet1gain;
};
PlanetMars.prototype = Object.create(PlanetPlay.prototype);

var PlanetBlue1 = function () {
    this.x = 3500;
    this.y = 3500;
    this.monsterImage = 'images/PlanetBlueX.png';
    this.sound = 27;
    this.timing = 16;
    this.channel = planet2gain;

};
PlanetBlue1.prototype = Object.create(PlanetPlay.prototype);

var PlanetBlue2 = function () {
    this.x = 3400;
    this.y = 4000;
    this.monsterImage = 'images/PlanetBlueHex2.png';
    this.sound = 29;
    this.timing = 16;
    this.channel = planet3gain;
    this.maxGain = 0.25;
    this.midGain = 0.10;
};
PlanetBlue2.prototype = Object.create(PlanetPlay.prototype);

var PlanetPinkMosaic = function () {
    this.x = 600;
    this.y = 4600;
    this.monsterImage = 'images/PlanetPink.png';
    this.sound = 10;
    this.timing = 4;
    this.channel = planet4gain;
    this.maxGain = 0.25;
    this.midGain = 0.10;
};
PlanetPinkMosaic.prototype = Object.create(PlanetPlay.prototype);

var PlanetFlute = function () {
    this.x = 2300;
    this.y = 2000;
    this.monsterImage = 'images/Planet6.png';
    this.sound = 32;
    this.timing = 8;
    this.channel = planet5gain;
    this.maxGain = 0.25;
    this.midGain = 0.10;
};
PlanetFlute.prototype = Object.create(PlanetPlay.prototype);

var PlanetCoconut = function () {
    this.x = 1400;
    this.y = 3500;
    this.monsterImage = 'images/PlanetPink2.png';
    this.sound = 22;
    this.timing = 1;
    this.channel = planet6gain;
    this.maxGain = 0.25;
    this.midGain = 0.10;
};
PlanetCoconut.prototype = Object.create(PlanetPlay.prototype);

var PlanetBreakbeat = function () {
    this.x = 2900;
    this.y = 4500;
    this.monsterImage = 'images/Planet9.png';
    this.soundMin = 33;
    this.soundMax = 40;
    this.timing = 2;
    this.channel = planet7gain;
    this.maxGain = 0.2;
    this.midGain = 0.08;
    this.planetDice = true;
};
PlanetBreakbeat.prototype = Object.create(PlanetPlay.prototype);

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
    this.planetDice = true;

};
PlanetWarble.prototype = Object.create(PlanetPlay.prototype);

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
    this.planetDice = true;
};
PlanetPlink.prototype = Object.create(PlanetPlay.prototype);

var PlanetFlange = function () {
    this.x = 4200;
    this.y = 1150;
    this.monsterImage = 'images/Planet8.png';
    this.sound = 72;
    this.timing = 8;
    this.channel = planet10gain;
    this.maxGain = 0.12;
    this.midGain = 0.05;
};
PlanetFlange.prototype = Object.create(PlanetPlay.prototype);

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
    this.planetDice = true;
};
PlanetBlobby.prototype = Object.create(PlanetPlay.prototype);

var Planet12 = function () {
    this.x = 3500;
    this.y = 600;
    this.monsterImage = 'images/Planet11.png';
    this.sound = 73;
    this.timing = 8;
    this.channel = planet12gain;
    this.maxGain = 0.25;
    this.midGain = 0.10;
};
Planet12.prototype = Object.create(PlanetPlay.prototype);

var Planet13 = function () {
    this.x = 900;
    this.y = 2600;
    this.monsterImage = 'images/Planet14.png';
    this.sound = 74;
    this.timing = 4;
    this.channel = planet13gain;
    this.maxGain = 0.17;
    this.midGain = 0.07;
};
Planet13.prototype = Object.create(PlanetPlay.prototype);

var Planet14 = function () {
    this.x = 4600;
    this.y = 2500;
    this.monsterImage = 'images/Planet12.png';
    this.sound = 79;
    this.timing = 4;
    this.channel = planet14gain;
    this.maxGain = 0.17;
    this.midGain = 0.07;
};
Planet14.prototype = Object.create(PlanetPlay.prototype);



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
    this.flag = "healthUpPlay";
    this.isPowerUp = true;
    this.timing = function () {
        return !!current16thNote % 1 === 0;
    };
    this.powerUp = function () {
        hero.health += 100;
        xhealth.innerHTML = ("Space Health:  " + hero.health);
    };
};
HealthUp.prototype = Object.create(Npc.prototype);


var HealthFlyUp = function (position) {
    this.x = position.x;
    this.y = position.y;
    this.width = 32;
    this.height = 32;
    this.health = 10;
    this.damage = 0;
    this.points = 0;
    this.speed = 160;
    this.sizex = 32;
    this.sizey = 32;
    this.monsterImage = "images/HeartGreenEyes.png";
    this.sound = 17;
    this.flag = "healthUpPlay";
    this.isPowerUp = true;
    this.timing = function () {
        return !!current16thNote % 1 === 0;
    };
    this.powerUp = function () {
        hero.health += 100;
        xhealth.innerHTML = ("Space Health:  " + hero.health);
    };
};
HealthFlyUp.prototype = Object.create(MonsterRun.prototype);


var GunUp = function (position) {
    this.x = position.x;
    this.y = position.y;
    this.width = 16;
    this.height = 24;
    this.health = 10;
    this.damage = 0;
    this.points = 0;
    this.speed = 80;
    this.sizex = 16;
    this.sizey = 24;
    this.monsterImage = "images/Potion3.png";
    this.sound = 17;
    this.timing = function () {
        return !!(barNumber % 4 === 0 && current16thNote % 16 === 0);
    };
    this.flag = "gunUpPlay";
    this.isPowerUp = true;
    this.powerUp = function () {
        if (gun < 2) {
            gun += 1;
            xpowerup.innerHTML = "Bassline Upgrade!!";
            setTimeout(function () {
                powerupText = "";
                xpowerup.innerHTML = "";
            }, 3000);
        }
        else {
            bulletDamageMod += 5;
            powerupText = "Bullet Damage Up!!";
            xpowerup.innerHtml = "Bullet Damage Up!!!";
            setTimeout(function () {
                xpowerup.innerHtml = "";
            }, 3000);
        }
    };
};
GunUp.prototype = Object.create(MonsterRun.prototype);


var SlowPotion = function (position) {
    this.x = position.x;
    this.y = position.y;
    this.width = 16;
    this.height = 24;
    this.health = 10;
    this.damage = -20;
    this.points = 0;
    this.speed = 70;
    this.sizex = 16;
    this.sizey = 24;
    this.monsterImage = "images/Potion2.png";
    this.sound = 17;
    this.timing = function () {
        return !!current16thNote % 1 === 0;
    };
    this.flag = "slowPotionPlay";
    this.isPowerUp = true;
    this.powerUp = function () {
        speedMod = 0.4;
        convolverWarehouse.buffer = impulseBufferReverse;
        masterWet.gain.value = 0.9;
        xpowerup.innerHTML = "Slow Enemies!!!!";
        setTimeout(function () {
            speedMod = 1;
            convolverWarehouse.buffer = impulseBuffer;
            masterWet.gain.value = 0.2;
            xpowerup.innerHTML = "";
            console.log(speedMod);
        }, 15000);
    };
};
SlowPotion.prototype = Object.create(MonsterRun.prototype);


var Bullet = function (x, y, damage, type) {

    this.damage = typeof damage !== 'undefined' ? damage : 10;
    this.x = x;
    this.y = y;
    this.velocity = [0, 0];
    this.angle = 0;
    this.type = typeof type !== 'undefined' ? type : "hero";
};

Bullet.prototype = {

    width: 2,
    height: 2,

    update: function () {

        var that = this;
        var index = bullets.indexOf(this);

        if (this.type !== "hero") {
            this.x += this.velocity[0] * speedMod;
            this.y += this.velocity[1] * speedMod;
        } else {
            this.x += this.velocity[0];
            this.y += this.velocity[1];
        }

        for (var i in planets) {
            var planet = planets[i];

            if (circleCollide(planet, this)) {
                var index = bullets.indexOf(this);
                bullets.splice(index, 1);
                if (this.type === "hero") {
                    playSound(samplebb[planet.hitSound], gainNode4);
                    planet.health -= this.damage + bulletDamageMod;
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
                playSound(samplebb[82], gainNode4);
                xhealth.innerHTML = ("Space Health: " + hero.health);
                bullets.splice(index, 1);
            }

        }

        else if (this.type === "hero") {
            for (var y = 0, m = monsters.length; y < m; ++y) {
                var monst = monsters[y];
                if (!monst.isPowerUp) {
                    if (!monst.isDead) {
                        collide(this, monst, true, function (collides) {
                            if (collides === true) {
                                monst.health -= that.damage + bulletDamageMod;
                                //if (bulletpiercePower === false) {
                                bullets.splice(index, 1);
                                //}
                            }

                        })
                    }
                }
            }
        }
        var playerdist = {x: this.x - hero.x, y: this.y - hero.y};
        playerdist.length = Math.sqrt((playerdist.x * playerdist.x) + (playerdist.y * playerdist.y));
        // BULLET DISAPPEAR WHEN FAR AWAY
        if (playerdist.length > 1000) {
            bullets.splice(index, 1);
        }
    },

    render: function () {
        ctx.save();
        ctx.translate(this.x, this.y);  // +8?
        ctx.rotate(this.angle);

        if (this.type === "hero") {
            ctx.drawImage(resources.get("images/blt.png"), 0, 0, 3, 3);         // -8?
        } else if (this.type === "enemy1") {
            ctx.drawImage(resources.get("images/spawn.png"), 0, 0, 30, 8);
        } else if (this.type === "enemy2") {
            ctx.drawImage(resources.get("images/spawn.png"), 0, 0, 8, 6);
        }
        ctx.restore();
    }
}

var hero = {
    x: 2196,
    y: 3328,
    width: 60,
    height: 20,
    health: 420,
    speed: 300, // pixels per second
    image: "images/Hero.png"

    // sprite : new Sprite('')
};
