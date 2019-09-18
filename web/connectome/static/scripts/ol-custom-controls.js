app.ToggleLayer = function(opt_options) {
    var options = opt_options || {};
    var button = document.createElement('button');
    button.innerHTML = options.name + '<span class="symbol-' + options.name + '">' + options.symbol + '</span>';
    button.className = "toggle-layer";
    var state = app.toggleStatus[options.name];
    if (!state) {
        $(button).addClass('layer-invisible');
    }
    var that = this;
    var handleToggle = function(e) {
        var state = app.toggleStatus[options.name];
        that.getMap().getLayers().forEach(function (l) {
            if (l.get('name') == options.name || l.get('name') == options.name + '-Inj') {
                if (state) {
                    l.setVisible(false);
                    $(button).addClass('layer-invisible');
                    app.toggleStatus[options.name] = !state;
                } else {
                    l.setVisible(true);
                    $(button).removeClass('layer-invisible');
                    app.toggleStatus[options.name] = !state;
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

    var element = document.createElement('div');
    element.className = 'toggle-layer toggle-layer-' + options.name + ' ol-unselectable ol-control';
    element.appendChild(button);
    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });
};
ol.inherits(app.ToggleLayer, ol.control.Control);

app.SectionLabel = function(opt_options) {
    var options = opt_options || {};
    //var button = document.createElement('button');
    //button.innerHTML = app.case_id + '-' + app.section_code + ' \u00BB';
    //button.innerHTML = 'Case metadata \u00BB';
    //button.className = 'btn-toggle-meta';
    var elem = document.createElement('div');
    elem.className = 'section-label ol-unselectable ol-control';
    var section_str = app.case_id + '-' + app.section_code;
    elem.innerHTML = '<span class="label-text">' + section_str + '</span>';
    ol.control.Control.call(this, {
        element: elem,
        target: options.target
    });
}
ol.inherits(app.SectionLabel, ol.control.Control);

app.ToggleMeta = function(opt_options) {
    var options = opt_options || {};
    var button = document.createElement('button');
    //button.innerHTML = app.case_id + '-' + app.section_code + ' \u00BB';
    var section_str = app.case_id + '-' + app.section_code;
    button.innerHTML = 'Case metadata \u00BB';
    button.className = 'btn-toggle-meta';
    var that = this;

    var handleToggle = function(e) {
        if ($('#flatmap').is(':visible')) {
            $('#flatmap').hide();
        }
        $('#brain-meta').animate({left:'toggle'}, 350);
    };
    button.addEventListener('click', handleToggle, false);
    button.addEventListener('touchstart', handleToggle, false);

    var elem = document.createElement('div');
    elem.className = 'toggle-meta ol-unselectable ol-control';
    elem.appendChild(button);
    ol.control.Control.call(this, {
        element: elem,
        target: options.target
    });
}
ol.inherits(app.ToggleMeta, ol.control.Control);

app.BackButton = function(opt_options) {
    var options = opt_options || {};
    var button = document.createElement('button');
    //button.innerHTML = '\u00AB';
    button.innerHTML = 'Back to List';
    var that = this;

    var handleToggle = function(e) {
        e.preventDefault();
        window.location.href = app.back_url;
    };
    button.addEventListener('click', handleToggle, false);
    button.addEventListener('touchstart', handleToggle, false);

    var elem = document.createElement('div');
    elem.className = 'btn-back ol-unselectable ol-control';
    elem.appendChild(button);
    ol.control.Control.call(this, {
        element: elem,
        target: options.target
    });
}
ol.inherits(app.BackButton, ol.control.Control);

app.FlatButton = function(opt_options) {
    var options = opt_options || {};
    var button = document.createElement('button');
    button.innerHTML = 'Flat map \u00BB';
    var that = this;

    var handleToggle = function(e) {
        if ($('#brain-meta').is(':visible')) {
            $('#brain-meta').hide();
        }
        $('#flatmap').animate({left:'toggle'}, 350);
    };
    button.addEventListener('click', handleToggle, false);
    button.addEventListener('touchstart', handleToggle, false);

    var elem = document.createElement('div');
    elem.className = 'btn-flat ol-unselectable ol-control';
    elem.appendChild(button);
    ol.control.Control.call(this, {
        element: elem,
        target: options.target
    });
}
ol.inherits(app.FlatButton, ol.control.Control);

app.ParcelButton = function(opt_options) {
    var options = opt_options || {};

    var button = document.createElement('button');
    button.innerHTML = 'Parcellation';

    var button_plus = document.createElement('button');
    button_plus.innerHTML = '+';
    button_plus.className = 'plus';

    var button_minus = document.createElement('button');
    button_minus.innerHTML = '&ndash;';
    button_minus.className = 'minus';

    var that = this;

    var handleToggle = function(e) {
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

    var parcel_minus = function(e) {
        var parcel_layer = app.parcel_layer;
        if (app.parcel_opacity >= 0) {
            var op = parcel_layer.getOpacity();
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

    var parcel_plus = function(e) {
        if (app.parcel_opacity >= 0) {
            var parcel_layer = app.parcel_layer;
            var op = parcel_layer.getOpacity();
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

    var elem = document.createElement('div');
    elem.className = 'btn-parcel ol-unselectable ol-control';
    elem.appendChild(button);
    elem.appendChild(button_minus);
    elem.appendChild(button_plus);
    ol.control.Control.call(this, {
        element: elem,
        target: options.target
    });
}
ol.inherits(app.ParcelButton, ol.control.Control);

app.MousePosition = function(opt_options) {
    var options = opt_options || {};


    var className = options.className || 'ol-mouse-position';
    var elem = document.createElement('div');
    elem.className = className;

    var render = options.render || app.MousePosition.render;
    ol.control.Control.call(this, {
        element: elem,
        render: render,
        target: options.target
    });
    this.undefinedHTML_ = options.undefinedHTML || '';
    this.renderedHTML_ = elem.innerHTML;
    this.lastMouseMovePixel_ = null;

}
ol.inherits(app.MousePosition, ol.control.Control);

app.MousePosition.render = function (mapEvent) {
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
app.MousePosition.prototype.setMap = function(map) {
    var that = this;
    ol.control.Control.prototype.setMap.call(this, map);
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
app.MousePosition.prototype.handleMouseMove = function (e) {
    var map = this.getMap();
    this.lastMouseMovePixel_ = map.getEventPixel(e);
    this.updateHTML_(this.lastMouseMovePixel_);
    //this.updateHTML_(this.lastMouseMovePixel_);
    //console.log('mose moved', e);
};
app.MousePosition.prototype.updateHTML_ = function (pixel) {
    var html = this.undefinedHTML_;
    var map = this.getMap();
    var coordinate = map.getCoordinateFromPixel(pixel);
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
app.removed_features = [];
app.update_vertex_count = function(e) {
    var geom = e.target.getGeometry();
    var len;
    switch (geom.getType()) {
        case 'Polygon':
            len = geom.getCoordinates()[0].length; 
            break;
        default:
            len = geom.getCoordinates().length; 
    }
    $('#vertex-count-' + e.target.get('annotation_uuid')).text(len);
};
app.Annotation = function(opt_options) {
    var options = opt_options || {};
    var $label = $('<label>Annotation</label>');
    var $select = $('<select name="annotation-type" id="ol-annotation-type"></select>');
    _.each(_.keys(app.annotation_types), function(t, k, l) {
        $select.append('<option value="' + t + '">' + t + '</option>');
        return l;
    });
    var $start = $('<button class="btn-toggle-meta" id="ol-annotation-button">Start</BUTTON>');
    var $save = $('<button class="btn-save" id="ol-annotation-save">Save</button>');
    var $dropdown = $('<button><span class="caret"></span></button>');
    var $annolist = $('<div class="annotation-list"></div>');
    var $elem = $('<div class="annotation ol-unselectable ol-control"></div>');
    var $annotable = $('<table class="annotation-list"><tr><th>Item</th><th>Vertices</th><th>Memo</th><th>Actions</th></table>').appendTo($annolist)
    $annotable
        .on('click', 'button.btn-delete', function() {
            var $tr = $(this).parents('tr');
            var uuid = $tr.data('annotation-uuid');
            var f = app.annotation_uuid_lookup[uuid];
            f.set('deleted', true);
            app.removed_features.push(f);
            app.annotation_src.removeFeature(f);
            $(this).parents('tr').remove();
            $tr.hide('slow', function(){ $tr.remove(); });
        })
        .on('click', 'button.btn-annotate', function(e) {
            var $tr = $(this).parents('tr');
            var uuid = $tr.data('annotation-uuid');
            var f = app.annotation_uuid_lookup[uuid];
            //var bs_modal = $.fn.modal.noConflict();
            $('#modal-body textarea').val(f.get('memo'));
            $('#memo-edit').data('annotation_uuid', uuid);
            $('#memo-edit').modal({modalClass: 'jqmodal', showClose: false});
        });
    app.add_feature = function(f) {
        /*
        f.set('status', 'Draft');
        $.ajax({
            type:'POST',
            url: '/async/annotation',
            data: JSON.stringify(f),
            contentType: 'application/json; charset=utf-8'
        });
        */
        var type = f.getGeometry().getType();
        var coords = f.getGeometry().getCoordinates();
        if (type == 'Polygon') {
            coords = coords[0];
        }
        var annoid = f.get('annotation_id');
        var uuid = app.UUID.generate();
        f.set('annotation_uuid', uuid);
        app.annotation_uuid_lookup[uuid] = f;
        var $annorow = $('<tr data-annotation-id=' + annoid + ' data-annotation-uuid="' + uuid + '"></tr>')
            .append($('<td>' + f.get('annotation_type') + '</td><td><span id="vertex-count-' + uuid + '">' + coords.length + '</span></td>' + '<td><span id="memo-text-' + uuid + '">' + f.get('memo') + '</span><button class="btn-annotate">Edit</button>' + '</td><td><button class="btn-delete">Delete</button></td>'))
            .appendTo($annotable);
        f.on('change', app.update_vertex_count);
    }
    _.each(app.annotation_features.getArray(), function(f, k, l) {
        app.add_feature(f);
        return l;
    });
    var that = this;

    var colors = {
        FE: {
            line: [0, 255, 0, 1],
            fill: [0, 255, 0, 0.4]
        },
        FR: {
            line: [255, 0, 0, 1],
            fill: [255, 0, 0, 0.4]
        },
        FB: {
            line: [0, 0, 255, 1],
            fill: [0, 0, 255, 0.4]
        },
        DY: {
            line: [255, 255, 0, 1],
            fill: [255, 255, 0, 0.4]
        },
        BDA: {
            line: [128, 128, 0, 1],
            fill: [128, 128, 0, 0.4]
        }
    };
    var annoStyle = function(celltype, feature, resolution) {
        var white = [255, 255, 255, 1];
        //var blue = [0, 153, 255, 1];
        var styles = {};

        _.each(_.keys(app.annotation_types), function(t, k, l) {
            var style = app.annotation_types[t];
            var _styles = {};
            _styles.Polygon = [
                new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: [255, 255, 255, 0.5]
                    })
                })
            ];
            _styles.MultiPolygon = _styles.Polygon;

            _styles.LineString = [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: white,
                        width: style.width + 2
                    })
                }),
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: style.stroke,
                        width: style.width
                    })
                })
            ];
            _styles.MultiLineString = _styles.LineString;

            _styles.Circle = _styles.Polygon.concat(_styles.LineString);
            _styles.Point = [
                new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: style.width * 2,
                        fill: new ol.style.Fill({
                            color: style.fill
                        }),
                        stroke: new ol.style.Stroke({
                            color: white,
                            width: style.width / 2
                        })
                    }),
                    zIndex: Infinity
                })
            ];
            _styles.MultiPoint = styles.Point;
            _styles.GeometryCollection = _styles.Polygon.concat(styles.Point);
            styles[t] = _styles;
            return l;
        });
        return function(feature, resolution) {
            return styles[celltype][feature.getGeometry().getType()];
        };
    };

    var handleDrawing = function(e) {
        //var geometryFunction, maxPoints;
        console.log('app.drawing', app.drawing);
        if (app.drawing) {
            return;
        }
        app.drawing = true;
        var type = app.annotation_types[$('#ol-annotation-type').val()];
        var draw = new ol.interaction.Draw({
            source: app.annotation_src,
            type: type.geometry,
            //geometryFunction: geometryFunction,
            //maxPoints: maxPoints,
            clickTolerance: 12,
            snapTolerance: 0,
            style: annoStyle(type.name)
        });
        //console.log('style created', ol.style.createDefaultEditingStyles());
        //window.s_ = ol.style.createDefaultEditingStyles();
        draw.on('drawstart', function(e) {
            var feature = e.feature;
            var type = $('#ol-annotation-type').val();
            e.feature.set('annotation_type', type);
            app.add_feature(feature);
            $(document).on('keyup.cancel', function (key_evt) {
                if (key_evt.keyCode === 27) {
                    draw.finishDrawing();

                    var geom = feature.getGeometry();
                    console.log('geo type', geom.getType());
                    if (geom.getType() === 'Polygon') {
                        //var coord = geom.getCoordinates();
                        //var new_coord = [coord[0].slice(0, coord[0].length - 1)];
                        //geom.setCoordinates(new_coord);
                        //geom.setCoordinates([[]]);
                        annotation_features.remove(feature);
                    }
                } else if (key_evt.keyCode === 13) {
                    draw.finishDrawing();
                }
            });
        });
        draw.on('drawend', function(e) {
            e.preventDefault();
            var type = e.feature.get('annotation_type');
            var colors = app.annotation_types[type];
            e.feature.setStyle(
                new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: colors.fill
                    }),
                    stroke: new ol.style.Stroke({
                        color: colors.stroke,
                        width: 3
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#ffcc33'
                        })
                    })
                })
            );
            $(document).off('keyup.cancel');
            setTimeout(function() {
                $('#ol-annotation-button').text('Start');
                app.map.removeInteraction(draw);
                app.drawing = false;
            }, 251);
        });
        app.map.addInteraction(draw);
        $('#ol-annotation-button').text('Drawing');
    };
    $start.on('click.annotation touchstart.annotation', handleDrawing);
    $save.on('click touchstart', function() {
        var geojson = new ol.format.GeoJSON;
        var features = geojson.writeFeaturesObject(app.annotation_features.getArray());
        features.section_id = app.section_id;
        features.deleted = geojson.writeFeaturesObject(app.removed_features);
        $.ajax({
            type:'POST',
            url: '/async/annotation',
            data: JSON.stringify(features),
            contentType: 'application/json; charset=utf-8',
            success: function(data, status, xhr) {
                console.log(data.features);
                _.each(data.features, function(v, k, l) {
                    var uuid = v.properties.annotation_uuid;
                    var id = v.properties.annotation_id;
                    var f = app.annotation_uuid_lookup[uuid];
                    if (!f.get('annotation_id')) {
                        f.set('annotation_id', id);
                    }
                    return l;
                });
            }
        });

    });
    $elem.append($label, $select, $start, $save, $dropdown, $annolist);
    $annolist.hide();
    $dropdown.on('click touchstart', function() {
        $annolist.toggle('fast');
    });
    ol.control.Control.call(this, {
        element: $elem[0],
        target: options.target
    });
}
ol.inherits(app.Annotation, ol.control.Control);

