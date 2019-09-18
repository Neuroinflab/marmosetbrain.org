import _ol_ from 'ol';
import _ol_control_Control_ from 'ol/control/control';
export function _ol_control_SagittalNav_(opt_options) {
    let options = opt_options ? opt_options : {};
    let img = document.createElement('img');
    img.src = '/static/images/atlas_labels_contours_saggital_0215.png';
    this.x = this.getCoord(app.sagittal_coord);
    this.target_section_id = null;
    let ruler = document.createElement('div');
    ruler.className = 'sagittal-ruler';
    ruler.style.left = this.getRulerOffset(app.sagittal_coord) + 'px';

    let tooltip = document.createElement('div');
    tooltip.className = 'sagittal-tooltip';

    let tooltip_coord = document.createElement('div');
    tooltip_coord.className = 'sagittal-tooltip-coord';
    
    let tooltip_coord_suffix = document.createElement('div');
    tooltip_coord_suffix.className = 'sagittal-tooltip-coord-suffix';

    let tooltip_section = document.createElement('div');
    tooltip_section.className = 'sagittal-tooltip-section';
    let tooltip_cellcount = document.createElement('div');
    tooltip_cellcount.className = 'sagittal-tooltip-cellcount';
    tooltip.appendChild(tooltip_coord);
    tooltip.appendChild(tooltip_coord_suffix);
    tooltip.appendChild(tooltip_section);
    tooltip.appendChild(tooltip_cellcount);

    this.coord = app.sagittal_coord;
    this.target_section = _.find(app.sagittal_series, {coord: this.coord});
    if (!this.target_section) {
        this.target_section = _.first(app.sagittal_series);
    }

    this.tooltip_coord = tooltip_coord;
    this.tooltip_coord_suffix = tooltip_coord_suffix;
    this.tooltip_section = tooltip_section;
    this.tooltip_cellcount = tooltip_cellcount;
    this.updateTooltip();
    let drawThinLine = function(e) {
        //var x = map.getEventPixel(e)
        if (e.clientX > 190) return;

        if (e.clientX != this.x) {
            ruler.style.left = e.clientX + 'px';
            let coord = this.getCoord(e.clientX);
            let last_diff = Infinity;
            //var coord = this.coord;
            this.target_section = _.find(app.sagittal_series, function(value, idx, collection) {
                let diff = Math.abs(value.coord - coord);
                if (diff > last_diff) {
                    return true;
                } else {
                    last_diff = diff;
                }
            });
            if (!this.target_section) {
                this.target_section = _.last(app.sagittal_series);
            }
            this.coord = this.target_section.coord;
            this.updateTooltip();
            this.x = e.clientX;
            this.target_section_id = this.target_section.section_id;
        }
    }
    let restoreThinLine = function(e) {
        this.x = this.getRulerOffset(app.sagittal_coord);
        ruler.style.left = this.x + 'px';
        this.coord = app.sagittal_coord;
        this.target_section = _.find(app.sagittal_series, {coord: this.coord});
        this.updateTooltip();
    }
    let sagittalNav = function(e) {
        if (this.target_section_id) {
            window.location.href = '/section/' + this.target_section_id;
        }
    }
    img.addEventListener('mousemove', _.bind(drawThinLine, this), false);
    ruler.addEventListener('mousemove', _.bind(drawThinLine, this), false);
    img.addEventListener('click', _.bind(sagittalNav, this), false);
    ruler.addEventListener('click', _.bind(sagittalNav, this), false);
    let container = document.createElement('div');
    container.className = 'sagittal-nav ol-unselectable ol-control';
    container.appendChild(img);
    container.appendChild(ruler);
    container.appendChild(tooltip);
    container.addEventListener('mouseleave', _.bind(restoreThinLine, this), false);
    _ol_control_Control_.call(this, {
        element: container,
        target: options.target
    });
}
_ol_.inherits(_ol_control_SagittalNav_, _ol_control_Control_);

_ol_control_SagittalNav_.prototype.updateTooltip = function() {
    let val = Math.round(-this.coord * 10) / 10;
    if (val == 0) {
        this.tooltip_coord.innerHTML = '';
        this.tooltip_coord_suffix.innerHTML = 'interaural line';
    } else {
        this.tooltip_coord.innerHTML = (val > 0 ? val : -val) + ' mm ' + (val > 0 ? 'rostral' : 'caudal');
        this.tooltip_coord_suffix.innerHTML = 'to interaural line';
    }
    this.tooltip_section.innerHTML = this.target_section.section;
    this.tooltip_cellcount.innerHTML = 'Cells: ' + this.target_section.cell_count;
};

_ol_control_SagittalNav_.prototype.getCoord = function(v) {
    let coord = (v / 190) * 31.617 - 19.5;
    return coord;
};
_ol_control_SagittalNav_.prototype.getRulerOffset = function(coord) {
    let offset = (coord + 19.5) / 31.617 * 190;
    return offset;
};


