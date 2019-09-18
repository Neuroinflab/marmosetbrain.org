import Actions from '../../actions/Actions';
import _ol_ from 'ol';
import _ol_control_Control_ from 'ol/control/control';

export function _ol_control_ParcelButton_(opt_options) {
    let options = opt_options ? opt_options : {};

    let button = document.createElement('button');
    button.innerHTML = 'Parcellation';
    button.className = 'parcellation-toggle';

    let button_plus = document.createElement('button');
    button_plus.innerHTML = '+';
    button_plus.className = 'plus';

    let button_minus = document.createElement('button');
    button_minus.innerHTML = '&ndash;';
    button_minus.className = 'minus';

    let that = this;

    let handleToggle = function(e) {
        $(button).toggleClass('layer-invisible');
        if ($(button).hasClass('layer-invisible')) {
            app.parcel_opacity = -Math.abs(app.parcel_opacity);
        } else {
            app.parcel_opacity = Math.abs(app.parcel_opacity);
        }
        app.parcel_layer.setOpacity(app.parcel_opacity);
        Actions.saveViewerState();
    };
    button.addEventListener('click', handleToggle, false);
    button.addEventListener('touchstart', handleToggle, false);

    let parcel_minus = function(e) {
        let parcel_layer = app.parcel_layer;
        if (app.parcel_opacity >= 0) {
            let op = parcel_layer.getOpacity();
            op -= 0.1;
            if (op < 0) {
                op = 0;
            }
            app.parcel_opacity = op;
            app.parcel_layer.setOpacity(op);
        }
        Actions.saveViewerState();
    }
    button_minus.addEventListener('click', parcel_minus, false);
    button_minus.addEventListener('touchstart', parcel_minus, false);

    let parcel_plus = function(e) {
        if (app.parcel_opacity >= 0) {
            let parcel_layer = app.parcel_layer;
            let op = parcel_layer.getOpacity();
            op += 0.1;
            if (op > 1) {
                op = 1;
            }
            app.parcel_opacity = op;
            app.parcel_layer.setOpacity(op);
        }
        Actions.saveViewerState();
    }
    button_plus.addEventListener('click', parcel_plus, false);
    button_plus.addEventListener('touchstart', parcel_plus, false);

    let elem = document.createElement('div');
    elem.className = 'btn-parcel ol-unselectable ol-control';
    elem.appendChild(button);
    elem.appendChild(button_minus);
    elem.appendChild(button_plus);
    _ol_control_Control_.call(this, {
        element: elem,
        target: options.target
    });
}
_ol_.inherits(_ol_control_ParcelButton_, _ol_control_Control_);
