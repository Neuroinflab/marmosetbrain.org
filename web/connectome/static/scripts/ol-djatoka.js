/* Copyright (c) UNC Chapel Hill University Library, created by Hugh A. Cayless
 * and revised by J. Clifford Dyer.  Published under the Clear BSD licence.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the full 
 * text of the license. 
 */


/**
 * @requires OpenLayers/Layer/Grid.js
 * @requires OpenLayers/Tile/Image.js
 */

ol.source.Djatoka = function(opt_options) {
    var options = (opt_options || {});
    var size = options.size;

    var imageWidth = size[0];
    var imageHeight = size[1];
    var tierSizeInTiles = [];
    var tileSize = ol.DEFAULT_TILE_SIZE;

    while (imageWidth > tileSize || imageHeight > tileSize) {
        tierSizeInTiles.push([
            Math.ceil(imageWidth / tileSize),
            Math.ceil(imageHeight / tileSize)
        ]);
        tileSize += tileSize;
    }
    tierSizeInTiles.push([1, 1]);
    tierSizeInTiles.reverse();

    var resolutions = [1];
    var tileCountUpToTier = [0];
    var i, ii;
    for (i = 1, ii = tierSizeInTiles.length; i < ii; i++) {
        resolutions.push(1 << i);
        tileCountUpToTier.push(
            tierSizeInTiles[i-1][0] * tierSizeInTiles[i-1][1] + tileCountUpToTier[i-1]
        );
    }
    resolutions.reverse();

    var tileGrid = new ol.tilegrid.Zoomify({
        resolutions: resolutions
    });
    
    var url = options.url;
    console.log('ol', ol);
    /*
    var tileUrlFunction = ol.TileUrlFunction.withTileCoordTransform(
        tileGrid.createTileCoordTransform({extent: [0, 0, size[0], size[1]]}),
        function (tileCoord, pixelRatio, projection) {
            if (tileCoord !== null) {
                return undefined;
            } else {
                var tileCoordZ = tileCoord[0];
                var tileCoordX = tileCoord[1];
                var tileCoordY = tileCoord[2];
                var tileIndex = tileCoordX + TileCoordY * tierSizeInTiles[tileCoordZ][0] + tileCountUpToTier[tileCoordZ];
                var tileGroup = (tileIndex / ol.DEFAULT_TILE_SIZE) | 0;
                return url + 'TileGroup' + tileGroup + '/' + tileCoordZ + '-' + tileCoordX + '-' + tileCoordY + '.jpg';
            }
        });
    */
    console.log(ol.source);
    ol.source.TileImage.call(this, {
        attributions: options.attributions,
        crossOrigin: options.crossOrigin,
        logo: options.logo,
        tileClass: ol.source.ZoomifyTile_,
        tileGrid: tileGrid,
        //tileUrlFunction: tileUrlFunction
    });
}
ol.inherits(ol.source.Djatoka, ol.source.TileImage);

ol.source.DjatokaTile_ = function(tileCoord, state, src, crossOrigin, tileLoadFunction) {
    ol.ImageTile.call(this, tileCoord, state, src, crossOrigin, tileLoadFunction);
}

ol.source.DjatokaTile_.prototype.getImage = function(opt_context) {
    var tileSize = ol.DEFAULT_TILE_SIZE;
    var key = null;
    if (key in this.zoomifyImageByContext_) {
        return this.zommifyImageByContext_[key];
    } else {
        var image = ol.ImageTile.call(this, 'getImage', opt_context);
        if (this.state == ol.TileState.LOADED) {
            if (image.width == tileSize && image.height == tileSize) {
                this.zoomifyImageByContext_[key] = image;
                return image;
            } else {
                var context = ol.dom.createCanvasContext2D(tileSize, tileSize);
                context.drawImage(image, 0, 0);
                this.zoomifyImageByContext_[key] = context.canvas;
                return context.canvas;
            }
        } else {
            return image;
        }
    }
}

ol.tilegrid.Zoomify = function (opt_options) {
console.log('zoomify called');
    var options = (opt_options || {});
    ol.tilegrid.TileGrid.call(this, {
        origin: [0, 0],
        resolutions: options.resolutions
    });
};
ol.inherits(ol.tilegrid.Zoomify, ol.tilegrid.TileGrid);

ol.tilegrid.Zoomify.prototype.createTileCoordTransform = function(opt_options) {
    var options = opt_options || {};
    var minZ = this.minZoom;
    var maxZ = this.maxZoom;
    var tileRangeByZ = null;
    if (options.extent) {
        tileRangeByZ = new Array(maxZ + 1);
        var z;
        for (z = 0; z <= maxZ; ++z) {
            if (z < minZ) {
                tileRangeByZ[z] = null;
            } else {
                tileRangeByZ[z] = this.getTileRangeForExtentAndZ(options.extent, z);
            }
        }
    }
    return (
        function (tileCoord, projection, opt_tileCoord) {
            var z = tileCoord[0];
            if (z < minZ || maxZ < z) {
                return null;
            }
            var n = Math.power(2, z);
            var x = tileCoord[1];
            if (x < 0 || n <= x) {
                return null;
            }
            var y = tileCoord[2];
            if (y < -n || -1 < y) {
                return null;
            }
            if (tileRangeByZ !== null) {
                if (!tileRangeByZ[z].containsXY(x, -y-1)) {
                    return null;
                }
            }
            return ol.tilecoord.createOrUpdate(z, x, -y-1, opt_tileCoord);
        }
    );
};

