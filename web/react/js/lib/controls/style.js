import _ol_ from 'ol';
import _ol_style_Style_ from 'ol/style/style';
import _ol_style_RegularShape_ from 'ol/style/regularshape';
import _ol_style_Fill_ from 'ol/style/fill';
import _ol_style_Stroke_ from 'ol/style/stroke';
import _ol_style_Circle_ from 'ol/style/circle';

function marker_lookup(resolution) {
    var micron_per_px = resolution / app.res;
    var ret = 0.016 / micron_per_px;
    //console.log('marker width', ret);
    return ret;
    /*
    switch (size) {
        case 1:
            return 8;
            break;
        case 2:
            return 6;
            break;
        case 4:
            return 4;
            break;
        case 8:
            return 2;
            break;
        default:
            return 1;
            break;
    }
    */
 
}
export function makeStyleFunc(shape, {fill, stroke} = {}) {
    let func = (function() {
        var style_cache = {};
        return function (feature, resolution) {
            if (style_cache[resolution]) {
                return style_cache[resolution];
            } else {
                let style;
                switch (shape) {
                    case 'square':
                        style = [new _ol_style_Style_({
                            image: new _ol_style_RegularShape_({
                                fill: fill,
                                stroke: stroke,
                                points: 4,
                                radius: Math.ceil(0.9 * marker_lookup(resolution)) + 1,
                                angle: Math.PI / 4
                            })
                        })];
                        break;
                    case 'triangle':
                        style = [new _ol_style_Style_({
                            image: new _ol_style_RegularShape_({
                                fill: fill,
                                stroke: stroke,
                                strokeWidth: 0,
                                points: 3,
                                radius: marker_lookup(resolution) + 2,
                                angle: 0
                            })
                        })];
                        break;
                    case 'circle':
                        style = [new _ol_style_Style_({
                            image: new _ol_style_Circle_({
                                fill: fill,
                                stroke: stroke,
                                strokeWidth: 0,
                                radius: marker_lookup(resolution) + 0.5
                            })
                        })];
                        break;
                    case 'injection':
                        style = [
                            new _ol_style_Style_({
                                image: new _ol_style_RegularShape_({
                                    stroke: new _ol_style_Stroke_({color: '#ffffff', width: 10}),
                                    points: 4,
                                    radius: marker_lookup(resolution) * 4 + 2,
                                    radius2: 0,
                                    angle: Math.PI / 4
                                })
                            }),
                            new _ol_style_Style_({
                                image: new _ol_style_RegularShape_({
                                    stroke: stroke,
                                    points: 4,
                                    radius: marker_lookup(resolution) * 4,
                                    radius2: 0,
                                    angle: Math.PI / 4
                                })
                            })
                        ];
                        break;
 
                }
                style_cache[resolution] = style;
                return style;
            }
        };
    })();
    return func;
}
