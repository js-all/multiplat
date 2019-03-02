const canvas = <HTMLCanvasElement>document.createElement('canvas');
const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
const cw: number = 1000;
const ch: number = 1000;
const { log } = console;
const activeKeys: number[] = [];
const moveConst = 10;
const draw_rate = 60;
const play_rate = 60;

canvas.height = ch;
canvas.width = cw;
ctx.imageSmoothingEnabled = false;
document.body.appendChild(canvas);

const player = new Player(0, 0);
var area: null | Area = null;
var ID = -1;

function draw() {
    if (area === null) return;
    ctx.clearRect(0, 0, cw, ch);
    area.draw(ctx);
}

function play() {
    if (area === null) return;
    area.membersMove();
    area.membersAnime();
    [area.camera.x, area.camera.y] = [player.x - area.camera.width / 2 + player.width / 2, player.y - area.camera.height / 2 + player.height / 2];
    player.fx = 0;
    let actionUsed = false;
    if (player.isJumping && player.action !== Actions.jumping) player.setAction(Actions.jumping);
    for (let key of activeKeys) {
        switch (key) {
            case 37:
                player.fx = -moveConst;
                //player.orientation = Orientation.left;
                if (player.action !== Actions.walking) player.setAction(Actions.walking);
                actionUsed = true;
                break;
            case 38:
                if (player.isJumping && player.action !== Actions.jumping) player.setAction(Actions.jumping);
                player.jump();
                actionUsed = true;
                break;
            case 39:
                player.fx = moveConst;
                //player.orientation = Orientation.right;
                if (player.action !== Actions.walking) player.setAction(Actions.walking);
                actionUsed = true;
                break;
            case 16:
                if (player.action !== Actions.attacking) player.setAction(Actions.attacking);
                actionUsed = true;
        }
    }
    if (!actionUsed) {
        if (player.action !== Actions.nothing) player.setAction(Actions.nothing);
    }
}


function getMap() {
    fetch('/map')
        .then(r => r.json())
        .then(json => {
            area = Area.createAreaFromJson(json);
            area.members.push(player);
        }).catch(err => {
            if (err) setTimeout(getMap, 1000);
        })
}

getMap();


const draw_interval = setInterval(draw, 1000 / draw_rate);
const play_interval = setInterval(play, 1000 / play_rate);

const _$$c: HTMLCanvasElement = canvas;
const _$$cw = _$$c.width;
const _$$ch = _$$c.height;
function _$$adaptSize() {
    let rhl = _$$cw / _$$ch;
    let rlh = _$$ch / _$$cw;
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

document.addEventListener('keydown', e => { if (activeKeys.indexOf(e.keyCode) === -1) activeKeys.push(e.keyCode); });

document.addEventListener('keyup', e => { if (activeKeys.indexOf(e.keyCode) !== -1) activeKeys.splice(activeKeys.indexOf(e.keyCode), 1); });

