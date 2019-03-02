"use strict";
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var cw = 1000;
var ch = 1000;
var log = console.log;
var activeKeys = [];
var moveConst = 10;
var draw_rate = 60;
var play_rate = 60;
canvas.height = ch;
canvas.width = cw;
ctx.imageSmoothingEnabled = false;
document.body.appendChild(canvas);
var player = new Player(0, 0);
var area = null;
var ID = -1;
function draw() {
    if (area === null)
        return;
    ctx.clearRect(0, 0, cw, ch);
    area.draw(ctx);
}
function play() {
    var _a;
    if (area === null)
        return;
    area.membersMove();
    area.membersAnime();
    _a = [player.x - area.camera.width / 2 + player.width / 2, player.y - area.camera.height / 2 + player.height / 2], area.camera.x = _a[0], area.camera.y = _a[1];
    player.fx = 0;
    var actionUsed = false;
    if (player.isJumping && player.action !== Actions.jumping)
        player.setAction(Actions.jumping);
    for (var _i = 0, activeKeys_1 = activeKeys; _i < activeKeys_1.length; _i++) {
        var key = activeKeys_1[_i];
        switch (key) {
            case 37:
                player.fx = -moveConst;
                //player.orientation = Orientation.left;
                if (player.action !== Actions.walking)
                    player.setAction(Actions.walking);
                actionUsed = true;
                break;
            case 38:
                if (player.isJumping && player.action !== Actions.jumping)
                    player.setAction(Actions.jumping);
                player.jump();
                actionUsed = true;
                break;
            case 39:
                player.fx = moveConst;
                //player.orientation = Orientation.right;
                if (player.action !== Actions.walking)
                    player.setAction(Actions.walking);
                actionUsed = true;
                break;
            case 16:
                if (player.action !== Actions.attacking)
                    player.setAction(Actions.attacking);
                actionUsed = true;
        }
    }
    if (!actionUsed) {
        if (player.action !== Actions.nothing)
            player.setAction(Actions.nothing);
    }
}
function getMap() {
    fetch('/map')
        .then(function (r) { return r.json(); })
        .then(function (json) {
        area = Area.createAreaFromJson(json);
        area.members.push(player);
    }).catch(function (err) {
        if (err)
            setTimeout(getMap, 1000);
    });
}
getMap();
var draw_interval = setInterval(draw, 1000 / draw_rate);
var play_interval = setInterval(play, 1000 / play_rate);
var _$$c = canvas;
var _$$cw = _$$c.width;
var _$$ch = _$$c.height;
function _$$adaptSize() {
    var rhl = _$$cw / _$$ch;
    var rlh = _$$ch / _$$cw;
    if (window.innerWidth > window.innerHeight * rhl) {
        _$$c.style.width = 'inherit';
        _$$c.style.height = '100%';
    }
    if (window.innerHeight > window.innerWidth * rlh) {
        _$$c.style.height = 'inherit';
        _$$c.style.width = '100%';
    }
}
_$$adaptSize();
window.addEventListener('resize', _$$adaptSize);
document.addEventListener('keydown', function (e) { if (activeKeys.indexOf(e.keyCode) === -1)
    activeKeys.push(e.keyCode); });
document.addEventListener('keyup', function (e) { if (activeKeys.indexOf(e.keyCode) !== -1)
    activeKeys.splice(activeKeys.indexOf(e.keyCode), 1); });