export function _ol_control_CoronalNav_(opt_options) {
    let options = opt_options ? opt_options : {};
    let img = document.createElement('img');
    //img.src = '/static/images/atlas_labels_contours_saggital_0215.png';
    img.src = '/static/images/brain_nav.png';
    this.y = this.getCoord(app.sagittal_coord);
    this.target_section_id = null;

    let ruler_y = document.createElement('div');
    ruler_y.className = 'sagittal-ruler-y';
    ruler_y.style.top = this.getRulerOffset(app.sagittal_coord) + 'px'; 

    let tooltip = document.createElement('div');
    tooltip.className = 'sagittal-tooltip';

    let tooltip_coord = document.createElement('div');
    tooltip_coord.className = 'sagittal-tooltip-coord';
    
    let tooltip_coord_suffix = document.createElement('div');
    tooltip_coord_suffix.className = 'sagittal-tooltip-coord-suffix';

    let tooltip_section = document.createElement('div');
    tooltip_section.className = 'sagittal-tooltip-section';
    let tooltip_cellcount = document.createElement('div');
    tooltip_cellcount.className = 'sagittal-tooltip-cellcount';
    tooltip.appendChild(tooltip_coord);
    tooltip.appendChild(tooltip_coord_suffix);
    tooltip.appendChild(tooltip_section);
    tooltip.appendChild(tooltip_cellcount);

    this.coord = app.sagittal_coord;
    this.target_section = _.find(app.sagittal_series, {coord: this.coord});
    if (!this.target_section) {
        this.target_section = _.first(app.sagittal_series);
    }

    this.tooltip_coord = tooltip_coord;
    this.tooltip_coord_suffix = tooltip_coord_suffix;
    this.tooltip_section = tooltip_section;
    this.tooltip_cellcount = tooltip_cellcount;
    this.updateTooltip();
    let drawThinLine = function(e) {
        //var x = map.getEventPixel(e);
        let img_offset = $(img).offset();
        let delta = e.clientY - img_offset.top;
        if (delta > 68 || delta < 0) return;

        if (delta != this.y) {
            ruler_y.style.top = (delta + 32 - 2) + 'px';
            let coord = this.getCoord(delta);
            let last_diff = Infinity;
            //var coord = this.coord;
            this.target_section = _.find(app.sagittal_series, function(value, idx, collection) {
                let diff = Math.abs(value.coord - coord);
                if (diff > last_diff) {
                    return true;
                } else {
                    last_diff = diff;
                }
            });
            if (!this.target_section) {
                this.target_section = _.last(app.sagittal_series);
            }
            this.coord = this.target_section.coord;
            this.updateTooltip();
            this.y = delta;
            this.target_section_id = this.target_section.section_id;
        }
    }
    let restoreThinLine = function(e) {
        this.y = this.getRulerOffset(app.sagittal_coord);
        ruler_y.style.top = this.y + 'px';
        this.coord = app.sagittal_coord;
        this.target_section = _.find(app.sagittal_series, {coord: this.coord});
        this.updateTooltip();
    }
    let sagittalNav = function(e) {
        if (this.target_section_id) {
            window.location.href = '/section/' + this.target_section_id;
        }
    }
    img.addEventListener('mousemove', _.bind(drawThinLine, this), false);
    ruler_y.addEventListener('mousemove', _.bind(drawThinLine, this), false);
    img.addEventListener('click', _.bind(sagittalNav, this), false);
    ruler_y.addEventListener('click', _.bind(sagittalNav, this), false);
    let container = document.createElement('div');
    container.className = 'sagittal-nav topview ol-unselectable ol-control';
    container.appendChild(img);
    container.appendChild(ruler_y);
    container.appendChild(tooltip);
    container.addEventListener('mouseleave', _.bind(restoreThinLine, this), false);
    _ol_control_Control_.call(this, {
        element: container,
        target: options.target
    });
}
_ol_.inherits(_ol_control_CoronalNav_, _ol_control_SagittalNav_);
_ol_control_CoronalNav_.prototype.getCoord = function(v) {
    let coord = ((69 - v) / 69) * (11.22 - 0.0025);
    return coord;
};
_ol_control_CoronalNav_.prototype.updateTooltip = function() {
    let val = Math.round(this.coord * 10) / 10;
    if (val == 0) {
        this.tooltip_coord.innerHTML = '';
        this.tooltip_coord_suffix.innerHTML = 'the midline';
    } else {
        //this.tooltip_coord.innerHTML = (val > 0 ? val : -val) + ' mm ' + (val > 0 ? 'rostral' : 'caudal');
        //this.tooltip_coord.innerHTML = (val > 0 ? val : -val) + ' mm ' + (val > 0 ? 'rostral' : 'caudal');
        this.tooltip_coord.innerHTML = val + ' mm lateral';
        //this.tooltip_coord_suffix.innerHTML = 'to interaural line';
        this.tooltip_coord_suffix.innerHTML = 'to the midline';
    }
    this.tooltip_section.innerHTML = this.target_section.section;
    this.tooltip_cellcount.innerHTML = 'Cells: ' + this.target_section.cell_count;
};
_ol_control_CoronalNav_.prototype.getRulerOffset = function(coord) {
    let offset = 32 - 2 + 69 - (coord / (11.22 - 0.0025) * 69);
    return offset;
};
