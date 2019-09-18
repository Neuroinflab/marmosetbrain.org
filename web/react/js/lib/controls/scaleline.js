/* Kudos to Jeff Ward: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript */
/**
 * Fast UUID generator, RFC4122 version 4 compliant.
 * @author Jeff Ward (jcward.com).
 * @license MIT license
 * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
 **/
import _ol_ from 'ol';
import _ol_View_ from 'ol/view';
import _ol_layer_Vector_ from 'ol/layer/vector';
import _ol_source_Vector_ from 'ol/source/vector';
import _ol_style_Style_ from 'ol/style/style';
import _ol_style_Fill_ from 'ol/style/fill';
import _ol_Collection_ from 'ol/collection';
import _ol_Feature_ from 'ol/feature';
import _ol_geom_Polygon_ from 'ol/geom/polygon';
import _ol_geom_Point_ from 'ol/geom/point';
import _ol_control_Control_ from 'ol/control/control';
import _ol_control_ScaleLine_ from 'ol/control/scaleline';
import _ol_proj_ from 'ol/proj';

var ScaleLine = function(opt_options) {
    var options = opt_options || {};
    var className = typeof options.className !== 'undefined' ?
        options.className : 'ol-scale-line';

    this.innerElement_ = document.createElement('div');
    this.innerElement_.className = 'ol-scale-line-inner';

    this.element_ = document.createElement('div');
    this.element_.className = className + ' ol-unselectable';
    this.element_.appendChild(this.innerElement_);

    this.viewState_ = null;

    this.minWidth_ = typeof options.minWidth !== 'undefined' ? options.minWidth : 64;

    this.renderedVisible_ = false;

    this.renderedWidth_ = undefined;
    this.renderedHTML_ = '';
    let render = options.render ? options.render : ScaleLine.render;

    _ol_control_Control_.call(this, {
        element: this.element_,
        render: render,
        target: options.target
    });

    //goog.events.listen(
    //    this, ol.Object.getChangeEventType(ol.control.ScaleLineProperty.UNITS),
    //    this.handleUnitsChanged_, false, this);

    //this.setUnits(/** @type {ol.control.ScaleLineUnits} */ (options.units) ||
    //    ol.control.ScaleLineUnits.METRIC);

};
_ol_.inherits(ScaleLine, _ol_control_ScaleLine_);

ScaleLine.render = function(mapEvent) {
    var frameState = mapEvent.frameState;
    if (frameState === null) {
        this.viewState_ = null;
    } else {
        this.viewState_ = frameState.viewState;
    }
    this.updateElement_();
};
ScaleLine.prototype.updateElement_ = function () {
    var viewState = this.viewState_;
    if (viewState === null) {
        if (this.renderedVisible_) {
            this.element_.style.display = 'none';
            this.renderedVisible_ = false;
        }
        return;
    }

    var center = viewState.center;
    var projection = viewState.projection;
    var pointResolution =
        _ol_proj_.getPointResolution(projection, viewState.resolution, center);
    //var projectionUnits = projection.getUnits();
    var suffix = 'mm';

    /*var units = this.getUnits();
    var nominalCount = this.minWidth_ * pointResolution;
    var i = 3 * Math.floor(Math.log(this.minWidth_ * pointResolution) / Math.log(10));
    var count, width;
    while (true) {
        count = ol.control.ScaleLine.LEADING_DIGITS[i % 3] * Math.pow(10, Math.floor(i / 3));
        width = Math.round(count / pointResolution);
        console.log('i', i, 'width', width, 'count', count, 'res', pointResolution);
        if (isNaN(width)) {
            //goog.style.setElementShown(this.element_, false);
            this.renderedVisible_ = false;
            return;
        } else if (width >= this.minWidth_) {
            break;
        }
        ++i;
    }
    */
    var count, width;
    count = 1.;
    width = Math.round(count / pointResolution);
    while (true) {
        if (width > 500) {
            count /= 2;
            width /= 2;
        } else {
            break;
        }
    }
    var html = count + ' ' + suffix;
    if (this.renderedHTML_ != html) {
        this.innerElement_.innerHTML = html;
        this.renderedHTML_ = html;
    }

    if (this.renderedWidth_ != width) {
        this.innerElement_.style.width = width + 'px';
        this.renderedWidth_ = width;
    }
    if (!this.renderedVisible_) {
        //goog.style.setElementShown(this.element_, true);
        this.element_.style.display = '';
        this.renderedVisible_ = true;
    }

};
export default ScaleLine;