app.SagittalNav = function(opt_options) {
    var options = opt_options || {};
    var img = document.createElement('img');
    img.src = '/static/images/atlas_labels_contours_saggital_0215.png';
    this.x = this.getCoord(app.sagittal_coord);
    this.target_section_id = null;
    var ruler = document.createElement('div');
    ruler.className = 'sagittal-ruler';
    ruler.style.left = this.getRulerOffset(app.sagittal_coord) + 'px';

    var tooltip = document.createElement('div');
    tooltip.className = 'sagittal-tooltip';

    var tooltip_coord = document.createElement('div');
    tooltip_coord.className = 'sagittal-tooltip-coord';
    
    var tooltip_coord_suffix = document.createElement('div');
    tooltip_coord_suffix.className = 'sagittal-tooltip-coord-suffix';

    var tooltip_section = document.createElement('div');
    tooltip_section.className = 'sagittal-tooltip-section';
    var tooltip_cellcount = document.createElement('div');
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
    var drawThinLine = function(e) {
        //var x = map.getEventPixel(e)
        if (e.clientX > 190) return;

        if (e.clientX != this.x) {
            ruler.style.left = e.clientX + 'px';
            var coord = this.getCoord(e.clientX);
            var last_diff = Infinity;
            //var coord = this.coord;
            this.target_section = _.find(app.sagittal_series, function(value, idx, collection) {
                var diff = Math.abs(value.coord - coord);
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
    var restoreThinLine = function(e) {
        this.x = this.getRulerOffset(app.sagittal_coord);
        ruler.style.left = this.x + 'px';
        this.coord = app.sagittal_coord;
        this.target_section = _.find(app.sagittal_series, {coord: this.coord});
        this.updateTooltip();
    }
    var sagittalNav = function(e) {
        if (this.target_section_id) {
            window.location.href = '/section/' + this.target_section_id;
        }
    }
    img.addEventListener('mousemove', _.bind(drawThinLine, this), false);
    ruler.addEventListener('mousemove', _.bind(drawThinLine, this), false);
    img.addEventListener('click', _.bind(sagittalNav, this), false);
    ruler.addEventListener('click', _.bind(sagittalNav, this), false);
    var container = document.createElement('div');
    container.className = 'sagittal-nav ol-unselectable ol-control';
    container.appendChild(img);
    container.appendChild(ruler);
    container.appendChild(tooltip);
    container.addEventListener('mouseleave', _.bind(restoreThinLine, this), false);
    ol.control.Control.call(this, {
        element: container,
        target: options.target
    });
}

ol.inherits(app.SagittalNav, ol.control.Control);
app.SagittalNav.prototype.updateTooltip = function() {
    var val = Math.round(-this.coord * 10) / 10;
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

app.SagittalNav.prototype.getCoord = function(v) {
    var coord = (v / 190) * 31.617 - 19.5;
    return coord;
};
app.SagittalNav.prototype.getRulerOffset = function(coord) {
    var offset = (coord + 19.5) / 31.617 * 190;
    return offset;
};

app.CoronalNav = function(opt_options) {
    var options = opt_options || {};
    var img = document.createElement('img');
    //img.src = '/static/images/atlas_labels_contours_saggital_0215.png';
    img.src = '/static/images/brain_nav.png';
    this.y = this.getCoord(app.sagittal_coord);
    this.target_section_id = null;

    var ruler_y = document.createElement('div');
    ruler_y.className = 'sagittal-ruler-y';
    ruler_y.style.top = this.getRulerOffset(app.sagittal_coord) + 'px'; 

    var tooltip = document.createElement('div');
    tooltip.className = 'sagittal-tooltip';

    var tooltip_coord = document.createElement('div');
    tooltip_coord.className = 'sagittal-tooltip-coord';
    
    var tooltip_coord_suffix = document.createElement('div');
    tooltip_coord_suffix.className = 'sagittal-tooltip-coord-suffix';

    var tooltip_section = document.createElement('div');
    tooltip_section.className = 'sagittal-tooltip-section';
    var tooltip_cellcount = document.createElement('div');
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
    var drawThinLine = function(e) {
        //var x = map.getEventPixel(e);
        var img_offset = $(img).offset();
        var delta = e.clientY - img_offset.top;
        if (delta > 68 || delta < 0) return;

        if (delta != this.y) {
            ruler_y.style.top = (delta + 32 - 2) + 'px';
            var coord = this.getCoord(delta);
            var last_diff = Infinity;
            //var coord = this.coord;
            this.target_section = _.find(app.sagittal_series, function(value, idx, collection) {
                var diff = Math.abs(value.coord - coord);
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
    var restoreThinLine = function(e) {
        this.y = this.getRulerOffset(app.sagittal_coord);
        ruler_y.style.top = this.y + 'px';
        this.coord = app.sagittal_coord;
        this.target_section = _.find(app.sagittal_series, {coord: this.coord});
        this.updateTooltip();
    }
    var sagittalNav = function(e) {
        if (this.target_section_id) {
            window.location.href = '/section/' + this.target_section_id;
        }
    }
    img.addEventListener('mousemove', _.bind(drawThinLine, this), false);
    ruler_y.addEventListener('mousemove', _.bind(drawThinLine, this), false);
    img.addEventListener('click', _.bind(sagittalNav, this), false);
    ruler_y.addEventListener('click', _.bind(sagittalNav, this), false);
    var container = document.createElement('div');
    container.className = 'sagittal-nav topview ol-unselectable ol-control';
    container.appendChild(img);
    container.appendChild(ruler_y);
    container.appendChild(tooltip);
    container.addEventListener('mouseleave', _.bind(restoreThinLine, this), false);
    ol.control.Control.call(this, {
        element: container,
        target: options.target
    });
}
ol.inherits(app.CoronalNav, app.SagittalNav);
app.CoronalNav.prototype.getCoord = function(v) {
    var coord = ((69 - v) / 69) * (11.22 - 0.0025);
    return coord;
};
app.CoronalNav.prototype.updateTooltip = function() {
    var val = Math.round(this.coord * 10) / 10;
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
app.CoronalNav.prototype.getRulerOffset = function(coord) {
    var offset = 32 - 2 + 69 - (coord / (11.22 - 0.0025) * 69);
    return offset;
};
