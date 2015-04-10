//(function() {
function Monster() {}
Monster.prototype = {

    isDead: false,
    playing: false,
    barTiming: 1,
    follow: true,
    toRemove: false,
    channel: gainNode3,

    update: function () {

        if (this.health <= 0) {
            this.isDead = true;
        }

        if (this.isDead === false) {

            for (obj in monsters) {
                var monst = monsters[obj];
                if (monst.x !== this.x && monst.y !== this.y && monst.isDead === false) {
                    collide(this, monst, true);
                }
            }

            collide(hero, this, true, function (collides) {
                if (collides === true) {
                    damagePlayer(10);
                    this.follow = false;
                    //console.log("damage"+this.damage);
                    //console.log(collides);
                } else if (collides === false) {
                    this.follow = true;
                    //console.log(collides);
                }
            });
        }

        else if (this.isDead === true) {
            if (barNumber % this.barTiming === 0)
                if (current16thNote % this.timing === 0) {
                    score += this.points;
                    var index = monsters.indexOf(this);
                    //monsters.splice(index, 1);
                    this.toRemove = true;
                    //samplebb[this.sound].ready = false;
                    playSoundDelay(samplebb[this.sound], this.channel);
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
    }
};

function MonsterMove() {}
MonsterMove.prototype = Object.create(Monster.prototype);
MonsterMove.prototype.move = function () {
    if (this.health >= 0) {
        // Vector between the monster and the player
        var monstervector = {
            x: Math.round(this.x - hero.x),
            y: Math.round(this.y - hero.y)
        };
// Length of the vector
        monstervector.length = Math.sqrt((monstervector.x * monstervector.x) + (monstervector.y * monstervector.y));

        if (monstervector.length < 10 && this.follow === true) {
            // Run after the player!
            this.x -= Math.round((monstervector.x / monstervector.length) * 2);
            this.y -= Math.round((monstervector.y / monstervector.length) * 2);
        } else if (monstervector.length > 10 && !(monstervector.length > this.test) && this.follow === true) {
            this.x -= Math.round((monstervector.x / monstervector.length) * 1);
            this.y -= Math.round((monstervector.y / monstervector.length) * 1);
        }
    }
};

function MonsterMove2() {}
MonsterMove2.prototype = Object.create(Monster.prototype);
MonsterMove2.prototype.move = function (dt) {

    var monstervector = {
        x: Math.round(this.x - hero.x),
        y: Math.round(this.y - hero.y)
    };
    monstervector.length = Math.sqrt((monstervector.x * monstervector.x) + (monstervector.y * monstervector.y));  // Length of the vector

    //if(this.follow === true) {
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
    //}
};


function MonsterFly() {}
MonsterFly.prototype = Object.create(Monster.prototype);
MonsterFly.prototype.move = function () {

    this.speedX = this.speed * 6;
    this.speedY = this.speed * 2;
    this.x += this.speedX;
    this.y += this.speedY;

    var playerdist = {x: this.x - hero.x, y: this.y - hero.y};
    playerdist.length = Math.sqrt((playerdist.x * playerdist.x) + (playerdist.y * playerdist.y));

    if (playerdist.length > 3000) {
        var index = monsters.indexOf(this);
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
    this.damage = 5;
    this.points = 100;
    this.speed = Math.random() * (190 - 70) + 70;
    this.sizex = 32;
    this.sizey = 32;
    //?
    //this.monsterImage = new Image();
    this.monsterImage = 'images/Fish.png';
    //?
    this.sound = Math.floor((Math.random() * 2) + 19);
    this.timing = 4;
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
    this.points = 250;
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
    this.health = 110;
    this.damage = 100;
    this.points = 350;
    this.speed = Math.random() * (220 - 180) + 180;
    this.sizex = 32;
    this.sizey = 32;
    //this.monsterImage = new Image();
    this.monsterImage = "images/Prawn.png";
    this.sound = 7;
    this.timing = 3;
};
Prawn.prototype = Object.create(MonsterMove2.prototype);


var Bug = function (position) {

    var xx = Math.random() * (64 - 16) + 16;
    this.x = position.x;
    this.y = position.y;
    this.width = xx;
    this.height = xx;
    this.health = Math.random() * (100 - 20) + 20;
    this.damage = 100;
    this.points = 500;
    this.speed = Math.random() * (240 - 100) + 100;
    this.sizex = xx;
    this.sizey = xx;
    //this.monsterImage = new Image();
    this.monsterImage = "images/Bug.png";
    this.sound = Math.floor(Math.random() * (7 - 5)) + 5;
    this.timing = 1;

};
Bug.prototype = Object.create(MonsterMove2.prototype);


var Shark = function (position) {

    this.x = position.x;
    this.y = position.y;
    this.width = 64;
    this.height = 64;
    this.health = 700;
    this.damage = 100;
    this.points = 800;
    this.speed = Math.random() * (120 - 50) + 50;
    this.sizex = 92;
    this.sizey = 128;
    //this.monsterImage = new Image();
    this.monsterImage = "images/Shark.png";
    this.sound = 14;
    this.timing = 16;
    this.barTiming = 4;
};
Shark.prototype = Object.create(MonsterMove2.prototype);


var Mosquito = function (position) {

    this.x = position.x;
    this.y = position.y;
    this.width = 32;
    this.height = 32;
    this.health = 70;
    this.damage = 100;
    this.points = 100;
    this.speed = Math.random() * (280 - 260) + 260;
    this.sizex = 32;
    this.sizey = 32;
    //this.monsterImage = new Image();
    this.monsterImage = "images/Mosquito.png";

    this.timing = 1;
    this.sound = 13;

};
Mosquito.prototype = Object.create(MonsterMove2.prototype);


var Boulder = function (position) {

    var xx = Math.random() * (64 - 16) + 16;
    this.x = position.x;
    this.y = position.y;
    this.width = xx;
    this.height = xx;
    this.health = 100;
    this.damage = 200;
    this.points = 75;
    this.speed = Math.random() * (4 - 1) + 1;
    this.sizex = xx;
    this.sizey = xx;
    //this.monsterImage = new Image();
    this.monsterImage = "images/Boulder.png";

    this.timing = 4;
    this.sound = 0;

};
Boulder.prototype = Object.create(MonsterFly.prototype);

var monsterz = [Fish, Worm, Prawn, Bug, Shark, Mosquito];


// Game objects
var hero = {
    x: 500,
    y: 500,
    width: 100,
    height: 32,
    health: 100,
    speed: 400 // pixels per second
};

function damagePlayer(amt) {
    hero.health -= amt;
}
//})();
