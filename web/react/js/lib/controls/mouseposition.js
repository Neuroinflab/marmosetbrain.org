import _ol_ from 'ol';
import _ol_control_Control_ from 'ol/control/control';
import _ol_proj_ from 'ol/proj';

var _ol_control_MousePosition_ = function(opt_options) {
    var options = opt_options || {};


    var className = options.className || 'ol-mouse-position';
    var elem = document.createElement('div');
    elem.className = className;

    var render = options.render || _ol_control_MousePosition_.render;
    _ol_control_Control_.call(this, {
        element: elem,
        render: render,
        target: options.target
    });
    this.undefinedHTML_ = options.undefinedHTML || '';
    this.renderedHTML_ = elem.innerHTML;
    this.lastMouseMovePixel_ = null;

}
_ol_.inherits(_ol_control_MousePosition_, _ol_control_Control_);

_ol_control_MousePosition_.render = function (mapEvent) {
    var frameState = mapEvent.frameState;
    if (frameState === null) {
        this.mapProjection_ = null;
    } else {
        if (this.mapProjection_ != frameState.viewState.projection) {
            this.mapProjection_ = frameState.viewState.projection;
            this.transform_ = null;
        }
    }
    //this.updateHTML_(this.lastMouseMovePixel_);
};
_ol_control_MousePosition_.prototype.setMap = function(map) {
    var that = this;
    _ol_control_Control_.prototype.setMap.call(this, map);
    if (map !== null) {
        var viewport = map.getViewport();
        this.listenerKeys.push(
            /*
               goog.events.listen(viewport, goog.events.EventType.MOUSEMOVE,
               this.handleMouseMove, false, this),
               goog.events.listen(viewport, goog.events.EventType.MOUSEOUT,
               this.handleMouseOut, false, this)
               */
                viewport.addEventListener('mousemove', function(e) { that.handleMouseMove.call(that, e); }, false)
                );
    }
};
_ol_control_MousePosition_.prototype.handleMouseMove = function (e) {
    var map = this.getMap();
    this.lastMouseMovePixel_ = map.getEventPixel(e);
    this.updateHTML_(this.lastMouseMovePixel_);
    //this.updateHTML_(this.lastMouseMovePixel_);
    //console.log('mose moved', e);
};
_ol_control_MousePosition_.prototype.updateHTML_ = function (pixel) {
    let html = this.undefinedHTML_;
    let html_mm = this.undefinedHTML_;
    let map = this.getMap();
    let coordinate = map.getCoordinateFromPixel(pixel);
    if (coordinate !== null) {
        html = (coordinate[0]).toFixed(2) + 'px' + ' ' +
            (coordinate[1]).toFixed(2) + 'px';
        html_mm = (coordinate[0] / app.res).toFixed(2) + 'mm' + ' ' +
            (-coordinate[1] / app.res).toFixed(2) + 'mm';

    }
    if (typeof this.renderedHTML_ !== 'undefined' || html != this.renderedHTML_) {
        this.element.innerHTML = html;
        this.renderedHTML_ = html;
    }
    console.debug('Coordinate: ' + html);
};
export default _ol_control_MousePosition_;
