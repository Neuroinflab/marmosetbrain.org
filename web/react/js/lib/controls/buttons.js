import _ol_ from 'ol';
import _ol_control_Control_ from 'ol/control/control';

export function _ol_control_ToggleLayer_(opt_options) {
    let options = opt_options ? opt_options : {};
    let button = document.createElement('button');
    button.innerHTML = options.title + '<span class="symbol-' + options.name + '">' + options.symbol + '</span>';
    button.className = "toggle-layer";
    button.id = 'layer_toggle_' + options.name;
    button.setAttribute('data-name', options.name);
    let state = app.toggleStatus[options.name];
    if (!state) {
        $(button).addClass('layer-invisible');
    }
    let that = this;
    let handleToggle = function(e) {
        let state = app.toggleStatus[options.name];
        let re = /^([a-zA-Z]+) /;
        that.getMap().getLayers().forEach(function (l) {
            if (l.get('name') == options.name || l.get('name') == options.name + '-Inj') {
                if (state) {
                    l.setVisible(false);
                    $(button).addClass('layer-invisible');
                    app.toggleStatus[options.name] = !state;
                    app.annotation_features.forEach(f => {
                        let cat = re.exec(f.get('annotation_type'));
                        console.log('set for category', cat[1]);
                        if (cat[1] == options.name) {
                            app.active_annotation_features.remove(f);
                        }
                    });
                } else {
                    l.setVisible(true);
                    $(button).removeClass('layer-invisible');
                    app.toggleStatus[options.name] = !state;
                    app.annotation_features.forEach(f => {
                        let cat = re.exec(f.get('annotation_type'));
                        console.log('set for category', cat[1]);
                        if (cat[1] == options.name) {
                            app.active_annotation_features.push(f);
                        }
                    });
                }
            }
        });
        app.annotation_src.dispatchEvent('change');
        /*
        app.annotation_features.forEach(function(f) {
            if (f.get('annotation_type').startsWith(options.name)) {
                if (state) {
                    f.set('hidden', true);
                } else {
                    f.unset('hidden');
                }
            }
        });
        */
        localStorage.toggle_status = JSON.stringify(app.toggleStatus);
    };

    button.addEventListener('click', handleToggle, false);
    button.addEventListener('touchstart', handleToggle, false);

    let element = document.createElement('div');
    element.className = 'toggle-layer toggle-layer-' + options.name + ' ol-unselectable ol-control';
    element.appendChild(button);
    _ol_control_Control_.call(this, {
        element: element,
        target: options.target
    });
};
_ol_.inherits(_ol_control_ToggleLayer_, _ol_control_Control_);

export function _ol_control_ToggleMeta_(opt_options) {
    let options = opt_options ? opt_options : {};
    let button = document.createElement('button');
    //button.innerHTML = app.case_id + '-' + app.section_code + ' \u00BB';
    let section_str = app.case_id + '-' + app.section_code;
    button.innerHTML = 'Case metadata \u00BB';
    button.className = 'btn-toggle-meta';
    let that = this;

    let handleToggle = function(e) {
        if ($('#flatmap').is(':visible')) {
            $('#flatmap').hide();
        }
        $('#brain-meta').animate({left:'toggle'}, 350);
    };
    button.addEventListener('click', handleToggle, false);
    button.addEventListener('touchstart', handleToggle, false);

    let elem = document.createElement('div');
    elem.className = 'toggle-meta ol-unselectable ol-control';
    elem.appendChild(button);
    _ol_control_Control_.call(this, {
        element: elem,
        target: options.target
    });
}
_ol_.inherits(_ol_control_ToggleMeta_, _ol_control_Control_);

export function _ol_control_SectionLabel_(opt_options) {
    let options = opt_options ? opt_options : {};
    //var button = document.createElement('button');
    //button.innerHTML = app.case_id + '-' + app.section_code + ' \u00BB';
    //button.innerHTML = 'Case metadata \u00BB';
    //button.className = 'btn-toggle-meta';
    let elem = document.createElement('div');
    elem.className = 'section-label ol-unselectable ol-control';
    let section_str = app.display_name + '-' + app.section_code;
    elem.innerHTML = '<span class="label-text">' + section_str + '</span>';
    _ol_control_Control_.call(this, {
        element: elem,
        target: options.target
    });
}
_ol_.inherits(_ol_control_SectionLabel_, _ol_control_Control_);


export function _ol_control_BackButton_(opt_options) {
    let options = opt_options ? opt_options : {};
    let button = document.createElement('button');
    //button.innerHTML = '\u00AB';
    button.innerHTML = 'Back to List';
    let that = this;

    let handleToggle = function(e) {
        e.preventDefault();
        window.location.href = app.back_url;
    };
    button.addEventListener('click', handleToggle, false);
    button.addEventListener('touchstart', handleToggle, false);

    let elem = document.createElement('div');
    elem.className = 'btn-back ol-unselectable ol-control';
    elem.appendChild(button);
    _ol_control_Control_.call(this, {
        element: elem,
        target: options.target
    });
}
_ol_.inherits(_ol_control_BackButton_, _ol_control_Control_);

export function _ol_control_FlatButton_(opt_options) {
    let options = opt_options ? opt_options : {};
    let button = document.createElement('button');
    button.innerHTML = 'Flat map \u00BB';
    let that = this;

    let handleToggle = function(e) {
        if ($('#brain-meta').is(':visible')) {
            $('#brain-meta').hide();
        }
        $('#flatmap').animate({left:'toggle'}, 350);
    };
    button.addEventListener('click', handleToggle, false);
    button.addEventListener('touchstart', handleToggle, false);

    let elem = document.createElement('div');
    elem.className = 'btn-flat ol-unselectable ol-control';
    elem.appendChild(button);
    _ol_control_Control_.call(this, {
        element: elem,
        target: options.target
    });
}
_ol_.inherits(_ol_control_FlatButton_, _ol_control_Control_);
/*
export function _ol_control_ParcelButton_(opt_options) {
    let options = opt_options ? opt_options : {};

    let button = document.createElement('button');
    button.innerHTML = 'Parcellation';

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
*/
