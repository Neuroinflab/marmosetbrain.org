import _ol_ from 'ol';
import _ol_Collection_ from 'ol/collection';
import _ol_control_Control_ from 'ol/control/control';
import _ol_source_Vector_ from 'ol/source/vector';
import _ol_layer_Vector_ from 'ol/layer/vector';
import _ol_interaction_Modify_ from 'ol/interaction/modify';
import _ol_interaction_Draw_ from 'ol/interaction/draw';
import _ol_format_GeoJSON_ from 'ol/format/geojson';
import _ol_events_condition_ from 'ol/events/condition';
import _ol_style_Style_ from 'ol/style/style';
import _ol_style_Fill_ from 'ol/style/fill';
import _ol_style_Circle_ from 'ol/style/circle';
import _ol_style_Stroke_ from 'ol/style/stroke';
export default function _ol_control_GotoAdmin_(opt_options) {

    var options = opt_options ? opt_options : {};
    let $elem = $('<div class="annotation ol-unselectable ol-control"></div>');
    let $label = $('<label>Admin feature disabled</label>');
    let $button = $('<button>Goto Admin Site</button>');
    $button.on('click', function() {
        let loc = window.location;
        loc.hostname = 'marmoset.mrosa.org';
    });
    $elem.append($label, $button);
    //, $select, $start, $save, $dropdown, $annolist);
    _ol_control_Control_.call(this, {
        element: $elem[0],
        target: options.target
    });
    //setTimeout(function() { $elem.slideUp()}, 5000);
}

_ol_.inherits(_ol_control_GotoAdmin_, _ol_control_Control_);