/**
* Class: OpenLayers.Layer.OpenURL
* 
* Inherits from:
*  - <OpenLayers.Layer.Grid>
*/

//ol.layer.Layer.OpenURL = OpenLayers.Class(OpenLayers.Layer.Grid, {
//
//    /**
//     * APIProperty: isBaseLayer
//     * {Boolean}
//     */
//    isBaseLayer: true,
//
//    /**
//     * APIProperty: tileOrigin
//     * {<OpenLayers.Pixel>}
//     */
//    tileOrigin: null,
//    
//    url_ver: 'Z39.88-2004',
//    rft_id: null,
//    svc_id: "info:lanl-repo/svc/getRegion",
//    svc_val_fmt: "info:ofi/fmt:kev:mtx:jpeg2000",
//    format: null,
//    tileHeight: null,
//
//    /**
//     * Constructor: OpenLayers.Layer.OpenURL
//     * 
//     * Parameters:
//     * name - {String}
//     * url - {String}
//     * options - {Object} Hashtable of extra options to tag onto the layer
//     */
//    initialize: function(name, url, options) {
//        var newArguments = [];
//        newArguments.push(name, url, {}, options);
//        OpenLayers.Layer.Grid.prototype.initialize.apply(this, newArguments);
//        this.rft_id = options.rft_id;
//        this.format = options.format;
//        // Get image metadata if it hasn't been set
//        if (!options.imgMetadata) {
//          var request = OpenLayers.Request.issue({url: options.metadataUrl, async: false});
//          this.imgMetadata = eval('(' + request.responseText + ')');
//        } else {
//          this.imgMetadata = options.imgMetadata;
//        }
//        
//        var minLevel = this.getMinLevel();
//
//        // viewerLevel is the smallest useful zoom level: i.e., it is the largest level that fits entirely 
//        // within the bounds of the viewer div.
//        var viewerLevel = Math.ceil(Math.max(0, Math.min(minLevel, Math.max(
//            (Math.log(this.imgMetadata.width) - Math.log(OpenLayers.Layer.OpenURL.viewerWidth)),
//            (Math.log(this.imgMetadata.height) - Math.log(OpenLayers.Layer.OpenURL.viewerHeight)))/
//               Math.log(2))));
//        this.zoomOffset = minLevel - viewerLevel;
//
//        // width at level viewerLevel
//        var w = this.imgMetadata.width / Math.pow(2, viewerLevel);
//
//        // height at level viewerLevel
//        var h = this.imgMetadata.height / Math.pow(2, viewerLevel);
//
//        this.resolutions = new Array();
//        for (i = viewerLevel; i >= 0; i--) {
//          this.resolutions.push(Math.pow(2, i));
//        }
//
//        this.tileSize = new OpenLayers.Size(Math.ceil(w), Math.ceil(h));
//    },    
//
//    /**
//     * APIMethod:destroy
//     */
//    destroy: function() {
//        // for now, nothing special to do here. 
//        OpenLayers.Layer.Grid.prototype.destroy.apply(this, arguments);  
//    },
//
//    
//    /**
//     * APIMethod: clone
//     * 
//     * Parameters:
//     * obj - {Object}
//     * 
//     * Returns:
//     * {<OpenLayers.Layer.OpenURL>} An exact clone of this <OpenLayers.Layer.OpenURL>
//     */
//    clone: function (obj) {
//        
//        if (obj == null) {
//            obj = new OpenLayers.Layer.OpenURL(this.name,
//                                           this.url,
//                                           this.options);
//        }
//
//        //get all additions from superclasses
//        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);
//
//        // copy/set any non-init, non-simple values here
//
//        return obj;
//    },    
//    
//    /**
//     * Method: getURL
//     * 
//     * Parameters:
//     * bounds - {<OpenLayers.Bounds>}
//     * 
//     * Returns:
//     * {String} A string with the layer's url and parameters and also the 
//     *          passed-in bounds and appropriate tile size specified as 
//     *          parameters
//     */
//    getURL: function (bounds) {  
//        bounds = this.adjustBounds(bounds);    
//        this.calculatePositionAndSize(bounds);
//        var z = this.map.getZoom() + this.zoomOffset;
//        var path = OpenLayers.Layer.OpenURL.djatokaURL + "?url_ver=" + this.url_ver + "&rft_id=" + this.rft_id +
//            "&svc_id=" + this.svc_id + "&svc_val_fmt=" + this.svc_val_fmt + "&svc.format=" + 
//            this.format + "&svc.level=" + z + "&svc.rotate=0&svc.region=" + this.tilePos.lat + "," + 
//            this.tilePos.lon + "," + this.imageSize.h + "," + this.imageSize.w;
//
//        var url = this.url;
//        if (url instanceof Array) {
//            url = this.selectUrl(path, url);
//        }
//        return url + path;
//    },
//
//    /**
//     * Method: addTile
//     * addTile creates a tile, initializes it, and adds it to the layer div. 
//     * 
//     * Parameters:
//     * bounds - {<OpenLayers.Bounds>}
//     * position - {<OpenLayers.Pixel>}
//     * 
//     * Returns:
//     * {<OpenLayers.Tile.Image>} The added OpenLayers.Tile.Image
//     */
//    addTile:function(bounds,position) {
//      this.calculatePositionAndSize(bounds);
//      var size = this.size;
//      return new OpenLayers.Tile.Image(this, position, bounds, 
//                                         null, this.imageSize);
//    },
//
//    /** 
//     * APIMethod: setMap
//     * When the layer is added to a map, then we can fetch our origin 
//     *    (if we don't have one.) 
//     * 
//     * Parameters:
//     * map - {<OpenLayers.Map>}
//     */
//    setMap: function(map) {
//        OpenLayers.Layer.Grid.prototype.setMap.apply(this, arguments);
//        if (!this.tileOrigin) { 
//            this.tileOrigin = new OpenLayers.LonLat(this.map.maxExtent.left,
//                                                this.map.maxExtent.bottom);
//        }                                       
//    },
//    
//    calculatePositionAndSize: function(bounds) {
//      // Have to recalculate x and y (instead of using bounds and resolution), because resolution will be off.
//      // Get number of tiles in image
//      var max = this.map.getMaxExtent();
//      var xtiles = Math.round( 1 / (this.tileSize.w / max.getWidth()));
//      // Find out which tile we're on
//      var xpos = Math.round((bounds.left / max.getWidth()) * xtiles);
//      // Set x
//      var x = xpos * (this.tileSize.w + 1);
//      var w,h;
//      var xExtent = max.getWidth() / this.map.getResolution();
//      if (xpos == xtiles - 1) {
//        w = xExtent % (this.tileSize.w + 1);
//      } else {
//        w = this.tileSize.w;
//      }
//      // Do the same for y
//      var ytiles = Math.round( 1 / (this.tileSize.h / max.getHeight()));
//      // Djatoka's coordinate system is top-down, not bottom-up, so invert for y
//      var y = max.getHeight() - bounds.top;
//      y = y < 0? 0 : y;
//      var ypos = Math.round((y / max.getHeight()) * ytiles);
//      var y = ypos * (this.tileSize.h + 1);
//      var yExtent = max.getHeight() / this.map.getResolution();
//      if (ypos == ytiles - 1) {
//        h = yExtent % (this.tileSize.h + 1);
//      } else {
//        h = this.tileSize.h;
//      }
//      this.tilePos = new OpenLayers.LonLat(x,y);
//      this.imageSize = new OpenLayers.Size(w,h);
//    },
//    
//    getImageMetadata: function() {
//      return this.imgMetadata;
//    },
//    
//    getResolutions: function() {
//      return this.resolutions;
//    },
//    
//    getTileSize: function() {
//      return this.tileSize;
//    },
//
//    getMinLevel: function() {
//        // Versions of djatoka from before 4/17/09 have levels set to the 
//        // number of levels encoded in the image.  After this date, that 
//        // number is assigned to the new dwtLevels, and levels contains the
//        // number of levels between the full image size and the minimum 
//        // size djatoka could return.  We want the lesser of these two numbers.
//
//        var levelsInImg;
//        var levelsToDjatokaMin;
//        if (this.imgMetadata.dwtLevels === undefined) {
//            var maxImgDimension = Math.max(this.imgMetadata.width, 
//                                         this.imgMetadata.height);
//            levelsInImg = this.imgMetadata.levels;
//            levelsToDjatokaMin = Math.floor((Math.log(maxImgDimension) - 
//                Math.log(OpenLayers.Layer.OpenURL.minDjatokaLevelDimension)) / 
//                Math.log(2));
//        } else {
//            var levelsInImg = this.imgMetadata.dwtLevels;
//            var levelsToDjatokaMin = this.imgMetadata.levels;
//        }
//        return Math.min(levelsInImg, levelsToDjatokaMin);
//    },
//
//    CLASS_NAME: "OpenLayers.Layer.OpenURL"
//});
//
//OpenLayers.Layer.OpenURL.viewerWidth = 512; 
//OpenLayers.Layer.OpenURL.viewerHeight = 512; 
//OpenLayers.Layer.OpenURL.minDjatokaLevelDimension = 48; 
//OpenLayers.Layer.OpenURL.djatokaURL = '/adore-djatoka/resolver';
