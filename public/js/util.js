"use strict";
/**
 * transform le chemin d'une image en cet image.
 * @param path - le chemin vers l'image.
 */
function pathToImage(path) {
    var res = new Image();
    res.src = path;
    return res;
}
/**
 * retourne à 180° une image sur l'axe des ordonés.
 * @param img l'image a retourner.
 */
function rotateImageOnYaxis(img) {
    var cnv = document.createElement('canvas');
    //cnv.style.display = 'none';
    document.body.appendChild(cnv);
    var c = cnv.getContext('2d');
    cnv.width = img.width;
    cnv.height = img.height;
    c.save();
    c.scale(-1, 1);
    c.drawImage(img, -img.width, 0);
    c.restore();
    var res = pathToImage(cnv.toDataURL('image/png'));
    cnv.remove();
    return res;
}
