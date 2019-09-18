/* Kudos to Jeff Ward: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript */
/**
 * Fast UUID generator, RFC4122 version 4 compliant.
 * @author Jeff Ward (jcward.com).
 * @license MIT license
 * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
 **/
import CustomControls from './CustomControls';
import Actions from '../actions/Actions';
import _ol_control_Delineation_ from './controls/delineation';
import _ol_control_GotoAdmin_ from './controls/goto_admin';
import {_ol_source_Djatoka_} from '../lib/djatoka';
import _ol_ from 'ol';
import _ol_color_ from 'ol/color';
import _ol_View_ from 'ol/view';
import _ol_layer_Vector_ from 'ol/layer/vector';
import _ol_source_Vector_ from 'ol/source/vector';
import _ol_style_Style_ from 'ol/style/style';
import _ol_style_Fill_ from 'ol/style/fill';
import _ol_style_Circle_ from 'ol/style/circle';
import _ol_style_Text_ from 'ol/style/text';
import _ol_style_Stroke_ from 'ol/style/stroke';
import _ol_Collection_ from 'ol/collection';
import _ol_Feature_ from 'ol/feature';
import _ol_geom_Polygon_ from 'ol/geom/polygon';
import _ol_geom_Point_ from 'ol/geom/point';
import _ol_geom_LineString_ from 'ol/geom/linestring';
import _ol_geom_MultiPolygon_ from 'ol/geom/multipolygon';
import _ol_geom_MultiLineString_ from 'ol/geom/multilinestring';
import _ol_control_ScaleLine_ from './controls/scaleline';
import _ol_control_ from 'ol/control';
import _ol_coordinate_ from 'ol/coordinate';
import _ol_control_MousePosition_ from './controls/mouseposition';
import _ol_control_Attribution_ from 'ol/control/attribution';
import _ol_events_condition_ from 'ol/events/condition';
import {_ol_control_Annotation_} from './controls/annotation';
import {_ol_control_ToggleLayer_, _ol_control_ToggleMeta_,
    _ol_control_SectionLabel_, _ol_control_BackButton_,
    _ol_control_FlatButton_,
} from './controls/buttons';
import _ol_Projection_ from 'ol/proj/projection';
import {_ol_control_SagittalNav_, _ol_control_CoronalNav_} from './controls/nav';
import {_ol_control_ParcelButton_} from './controls/parcellation';
import Map from 'ol/map';
import Tile from 'ol/layer/tile';
import _ol_interaction_Modify_ from 'ol/interaction/modify';
import {makeStyleFunc} from './controls/style';

