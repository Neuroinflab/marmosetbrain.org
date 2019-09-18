import _ol_ from 'ol';
import _ol_control_Control_ from 'ol/control/control';
import _ol_style_Style_ from 'ol/style/style';
import _ol_style_Fill_ from 'ol/style/fill';
import _ol_style_Stroke_ from 'ol/style/stroke';
import _ol_style_Circle_ from 'ol/style/circle';
import _ol_style_Text_ from 'ol/style/text';
import _ol_format_GeoJSON_ from 'ol/format/geojson';
import _ol_interaction_Draw_ from 'ol/interaction/draw';


let removed_features = [];
let updateVertexCount = function(e) {
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
let styleFunc = (function() {
    let style_cache = {};
    let re = /^([a-zA-Z]+) /;
    return function (resolution) {
        //var hidden = this.get('hidden');
        //if (hidden) return null;
        var cat = re.exec(this.get('annotation_type'));
        var status = app.toggleStatus[cat[1]];
        if (!status) {
            console.log('ok do not display me');
            return null;
        }
        var color = this.get('color');
        var type = this.get('annotation_type');
        if (style_cache[type]) {
            return style_cache[type];
        } else {
            var style = [new _ol_style_Style_({
                fill: new _ol_style_Fill_({
                    color: this.get('style_').fill
                }),
                stroke: new _ol_style_Stroke_({
                    color: this.get('style_').stroke,
                    width: 3
                }),
                image: new _ol_style_Circle_({
                    radius: 7,
                    fill: new _ol_style_Fill_({
                        color: '#ffcc33'
                    })
                }),
                text: new _ol_style_Text_({
                    textAlign: 'center',
                    textBaseline: 'middle',
                    font: 'normal 12px Arial',
                    text: this.get('memo').replace('&#39;', "'"), //getText(feature, resolution, dom),
                    fill: new _ol_style_Fill_({color: '#fff'}),
                    //stroke: new _ol_style_Stroke_({color: style.stroke, width: 4}),
                    offsetX: 0,
                    offsetY: 0,
                    rotation: 0
              })
            })];
            style_cache[type] = style;
            return style;
        }
    };
})();

export function _ol_control_Annotation_(opt_options) {
    var options = opt_options || {};
    var $label = $('<label>Annotation</label>');
    var $select = $('<select name="annotation-type" id="ol-annotation-type"></select>');
    _.each(_.sortBy(app.annotation_types, 'position'), function(t, k, l) {
        $select.append('<option value="' + t.name + '">' + t.name + '</option>');
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
            removed_features.push(f);
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
    let addFeature = function(f) {
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
        f.on('change', updateVertexCount);
    }
    _.each(app.annotation_features.getArray(), function(f, k, l) {
        addFeature(f);
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
    let drawingStyle = function(celltype) {
        var white = [255, 255, 255, 1];
        //var blue = [0, 153, 255, 1];
        var styles = {};

        if (celltype in styles) {
            return styles[celltype][feature.getGeometry().getType()];
        } else {
            _.each(app.annotation_types, function(t, k, l) {
                //var style = app.annotation_types[t];
                let style = t;
                var _styles = {};
                _styles.Polygon = [
                    new _ol_style_Style_({
                        fill: new _ol_style_Fill_({
                            color: [255, 255, 255, 0.5]
                        })
                    })
                ];
                _styles.MultiPolygon = _styles.Polygon;

                _styles.LineString = [
                    new _ol_style_Style_({
                        stroke: new _ol_style_Stroke_({
                            color: white,
                            width: style.width + 2
                        })
                    }),
                    new _ol_style_Style_({
                        stroke: new _ol_style_Stroke_({
                            color: style.stroke,
                            width: style.width
                        })
                    })
                ];
                _styles.MultiLineString = _styles.LineString;

                _styles.Circle = _styles.Polygon.concat(_styles.LineString);
                _styles.Point = [
                    new _ol_style_Style_({
                        image: new _ol_style_Circle_({
                            radius: style.width * 2,
                            fill: new _ol_style_Fill_({
                                color: style.fill
                            }),
                            stroke: new _ol_style_Stroke_({
                                color: white,
                                width: style.width / 2
                            })
                        }),
                        zIndex: Infinity
                    })
                ];
                _styles.MultiPoint = _styles.Point;
                _styles.GeometryCollection = _styles.Polygon.concat(_styles.Point);
                styles[celltype] = _styles;
                //return l;
            });
            return function(feature, resolution) {
                return styles[celltype][feature.getGeometry().getType()];
            };
        }
    };

    var handleDrawing = function(e) {
        //var geometryFunction, maxPoints;
        console.log('app.drawing', app.drawing);
        if (app.drawing) {
            return;
        }
        app.drawing = true;
        var type = _.find(app.annotation_types, {name: $('#ol-annotation-type').val()});
        var draw = new _ol_interaction_Draw_({
            source: app.annotation_src,
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
            var feature = e.feature;
            var type = $('#ol-annotation-type').val();
            feature.set('annotation_type', type);
            feature.set('memo', ''); 
            addFeature(feature);
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
            var type_name = e.feature.get('annotation_type');
            var type = _.find(app.annotation_types, {name: type_name});
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
        var geojson = new _ol_format_GeoJSON_;
        var features = geojson.writeFeaturesObject(app.annotation_features.getArray());
        features.section_id = app.section_id;
        features.deleted = geojson.writeFeaturesObject(removed_features);
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
        if ($('.ol-control.delineation').is(':visible')) {
            $('.ol-control.delineation').hide();
        } else {
            $('.ol-control.delineation').show();
        }
        $annolist.toggle('fast');

    });
    _ol_control_Control_.call(this, {
        element: $elem[0],
        target: options.target
    });
}
_ol_.inherits(_ol_control_Annotation_, _ol_control_Control_);
