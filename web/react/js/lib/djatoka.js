import _ol_ from 'ol';
import Map from 'ol/map';
import View from 'ol/view';
import OSM from 'ol/source/osm';
import _ol_TileState_ from 'ol/tilestate';
import _ol_dom_ from 'ol/dom';
import _ol_extent_ from 'ol/extent';
import _ol_TileGrid_ from 'ol/tilegrid/tilegrid';

import _ol_source_TileImage_ from 'ol/source/tileimage';
import _ol_ImageTile_ from 'ol/imagetile';

var _ol_source_DjatokaTile_ = function(
    tileCoord, state, src, crossOrigin, tileLoadFunction) {
    _ol_ImageTile_.call(this, tileCoord, state, src, crossOrigin, tileLoadFunction);

    /**
     * @private
     * @type {Object.<string,
     *   HTMLCanvasElement|HTMLImageElement|HTMLVideoElement>}
     */
    this.imageCache = null;

};
_ol_.inherits(_ol_source_DjatokaTile_, _ol_ImageTile_);

_ol_source_DjatokaTile_.prototype.getImage = function() {
    var tileSize = _ol_.DEFAULT_TILE_SIZE;
    if (this.imageCache) {
        return this.imageCache;
    }
    var image = _ol_ImageTile_.prototype.getImage.call(this);
    if (this.state == _ol_TileState_.LOADED) {
        if (image.width == tileSize && image.height == tileSize) {
            //this.zoomifyImageByContext_[key] = image;
            this.imageCache = image;
            return image;
        } else {
            // this is to draw the edge of the image which it doesn't fill a full grid
            var context = _ol_dom_.createCanvasContext2D(tileSize, tileSize);
            context.drawImage(image, 0, 0);
            //this.zoomifyImageByContext_[key] = context.canvas;
            //this.zoomifyImage_ = context.canvas;
            //return context.canvas;
            this.imageCache = context.canvas;
            //return context.canvas;
            return context.canvas;
        }
    } else {
        return image;
    }
};


var _ol_source_Djatoka_ = function(opt_options) {
    var options = opt_options || {};
    this.url = options.url || 'http://'+ window.location.hostname + '/webapps/adore-djatoka/resolver';
    this.url_ver = 'Z39.88-2004';
    this.rft_id = options.image;
    this.svc_id = 'info:lanl-repo/svc/getRegion';
    this.svc_val_fmt = 'info:oft/fmt:kev:mtx:jpeg2000';
    this.format = 'image/jpeg';

    this.resolutions = [1];
    var tileGrid;
    var that = this;
    /**
    * @param {ol.TileCoord} tileCoord Tile Coordinate.
    * @param {number} pixelRatio Pixel ratio.
    * @param {ol.proj.Projection} projection Projection.
    * @return {string|undefined} Tile URL.
    */
    var tileUrlFunction = function(tileCoord, pixelRatio, projection) {
        if (!tileCoord) {
            return undefined;
        } else {
            var cz = tileCoord[0];
            var cx = tileCoord[1];
            var cy = - tileCoord[2] - 1;
            var res = that.resolutions[cz];
            console.log('res is', res);
            return that.url + '?url_ver=' + that.url_ver + '&rft_id=' + that.rft_id + '&svc_id=' + that.svc_id +
                '&svc_val_fmt=' + that.svc_val_fmt + '&svc.format=' + that.format +
                '&svc.level=' + (cz + 1) + '&svc.rotate=0&svc.region=' +
                256 * cy * res + ',' + 256 * cx * res + ',256,256' +
                '&svc.crange=0-255,0-255,0-255';
        }
    }
    _ol_source_TileImage_.call(this, {
        attributions: options.attributions,
        crossOrigin: options.crossOrigin,
        logo: options.logo,
        tileClass: _ol_source_DjatokaTile_,
        tileGrid: tileGrid,
        tileUrlFunction: tileUrlFunction
    });

    /**
     * The image meta stored in jp2 file including width and height
     * @protected
     * @type {Object|undefined}
     */
     this.imageMeta_;

};
_ol_.inherits(_ol_source_Djatoka_, _ol_source_TileImage_);
export {_ol_source_Djatoka_};

_ol_source_Djatoka_.prototype.getTileSize = function() {
    return [256, 256];
};

_ol_source_Djatoka_.prototype.getImageMetadata = function(callback) {
    var meta_url = this.url + '?url_ver=' + this.url_ver + '&rft_id=' + this.rft_id + '&svc_id=info:lanl-repo/svc/getMetadata';
    var that = this;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', meta_url, true);

    xhr.onload = function(e) {
        //var xhr = e.target;
        var obj = JSON.parse(xhr.responseText);
        that.imageMeta_ = obj;
        var width = obj.width;
        var height = obj.height;
console.log('obj.levels', obj.levels, obj);
        for (var i=1, ii=obj.levels; i < ii; i++) {
            that.resolutions.push(1 << i);
        }
        that.resolutions.reverse();
        var extent = [0, -height, width, 0];
        that.tileGrid = new _ol_TileGrid_({
            extent: extent,
            origin: _ol_extent_.getTopLeft(extent),
            resolutions: that.resolutions
        });
        console.log('dump resolutions', that.resolutions);
        callback && callback();
    };
    xhr.send();
};
_ol_source_Djatoka_.prototype.getMeta = function() {
    return this.imageMeta_;
};
