"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * les Faces
 */
var Face;
(function (Face) {
    /**
     * la face du haut
     */
    Face[Face["top"] = 0] = "top";
    /**
     * la face de la gauche
     */
    Face[Face["left"] = 1] = "left";
    /**
     * la face de la droite
     */
    Face[Face["right"] = 2] = "right";
    /**
     * la face du bas
     */
    Face[Face["bottom"] = 3] = "bottom";
})(Face || (Face = {}));
/**
 * @class les elements du jeu
 */
var GameElement = /** @class */ (function () {
    /**
     * constructeur de GameElement
     * @param width - la largeur de l'objet
     * @param height - la hauteur de l'objet
     * @param x - l'absice de l'objet
     * @param y - l'ordonée de l'objet
     * @param life - la vie de l'objet
     * @param style - le style de l'objet
     * @param fx - la force y de l'objet
     * @param fy - la force x de l'objet
     * @param collision - indique si l'objet recevra des collisions
     * @param showHitBox - indique si la hitbox de l'objet doit être afficher
     * @param hitBoxColor - la couleure de la hitbox
     * @param onDamage - une fonctino appeler lorsque l'objet prendra des dommage (via la fonction damage)
     * @param onDeath - une fonction appeler quand l'objet mourra, quand sa vie serat a 0 (via la fonctino damage)
     */
    function GameElement(width, height, x, y, life, style, fx, fy, collision, showHitBox, hitBoxColor, onDamage, onDeath) {
        if (fx === void 0) { fx = 0; }
        if (fy === void 0) { fy = 0; }
        if (collision === void 0) { collision = false; }
        if (showHitBox === void 0) { showHitBox = false; }
        if (hitBoxColor === void 0) { hitBoxColor = "red"; }
        if (onDamage === void 0) { onDamage = function () { }; }
        if (onDeath === void 0) { onDeath = function () { }; }
        /**
         * dit si l'objet aura des collsions
         */
        this.collision = false;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.life = life;
        this.maxLife = life;
        this.style = style;
        this.showHitBox = showHitBox;
        this.hitBoxColor = hitBoxColor;
        this.collision = collision;
        if (collision)
            CollisionObjects.push(this);
        if ((this.style.type === 'rectangle' || this.style.type === 'path') && this.style.color === undefined)
            throw new TypeError('GameElement, you must provide a color in style if you use a rectangle or path style type');
        if ((this.style.type === 'image') && this.style.IMGPath === undefined)
            throw new TypeError('GameElement, you must provide an IMGPath in style if you use a image style type');
        if (this.style.type === 'path') {
            if (this.style.points === undefined)
                throw new TypeError('GameElement, you must provide points when you use a path style type');
            for (var _a = 0, _b = this.style.points; _a < _b.length; _a++) {
                var i = _b[_a];
                if (i.length !== 2)
                    throw new TypeError('GameElement, the points array is an array of array of numbers with a length of two');
            }
        }
        this.styleImage = this.style.type === "image" ? pathToImage(this.style.IMGPath) : null;
        this.fx = fx;
        this.fy = fy;
        this.callOnDamage = onDamage;
        this.callOnDeath = onDeath;
    }
    /**
     * dessine l'element
     * @param ctx - le context sur lequel dessiner.
     */
    GameElement.prototype.draw = function (ctx) {
        if (this.showHitBox) {
            ctx.save();
            ctx.fillStyle = this.hitBoxColor;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        }
        if (this.style.type === 'rectangle') {
            var color = this.style.color === undefined ? "red" : this.style.color;
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        else if (this.style.type === 'image') {
            var resizeIMG = this.style.resiveIMG === undefined ? true : this.style.resiveIMG;
            if (resizeIMG) {
                ctx.drawImage(this.styleImage, this.x, this.y, this.width, this.height);
            }
            else {
                ctx.drawImage(this.styleImage, this.x, this.y);
            }
        }
        else if (this.style.type === 'path') {
            var color = this.style.color === undefined ? "red" : this.style.color;
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            var points = [];
            var temp_points = this.style.points;
            for (var _a = 0, temp_points_1 = temp_points; _a < temp_points_1.length; _a++) {
                var i = temp_points_1[_a];
                var temp_array = [0, 0];
                temp_array[0] = ((i[0] / 100) * this.width) + this.x;
                temp_array[1] = ((i[1] / 100) * this.height) + this.y;
                points.push(temp_array);
            }
            var p = points;
            ctx.beginPath();
            ctx.moveTo.apply(ctx, p[0]);
            ctx.lineTo.apply(ctx, p[0]);
            for (var _b = 0, p_1 = p; _b < p_1.length; _b++) {
                var i = p_1[_b];
                ctx.lineTo.apply(ctx, i);
            }
            var closePath = this.style.closePath === undefined ? true : this.style.closePath;
            if (closePath)
                ctx.lineTo.apply(ctx, p[0]);
            ctx.stroke();
            var fill = this.style.fill === undefined ? false : this.style.fill;
            if (fill)
                ctx.fill();
            ctx.closePath();
            var showPoints = this.style.showPoints === undefined ? false : this.style.showPoints;
            if (showPoints) {
                for (var i = 0; i < p.length; i++) {
                    var e = p[i];
                    var color_1 = 'hsl(' + (i * (255 / p.length)) + ', 100%, 50%)';
                    ctx.fillStyle = color_1;
                    ctx.beginPath();
                    ctx.arc(e[0], e[1], 5, 0, Math.PI * 2);
                    ctx.font = '15px Arial';
                    ctx.fill();
                    ctx.fillStyle = 'black';
                    ctx.fillText((i + 1).toString(), e[0] - 5, e[1] - 7);
                    ctx.closePath();
                }
            }
        }
    };
    /**
     * fait bouger l'lement selon les forces x et y qu'il a
     */
    GameElement.prototype.move = function () {
        this.x += this.fx;
        this.y += this.fy;
    };
    /**
     * retourne un boolean ou une detailTouchInterface indiquant si l'element touche oui ou non l'element passé en parametre
     * @param gameElement - l'element testé
     * @param detail - boolean disant si la foction va retourné une detailTouchInteface, ou just boolean, la detailTouchInterface indiquera plus de details que just le boolean
     */
    GameElement.prototype.touch = function (gameElement, detail) {
        return GameElement.touch(this.width, this.height, this.x, this.y, gameElement.width, gameElement.height, gameElement.x, gameElement.y, detail);
    };
    /**
     * change l'image de l'element si son style.type vaut "image"
     * @param image - l'image ou le chemin vers l'image
     */
    GameElement.prototype.setImage = function (image) {
        if (this.style.type !== 'image')
            return;
        if (typeof image === "string") {
            this.style.IMGPath = image;
            this.styleImage = pathToImage(image);
        }
        else {
            this.style.IMGPath = image.src;
            this.styleImage = image;
        }
    };
    /**
     * retourne un boolean ou une detailTouchInterface indiquant si dans la cas ou il y aurait des element avec les largeurs, heuteurs, ordonées et abscices fourni en parametre ils se toucherait
     * @param width - la largeure de l'element 1
     * @param height - la hauteure de l'element 1
     * @param x - l'abscice de l'element 1
     * @param y - l'ordonée de l'element 1
     * @param gWidth - la largeure de l'element 2
     * @param gHeight - la hauteure de l'element 2
     * @param gX - l'abscice de l'element 2
     * @param gY - l'ordonée de l'element 2
     * @param detail - boolean disant si la foction va retourné une detailTouchInteface, ou just boolean, la detailTouchInterface indiquera plus de details que just le boolean
     */
    GameElement.touch = function (width, height, x, y, gWidth, gHeight, gX, gY, detail) {
        var X = false;
        var Y = false;
        if (gX <= width + x && gX + gWidth >= x)
            X = true;
        if (gY <= height + y && gY + gHeight >= y)
            Y = true;
        if (detail) {
            var face = Face.top;
            var superposed = (x === gX + gWidth || x + width === gX || y === gY + gHeight || y + height === gY);
            superposed = superposed ? false : true;
            var collideLarg = (gX + gWidth <= width + x ? gWidth + gX : x + width) - (gX >= x ? gX : x);
            var collideLong = (gY + gHeight <= y + height ? gY + gHeight : y + height) - (gY >= y ? gY : y);
            if (collideLarg >= collideLong) {
                if (y + (height / 2) <= gY + (gHeight / 2)) {
                    face = Face.top;
                }
                else {
                    face = Face.bottom;
                }
            }
            else if (collideLong > collideLarg) {
                if (x + (width / 2) <= gX + (gWidth / 2)) {
                    face = Face.left;
                }
                else {
                    face = Face.right;
                }
            }
            var res_1 = {
                res: X && Y,
                face: face,
                superposed: superposed
            };
            return res_1;
        }
        var res = X && Y;
        return res;
    };
    return GameElement;
}());
/**
 * les objets a collisions que les GameEntity et autre devront prendre en compte
 */
var CollisionObjects = [];
/**
 * les Orientations
 */
var Orientation;
(function (Orientation) {
    /**
     * l'orientation a gauche
     */
    Orientation[Orientation["left"] = 0] = "left";
    /**
     * l'orientation a droite
     */
    Orientation[Orientation["right"] = 1] = "right";
})(Orientation || (Orientation = {}));
/**
 * les actions
 */
var Actions;
(function (Actions) {
    /**
     * l'action de sauter
     */
    Actions[Actions["jumping"] = 0] = "jumping";
    /**
     * l'action de marcher
     */
    Actions[Actions["walking"] = 1] = "walking";
    /**
     * l'action d'attaquer
     */
    Actions[Actions["attacking"] = 2] = "attacking";
    /**
     * l'action de ne rien faire
     */
    Actions[Actions["nothing"] = 3] = "nothing";
})(Actions || (Actions = {}));
/**
 * les entités vivantes du jeu
 */
var GameEntity = /** @class */ (function (_super) {
    __extends(GameEntity, _super);
    /**
     *
     * @param width - la largeur de l'entité
     * @param height - la hauteur de l'entité
     * @param x - l'absice de l'entité
     * @param y - l'ordonée de l'entité
     * @param life - la vie de lantité
     * @param sprites - les sprites de l'entité
     * @param fx  - la force x de lentité
     * @param fy - la force y de l'entité
     * @param orientation - l'orientation de l'entité
     * @param showHitBox - boolean indiquant si la hit box de l'entité doit être affiché
     * @param hitBoxColor - la couleure de la hitbox de l'entité
     * @param jumpTimeOut - le delai minimum antre chasue saut
     * @param onDamage - une fonctino appeler lorsque l'objet prendra des dommage (via la fonction damage)
     * @param onDeath - une fonction appeler quand l'objet mourra, quand sa vie serat a 0 (via la fonctino damage)
     */
    function GameEntity(width, height, x, y, life, sprites, fx, fy, orientation, showHitBox, hitBoxColor, jumpTimeOut, onDamage, onDeath) {
        if (fx === void 0) { fx = 0; }
        if (fy === void 0) { fy = 0; }
        if (orientation === void 0) { orientation = Orientation.right; }
        if (showHitBox === void 0) { showHitBox = false; }
        if (hitBoxColor === void 0) { hitBoxColor = "red"; }
        if (jumpTimeOut === void 0) { jumpTimeOut = 50; }
        if (onDamage === void 0) { onDamage = function () { }; }
        if (onDeath === void 0) { onDeath = function () { }; }
        var _this_1 = _super.call(this, width, height, x, y, life, {
            type: 'image',
            IMGPath: ''
        }, fx, fy, false, showHitBox, hitBoxColor, onDamage, onDeath) || this;
        /**
         * la frame ou en est arrivé l'animation
         */
        _this_1.animeFrame = 0;
        /**
         * le nombre total de frame dans l'animation
         */
        _this_1.maxAnimeFrame = 0;
        /**
         * la date du dernier moment ou l'entité a été animé
         */
        _this_1.lastAnimeFrame = null;
        /**
         * la force de saut de l'entité
         */
        _this_1.fj = 0;
        /**
         * boolean indiquant si l'entité est entrain de sauté
         */
        _this_1.isJumping = false;
        /**
         * la gravité de lentité
         */
        _this_1.gravity = 0;
        /**
         * la date du dernier saut
         */
        _this_1.lastJump = null;
        _this_1.orientation = orientation;
        _this_1.isWalking = false;
        _this_1.jumpTimeOut = jumpTimeOut;
        var walkingSprites = {
            left: [],
            right: []
        };
        var jumpingSprites = {
            left: [],
            right: []
        };
        var attackingSprites = {
            left: [],
            right: []
        };
        var nothingSprites = {
            left: [],
            right: []
        };
        for (var _a = 0, _b = sprites.walking.spritesPath; _a < _b.length; _a++) {
            var i = _b[_a];
            var imgR = pathToImage(i);
            var imgL = rotateImageOnYaxis(imgR);
            walkingSprites.left.push(imgL);
            walkingSprites.right.push(imgR);
        }
        var walkingSpritesTime = Math.round((walkingSprites.right.length / sprites.walking.animeTime) * GameEntity.maxAnimeTime);
        for (var i = 1; i < walkingSpritesTime; i++) {
            walkingSprites.left.push(walkingSprites.left[i - 1]);
            walkingSprites.right.push(walkingSprites.right[i - 1]);
        }
        for (var _c = 0, _d = sprites.jumping.spritesPath; _c < _d.length; _c++) {
            var i = _d[_c];
            var imgR = pathToImage(i);
            var imgL = rotateImageOnYaxis(imgR);
            jumpingSprites.left.push(imgL);
            jumpingSprites.right.push(imgR);
        }
        var jumpingSpritesTime = Math.round((jumpingSprites.right.length / sprites.jumping.animeTime) * GameEntity.maxAnimeTime);
        for (var i = 1; i < jumpingSpritesTime; i++) {
            jumpingSprites.left.push(jumpingSprites.left[i - 1]);
            jumpingSprites.right.push(jumpingSprites.right[i - 1]);
        }
        for (var _e = 0, _f = sprites.attacking.spritesPath; _e < _f.length; _e++) {
            var i = _f[_e];
            var imgR = pathToImage(i);
            var imgL = rotateImageOnYaxis(imgR);
            attackingSprites.left.push(imgL);
            attackingSprites.right.push(imgR);
        }
        var attackingSpritesTime = Math.round((attackingSprites.right.length / sprites.attacking.animeTime) * GameEntity.maxAnimeTime);
        for (var i = 1; i < attackingSpritesTime; i++) {
            attackingSprites.left.push(attackingSprites.left[i - 1]);
            attackingSprites.right.push(attackingSprites.right[i - 1]);
        }
        for (var _g = 0, _h = sprites.nothing.spritesPath; _g < _h.length; _g++) {
            var i = _h[_g];
            var imgR = pathToImage(i);
            var imgL = rotateImageOnYaxis(imgR);
            nothingSprites.left.push(imgL);
            nothingSprites.right.push(imgR);
        }
        var nothingSpritesTime = Math.round((nothingSprites.right.length / sprites.nothing.animeTime) * GameEntity.maxAnimeTime);
        for (var i = 1; i < nothingSpritesTime; i++) {
            nothingSprites.left.push(nothingSprites.left[i - 1]);
            nothingSprites.right.push(nothingSprites.right[i - 1]);
        }
        _this_1.sprites = {
            walking: {
                sprites: walkingSprites,
                animeTime: sprites.walking.animeTime
            },
            jumping: {
                sprites: jumpingSprites,
                animeTime: sprites.jumping.animeTime
            },
            attacking: {
                sprites: attackingSprites,
                animeTime: sprites.attacking.animeTime
            },
            nothing: {
                sprites: nothingSprites,
                animeTime: sprites.nothing.animeTime
            }
        };
        _this_1.action = Actions.nothing;
        _this_1._sprite = new Image();
        _this_1.anime();
        return _this_1;
    }
    Object.defineProperty(GameEntity.prototype, "sprite", {
        get: function () {
            return this._sprite;
        },
        set: function (value) {
            this._sprite = value;
            this.style.IMGPath = value.src;
            this.styleImage = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * defini l'action de l'entité et remet a zero l'animatione autre
     * @param action l'action de l'entité
     */
    GameEntity.prototype.setAction = function (action) {
        this.action = action;
        this.animeFrame = 0;
        this.lastAnimeFrame = null;
    };
    /**
     * change le sprites de l'entité pour qu'ile s'anime (a utilisé en boucle)
     */
    GameEntity.prototype.anime = function () {
        if (this.lastAnimeFrame instanceof Date) {
            var len = 1;
            switch (this.action) {
                case Actions.nothing:
                    len = this.sprites.nothing.sprites.right.length;
                    break;
                case Actions.walking:
                    len = this.sprites.walking.sprites.right.length;
                    break;
                case Actions.attacking:
                    len = this.sprites.attacking.sprites.right.length;
                    break;
                case Actions.jumping:
                    len = this.sprites.jumping.sprites.right.length;
                    break;
            }
            var time = GameEntity.maxAnimeTime / len;
            if (new Date().getTime() - this.lastAnimeFrame.getTime() < time)
                return;
        }
        if (this.action === Actions.attacking) {
            if (this.orientation === Orientation.left)
                this.sprite = this.sprites.attacking.sprites.left[this.animeFrame];
            else if (this.orientation === Orientation.right)
                this.sprite = this.sprites.attacking.sprites.right[this.animeFrame];
        }
        else if (this.action === Actions.walking) {
            if (this.orientation === Orientation.left)
                this.sprite = this.sprites.walking.sprites.left[this.animeFrame];
            else if (this.orientation === Orientation.right)
                this.sprite = this.sprites.walking.sprites.right[this.animeFrame];
        }
        else if (this.action === Actions.jumping) {
            if (this.orientation === Orientation.left)
                this.sprite = this.sprites.jumping.sprites.left[this.animeFrame];
            else if (this.orientation === Orientation.right)
                this.sprite = this.sprites.jumping.sprites.right[this.animeFrame];
        }
        else if (this.action === Actions.nothing) {
            if (this.orientation === Orientation.left)
                this.sprite = this.sprites.nothing.sprites.left[this.animeFrame];
            else if (this.orientation === Orientation.right)
                this.sprite = this.sprites.nothing.sprites.right[this.animeFrame];
        }
        switch (this.action) {
            case Actions.nothing:
                this.maxAnimeFrame = this.sprites.nothing.sprites.right.length - 1;
                break;
            case Actions.walking:
                this.maxAnimeFrame = this.sprites.walking.sprites.right.length - 1;
                break;
            case Actions.attacking:
                this.maxAnimeFrame = this.sprites.attacking.sprites.right.length - 1;
                break;
            case Actions.jumping:
                this.maxAnimeFrame = this.sprites.jumping.sprites.right.length - 1;
                break;
        }
        this.animeFrame = this.animeFrame >= this.maxAnimeFrame ? 1 : this.animeFrame + 1;
        this.lastAnimeFrame = new Date();
    };
    /**
     * fait sauté l'entité
     * @param power la puissance du saut de l'entité
     */
    GameEntity.prototype.jump = function (power) {
        if (power === void 0) { power = 30; }
        if (this.isJumping)
            return;
        if (this.lastJump !== null && new Date().getTime() - this.lastJump.getTime() < this.jumpTimeOut)
            return;
        ;
        this.fj = Math.abs(power);
        this.isJumping = true;
    };
    /**
     * fait attacké l'entité (a redefinire)
     */
    GameEntity.prototype.attack = function () {
        return console.warn('attack is not defined');
    };
    /**
     * fait bougé l'entité selon ses forces x et y en applicants les coliisions et la gravité
     */
    GameEntity.prototype.move = function () {
        var nfy = 10;
        var ngr = 0.5;
        var collisions = [];
        for (var _a = 0, CollisionObjects_1 = CollisionObjects; _a < CollisionObjects_1.length; _a++) {
            var c = CollisionObjects_1[_a];
            collisions.push(this.touch(c, true));
        }
        var touchGround = false;
        for (var _b = 0, collisions_1 = collisions; _b < collisions_1.length; _b++) {
            var c = collisions_1[_b];
            if (c.res && c.face === Face.top)
                touchGround = true;
        }
        if (touchGround)
            this.fy = 0;
        var fff = false;
        var winnerIndex = 0;
        var _i = 0;
        /*for (let c of CollisionObjects) {
            const d = CollisionObjects[winnerIndex];
            let Y, X = false;
            if (this.fy > 0) {
                if ((this.fy + this.height + this.y) - (c.y) > (this.fy + this.height + this.y) - (d.y) &&
                    (c.y + c.height) - (this.y + this.height) < (d.y + d.height) - (this.y + this.height))
                    Y = true;
            } else if (this.fy <= 0) {
                if ((c.height + c.y) - (this.fy + this.y) > (d.height + d.y) - (this.fy + this.y) &&
                    (c.y) - (this.y + this.fy + this.height) > (d.y) - (this.y + this.fy + this.height))
                    Y = true;
            }
            if (Y) {
                if (this.fx > 0) {
                    if (c.x + c.width >= this.x + this.width && c.x <= this.x + this.fx + this.width) X = true;
                } else if (this.fx <= 0) {
                    if (c.x <= this.x && c.x + c.width >= this.x + this.fx) X = true;
                }
            }
            if (X && Y) winnerIndex = _i;
            _i++;
        }*/
        this.y += this.fj > 0 ? -this.fj : touchGround ? 0 : this.fy;
        this.x += this.fx;
        collisions = [];
        for (var _c = 0, CollisionObjects_2 = CollisionObjects; _c < CollisionObjects_2.length; _c++) {
            var c = CollisionObjects_2[_c];
            collisions.push(this.touch(c, true));
        }
        for (var _d = 0, collisions_2 = collisions; _d < collisions_2.length; _d++) {
            var c = collisions_2[_d];
            if (c.res && c.face === Face.left && c.superposed) {
                this.x = CollisionObjects[collisions.indexOf(c)].x - this.width;
            }
            else if (c.res && c.face === Face.right && c.superposed) {
                this.x = CollisionObjects[collisions.indexOf(c)].x + CollisionObjects[collisions.indexOf(c)].width;
            }
            else if (c.res && c.face === Face.top && c.superposed) {
                this.y = CollisionObjects[collisions.indexOf(c)].y - this.height;
            }
        }
        touchGround = false;
        for (var _e = 0, collisions_3 = collisions; _e < collisions_3.length; _e++) {
            var c = collisions_3[_e];
            if (c.res && c.face === Face.top)
                touchGround = true;
        }
        if (!touchGround)
            this.isJumping = true;
        if (this.fj > 0) {
            this.fj -= this.gravity;
            this.gravity += .1;
            for (var _f = 0, collisions_4 = collisions; _f < collisions_4.length; _f++) {
                var c = collisions_4[_f];
                if (c.res && c.face === Face.bottom && c.superposed) {
                    this.fj = -.1;
                    this.y = CollisionObjects[collisions.indexOf(c)].y + CollisionObjects[collisions.indexOf(c)].height;
                }
            }
            if (this.fj < 0) {
                this.fj = 0;
                this.fy = 0;
                this.gravity = ngr;
            }
        }
        else {
            if (!touchGround) {
                this.fy += this.gravity;
                this.gravity = this.gravity < 2 ? this.gravity + .1 : this.gravity;
            }
            else {
                this.fy = nfy;
                this.gravity = ngr;
            }
        }
        for (var _g = 0, collisions_5 = collisions; _g < collisions_5.length; _g++) {
            var c = collisions_5[_g];
            if (c.res && c.face === Face.top)
                touchGround = true;
        }
        if (touchGround && this.isJumping) {
            this.isJumping = false;
            this.lastJump = new Date();
        }
    };
    /**
     * la duré maximal d'animaation
     */
    GameEntity.maxAnimeTime = 10000;
    return GameEntity;
}(GameElement));
/**
 * les entité servent au attaques et autre
 */
var GameMovingElement = /** @class */ (function (_super) {
    __extends(GameMovingElement, _super);
    /**
     *
     * @param width - la largeur de l'entité
     * @param height - la hauteur de l'entité
     * @param x - l'absice de l'entité
     * @param y - l'ordonée de l'entité
     * @param fx  - la force x de lentité
     * @param fy - la force y de l'entité
     * @param life - la vie de lantité
     * @param showHitBox - bolean indiquant si la hitbox de l'entité doit êter afficher
     * @param hitBoxColor - la couelure de la hitbox
     */
    function GameMovingElement(width, height, x, y, style, fx, fy, life, showHitBox, hitBoxColor) {
        if (fx === void 0) { fx = 0; }
        if (fy === void 0) { fy = 0; }
        if (life === void 0) { life = 1; }
        if (showHitBox === void 0) { showHitBox = false; }
        if (hitBoxColor === void 0) { hitBoxColor = "red"; }
        var _this_1 = _super.call(this, width, height, x, y, life, { type: 'rectangle', color: 'black' }, fx, fy, false, showHitBox, hitBoxColor) || this;
        /**
         * les sprites de l'entité
         */
        _this_1.sprites = null;
        /**
         * les sprites de l'animation de la mort de l'entité
         */
        _this_1.deathSprites = null;
        /**
         * la date du dernier moment ou l'entité a été animé
         */
        _this_1.lastAnimeFrame = null;
        /**
         * la frame ou en est arrivé l'animation
         */
        _this_1.animeFrame = 0;
        /**
         * le nombre total de frame de l'animation
         */
        _this_1.maxAnimeFrame = 0;
        /**
         * le sprite actuelle de l'animation
         */
        _this_1._sprite = new Image();
        /**
         * bolean indiquant si l'entité est en vie
         */
        _this_1.isAlive = true;
        _this_1.movingStyle = style;
        if (_this_1.movingStyle.type === 'sprites') {
            _this_1.sprites = [];
            if (_this_1.movingStyle.spritesPath === undefined)
                throw new TypeError('GameMovingElement, spritesPath must be defined if type is sprites');
            for (var _a = 0, _b = _this_1.movingStyle.spritesPath; _a < _b.length; _a++) {
                var i = _b[_a];
                _this_1.sprites.push(pathToImage(i));
            }
            if (_this_1.movingStyle.onDeathSpritesPath !== undefined) {
                _this_1.deathSprites = [];
                for (var _c = 0, _d = _this_1.movingStyle.onDeathSpritesPath; _c < _d.length; _c++) {
                    var i = _d[_c];
                    _this_1.deathSprites.push(pathToImage(i));
                }
            }
        }
        return _this_1;
    }
    /**
     * dessine l'élement
     * @param ctx - le context sur lequelle m'element doit être dessiné
     */
    GameMovingElement.prototype.draw = function (ctx) {
        if (this.showHitBox) {
            ctx.save();
            ctx.fillStyle = this.hitBoxColor;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        }
        if (this.movingStyle.type === 'rectangle') {
            var color = this.movingStyle.color || "red";
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        else if (this.movingStyle.type === 'path') {
            var color = this.movingStyle.color || "red";
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            var points = [];
            var temp_points = this.movingStyle.points;
            for (var _a = 0, temp_points_2 = temp_points; _a < temp_points_2.length; _a++) {
                var i = temp_points_2[_a];
                var temp_array = [0, 0];
                temp_array[0] = ((i[0] / 100) * this.width) + this.x;
                temp_array[1] = ((i[1] / 100) * this.height) + this.y;
                points.push(temp_array);
            }
            var p = points;
            ctx.beginPath();
            ctx.moveTo.apply(ctx, p[0]);
            ctx.lineTo.apply(ctx, p[0]);
            for (var _b = 0, p_2 = p; _b < p_2.length; _b++) {
                var i = p_2[_b];
                ctx.lineTo.apply(ctx, i);
            }
            var closePath = this.movingStyle.closePath === undefined ? true : this.movingStyle.closePath;
            if (closePath)
                ctx.lineTo.apply(ctx, p[0]);
            ctx.stroke();
            var fill = this.movingStyle.fill === undefined ? false : this.movingStyle.fill;
            if (fill)
                ctx.fill();
            ctx.closePath();
            var showPoints = this.movingStyle.showPoints === undefined ? false : this.movingStyle.showPoints;
            if (showPoints) {
                for (var i = 0; i < p.length; i++) {
                    var e = p[i];
                    var color_2 = 'hsl(' + (i * (255 / p.length)) + ', 100%, 50%)';
                    ctx.fillStyle = color_2;
                    ctx.beginPath();
                    ctx.arc(e[0], e[1], 5, 0, Math.PI * 2);
                    ctx.font = '15px Arial';
                    ctx.fill();
                    ctx.fillStyle = 'black';
                    ctx.fillText((i + 1).toString(), e[0] - 5, e[1] - 7);
                    ctx.closePath();
                }
            }
        }
        else if (this.movingStyle.type === 'sprites') {
            if (this.movingStyle.resiveSprites || false) {
                ctx.drawImage(this._sprite, this.x, this.y, this.width, this.height);
            }
            else {
                ctx.drawImage(this._sprite, this.x, this.y);
            }
        }
    };
    /**
     * change le sprites de l'entité pour qu'ile s'anime (a utilisé en boucle)
     */
    GameMovingElement.prototype.anime = function () {
        if (this.movingStyle.type !== 'sprites')
            return;
        if (this.sprites === null)
            return;
        if (this.lastAnimeFrame instanceof Date) {
            var len = 1;
            if (this.isAlive)
                len = this.sprites.length;
            else if (this.deathSprites !== null)
                len = this.deathSprites.length;
            if (this.movingStyle.animeTime === undefined)
                this.movingStyle.animeTime = 100;
            var time = this.movingStyle.animeTime;
            if (new Date().getTime() - this.lastAnimeFrame.getTime() < time)
                return;
        }
        if (this.isAlive)
            this._sprite = this.sprites[this.animeFrame];
        else if (this.deathSprites !== null)
            this._sprite = this.deathSprites[this.animeFrame];
        else
            this._sprite = new Image();
        if (this.isAlive)
            this.maxAnimeFrame = this.sprites.length - 1;
        else if (this.deathSprites !== null)
            this.maxAnimeFrame = this.deathSprites.length - 1;
        else
            this.maxAnimeFrame = 0;
        this.animeFrame = this.animeFrame >= this.maxAnimeFrame ? 1 : this.animeFrame + 1;
        this.lastAnimeFrame = new Date();
    };
    /**
     * tue l'element
     */
    GameMovingElement.prototype.kill = function () {
        this.life = 0;
        this.isAlive = false;
        this.lastAnimeFrame = null;
        this.animeFrame = 0;
        this.anime();
    };
    /**
     * la duré maximal d'animaation
     */
    GameMovingElement.maxAnimeTime = 10000;
    return GameMovingElement;
}(GameElement));
var MonstersElement = [];
var Monster = {
    /**
     * les class de monstre
     */
    monsters: [],
    /**
     * crée une nouvelle instance de la clas de monstre presciser par l'id
     * @param x l'absice du monstre
     * @param y l'ordonée du monstre
     * @param id l'id de la class du monstre
     */
    createMonsterEntity: function (x, y, id) {
        if (id >= Monster.monsters.length)
            throw new Error('bad ID');
        var _this = new Monster.monsters[id]();
        MonstersElement.push(_this);
        _this.x = x;
        _this.y = y;
        return _this;
    },
    addMonster: function (monsterClass) {
        this.monsters.push(monsterClass);
    }
};
var AreaCamera = /** @class */ (function () {
    function AreaCamera(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    return AreaCamera;
}());
var Area = /** @class */ (function () {
    function Area(members, camera) {
        this.members = members;
        this.camera = camera;
    }
    Area.createAreaFromJson = function (json) {
        var baseID = Tile.tiles.length;
        for (var _a = 0, _b = json.json.tiles; _a < _b.length; _a++) {
            var tile = _b[_a];
            Tile.addTile(tile.name, json.res[tile.resID]);
        }
        var area = new Area([], new AreaCamera(0, 0, 1000, 1000));
        for (var _c = 0, _d = json.json.map; _c < _d.length; _c++) {
            var tile = _d[_c];
            area.members.push(new Tile(tile.pos[0] * json.json.size, tile.pos[1] * json.json.size, json.json.size, tile.id + baseID, !json.json.tiles[tile.id].background));
        }
        return area;
    };
    Area.prototype.draw = function (ctx) {
        ctx.save();
        ctx.scale((ctx.canvas.width / this.camera.width), (ctx.canvas.height / this.camera.height));
        ctx.translate(-this.camera.x, -this.camera.y);
        for (var _a = 0, _b = this.members; _a < _b.length; _a++) {
            var member = _b[_a];
            member.draw(ctx);
        }
        ctx.restore();
    };
    Area.prototype.membersMove = function () {
        for (var _a = 0, _b = this.members; _a < _b.length; _a++) {
            var member = _b[_a];
            member.move();
        }
    };
    Area.prototype.membersAnime = function () {
        for (var _a = 0, _b = this.members; _a < _b.length; _a++) {
            var member = _b[_a];
            if ('anime' in member) {
                member.anime();
            }
        }
    };
    return Area;
}());
var Tile = /** @class */ (function (_super) {
    __extends(Tile, _super);
    function Tile(x, y, size, id, collision) {
        if (size === void 0) { size = Tile.defaultTileSize; }
        if (collision === void 0) { collision = false; }
        var _this_1 = _super.call(this, size, size, x, y, 1, { type: 'image', IMGPath: '' }, 0, 0, collision) || this;
        _this_1.setImage(Tile.defaultTexture);
        var image = new Image();
        var _this = _this_1;
        image.src = typeof Tile.tiles[id].image === "string" ? Tile.tiles[id].image : Tile.tiles[id].image.src;
        image.onload = function () {
            _this.setImage(image);
        };
        return _this_1;
    }
    Tile.addTile = function (name, image) {
        var tile = {
            name: name,
            image: image
        };
        Tile.tiles.push(tile);
    };
    Tile._createDefaultTexture = function () {
        var res = new Image();
        res.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAY30lEQVR4Xu1dCawV1Rn+UXAFUYm7IZUqAkaNNgippSxu0BZlCcgioCCERSDsi0YRwiYCQdkXWaRsIkWWUjYVymIEgo' +
            'WyhBIwjUgCQSFC2XnNN3PnvXnzZu6d+969+vD7JmlSuXPnzjnfd77z/f/5z3klcsxyTBdtD5Sgbbkajh4oIQHgJoIEgBx/CQA5AbibT996OQByCsgBcBNAAsCNv0kAuAkgAeDGXwLAjr9yANwMkAMgx18CQE4A7ubTt14hADkF' +
            '5AC4CSAB4MZfOQB2/BUCcDNADoAcfwkAOQG4m0/feoUA5BSQA+AmgASAG3/lANjxVwjAzQA5AHL8JQDkBOBuPn3rFQKQU0AOgJsAEgBu/JUDYMdfIQA3A+QAyPGXAJATgLv59K1XCEBOATkAbgJIALjxVw6AHX+FANwMkAMgx1' +
            '8CQE4A7ubTt14hADkF5AC4CSAB4MZfOQB2/BUCcDNADoAcfwkAOQG4m0/feoUA5BSQA+AmgASAG3/lANjxVwjAzQA5AHL8JQDkBOBuPn3rFQKQU0AOgJsAEgBu/JUDYMdfIQA3A+QAyPGXAJATgLv59K1XCEBOATkAbgJIALjx' +
            'Vw6AHX+FANwMkAMgx18CQE4A7ubTt14hADkF5AC4CSAB4MZfOQB2/BUCcDNADoAcfwkAOQG4m0/feoUA5BSQA+AmgASAG3/lANjxVwjAzQA5AHL8JQDkBOBuPn3rFQKQU0AOgJsAEgBu/JUDYMdfIQA3A+QAyPGXAJATgLv59K' +
            '1XCEBOATkAbgJIALjxVw6AHX+FANwMkAMgx18CQE4A7ubTt14hADkF5AC4CSAB4MZfOQB2/BUCcDNADoAcfwkAOQG4m0/feoUA5BSQA+AmgASAG3/lANjxVwjAzQA5AHL8JQDkBOBuPn3rFQKQU0AOgJsAEgBu/JUDYMdfIQA3' +
            'A+QAyPGXAJATgLv59K1XCEBOATkAbgJIALjxVw6AHX+FANwMkAMgx18CQE4A7ubTt14hADkF5AC4CSAB4MZfOQB2/BUCcDNADoAcfwkAOQG4m0/feoUA5BSQA+AmgASAG3/lANjxVwjAzQA5AHL8JQDkBOBuPn3rFQKQU0AOgJ' +
            'sAEgBu/JUDYMdfIQA3A+QAyPGXAJATgLv59K1XCEBOATkAbgJIALjxVw6AHX+FANwMkAMgx18CQE4A7ubTt14hADkF5AC4CSAB4MZfOQB2/BUCcDNADoAcfwkAOQG4m0/feoUA5BSQA+AmgASAG3/lANjxVwjAzQA5AHL8JQDk' +
            'BOBuPn3rFQKQU0AOgJsAEgBu/JUDYMdfIQA3A+QAyPGXAJATgLv59K1XCEBOATkAbgJIALjxVw6AHX+FANwMkAMgx18CQE4A7ubTt14hADkF5AC4CSAB4MZfOQB2/BUCcDNADoAcfwkAOQG4m0/feoUA5BSQA+AmQNEEYPBgs3' +
            '79zK67zu3F9evNnn325+/RMmXMBgwwa9bM7N57za6/3n2HS5fMTp0yGzPGbNiwn/+9ivKL06ebtWuX94QZM8xefz35E++/323vTz/F/uU4AlCmTBkrW7asfffdd7GfW9xv/DW2qTB9fvULAAb/4sVmzz1nViKEzmfOmPXvbzZ+' +
            'fGH655f7TjoCUL262ZAhZg8+6IrG55/Hfu9kAoBBMnToUHv55ZdtypQp9vbbb8d+bnG+sV+/ftazZ09bvny5vZ5KVItzQzLwble/AIwebda1q1mpUuHdcfSoWZs2ZmvXZqC7fsZHxBEAiN/QoWatW5uVLWt25Ij7/zMgAO3atb' +
            'MBAwZYhQoV7OLFizZy5MirXgBeeOEFGzZsmD3xxBNWokQJmzFjhgSgSEnA4hAC7Nhh9uST7sjMyTH717/M8F5/+5sZBghmx6++SssW/4zDPPqn4ghAnTpmc+aY3Xef+5wMCsC6devsmWeecR574cKFX4UATJ8+3SBs3iUBMLu6' +
            'HUDVqmaLFpn95jcupj/+aPbGG2bz5hWLMVykl5AAFKn7wr4sASjYK1e3AGRgBsw4yzL1QAlApnoy9zkSAAlAxkmVtQdKADLetRIACUDGSZW1B0oAMt61EoC4AoDkWefOZs2bm/32t2Y33+wusZ0/b3bwoNnMmWbIvhcmCeh/do' +
            'UKZqVLu89GAu/0abNDh8zmzzebODE8cRe0/cloEpUUQ+6gUyezGjXM7rnH7Kab8pYQ8R7/+58Z1rxR1zBhgtnevdG/sm6dWSJZZhcumI0caZZquSzYb2Fr/MkEIPhZ1NvFqB3wLwO2atXKJkyYYFj+S3bt3bvXHnnkkdBb8N3O' +
            'nTtb8+bNnRWE0qVLOxn3nJwcO336tB06dMjmz59vEydOtJ8i6hUWLlxoTZo0cb7npnZ+tN69e9tHH30U+VodO3a04cOH26233urcg5WLDz/80FauXGlz5syx+7xEacQTjhw5Yq1bt7bPEysohUmCDh482LDEeF2iLiYsyegXIe' +
            '83H3jgAevevbtVrlzZSpYsaZcuXbITJ07Yxo0bneXKYP1FJvrY64aCOYCXXjIbNcpdUw5bV8c3MUg2bnSz6z16xC8EwqDD4Lj77uTqjudDCIYPNwOJ/VdRBKBKFbOxY81q1cp751TzDAprUEPw1lvhd0oAcvulU6dOzlLh3Snw' +
            'hRhACDBgMUiCV5UqVWzRokX5RGb79u1Wp06dUNHA/RCVxx57LPdRGMgNGjSwqlWrFmsBgOD27ds3V7j8fbF+/Xp7NlBYl6k+DheAtm3dQXfnnamGhSsChw+bofosTiUgClV69TK78cbUz/buwAwBp/Huu3nfKawAYPDDWfhIEv' +
            'tFzp513c6IEQW/IgFw+mTIkCHWq1cvuzENfOEARo8ebe/68U30cHBGv3z5sk2ePNnewCpP4Jo7d67jOK655hrnE8yYHTp0sFWrVjmiUVwdwA8//GBo1x133FGgTefOnTM4Coikd2W6j/HcPAeAAbJ0qdlDD+W9DGY//BvWmmGN' +
            'YJ27dDFr0MAtPAleUaXA3bq5pbgIJXBBPPbvN1uwwGzVKrNt28zw+40bu2FHpUp57uPkSbfMd/Lkgr+XzirAsmVmf/lL3nMhLmvWuFWEK1e64Qas75//bPbii2Z/+lP+Nu7caVazZsGw5JcQAK8n0ml/hNpFVQKmY4G7devmFN' +
            'jcnMAXM/z+/fttwYIFziDctm2bYZZu3LixM1ArVaqUa+9PnjzpFBxhcAev2bNnW8uWLe3aa691PsKA6dKli/Nc7wr+NgbOmDFj7M033yzwvHRyAOm03/uhdEMA73sQgQ0bNjgievDgQadW4bnnnrMePXo4fYcrW32cJwCzZpm1' +
            'amWWUFEnBobafvZZQerAQiNGr1w5/2dhAhAUlnPnXFsfouS5D4PlRsHGDTe4/7R9uxnIHowZ4w6Ahg3Npk0zK1fOfV4yUfFeAt8BKT03dOyYW4u/fHn+NpMLAAb20qVL7aHExIEBCFsfNlN7HTd+/HiH5Dck8I2y9xUrVnRCgc' +
            'cffzy3zzdv3mz16tVzQoHq1avbvHnzDDG0O6/k2Nq1aw0Vf2FXcRQAvPOKFSvsRUw6EVc2+9gVgGBBDWZ+zLqTJkW+lAUHCO4MEwDY5p493VLdK1dcG/7KK9HP9T5ZuNCsSRN3xoZowIL77JBzW1wBgKAg/wBxg/vADNKiRep3' +
            'gOupXdu9D+ID9/PxxxIAXw+MGDHCSVSVKlXKrly54sTir8TA15/oC7O73k+0bdvW3n//fbvtttucf/KSewg3Vq9e7cyUXrLw8OHD1qJFC/sKuamQqzgKABKcEEsIWdSVzT52BaBvX7NBg/Li83/+0+yPf0w9QPDS2IHnJQvDBM' +
            'BfqptOqSoGKAZuAniDhUeC0n/FFYDULQm/wz+7SwBC9wLs2LHDnkyUYgcz6cm6HQMVTsAb2MuWLbOXgvgmHoD7kBPwQoHvv//ecR0QB89FnDlzxgYOHGgffPBB5M8WRwFAqPTUU09FroigMdnsY1cApkwxa9/eHcjYQjtunFnv' +
            '3qmHDWw8Zngvtg8KAHbozZ7tLrXh2rLF7OmnUz8Xd1Ss6MbmWI3AhaW44NJTpgUATugPfzD7/e/dfAeWjkqWlAOI2AuA2Rdx+j0JfLds2WJPx8QX9h5LdA8m8E21tIhcgvds2GbEzVgywxXXeRRHAQjL9PsHSLb72BUA/0yXzv' +
            'bZ4AAMCgByClhHT7GuHEsRwtxDYQUAeQkkG7FRqHx5s7vuckXMG+xhLyQHUMABxK0biINvKveAuB8D+F6c9xC4du3a5SQXISLJruIoAKk2JGW7j10B8Nv0KKKH9Wxwlg4KQLDgJQ4Tou7JhAAgOYQlp9/9LvlglwBYnCx4MOtd' +
            'NHjzF+KEPQtnEyDf4Nl+3JNsFSH4jKtRALLdx64A7NnjLsPhSkcAcL//u8VZADp2dPfO3357NE+RIIQD+u9/3UInhByoFkzWL8SrANkmZxCo9u3b23vvvZevaMa/5p9KgCQABUUWy8A5/iQDllew1vpxMNsd0bt79uxx1nhxBe' +
            'OZIEHWrFkTuUSTCrywz4NFHlE2EvZx6tSpdj+KlhIXYsijR48669UHDhxw1lu//vrrfDbSPwtG9UucmTL47oVZLw6zinHbn6xvc6I+jCNsQYeHuoqIJbjC4JvvO8kKubBag9qUVEehxdlf4f1onPYXBDb/EXnplniHdVKW+9gR' +
            'AD+JkU3t37+/k6FNddWoUcNZvvAGVlAAsLyBJQyvQCSdJFGq38bncQcA3rFZs2a5y0UotkBt+WdhNQ6+H44jAFiKev75551vxT04I85MFOeeuO3PmgAEk8DpJHnjAOy/B8nkli3NEkVB+b6OPRioGB04MPlT0xGA1avNErjG3u' +
            'MR5/lx7vG3Ist97AgAznuDvcJ6KjKqkyZNSlrI4b0flnKwqQMHRoY5gPr16zuJmzsTxTSpEj3pciLOAAhmm+Osu3rvgeTSo48+6vxnlAPwD9S4AoBKNpyz512pNo3gvmLpAOrXNwOhvWKpdJZ50wEbNRyoAfGqT1EX8o9/mNWt' +
            'm1cshkIthHk4CSrqSmfw+e+Nu8kL9SU+XJ2Ct+CZg+m8A9qR5T52BCA4U+/cudNq1qyZdG0S7wahQM21V4MddADYtbR169bcTR0o4kCZJhxGJq44AhC8J866K94tuE599uxZGzRokBOD+i+/AMQRT/QJyj5xLl1RBSDowAojsJ' +
            'EhQJwZEKs7W7fmLc9evOiewJwhfJ3+CVaSIk+zYoXrBpYscXdienUoURWjXkf7l7tdVY0+adk/UFHAhqK4ZNWr6IsNG8x8uGZEALLcx44AYJZEIcbDDz/sdFWyemqvL4NlmGEOIEwk4iZtsOsJGyE8dxEmSoURgG+//daaNm2a' +
            'W2MdJkQYpEuWLHHOxPOqzKJmd4RKeNcoEQw+P1jTHTW7xwkB8F1/DiajAhB3BsTA6NAhfwk5/ht7PJJdwVk9aq9FcA/Hf/7jxvtY8qtXz2zqVHdDGq7Ll926E/9x6v53iLMN27vfXz3qkjv5kffB/S5RApOuA3AHUdb62BEA/A' +
            'Z2ZXXt2tUp6cSF5ZV33nkntLIKSb+ZM2c6Wy29ARIlAGG7sXbv3u04h6iSTVSEYWB5uYWowRdHAMJcCPaJo5Q07MJvImGIuN6rPMN9Ue8QdE+nTp1yNrfAHQWvYLu8zwsbAgQFAEnNNm3aOPXwca9IBxAUAGwRD9sSHbY7c/du' +
            'l7ARJblORScGmDdwoyw2qlPxdye8PSFYoUGc76/2wyYzYOntSMW5kChiCzs7ICgAEItXXw3vqmDsnaw8PtiePGCLHgLgWVns41wBiJr1Nm3a5MSfSKRh4L/22mvOwQleXO/vvaiqprD1WwwUlHNiqyb2buP3GzVq5BwEgZnXv9' +
            'br3wDi/704AoD7Z82aZSio8GZpDOYvvvjCpk2bZp9++qnzSOxUw//q1q2bW57q/y18Z9SoUfZWYBAE3RO+g3wBHAT2emN1AasQ2PwCUUE7ceADqtk8sS2KAPjzFFjZ+OSTT6xPnz6OOKNSDv+d7IoUgKBd/ve/3ePXEWuDkP4k' +
            'MZZXsd/DG6j4weBOUljZRo3c/R2w7f57N292Z3N/Fj84u0ftI8FzsWMV7+Rdu3a5hV7BwiCcRQEB8f5wDDa89eljtmmTG2tjlj9wwH0KalzgPhKu2Pk3vB/CDhS3YZce3hFuA8lCvAeqaBGieEfUZyIH4LUpG32M7cCeA8DvhB' +
            '2skIw8WD6DRb8LlXQhy4D+72KwQTi801LizlD79u1zTpj58ssvC3wlrgAEd1PF+W3E/BAexNnXJwiDstdXQ2aMMIGL+g0MUqw+VKtWLfeUmqIIAJ4VtZMszrJrpAAE94f4G4SBg70a2DPiXdhtib9J4M3EcToZ9+zb554+5ccX' +
            'gykY30cNajwDAxGOxasSRCjw17+6fw/Cf0F8sMMzrBYEgoX38G/KCRt00cC6O2erVcs7pj2TAoDfzWQfJ9qRTwA8ERg3bpzVqlUrt9Y62GbMXii7xBIf/ucdt5SqrhlVXDgyKcw9BH8DsyQGPY5KiirxjCsALkfqGdrlbVuNwh' +
            'FtQ74BG0tuueUWZ5/67QnCJFvGHDt2rDPLJztOC7kVHF6xePFix1V5/VYUAWjYsKGzEhN2Cg9CLf8pOWFtjhQADMK//93duxE8GSpssODhcAGw7HEOlMFsiUHfvXvBmTpo6+Ns3w7+gZgoy45j5OFEgsuJOO4Ov4swwX/hBCnM' +
            '8snK2bEqMXeue7YEBr13/FimBSCTfRwlAF7bQSzMvLCSGAiI9TEokWiCvUV+IHjcUioBwLMxQGBRMWv5z4zDZ+fPn7fjx48bBhpi6LBZ349NOgLg/Tbic4Qa5cuXzz29Bu1CzuObb75x9p/DrXj3+zP2x44dc/6SDP6kVNiFxC' +
            'gEq3bt2lauXDlHQCEoWHrEnnesgKBuIPjeRREAvAf2v2OFAoP9Jpxv6PxZxEtOkRMO1ECYECl4kZ+YG6Nj+Q2Ho2BXpnd244kT7p8iC9t5h4ECW4397f4zH12AzY4fdzeFIUcS4uoKbDOPms2D743fReLRvxkJVapNm+YXGNyH' +
            'cnDsYoVQQQi88yjhDuB8ghf2jECosDUcZ0pgzwi+g3wDVh6w8oFVk2Csng0BcIlZtD72ta+AA0jGB3326+uBSAfw62uqWhTSAxIAclpIALgJIAHgxt9dA9ZF2wMSAFro3YZLALgJIAHgxl8CQI6/BICcAHIA3ASQAHDjLwdAjr' +
            '8EgJwAcgDcBJAAcOMvB0COvwSAnAByANwEkABw4y8HQI6/BICcAHIA3ASQAHDjLwdAjr8EgJwAcgDcBJAAcOMvB0COvwSAnAByANwEkABw4y8HQI6/BICcAHIA3ASQAHDjLwdAjr8EgJwAcgDcBJAAcOMvB0COvwSAnAByANwE' +
            'kABw4y8HQI6/BICcAHIA3ASQAHDjLwdAjr8EgJwAcgDcBJAAcOMvB0COvwSAnAByANwEkABw4y8HQI6/BICcAHIA3ASQAHDjLwdAjr8EgJwAcgDcBJAAcOMvB0COvwSAnAByANwEkABw4y8HQI6/BICcAHIA3ASQAHDjLwdAjr' +
            '8EgJwAcgDcBJAAcOMvB0COvwSAnAByANwEkABw4y8HQI6/BICcAHIA3ASQAHDjLwdAjr8EgJwAcgDcBJAAcOMvB0COvwSAnAByANwEkABw4y8HQI6/BICcAHIA3ASQAHDjLwdAjr8EgJwAcgDcBJAAcOMvB0COvwSAnAByANwE' +
            'kABw4y8HQI6/BICcAHIA3ASQAHDjLwdAjr8EgJwAcgDcBJAAcOMvB0COvwSAnAByANwEkABw4y8HQI6/BICcAHIA3ASQAHDjLwdAjr8EgJwAcgDcBJAAcOMvB0COvwSAnAByANwEkABw4y8HQI6/BICcAHIA3ASQAHDjLwdAjr' +
            '8EgJwAcgDcBJAAcOMvB0COvwSAnAByANwEkABw4y8HQI6/BICcAHIA3ASQAHDjLwdAjr8EgJwAcgDcBJAAcOMvB0COvwSAnAByANwEkABw4y8HQI6/BICcAHIA3ASQAHDjLwdAjr8EgJwAcgDcBJAAcOMvB0COvwSAnAByANwE' +
            'kABw4y8HQI6/BICcAHIA3ASQAHDjLwdAjr8EgJwAcgDcBJAAcOMvB0COvwSAnAByANwEkABw4y8HQI6/BICcAHIA3ASQAHDjLwdAjr8EgJwAcgDcBJAAcOMvB0COvwSAnAByANwEkABw4y8HQI6/BICcAHIA3ASQAHDjLwdAjr' +
            '8EgJwAcgDcBJAAcOMvB0COvwSAnAByANwEkABw4y8HQI6/BICcAHIA3ASQAHDjLwdAjr8EgJwAcgDcBJAAcOMvB0COvwSAnAByANwEkABw4y8HQI6/BICcAHIA3ASQAHDjLwdAjr8EgJwAcgDcBJAAcOMvB0COvwSAnAByANwE' +
            'kABw4y8HQI6/BICcAHIA3ASQAHDjLwdAjr8EgJwAcgDcBJAAcOMvB0COvwSAnAByANwE+D8fqGtTAqyWBwAAAABJRU5ErkJggg==';
        return res;
    };
    Tile.defaultTileSize = 100;
    Tile.defaultTexture = Tile._createDefaultTexture();
    Tile.tiles = [];
    return Tile;
}(GameElement));
