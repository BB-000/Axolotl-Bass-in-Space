//var bullet = bullets[z];
//var index = bullets.indexOf(bullet);
//if (bullet !== undefined) {
//    //Increase it's position by it's velocity...
//    bullet.x += bullet.velocity[0];
//    bullet.y += bullet.velocity[1];
//
//    if (bullet.type !== "hero") {
//            //var collides1;
//            //if (
//            //    bullet.x > hero.x + hero.width ||
//            //    bullet.x + hero.width / 2 < hero.x ||
//            //    bullet.y > hero.y + hero.height ||
//            //    bullet.y + hero.height / 2 < hero.y
//            //) {
//            //    collides1 = false;
//            //}
//            //else {
//            //    collides1 = true;
//            //}
//            //
//            //
//            //if (collides1 === true) {
//            //    hero.health -= bullet.damage;
//            //    //var index = bullets.indexOf(bullet);
//            //    bullets.splice(index, 1);
//            //}
//
//            collide(bullet, hero, true, function (collides) {
//                if (collides === true) {
//                    hero.health -= bullet.damage;
//                    //var index = bullets.indexOf(bullet);
//                    bullets.splice(index, 1);
//                }
//            }, 2);
//        }
//
//        for (var y = 0, m = monsters.length; y < m; ++y) {
//            // bullet-entity collision
//            var collides;
//            var monst = monsters[y];
//            if (bullet.type === "hero") {
//                //if (
//                //    bullet.x > monst.x + monst.width ||
//                //    bullet.x + monst.width / 2 < monst.x ||
//                //    bullet.y > monst.y + monst.height ||
//                //    bullet.y + monst.height / 2 < monst.y
//                //) {
//                //    collides = false;
//                //}
//                //else {
//                //    collides = true;
//                //}
//                //
//                //if (collides === true && monst.isDead === false) {
//                //    monst.health -= bullet.damage;
//                //    //var index = bullets.indexOf(bullet);
//                //    bullets.splice(index, 1);
//                //}
//
//                collide(bullet, monst, true, function (collides) {
//                    if (collides === true) {
//                        monst.health -= bullet.damage;
//                        //var index = bullets.indexOf(bullet);
//                        bullets.splice(index, 1);
//                    }
//                }, 2);
//            }


for(var i in planets) {
    var planet = planets[i];
    collide(this, planet, true, function (collides) {
        if (collides === true) {
            planet.health -= that.damage;
            var index = bullets.indexOf(that);
            bullets.splice(index, 1);
            playSound(samplebb[planet.sound], gainNode5);
        }
    }, 2);
}

if (this.type !== "hero") {
    collide(this, hero, true, function (collides) {
        if (collides === true) {
            hero.health -= that.damage;
            var index = bullets.indexOf(that);
            bullets.splice(index, 1);
        }
    }, 2);
}
else if (this.type === "hero") {
    for (var y = 0, m = monsters.length; y < m; ++y) {
        var monst = monsters[y];

        collide(this, monst, true, function (collides) {
            if (collides === true) {
                monst.health -= that.damage;
                var index = bullets.indexOf(that);
                bullets.splice(index, 1);
            }
        }, 2);
    }
}