class SectionViewer {
    constructor() {
        if (app.route_name == 'section.view') {
            app.UUID = (function() {
              var self = {};
              var lut = []; for (var i=0; i<256; i++) { lut[i] = (i<16?'0':'')+(i).toString(16); }
              self.generate = function() {
                var d0 = Math.random()*0xffffffff|0;
                var d1 = Math.random()*0xffffffff|0;
                var d2 = Math.random()*0xffffffff|0;
                var d3 = Math.random()*0xffffffff|0;
                return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
                  lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
                  lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
                  lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];
              }
              return self;
            })();
            let headers = app._cells.headers;
            _.each(app._cells.data, function(v) {
                let c = {
                    [headers[0]]: v[0],
                    [headers[1]]: v[1],
                    [headers[2]]: v[2]
                };
                c.x = c.x * app.res / app.scale_factor_x;
                c.y = c.y * app.res / app.scale_factor_y;
                let f = new _ol_Feature_(new _ol_geom_Point_([c.x, -c.y]));
                switch (c.tracer) {
                    case 'FR':
                    case 'CTBr':
                        app.features_fr.push(f);
                        break;
                    case 'FE':
                    case 'CTBgr':
                        app.features_fe.push(f);
                        break;
                    case 'FB':
                        app.features_fb.push(f);
                        break;
                    case 'DY':
                        app.features_dy.push(f);
                        break;
                    case 'BDA':
                        app.features_bda.push(f)
                        break;
                }
                app.cells.push(c);
            });            
            app.titles = {};
            _.each(app.injections, inj => {
                inj.flatmap_image = 'http://flatmap.marmosetbrain.org/flatmap/' + app.case_id + '/' + inj.tracer + '.png';
                inj.x_mm = inj.x;
                inj.y_mm = inj.y;
                inj.x = inj.x * app.res / app.scale_factor_x;
                inj.y = inj.y * app.res / app.scale_factor_y;
                let f = new _ol_Feature_(new _ol_geom_Point_([inj.x, -inj.y]));
                switch (inj.tracer) {
                    case 'FR':
                    case 'CTBr':
                        if (inj.section_id == app.section_id) {
                            app.features_fr_inj.push(f);
                        }
                        app.titles.FR = inj.tracer;
                        break;
                    case 'FE':
                    case 'CTBgr':
                        if (inj.section_id == app.section_id) {
                            app.features_fe_inj.push(f);
                        }
                        app.titles.FE = inj.tracer;
                        break;
                    case 'FB':
                        if (inj.section_id == app.section_id) {
                            app.features_fb_inj.push(f);
                        }
                        app.titles.FB = inj.tracer;
                        break;
                    case 'DY':
                        if (inj.section_id == app.section_id) {
                            app.features_dy_inj.push(f);
                        }
                        app.titles.DY = inj.tracer;
                        break;
                    case 'BDA':
                        if (inj.section_id == app.section_id) {
                            app.features_bda_inj.push(f)
                        }
                        app.titles.BDA = inj.tracer;
                        break;
                }
            });
            let annotation_type_lookup = {};
            _.each(app.annotation_types, at => {
                at.stroke = JSON.parse(at.stroke);
                at.fill = JSON.parse(at.fill);
                annotation_type_lookup[at.id] = at; 
            });
            var annotation_features = app.annotation_features = new _ol_Collection_();
            app.annotation_lookup = {};
            app.annotation_uuid_lookup = {};

            let annoStyleFunc = (function() {
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
                    var type = this.get('annotation_type');
                    if (style_cache[type]) {
                        return style_cache[type];
                    } else {
                        console.log('ok fill is', this.get('style_').fill);
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
                                text: this.get('memo') ? this.get('memo').replace('&#39;', "'") : '', //getText(feature, resolution, dom),
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

            _.each(app.annotations, function(v, k, l) {
                var type = annotation_type_lookup[v.type_id];
                let geom;
                switch (type.geometry) {
                    case 'Polygon':
                        geom = _ol_geom_Polygon_;
                        break;
                    case 'MultiPolygon':
                        geom = _ol_geom_MultiPolygon_;
                        break;
                    case 'LineString':
                        geom = _ol_geom_LineString_;
                        break;
                    case 'MultiLineString':
                        geom = _ol_geom_MultiLineString_;
                        break;
                }
                //let geom = new _ol_geom_[style.geometry](${af.path_json});
                let f = new _ol_Feature_(new geom(JSON.parse(v.path)));
                f.set('style_', type);
                f.set('annotation_type', type.name);
                f.set('annotation_id', v.id);
                f.set('memo', v.memo);
                f.set('section_id', v.section_id);
                f.setStyle(annoStyleFunc);
                annotation_features.push(f);
                app.annotation_lookup[v.id] = f;
            });

            /* something for the delineation */
            /* a little quick and dirty but should serve its purpose */

            let deliStyleFunc = (function() {
                var style_cache = {};
                var re = /^([a-zA-Z]+) /;
                return function (resolution) {
                    //var hidden = this.get('hidden');
                    //if (hidden) return null;
                    /*
                    var cat = re.exec(this.get('delineation_type'));
                    console.log('cat', cat);
                    var status = app.toggleStatus[cat[1]];
                    if (!status) {
                        console.log('ok do not display me');
                        return null;
                    }
                    */

                    var color = this.get('color');
                    var key = this.get('delineation_type');
                    if (style_cache[this]) {
                        return style_cache[this];
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
                                text: this.get('memo') ? this.get('memo').replace('&#39;', "'") : '',
                                // text: getText(feature, resolution, dom),
                                fill: new _ol_style_Fill_({color: '#000'}),
                                //stroke: new ol.style.Stroke({color: style.stroke, width: 4}),
                                offsetX: 0,
                                offsetY: 0,
                                rotation: 0
                            })
                        })];
                        style_cache[key] = style;
                        return style;
                    }
                };
            })();


            let delineation_types = app.delineation_types;
            app.delitype_lookup = {};
            _.each(app.delineation_types, function(v, k) {
                v.fill = JSON.parse(v.fill);
                v.stroke = JSON.parse(v.stroke);
                //delineation_types[v.name] = v;
                app.delitype_lookup[v.id] = v;
            });

            var delineation_features = app.delineation_features = new _ol_Collection_();
            app.delineation_lookup = {};
            app.delineation_uuid_lookup = {};

            _.each(app.delineations, function(v, k) {
                let delitype = app.delitype_lookup[v.type_id];
                v.path = JSON.parse(v.path);
                let geom;
                switch (delitype.geometry) {
                    case 'Polygon':
                        geom = _ol_geom_Polygon_;
                        break;
                    case 'MultiPolygon':
                        geom = _ol_geom_MultiPolygon_;
                        break;
                    case 'LineString':
                        geom = _ol_geom_LineString_;
                        break;
                    case 'MultiLineString':
                        geom = _ol_geom_MultiLineString_;
                        break;
                }
                var f = new _ol_Feature_(new geom(v.path));
                f.set('style_', delitype);
                f.set('delineation_type', delitype.name);
                f.set('delineation_id', v.id);
                f.set('memo', v.memo);
                f.set('section_id', v.section_id);
                f.setStyle(deliStyleFunc);
                delineation_features.push(f);
                app.delineation_lookup[v.id] = f;
            });

            $(function() {
                var app = window.app;               
                app.toggleStatus = typeof localStorage.toggle_status !== 'undefined' ? JSON.parse(localStorage.toggle_status) : {FE: true, FR: true, FB: true, FB: true, BDA: true, Delineation: true};
                app.toggleStatus.Pencil = true;

                var mousePositionControl = new _ol_control_MousePosition_({
                    coordinateFormat: _ol_coordinate_.createStringXY(1),
                    projection: 'pixels',
                    className: 'custom-mouse-position',
                    target: document.getElementById('mouse-position'),
                    undefinedHTML: '&nbsp;'
                });

                if ($('#thumbnail-' + app.section_code).length > 0) {
                    $('#gallery-thumbnail').scrollTo($('#thumbnail-' + app.section_code), {
                        onAfter: function() {
                            $('.lazy-load').lazyload({
                                container: $('#gallery-thumbnail'),
                                threshold: 200
                            });
                        },
                        offset: function() { return {left: - $('#gallery-thumbnail').width() / 2 + 60}; }
                    });
                } else {
                    var target = $('.section-thumbnail[data-section-id=' + app.next_section_with_cells_id + ']');
                    if (target.length == 0) {
                        target = $('.section-thumbnail').last();
                    }
                    $('#gallery-thumbnail').scrollTo(target, {
                        onAfter: function() {
                            $('.lazy-load').lazyload({
                                container: $('#gallery-thumbnail'),
                                threshold: 200
                            });
                        },
                        offset: function() { return {left: - $('#gallery-thumbnail').width() / 2 + 60}; }
                    });
                }
                /*
                var jsrc = new _ol.source.Djatoka({
                    url: app.url,
                    image: app.rft_id,
                    });
                    */
                var stroke_fe = new _ol_style_Stroke_({color: 'green', width: 0});
                var fill_fe = new _ol_style_Fill_({color: 'green'});
                var style_cache = {};
                app.style_cache = style_cache;
                
                let styles = {
                    FE: makeStyleFunc('square', {
                        fill: new _ol_style_Fill_({color: 'green'}),
                        stroke: new _ol_style_Stroke_({color: 'green', width: 0})
                    }),
                    FR: makeStyleFunc('triangle', {
                        fill: new _ol_style_Fill_({color: 'red'}),
                        stroke: new _ol_style_Stroke_({color: 'red', width: 0})
                    }),
                    DY: makeStyleFunc('circle', {
                        fill: new _ol_style_Fill_({color: '#ffff00'}),
                        stroke: new _ol_style_Stroke_({color: '#ffff00', width: 0})
                    }),
                    FB: makeStyleFunc('square', {
                        fill: new _ol_style_Fill_({color: 'blue'}),
                        stroke: new _ol_style_Stroke_({color: 'blue', width: 0})
                    }),
                    BDA: makeStyleFunc('circle', {
                        fill: new _ol_style_Fill_({color: '#800000'}),
                        stroke: new _ol_style_Stroke_({color: '#800000', width: 0})
                    }),
                    'FE-Inj': makeStyleFunc('injection', {
                        stroke: new _ol_style_Stroke_({color: '#00ff00', width: 4})
                    }),
                    'FR-Inj': makeStyleFunc('injection', {
                        stroke: new _ol_style_Stroke_({color: '#ff0000', width: 4})
                    }),
                    'FB-Inj': makeStyleFunc('injection', {
                        stroke: new _ol_style_Stroke_({color: '#0000ff', width: 4})
                    }),
                    'DY-Inj': makeStyleFunc('injection', {
                        stroke: new _ol_style_Stroke_({color: '#eeee00', width: 4})
                    }),
                    'BDA-Inj': makeStyleFunc('injection', {
                        stroke: new _ol_style_Stroke_({color: '#804040', width: 4})
                    }),
                };

                let cell_layers = [];
                _.map(['FE', 'FR', 'FB', 'BDA', 'DY'], (l) => {
                    let layer = new _ol_layer_Vector_({
                        name: l,
                        source: new _ol_source_Vector_({ features: app['features_' + l.toLowerCase()] }),
                        style: styles[l]
                    });
                    cell_layers.push(layer);
                });
                let injection_layers = [];
                _.map(['FE', 'FR', 'FB', 'BDA', 'DY'], (l) => {
                    let layer = new _ol_layer_Vector_({
                        name: l + '-Inj',
                        source: new _ol_source_Vector_({ features: app['features_' + l.toLowerCase() + '_inj'] }),
                        style: styles[l + '-Inj']
                    });
                    injection_layers.push(layer);
                });
                let layer_clip;
                if (app.clip) {
                    let clip_coords = new _ol_Collection_();
                    clip_coords.push(new _ol_Feature_({
                        geometry: new _ol_geom_Polygon_(JSON.parse(app.clip.path))
                    }));
                    var style = new _ol_style_Style_({
                      fill: new _ol_style_Fill_({
                        color: 'black'
                      })
                    });
                    layer_clip = new _ol_layer_Vector_({
                        name: 'clip',
                        source: new _ol_source_Vector_({ features: clip_coords }),
                        style: style
                    });
                    layer_clip.on('precompose', function(e) {
                        e.context.globalCompositeOperation = 'destination-in';
                    });
                    layer_clip.on('postcompose', function(e) {
                      e.context.globalCompositeOperation = 'source-over';
                    });
                }

                let new_source = new _ol_source_Djatoka_({
                    url: app.url,
                    image: app.rft_id
                });
                new_source.getImageMetadata(function() {
                    var meta = new_source.getMeta();
                    var imgWidth = meta.width;
                    var imgHeight = meta.height;
                    var proj = new _ol_Projection_({
                        code: 'DJATOKA',
                        units: 'pixels',
                        //extent: [0, 0, imgWidth, -imgHeight]
                        extent: [0, 0, 256 * Math.pow(2, meta.levels - 1), 256 * Math.pow(2, meta.levels - 1)],
                        getPointResolution: function (resolution, point) {
                            return resolution / app.res;
                        }
                    });
                    let imageLayer = new Tile({
                        source: new_source,
                        projection: proj,
                        name: 'Histology'
                    });

                    let layers = [
                        imageLayer,
                        //layer_clip,
                    ];
                    
                    if (app.clip) {
                        layers.push(layer_clip);
                    }
                    var annotation_features = app.annotation_features;
                    var annotation_src = new _ol_source_Vector_({wrapX: false, features: annotation_features});
                    app.annotation_src = annotation_src;

                    let annotation_layer = new _ol_layer_Vector_({
                        name: 'Annotation',
                        source: annotation_src
                    });        

                    var parcel_styles = (function() {
                        var style_cache = {};
                        return function (resolution) {
                            var color = this.get('color');
                            var key = color;
                            if (this.get('highlight')) {
                                key += '_highlight';
                            }
                            if (style_cache[key]) {
                                return style_cache[key];
                            } else {
                                var color_array = _ol_color_.asArray(color).slice();
                                if (this.get('highlight')) {
                                    color_array = [255, 255, 255, 0];
                                }
                                var style = [new _ol_style_Style_({
                                    fill: new _ol_style_Fill_({
                                        color: color_array,
                                    }),
                                    stroke: new _ol_style_Stroke_({
                                        color: color_array,
                                        width: 1,
                                    })
                                })];
                                style_cache[key] = style;
                                return style;
                            }
                        };
                    })();
                    var parcel_features = app.parcel_features = new _ol_Collection_();
                    app.parcel_lookup = {};
                    app.parcel_uuid_lookup = {};
                    _.each(app.parcellation, function(v, k, l) {
                        let hexColor = v.fill;
                        let f = new _ol_Feature_({
                            geometry: new _ol_geom_Polygon_(v.path)
                        });
                        f.set('name', v.region);
                        f.set('color', v.fill);
                        f.setStyle(parcel_styles);
                        parcel_features.push(f);
                    });

                    var parcel_src = new _ol_source_Vector_({wrapX: false, features: parcel_features});
                    app.parcel_src = parcel_src;

                    var parcel_layer = new _ol_layer_Vector_({
                        source: parcel_src
                    });
                    app.parcel_layer = parcel_layer;
                    app.parcel_opacity = 0.5;
                    parcel_layer.setOpacity(app.parcel_opacity);
                    layers.push(parcel_layer);
                    layers.push(annotation_layer);
                    if (app.logged_in) {
                        let delineation_src = new _ol_source_Vector_({wrapX: false, features: app.delineation_features});
                        app.delineation_src = delineation_src;
                        let delineation_layer = new _ol_layer_Vector_({
                            name: 'Delineation',
                            source: delineation_src,
                        });
                        app.delineation_layer = delineation_layer;
                        layers.push(delineation_layer);
                    }
                    var imgCenter = [imgWidth / 2, -imgHeight / 2];
                    app.map_view = new _ol_View_({
                        //zoom: typeof localStorage['last_zoom'] !== 'undefined' ? localStorage['last_zoom'] : 1,
                        zoom: 1,
                        maxZoom: meta.levels - 1,
                        projection: proj,
                        center: imgCenter,
                        extent: [0, -1.5 * imgHeight, 1.5 * imgWidth, 0]
                        //extent: [0, 0, imgWidth, imgHeight]
                    });
                    var custom_controls = [];
                    if (app.features_fe.length > 0) {
                        custom_controls.push(new _ol_control_ToggleLayer_({name: 'FE', index: 1, symbol: '\u25a0', title: app.titles.FE}));
                    }
                    if (app.features_fr.length > 0) {
                        custom_controls.push(new _ol_control_ToggleLayer_({name: 'FR', index: 2, symbol: '\u25b2', title: app.titles.FR}));
                    }
                    if (app.features_fb.length > 0) {
                        custom_controls.push(new _ol_control_ToggleLayer_({name: 'FB', index: 3, symbol: '\u25a0', title: app.titles.FB}));
                    }
                    if (app.features_dy.length > 0) {
                        custom_controls.push(new _ol_control_ToggleLayer_({name: 'DY', index: 4, symbol: '\u25cf', title: app.titles.DY}));
                    }
                    if (app.features_bda.length > 0) {
                        custom_controls.push(new _ol_control_ToggleLayer_({name: 'BDA', index: 5, symbol: '\u25cf', title: app.titles.BDA}));
                    }
                    if (app.logged_in) {
                        custom_controls.push(new _ol_control_ToggleLayer_({name: 'Delineation', index: 6, symbol: '', title: 'Delineation'}));
                        if (app.allow_admin) {
                            custom_controls.push(new _ol_control_Annotation_());
                            custom_controls.push(new _ol_control_Delineation_());
                        } else {
                            custom_controls.push(new _ol_control_GotoAdmin_());
                        }
                    }
                    let attribution = new _ol_control_Attribution_({
                        collapsible: false,
                        html: 'Scanned images by MHP, Department of Anatomy and Developmental Biology'
                    });


                    var nav;
                    if (app.sectioning_plane == 'sagittal') {
                        nav = new _ol_control_CoronalNav_();
                    } else {
                        nav = new _ol_control_SagittalNav_();
                    }
                    Array.prototype.push.apply(custom_controls, [
                            //new ol.control.OverviewMap(),
                        new _ol_control_SectionLabel_(),
                        new _ol_control_ToggleMeta_(),
                        new _ol_control_BackButton_(),
                        new _ol_control_FlatButton_(),
                        new _ol_control_ParcelButton_(),
                        mousePositionControl,
                        new _ol_control_ScaleLine_({unit: 'pixels', minWidth: 150}),
                        nav
                    ]);
                    var baseTextStyle = {
                        font: 'bold 16px Calibri,Arial,sans-serif',
                        textAlign: 'center',
                        textBaseline: 'middle',
                        offsetX: 0,
                        offsetY: -15,
                        rotation: 0,
                        fill: new _ol_style_Fill_({
                            color: [0,0,0,1]
                        }),
                        troke: new _ol_style_Stroke_({
                            color: [255,255,255,0.8],
                            width: 4
                        })
                    };

                    var highlightStyle = new _ol_style_Style_({
                        stroke: new _ol_style_Stroke_({
                            color: [255,0,0,6],
                            width: 2
                        }),
                        fill: new _ol_style_Fill_({
                            color: [255,0,0,0.2]
                        }),
                        zIndex: 1
                    });


                    function styleFunction(feature, resolution) {
                        var style;
                        var geom = feature.getGeometry();
                        if (geom.getType() == 'Point') {
                            var text = feature.get('text');
                            baseTextStyle.text = text;
                            // this is inefficient as it could create new style objects for the
                            // same text.
                            // A good exercise to see if you understand would be to add caching
                            // of this text style
                            style = new _ol_style_Style_({
                                text: new _ol_style_Text_(baseTextStyle),
                                zIndex: 2
                            });
                        } else {
                            style = highlightStyle;
                        }

                        return [style];
                    }

                    layers.push.apply(layers, cell_layers);
                    if (app.logged_in) {
                        //layers.push.apply(layers, injection_layers);
                    }    
                    let parcelHighlightCollection = new _ol_Collection_();
                    let parcelHighlightSrc = new _ol_source_Vector_({wrapX: false, features: parcelHighlightCollection, useSpatialIndex: false});
                    let overlay_layer = new _ol_layer_Vector_({
                        map: app.map,
                        style: styleFunction,
                        source: parcelHighlightSrc
                    });
                    layers.push(overlay_layer);
                    app.map = new Map({
                        target: 'map',
                        layers: layers,
                        view: app.map_view,
                        pixelRatio: 1,
                        controls: _ol_control_.defaults({
                            attribution: false
                        }).extend(custom_controls),
                        logo: false
                    });
                    _.each(['FE', 'FR', 'FB', 'DY', 'BDA', 'Delineation'], layer_name => {
                        if (!app.toggleStatus[layer_name]) {
                            _.each(layers, cl => {
                                if (cl.get('name') == layer_name) {
                                    cl.setVisible(false);
                                }
                            });
                        }
                    });
                    app.map_inited = false;
                    var view = app.map.getView();
                    var extent = null;
                    /*
                    try {
                        var last_view = localStorage['last_view'];
                        console.log('last_view', last_view, typeof last_view);
                        var now = Math.floor(new Date().getTime() / 1000);
                        console.log('diff', (now - last_view));
                        if (now - last_view < 3600) {
                            extent = JSON.parse(localStorage['last_extent']);
                        }
                    } catch (e) {
                        console.log('parsing last_extent error', e);
                    }
                    console.log(app.marmoset_id, localStorage['last_marmoset_id'], app.marmoset_id == localStorage['last_marmoset_id']);
                    if (extent !== null && app.marmoset_id == localStorage['last_marmoset_id']) {
                        view.fit(extent, app.map.getSize());
                    } 
                    if (app.marmoset_id != localStorage['last_marmoset_id']) {
                        localStorage['last_marmoset_id'] = app.marmoset_id;
                    }
                    */
                    /*
                    app.map.on('change:size', function(evt) {
                        if (!app.map_inited) {
                            var map = evt.target;
                            var view = map.getView();
                            var extent = JSON.parse(localStorage['last_extent']);
                            if (extent !== null) {
                                //view.fit(extent, map.getSize());
                                console.log('yes!');
                            }
                            app.map_inited = true;
                        }
                    });
                    */


                    // Viewer State must be restored before moveend and change:resolution
                    // otherwise it will trigger dispatch loop
                    Actions.restoreViewerState();
                    app.map.on('moveend', function(evt) {
                        /*
                        var map = evt.map;
                        var view = map.getView();
                        var extent = view.calculateExtent(map.getSize());
                        localStorage['last_extent'] = JSON.stringify(extent);
                        localStorage['last_view'] = Math.floor(new Date().getTime() / 1000);
                        //localStorage['last_zoom'] = JSON.stringify(view.getZoom());
                        */
                       Actions.saveViewerState();
                       console.log('moveend');
                    });
                    app.map_view.on('change:resolution', function(evt) {
                        /*
                        var view = evt.target;
                        var map = app.map;
                        var extent = view.calculateExtent(map.getSize());
                        localStorage['last_extent'] = JSON.stringify(extent);
                        localStorage['last_view'] = Math.floor(new Date().getTime() / 1000);
                        //localStorage['last_zoom'] = JSON.stringify(view.getZoom());
                        //var center = viewState.center;
                        //var projection = viewState.projection;
                        //var pointResolution =
                        //    projection.getPointResolution(viewState.resolution, center);
                        var zoom  = evt.target.getZoom();
                        if (zoom >= 5) {
                        }
                        */
                       Actions.saveViewerState();
                       console.log('change:resolution');
                    });

                    app.highlit_features = new _ol_Collection_();
                    var highlight_style = new _ol_style_Style_({
                        stroke: new _ol_style_Stroke_({color: [0, 0, 0, 1], width: 2}),
                        fill: new _ol_style_Fill_({color: [255, 255, 255, 0]})
                    });
                    app.map.on('pointermove', function(browserEvent) {
                        // first clear any existing features in the overlay
                        overlay_layer.getSource().clear(true);
                        //app.highlit_features.clear(true);
                        var coordinate = browserEvent.coordinate;
                        var pixel = browserEvent.pixel;
                        var itered_features = 0;
                        app.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                            itered_features++;
                            if (layer != parcel_layer) {
                                return;
                            }
                            var opacity = layer.getOpacity();
                            if (opacity <= 0) {
                                return;
                            }
                            var contour = new _ol_Feature_(new _ol_geom_Polygon_(feature.getGeometry().getCoordinates()));
                            contour.setStyle(highlight_style);
                            var to_remove = [];
                            app.highlit_features.forEach(function(f) {
                                if (f == feature || f.getGeometry().getType() == 'Point') {
                                    return;
                                } else {
                                    f.unset('highlight');
                                    to_remove.push(f);
                                }
                            });
                            _.each(to_remove, function(f) {
                                app.highlit_features.remove(f);
                            });
                            app.highlit_features.push(feature);
                            feature.set('highlight', true);
                            /*
                            var geometry = feature.getGeometry();
                            var point;
                            switch (geometry.getType()) {
                                case 'MultiPolygon':
                                    var poly = geometry.getPolygons().reduce(function(left, right) {
                                        return left.getArea() > right.getArea() ? left : right;
                                    });
                                    point = poly.getInteriorPoint().getCoordinates();
                                    break;
                                case 'Polygon':
                                    point = geometry.getInteriorPoint().getCoordinates();
                                    break;
                                default:
                                    point = geometry.getClosestPoint(coordinate);
                                    }
                                    */       
                            let textFeature = new _ol_Feature_({
                                geometry: new _ol_geom_Point_(coordinate),
                                text: feature.get('name'),
                            });
                            overlay_layer.getSource().addFeature(contour);
                            overlay_layer.getSource().addFeature(textFeature);
                        });
                        if (itered_features == 0) {
                            app.highlit_features.forEach(function(f) {
                                f.unset('highlight');
                            });
                            app.highlit_features.clear();
                        }
                    });
                    app.map.on('click', (e) => {
                        let ctrlKey = e.originalEvent.ctrlKey;
                        let coordinate = e.coordinate;
                        let pixel = e.pixel;
                        let itered_features = 0;
                        if (ctrlKey) {
                            app.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                                if (layer != app.delineation_layer) {
                                    return;
                                }
                                itered_features++;
                                console.log('feature found', feature);
                                let uuid = feature.get('delineation_uuid');
                                $('table.delineation-list tr[data-delineation-uuid="' + uuid + '"] .btn-modify').click();
                                /*
                                var opacity = layer.getOpacity();
                                if (opacity <= 0) {
                                    return;
                                }
                                var contour = new ol.Feature(new ol.geom.Polygon(feature.getGeometry().getCoordinates()));
                                contour.setStyle(highlight_style);
                                var to_remove = [];
                                app.highlit_features.forEach(function(f) {
                                    if (f == feature || f.getGeometry().getType() == 'Point') {
                                        return;
                                    } else {
                                        f.unset('highlight');
                                        to_remove.push(f);
                                    }
                                });
                                _.each(to_remove, function(f) {
                                    app.highlit_features.remove(f);
                                   })
                                */
                            });
                            if (itered_features == 0) {
                                $('table.delineation-list tr .btn-modify.active').click();
                            }
                        }
                        /*
                        app.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                            itered_features++;
                            if (layer != parcel_layer) {
                                return;
                            }
                            var opacity = layer.getOpacity();
                            if (opacity <= 0) {
                                return;
                            }
                            var contour = new ol.Feature(new ol.geom.Polygon(feature.getGeometry().getCoordinates()));
                            contour.setStyle(highlight_style);
                            var to_remove = [];
                            app.highlit_features.forEach(function(f) {
                                if (f == feature || f.getGeometry().getType() == 'Point') {
                                    return;
                                } else {
                                    f.unset('highlight');
                                    to_remove.push(f);
                                }
                            });
                            _.each(to_remove, function(f) {
                                app.highlit_features.remove(f);
                               });
                        */

                    });
                    let active_annotation_features = new _ol_Collection_();
                    app.active_annotation_features = active_annotation_features;
                    if (app.logged_in) {
                        annotation_features.forEach(v => {
                            active_annotation_features.push(v);
                        });
                        if (app.allow_admin) {
                            let modify = new _ol_interaction_Modify_({
                                features: active_annotation_features,
                                deleteCondition: function(event) {
                                    return _ol_events_condition_.shiftKeyOnly(event) &&
                                        _ol_events_condition.singleClick(event);
                                }
                            });
                            app.map.addInteraction(modify);
                            app.map.once('postrender', (event) => {
                                $('table.delineation-list button.btn-modify').click();
                            });
                        }
                    }
                });
                //layers[1].setVisible(false);
                var update_flatmap_position = function() {
                    var top = $(window).height() / 2 - $('#flatmap-image').height() / 2;
                    var left = $(window).width() / 2 - $('#flatmap-image').width() / 2;
                    $('#flatmap-holder').css({
                        top: top,
                        left: left
                    });
                };
                $('#flatmap-image').load(function() {
                    $('#flatmap-image-caption').text(app.flatmap_caption);
                    $('#flatmap-holder').show();
                    update_flatmap_position();
                    $('#loading-monkey').hide();
                });
                $(window)
                    .on('resize', function(e) {
                        if (app.flatmap_on) {
                            update_flatmap_position();
                        }
                    });
                $(document)
                    .on('click.memo-edit', '#memo-edit .btn-save-annotation', function(e) {
                        let $edit = $('#memo-edit');
                        let uuid_key = $edit.data('uuid_key');
                        if (!uuid_key) {
                            uuid_key = 'annotation_uuid';
                        }
                        let uuid = $edit.data(uuid_key);
                        let memo = $('#memo-content').val();
                        let f = app[uuid_key + '_lookup'][uuid];
                        f.set('memo', memo);
                        $('#memo-text-' + uuid).text(memo);
                    })
                    .on('keydown', function(e) {
                        if ($.modal.isActive()) {
                            return;
                        }
                        switch (e.keyCode) {
                            case 37: // left
                                if (app.flatmap_on) {
                                    var count = $('#flatmap-ul li').length;
                                    var index = app.flatmap_index;
                                    index -= 1;
                                    if (index < 0) {
                                        index += count;
                                    }
                                    var flatmap_anchor = $('#flatmap-ul li:eq(' + index +') a');
                                    var flatmap = $('#flatmap-image').attr('src', flatmap_anchor.attr('href'));
                                    app.flatmap_caption = flatmap_anchor.data('caption');
                                    app.flatmap_index = index;
                                } else {
                                    if (!e.shiftKey) {
                                        // left arrow
                                        window.location.href = app.prev_section_with_cells_url;
                                    } else {
                                        // shift left
                                        window.location.href = app.prev_section_url;
                                    }
                                }
                                break;
                            case 39: // right
                                if (app.flatmap_on) {
                                    var count = $('#flatmap-ul li').length;
                                    var index = app.flatmap_index;
                                    index += 1;
                                    if (index >= count) {
                                        index -= count;
                                    }
                                    var flatmap_anchor = $('#flatmap-ul li:eq(' + index +') a');
                                    var flatmap = $('#flatmap-image').attr('src', flatmap_anchor.attr('href'));
                                    app.flatmap_caption = flatmap_anchor.data('caption');
                                    app.flatmap_index = index;
                                } else {
                                    if (!e.shiftKey) {
                                        // right arrow
                                        window.location.href = app.next_section_with_cells_url;
                                    } else  {
                                        // shift right
                                        window.location.href = app.next_section_url;
                                    }
                                }
                                break;
                            case 27: // Esc
                                if (app.flatmap_on) {
                                    app.flatmap_on = false;
                                    $('#flatmap-holder').hide();
                                    $('#flatmap-overlay').hide();
                                    $('#loading-monkey').show();
                                } else {
                                    console.log('when flatmap is not on');
                                    if ($('#flatmap').is(':visible') && !$('#flatmap').is(':animated')) {
                                        $('#flatmap').animate({left:'toggle'}, 350);
                                    }
                                }
                                break;
                            case 65: //'a'
                                if (!e.shiftKey) {
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
                                    Actions.saveViewerState();
                                }
                                break;
                            case 68: //'d'
                                if (!e.shiftKey) {
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
                                    Actions.saveViewerState();
                                } else {
                                    app.$delineation_start.trigger('click.delineation');
                                }
                                break;
                            case 83: //'s'
                                if (!e.shiftKey) {
                                    var parcel_layer = app.parcel_layer; 
                                    app.parcel_opacity = - app.parcel_opacity;
                                    if (app.parcel_opacity > 0) {
                                        parcel_layer.setOpacity(app.parcel_opacity);   
                                        $('button.parcellation-toggle').removeClass('layer-invisible');
                                    } else {
                                        parcel_layer.setOpacity(0);   
                                        $('button.parcellation-toggle').addClass('layer-invisible');
                                    }
                                    Actions.saveViewerState();
                                }
                                break;
                            case 71: // 'g'
                                if (!e.shiftKey) {
                                    let hide_all = $('.toggle-layer.hide-all');
                                    console.log('hide all is');
                                    if (hide_all.length > 0) {
                                        console.log('length > 0');
                                        $('.toggle-layer.hide-all').each(function() {
                                            $(this).removeClass('hide-all').click();
                                        });
                                    } else {
                                        $('.toggle-layer:not(.layer-invisible)').each(function() {
                                            if ($(this).data('name') != 'Delineation') {
                                                $(this).addClass('hide-all').click();
                                            }
                                        });
                                    }
                                    Actions.saveViewerState();
                                }
                                break;
                            case 72: // 'h'
                                if (!e.shiftKey) {
                                    /*
                                    var deli_layer = app.delineation_layer; 
                                    deli_layer.setVisible(false);
                                    if (app.parcel_opacity > 0) {
                                        parcel_layer.setOpacity(app.parcel_opacity);   
                                        $('button.parcellation-toggle').removeClass('layer-invisible');
                                    } else {
                                        parcel_layer.setOpacity(0);   
                                        $('button.parcellation-toggle').addClass('layer-invisible');
                                        }*/
                                    $('#layer_toggle_Delineation').click();

                                    Actions.saveViewerState();
                                }
                                break;
                            default:
                                console.log('key code', e.keyCode);
                                break;
                        }
                    })
                    .on('click', '.flatmap-link', function(e) {
                        app.flatmap_on = true;
                        Actions.showFlatmap();
                        e.preventDefault();
                        let container = $('#flatmap-image-container');
                        let index = $(this).data('index');
                        app.flatmap_index = index;
                        let flatmap_anchor = $('#flatmap-ul li:eq(' + index +') a');
                        app.flatmap_caption = flatmap_anchor.data('caption');
                        $('#flatmap-overlay').show();
                        let flatmap = $('#flatmap-image').attr('src', flatmap_anchor.attr('href'));
                    })
                    .on('click', '#flatmap-holder,#flatmap-overlay', function(e) {
                        if (e.target == this || e.target == $('#flatmap-image')[0]) {
                            app.flatmap_on = false;
                            $('#flatmap-holder').hide();
                            $('#flatmap-overlay').hide();
                            $('#loading-monkey').show();
                        }
                    });
                    /*
                    .on('mouseenter', '.reconstruction-preview', function(e) {
                        var area = $(this).data('region');
                        console.log('area', area);
                        $('#reconstruction-thumbnail img')[0].src = 'http://www.3dbar.org:8080/getThumbnail?cafDatasetName=mbisc_11;structureName=' + area;
                        $('#reconstruction-thumbnail')
                            .css({left: $('#brain-meta').width() + $('#brain-meta').position().left + 10})
                            .show();
                    })
                    .on('mouseleave', '.reconstruction-preview', function(e) {
                        $('#reconstruction-thumbnail').hide();
                    });
                    */
                if (app.logged_in) {
                    $('.info-mouse-position').show();
                }
            });
        }
    }
}
let sectionViewer = new SectionViewer();
export default sectionViewer;
