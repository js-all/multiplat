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
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    /**
     * crée un nouvean joueure
     * @param x - l'absice du joueure
     * @param y - l'ordoné du joueure
     * @param showHitBox - boolean indiquan si la hitbox du joueure doit être afficher
     * @param hitBoxColor - la couleure de la hitbox
     */
    function Player(x, y, showHitBox, hitBoxColor) {
        if (showHitBox === void 0) { showHitBox = false; }
        if (hitBoxColor === void 0) { hitBoxColor = 'red'; }
        return _super.call(this, 68.75, 93.75, x, y, 10, {
            walking: {
                spritesPath: [
                    "./images/sprites/player/walking/0.png",
                    "./images/sprites/player/walking/1.png",
                    "./images/sprites/player/walking/2.png",
                    "./images/sprites/player/walking/3.png"
                ],
                animeTime: 1000
            },
            jumping: {
                spritesPath: [
                    "./images/sprites/player/jumping/0.png"
                ],
                animeTime: 1000
            },
            attacking: {
                spritesPath: [
                    "./images/sprites/player/attacking/0.png"
                ],
                animeTime: 1000
            },
            nothing: {
                spritesPath: [
                    "./images/sprites/player/nothing/0.png"
                ],
                animeTime: 1000
            }
        }, 0, 0, Orientation.right, showHitBox, hitBoxColor) || this;
    }
    /**
     * dessine le joueure
     * @param ctx - le context sur le quelle dessiner le joueure
     */
    Player.prototype.draw = function (ctx) {
        if (this.showHitBox) {
            ctx.save();
            ctx.fillStyle = this.hitBoxColor;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        }
        var y = 1;
        ctx.drawImage(pathToImage(this.style.IMGPath || ''), 5, y, 22, 32 - (y), this.x, this.y, this.width, this.height);
    };
    return Player;
}(GameEntity));
