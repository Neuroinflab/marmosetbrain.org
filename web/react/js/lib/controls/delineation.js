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
/*
 * let delineation_layer = new ol.layer.Vector({
    source: delineation_src
});
*/
let removed_features = [];
function update_vertex_count(e) {
    var geom = e.target.getGeometry();
    var len;
    switch (geom.getType()) {
        case 'Polygon':
            len = geom.getCoordinates()[0].length; 
            break;
        default:
            len = geom.getCoordinates().length; 
    }
    $('#vertex-count-' + e.target.get('delineation_uuid')).text(len);
}
function do_cell_count(f) {
    let extent = f.getGeometry().getExtent();
    let info = []; 
    app.map.getLayers().forEach(layer => {
        switch (layer.get('name')) {
            case 'FB':
            case 'FE':
            case 'CTBgr':
            case 'FR':
            case 'CTBr':
            case 'DY':
            case 'BDA':
                {
                    let name = layer.get('name');
                    let poly = f.getGeometry();
                    let selectedFeatures = new _ol_Collection_();
                    let source = layer.getSource();
                    source.forEachFeature(feature => {
                        if (poly.intersectsExtent(feature.getGeometry().getExtent())) {
                            selectedFeatures.push(feature);
                        }
                    });
                    info.push(name + ': ' + selectedFeatures.getLength());
                }
                break;
            default:
                // noop
                break;
        }
    });
    let text = info.join(' ');
    f.set('memo', text);
    let uuid = f.get('delineation_uuid');
    $('#memo-text-' + uuid).text(text);
    app.display_message(['Cell count result: ' + text]);
    return text;
}
export default function _ol_control_Delineation_(opt_options) {

    var options = opt_options ? opt_options : {};
    var $label = $('<label>Utility</label>');
    var $select = $('<select name="delineation-type" id="ol-delineation-type"></select>');
    _.each(_.sortBy(app.delineation_types, 'position'), (t, k, l) => {
        $select.append('<option value="' + t.name + '">' + t.name + '</option>');
        return l;
    });
    let $start = $('<button class="btn-toggle-meta" id="ol-delineation-button">Start</button>');
    let $save = $('<button class="btn-save" id="ol-delineation-save">Save</button>');
    let $dropdown = $('<button><span class="caret"></span></button>');
    let $annolist = $('<div class="delineation-list"></div>');
    let $elem = $('<div class="delineation ol-unselectable ol-control"></div>');
    let $delitable = $('<table class="delineation-list"><tr><th>Item</th><th>Memo</th><th>Actions</th></table>').appendTo($annolist)

    $delitable
        .on('click', 'button.btn-delete', function() {
            var $tr = $(this).parents('tr');
            var uuid = $tr.data('delineation-uuid');
            var f = app.delineation_uuid_lookup[uuid];
            f.set('deleted', true);
            removed_features.push(f);
            app.delineation_src.removeFeature(f);
            $(this).parents('tr').remove();
            $tr.hide('slow', function(){ $tr.remove(); });
        })
        .on('click', 'button.btn-annotate', function(e) {
            var $tr = $(this).parents('tr');
            var uuid = $tr.data('delineation-uuid');
            var f = app.delineation_uuid_lookup[uuid];
            //var bs_modal = $.fn.modal.noConflict();
            $('#modal-body textarea').val(f.get('memo'));
            $('#memo-edit').data('delineation_uuid', uuid);
            $('#memo-edit').data('uuid_key', 'delineation_uuid');
            $('#memo-edit').modal({modalClass: 'jqmodal', showClose: false});
        })
        .on('click', 'button.btn-modify', function(e) {
            let editing = $(this).data('editing');
            if (editing) {
                $(this).text('Edit').removeClass('active');
                app.map.removeInteraction(editing);
                $(this).data('editing', false);
            } else {
                let $tr = $(this).parents('tr');
                let uuid = $tr.data('delineation-uuid');
                let f = app.delineation_uuid_lookup[uuid];
                let featureCollection = new _ol_Collection_();
                featureCollection.push(f);
                
                let modify = new _ol_interaction_Modify_({
                    features: featureCollection,
                    deleteCondition: function(evt) {
                        return _ol_events_condition_.shiftKeyOnly(evt) &&
                            _ol_events_condition_.singleClick(evt);
                    }
                });
                modify.on('modifyend', (e) => {
                    e.features.forEach(f => {
                        let type_str = f.get('delineation_type');
                        if (type_str == 'Cell Count') {
                            do_cell_count(f);
                        } else if (type_str == 'Rogue Cells') {
                            do_cell_count(f);
                        }
                    });
                });
                $(this).text('End').addClass('active');
                app.map.addInteraction(modify);
                $(this).data('editing', modify);
            }
        })
    let addFeature = function(f) {
        let type = f.getGeometry().getType();
        let coords = f.getGeometry().getCoordinates();
        if (type == 'Polygon') {
            coords = coords[0];
        }
        let deli_id = f.get('delineation_id');
        let uuid = app.UUID.generate();
        f.set('delineation_uuid', uuid);
       
        let deli_type = _.find(app.delineation_types, {name: f.get('delineation_type')});
        app.delineation_uuid_lookup[uuid] = f;
        var $annorow = $('<tr data-delineation-id="' + deli_id + '" data-delineation-uuid="' + uuid + '" data-delineation-status="' + deli_type.status +'"></tr>')
        .append($(
            '<td>' + f.get('delineation_type') + '</td>'
            + '<td><span id="memo-text-' + uuid + '">' + f.get('memo') + '</span></td>'
            + '<td><button class="btn-modify">Edit</button>'
            + '<button class="btn-annotate">Memo</button>'
            + '<button class="btn-delete">Delete</button></td>'
        ))
            .appendTo($delitable);
        //f.set('memo', '');
        //f.on('change', update_vertex_count);
    }
    _.each(app.delineation_features.getArray(), function(f, k, l) {
        addFeature(f);
        return l;
    });

    var drawingStyle = function(celltype, feature, resolution) {
        let white = [255, 255, 255, 1];
        //var blue = [0, 153, 255, 1];
        let styles = {};

        if (celltype in styles) {
            return styles[celltype][feature.getGeometry().getType()];
        } else {
            //_.each(app.delineation_types, function(t, k) {
            let t = _.find(app.delineation_types, {name: celltype});
            let _styles = {};
                _styles.Polygon = [
                    new _ol_style_Style_({
                        fill: new _ol_style_Fill_({
                            color: [255, 255, 255, 0.0]
                        })
                    })
                ];
                _styles.MultiPolygon = _styles.Polygon;

                _styles.LineString = [
                    new _ol_style_Style_({
                        stroke: new _ol_style_Stroke_({
                            color: white,
                            width: t.width + 2
                        })
                    }),
                    new _ol_style_Style_({
                        stroke: new _ol_style_Stroke_({
                            color: t.stroke,
                            width: t.width
                        })
                    })
                ];
                _styles.MultiLineString = _styles.LineString;

                _styles.Circle = _styles.Polygon.concat(_styles.LineString);
                console.log('ok width, t.width', t.width, 'fill', t.fill);
                _styles.Point = [
                    new _ol_style_Style_({
                        image: new _ol_style_Circle_({
                            radius: t.width * 2,
    
                            fill: new _ol_style_Fill_({
                                //color: t.fill
                                color: [0, 0, 255, 0.5]
                            }),
                            stroke: new _ol_style_Stroke_({
                                color: white,
                                width: t.width / 2
                            })
                        }),
                        zIndex: Infinity
                    })
                ];
                _styles.MultiPoint = _styles.Point;
                _styles.GeometryCollection = _styles.Polygon.concat(_styles.Point);
                styles[celltype] = _styles;
            //});
            return function(feature, resolution) {
                let s = styles[celltype][feature.getGeometry().getType()];
                return styles[celltype][feature.getGeometry().getType()];
            };
        }
    };

    var handleDrawing = function(e) {
        //var geometryFunction, maxPoints;
        if (app.drawing) {
            return;
        }
        app.drawing = true;
        $('table.delineation-list tr[data-delineation-status="Ephemeral"]').each(function(i) {

            let editing = $(this).find('button.btn-modify').data('editing');
            //console.log('tr', tr, $(tr).find('button.btn-modify'), editing);
            if (editing) {
                app.map.removeInteraction(editing);
            }
            
        }).remove();
        _.each(app.delineation_features.getArray(), f => {
            if (f.get('status') == 'Ephemeral') {
                app.delineation_features.remove(f);
            } 
        });
        let type = _.find(app.delineation_types, {name: $('#ol-delineation-type').val()});
        let draw = new _ol_interaction_Draw_({
            source: app.delineation_src,
            type: type.geometry,
            //geometryFunction: geometryFunction,
            //maxPoints: maxPoints,
            clickTolerance: 12,
            snapTolerance: 0,
            style: drawingStyle(type.name)
        });
        //console.log('style created', ol.style.createDefaultEditingStyles());
        //window.s_ = ol.style.createDefaultEditingStyles();
        draw.on('drawstart', function(e) {
            let feature = e.feature;
            let type = $('#ol-delineation-type').val();
            feature.set('delineation_type', type);
            feature.set('memo', '');
            addFeature(feature);
            let deli_type = _.find(app.delineation_types, {name: type});
            feature.set('status', deli_type.status);
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
                        delineation_features.remove(feature);
                    }
                } else if (key_evt.keyCode === 13) {
                    draw.finishDrawing();
                }
            });
        });
        draw.on('drawend', function(e) {
            e.preventDefault();
            let type_str = e.feature.get('delineation_type');
            let type = _.find(app.delineation_types, {name: type_str});
            e.feature.setStyle(
                new _ol_style_Style_({
                    fill: new _ol_style_Fill_({
                        color: type.fill
                    }),
                    stroke: new _ol_style_Stroke_({
                        color: type.stroke,
                        width: 3
                    }),
                    image: new _ol_style_Circle_({
                        radius: 7,
                        fill: new _ol_style_Fill_({
                            color: '#ffcc33'
                        })
                    })
                })
            );
            $(document).off('keyup.cancel');
            if (type_str == 'Cell Count') {
                let cell_count_result = do_cell_count(e.feature);
            } else if (type_str == 'Rogue Cells') {
                let cell_count_result = do_cell_count(e.feature);
                e.feature.set('memo', '');
            } else {
                e.feature.set('memo', '');
            }
            setTimeout(function() {
                $('#ol-delineation-button').text('Start');
                app.map.removeInteraction(draw);
                app.drawing = false;
                let uuid = e.feature.get('delineation_uuid');
                $('table.delineation-list tr[data-delineation-uuid="' + uuid + '"] .btn-modify').click();

            }, 251);
        });
        app.map.addInteraction(draw);
        $('#ol-delineation-button').text('Drawing');
    };
    app.$delineation_start = $start;
    $start.on('click.delineation touchstart.delineation', handleDrawing);
    $save.on('click touchstart', function() {
        let f = _.filter(app.delineation_features.getArray(), f => f.status != 'Ephemeral');
        let geojson = new _ol_format_GeoJSON_;
        let features = geojson.writeFeaturesObject(f);
        features.section_id = app.section_id;
        features.deleted = geojson.writeFeaturesObject(removed_features);
        $.ajax({
            type:'POST',
            url: '/async/delineation',
            data: JSON.stringify(features),
            contentType: 'application/json; charset=utf-8',
            success: function(data, status, xhr) {
                _.each(data.features, function(v, k) {
                    let uuid = v.properties.delineation_uuid;
                    let id = v.properties.delineation_id;
                    let f = app.delineation_uuid_lookup[uuid];
                    if (!f.get('delineation_id')) {
                        f.set('delineation_id', id);
                    }
                });
            }
        });

    });
    $elem.append($label, $select, $start, $save, $dropdown, $annolist);
    $annolist.hide();
    $dropdown.on('click touchstart', function() {
        $annolist.toggle('fast');
    });
    _ol_control_Control_.call(this, {
        element: $elem[0],
        target: options.target
    });
}

_ol_.inherits(_ol_control_Delineation_, _ol_control_Control_);
