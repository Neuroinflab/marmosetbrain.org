/* Kudos to Jeff Ward: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript */
/**
 * Fast UUID generator, RFC4122 version 4 compliant.
 * @author Jeff Ward (jcward.com).
 * @license MIT license
 * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
 **/
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

$(function() {
    var app = window.app;
    app.toggleStatus = typeof localStorage.toggle_status !== 'undefined' ? JSON.parse(localStorage.toggle_status) : {FE: true, FR: true, FB: true, FB: true, BDA: true};
    app.toggleStatus.Pencil = true;

    var mousePositionControl = new app.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(1),
        projection: 'pixels',
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;'
    });

    var ScaleLine = function(opt_options) {
        var options = opt_options || {};
        options.render = ScaleLine.render;
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
        //var render = options.render ? options.render : ol.control.ScaleLine.render;

        ol.control.Control.call(this, {
            element: this.element_,
            render: ScaleLine.render,
            target: options.target
        });

        //goog.events.listen(
        //    this, ol.Object.getChangeEventType(ol.control.ScaleLineProperty.UNITS),
        //    this.handleUnitsChanged_, false, this);

        //this.setUnits(/** @type {ol.control.ScaleLineUnits} */ (options.units) ||
        //    ol.control.ScaleLineUnits.METRIC);

    };
    ol.inherits(ScaleLine, ol.control.ScaleLine);

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
            projection.getPointResolution(viewState.resolution, center);
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
    var scaleLine = new ScaleLine({
        unit: 'pixels',
        minWidth: 150,
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
    var jsrc = new ol.source.Djatoka({
        url: app.url,
        image: app.rft_id,
    });
    var stroke_fe = new ol.style.Stroke({color: 'green', width: 0});
    var fill_fe = new ol.style.Fill({color: 'green'});
    var marker_lookup = function(res) {
        var micron_per_px = res / app.res;
        var ret = 0.016 / micron_per_px;
        console.log('marker width', ret);
        return ret;
        /*
        switch (size) {
            case 1:
                return 8;
                break;
            case 2:
                return 6;
                break;
            case 4:
                return 4;
                break;
            case 8:
                return 2;
                break;
            default:
                return 1;
                break;
        }
        */
    }
    var style_cache = {};
    app.style_cache = style_cache;
    var styles = {
        'FE': (function() {
            var style_cache = {};
            return function (feature, resolution) {
                if (style_cache[resolution]) {
                    return style_cache[resolution];
                } else {
                    var style = [new ol.style.Style({
                        image: new ol.style.RegularShape({
                            fill: new ol.style.Fill({color: 'green'}),
                            stroke: new ol.style.Stroke({color: 'green', width: 0}),
                            points: 4,
                            radius: Math.ceil(0.9 * marker_lookup(resolution)) + 1,
                            angle: Math.PI / 4
                        })
                    })];
                    style_cache[resolution] = style;
                    return style;
                }
            };
        })(),
        'FR': (function() {
            var style_cache = {};
            return function (feature, resolution) {
                if (style_cache[resolution]) {
                    return style_cache[resolution];
                } else {
                    var style = [new ol.style.Style({
                        image: new ol.style.RegularShape({
                            fill: new ol.style.Fill({color: 'red'}),
                            stroke: new ol.style.Stroke({color: 'red', width: 0}),
                            strokeWidth: 0,
                            points: 3,
                            radius: marker_lookup(resolution) + 2,
                            angle: 0
                        })
                    })];
                    style_cache[resolution] = style;
                    return style;
                }
            };
        })(),
        'DY': (function() {
            var style_cache = {};
            return function (feature, resolution) {
                if (style_cache[resolution]) {
                    return style_cache[resolution];
                } else {
                    var style = [new ol.style.Style({
                        image: new ol.style.Circle({
                            fill: new ol.style.Fill({color: '#ffff00'}),
                            stroke: new ol.style.Stroke({color: '#ffff00', width: 0}),
                            radius: marker_lookup(resolution) + 0.5
                        })
                    })];
                    style_cache[resolution] = style;                
                    return style;
                }
            };
        })(),
        'FB': (function() {
            var style_cache = {};
            return function(feature, resolution) {
                if (style_cache[resolution]) {
                    return style_cache[resolution];
                } else {
                    var style = [new ol.style.Style({
                        image: new ol.style.RegularShape({
                            fill: new ol.style.Fill({color: 'blue'}),
                            stroke: new ol.style.Stroke({color: 'blue', width: 0}),
                            points: 4,
                            radius: Math.ceil(0.9 * marker_lookup(resolution)) + 1,
                            angle: Math.PI / 4
                        })
                    })];
                    style_cache[resolution] = style;
                    return style;
                }
            };
        })(),
        'BDA': (function() {
            var style_cache = {};
            return function(feature, resolution) {
                if (style_cache[resolution]) {
                    return style_cache[resolution];
                } else {
                    var style = [new ol.style.Style({
                        image: new ol.style.Circle({
                            fill: new ol.style.Fill({color: '#800000'}),
                            stroke: new ol.style.Stroke({color: '#800000', width: 0}),
                            radius: marker_lookup(resolution),
                        })
                    })];
                    style_cache[resolution] = style;
                    return style;
                }
            };
        })(),
        'FE-Inj': (function() {
            var style_cache = {};
            return function(feature, resolution) {
                if (style_cache[resolution]) {
                    return style_cache[resolution];
                } else {
                    var style = [
                        new ol.style.Style({
                            image: new ol.style.RegularShape({
                                stroke: new ol.style.Stroke({color: '#ffffff', width: 10}),
                                points: 4,
                                radius: marker_lookup(resolution) * 4 + 2,
                                radius2: 0,
                                angle: Math.PI / 4
                            })
                        }),
                        new ol.style.Style({
                            image: new ol.style.RegularShape({
                                stroke: new ol.style.Stroke({color: '#00ff00', width: 4}),
                                points: 4,
                                radius: marker_lookup(resolution) * 4,
                                radius2: 0,
                                angle: Math.PI / 4
                            })
                    })];
                    style_cache[resolution] = style;
                    return style;
                };
            }
        })(),
        'FR-Inj': (function() {
            var style_cache = {};
            return function(feature, resolution) {
                if (style_cache[resolution]) {
                    return style_cache[resolution];
                } else {
                    var style = [
                        new ol.style.Style({
                            image: new ol.style.RegularShape({
                                //fill: new ol.style.Fill({color: '#000000'}),
                                stroke: new ol.style.Stroke({color: '#ffffff', width: 10}),
                                points: 4,
                                radius: marker_lookup(resolution) * 4 + 2,
                                radius2: 0,
                                angle: Math.PI / 4
                            })
                        }),
                        new ol.style.Style({
                            image: new ol.style.RegularShape({
                                //fill: new ol.style.Fill({color: 'red'}),
                                stroke: new ol.style.Stroke({color: '#ff0000', width: 4}),
                                points: 4,
                                radius: marker_lookup(resolution) * 4,
                                radius2: 0,
                                angle: Math.PI / 4
                            })
                        })
                    ];
                    style_cache[resolution] = style;
                    return style;
                };
            }
        })(),
        'FB-Inj': (function() {
            var style_cache = {};
            return function (feature, resolution) {
                if (style_cache[resolution]) {
                    return style_cache[resolution];
                } else {
                    var style = [
                        new ol.style.Style({
                            image: new ol.style.RegularShape({
                                //fill: new ol.style.Fill({color: '#000000'}),
                                stroke: new ol.style.Stroke({color: '#ffffff', width: 10}),
                                points: 4,
                                radius: marker_lookup(resolution) * 4 + 2,
                                radius2: 0,
                                angle: Math.PI / 4
                            })
                        }),
                        new ol.style.Style({
                            image: new ol.style.RegularShape({
                                //fill: new ol.style.Fill({color: '#000000'}),
                                stroke: new ol.style.Stroke({color: '#0000ff', width: 4}),
                                points: 4,
                                radius: marker_lookup(resolution) * 4,
                                radius2: 0,
                                angle: Math.PI / 4
                            })
                        })
                    ];
                    style_cache[resolution] = style;                
                    return style;
                }
            }
        })(),
        
        'DY-Inj': (function() {
            var style_cache = {};
            return function (feature, resolution) {
                if (style_cache[resolution]) {
                    return style_cache[resolution];
                } else {
                    var style = [
                        new ol.style.Style({
                            image: new ol.style.RegularShape({
                                //fill: new ol.style.Fill({color: '#000000'}),
                                stroke: new ol.style.Stroke({color: '#ffffff', width: 10}),
                                points: 4,
                                radius: marker_lookup(resolution) * 4 + 2,
                                radius2: 0,
                                angle: Math.PI / 4
                            })
                        }),
                        new ol.style.Style({
                            image: new ol.style.RegularShape({
                                //fill: new ol.style.Fill({color: '#000000'}),
                                stroke: new ol.style.Stroke({color: '#eeee00', width: 4}),
                                points: 4,
                                radius: marker_lookup(resolution) * 4,
                                radius2: 0,
                                angle: Math.PI / 4
                            })
                        })
                    ];
                    style_cache[resolution] = style;                
                    return style;
                }
            };
        })(),
        'BDA-Inj': [new ol.style.Style({
            image: new ol.style.RegularShape({
                //fill: new ol.style.Fill({color: '#804040'}),
                stroke: new ol.style.Stroke({color: '#804040', width: 4}),
                points: 4,
                radius: 10,
                radius2: 0,
                angle: Math.PI / 4
            })
        })],

    };


    var layer_fe = new ol.layer.Vector({
        name: 'FE',
        source: new ol.source.Vector({ features: app.features_fe }),
        style: styles['FE'],
    });
    var layer_fr = new ol.layer.Vector({
        name: 'FR',
        source: new ol.source.Vector({ features: app.features_fr }),
        style: styles['FR']
    });
    var layer_fb = new ol.layer.Vector({
        name: 'FB',
        source: new ol.source.Vector({ features: app.features_fb }),
        style: styles['FB']
    });
    var layer_bda = new ol.layer.Vector({
        name: 'BDA',
        source: new ol.source.Vector({ features: app.features_bda }),
        style: styles['BDA']
    });
    var layer_dy = new ol.layer.Vector({
        name: 'DY',
        source: new ol.source.Vector({ features: app.features_dy }),
        style: styles['DY']
    });
    var layer_fe_inj = new ol.layer.Vector({
        name: 'FE-Inj',
        source: new ol.source.Vector({ features: app.features_fe_inj }),
        style: styles['FE-Inj']
    });
    var layer_fr_inj = new ol.layer.Vector({
        name: 'FR-Inj',
        source: new ol.source.Vector({ features: app.features_fr_inj }),
        style: styles['FR-Inj']
    });
    var layer_fb_inj = new ol.layer.Vector({
        name: 'FB-Inj',
        source: new ol.source.Vector({ features: app.features_fb_inj }),
        style: styles['FB-Inj']
    });
    var layer_dy_inj = new ol.layer.Vector({
        name: 'DY-Inj',
        source: new ol.source.Vector({ features: app.features_dy_inj }),
        style: styles['DY-Inj']
    });
    var layer_bda_inj = new ol.layer.Vector({
        name: 'BDA-Inj',
        source: new ol.source.Vector({ features: app.features_bda_inj }),
        style: styles['BDA-Inj']
    });


    jsrc.getImageMetadata(function() {
        var meta = jsrc.getMeta();
        var imgWidth = meta.width;
        var imgHeight = meta.height;
        var proj = new ol.proj.Projection({
            code: 'DJATOKA',
            units: 'pixels',
            //extent: [0, 0, imgWidth, -imgHeight]
            extent: [0, 0, 256 * Math.pow(2, meta.levels - 1), 256 * Math.pow(2, meta.levels - 1)],
            getPointResolution: function (resolution, point) {
                return resolution / app.res;
            }
        });
        var imageLayer = new ol.layer.Tile({
            source: jsrc,
            projection: proj
        });

        var layers = [
            imageLayer
        ];
        var annotation_features = app.annotation_features;
        var annotation_src = new ol.source.Vector({wrapX: false, features: annotation_features});
        app.annotation_src = annotation_src;

        var annotation_layer = new ol.layer.Vector({
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
                    var color_array = ol.color.asArray(color).slice();
                    if (this.get('highlight')) {
                        color_array = [255, 255, 255, 0];
                    }
                    var style = [new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: color_array,
                        }),
                        stroke: new ol.style.Stroke({
                            color: color_array,
                            width: 1,
                        })
                    })];
                    style_cache[key] = style;
                    return style;
                }
            };
        })();
        var parcel_features = app.parcel_features = new ol.Collection();
        app.parcel_lookup = {};
        app.parcel_uuid_lookup = {};
        _.each(app.parcellation, function(v, k, l) {
            var hexColor = v.fill;
            var f = new ol.Feature({
                geometry: new ol.geom.Polygon(v.path)
            });
            f.set('name', v.region);
            f.set('color', v.fill);
            f.setStyle(parcel_styles);
            parcel_features.push(f);
        });

        var parcel_src = new ol.source.Vector({wrapX: false, features: parcel_features});
        app.parcel_src = parcel_src;

        var parcel_layer = new ol.layer.Vector({
            source: parcel_src
        });
        app.parcel_layer = parcel_layer;
        app.parcel_opacity = 0.5;
        parcel_layer.setOpacity(app.parcel_opacity);
        layers.push(parcel_layer);
        layers.push(annotation_layer);

        Array.prototype.push.apply(layers, [
            layer_fe,
            layer_fr,
            layer_fb,
            layer_dy,
            layer_bda
        ]);
        /*
            layer_fe_inj,
            layer_fr_inj,
            layer_fb_inj,
            layer_dy_inj,
            layer_bda_inj
        ]);
        */
        var imgCenter = [imgWidth / 2, -imgHeight / 2];
        app.map_view = new ol.View({
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
            custom_controls.push(new app.ToggleLayer({name: 'FE', index: 1, symbol: '\u25a0'}));
        }
        if (app.features_fr.length > 0) {
            custom_controls.push(new app.ToggleLayer({name: 'FR', index: 2, symbol: '\u25b2'}));
        }
        if (app.features_fb.length > 0) {
            custom_controls.push(new app.ToggleLayer({name: 'FB', index: 3, symbol: '\u25a0'}));
        }
        if (app.features_dy.length > 0) {
            custom_controls.push(new app.ToggleLayer({name: 'DY', index: 4, symbol: '\u25cf'}));
        }
        if (app.features_bda.length > 0) {
            custom_controls.push(new app.ToggleLayer({name: 'BDA', index: 5, symbol: '\u25cf'}));
        }
        if (app.logged_in) {
            custom_controls.push(new app.Annotation({}));
        }
        var nav;
        if (app.sectioning_plane == 'sagittal') {
            nav = new app.CoronalNav();
        } else {
            nav = new app.SagittalNav();
        }
        Array.prototype.push.apply(custom_controls, [
                //new ol.control.OverviewMap(),
                new app.SectionLabel(),
                new app.ToggleMeta({}),
                new app.BackButton(),
                new app.FlatButton(),
                new app.ParcelButton(),
                mousePositionControl,
                scaleLine,
                nav
        ]);

        var baseTextStyle = {
            font: 'bold 16px Calibri,Arial,sans-serif',
            textAlign: 'center',
            textBaseline: 'middle',
            offsetX: 0,
            offsetY: -15,
            rotation: 0,
            fill: new ol.style.Fill({
                color: [0,0,0,1]
            }),
            stroke: new ol.style.Stroke({
                color: [255,255,255,0.8],
                width: 4
            })
        };

        var highlightStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [255,0,0,6],
                width: 2
            }),
            fill: new ol.style.Fill({
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
                style = new ol.style.Style({
                    text: new ol.style.Text(baseTextStyle),
                    zIndex: 2
                });
            } else {
                style = highlightStyle;
            }

            return [style];
        }


        var tempCol = new ol.Collection();
        var tempSrc = new ol.source.Vector({wrapX: false, features: tempCol, useSpatialIndex: false});
        var overlay_layer = new ol.layer.Vector({
            map: app.map,
            style: styleFunction,
            source: tempSrc
        });
        layers.push(overlay_layer);
        app.map = new ol.Map({
            target: 'map',
            layers: layers,
            view: app.map_view,
            pixelRatio: 1,
            controls: ol.control.defaults({
                attribution: false
            }).extend(custom_controls),
            logo: false
        });
        if (!app.toggleStatus.FE) {
            layer_fe.setVisible(false);
        }
        if (!app.toggleStatus.FR) {
            layer_fr.setVisible(false);
        }
        if (!app.toggleStatus.FB) {
            layer_fb.setVisible(false);
        }
        if (!app.toggleStatus.DY) {
            layer_dy.setVisible(false);
        }
        if (!app.toggleStatus.BDA) {
            layer_bda.setVisible(false);
        }
        app.map_inited = false;
        var view = app.map.getView();
        var extent = null;
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

        app.map.on('moveend', function(evt) {
            var map = evt.map;
            var view = map.getView();
            var extent = view.calculateExtent(map.getSize());
            localStorage['last_extent'] = JSON.stringify(extent);
            localStorage['last_view'] = Math.floor(new Date().getTime() / 1000);
            //localStorage['last_zoom'] = JSON.stringify(view.getZoom());
        });
        app.map_view.on('change:resolution', function(evt) {
            var view = evt.target;
            var map = app.map;
            var extent = view.calculateExtent(map.getSize());
            localStorage['last_extent'] = JSON.stringify(extent);
            localStorage['last_view'] = Math.floor(new Date().getTime() / 1000);
            //localStorage['last_zoom'] = JSON.stringify(view.getZoom());
            /*var center = viewState.center;
            var projection = viewState.projection;
            var pointResolution =
                projection.getPointResolution(viewState.resolution, center);
                */
            var zoom  = evt.target.getZoom();
            if (zoom >= 5) {
            }
        });

        app.highlit_features = new ol.Collection();
        var highlight_style = new ol.style.Style({
            stroke: new ol.style.Stroke({color: [0, 0, 0, 1], width: 2}),
            fill: new ol.style.Fill({color: [255, 255, 255, 0]})
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
                textFeature = new ol.Feature({
                    geometry: new ol.geom.Point(coordinate),
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

        if (app.logged_in) {
            var modify = new ol.interaction.Modify({
                features: annotation_features,
                deleteCondition: function(event) {
                    return ol.events.condition.shiftKeyOnly(event) &&
                    ol.events.condition.singleClick(event);
                }
            });
            app.map.addInteraction(modify);
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
            var uuid = $('#memo-edit').data('annotation_uuid');
            var memo = $('#memo-content').val();
            console.log('uuid', uuid);
            var f = app.annotation_uuid_lookup[uuid];
            f.set('memo', memo);
            $('#memo-text-' + uuid).text(memo);
        })
        .on('keydown', function(e) {
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
                        if ($('#flatmap').is(':visible')) {
                            $('#flatmap').animate({left:'toggle'}, 350);
                        }
                    }
                    break;
                case 65: //'a'
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
                    break
                case 68: //'d'
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
                    break
                case 83: //'s'
                    var parcel_layer = app.parcel_layer; 
                    app.parcel_opacity = - app.parcel_opacity;
                    if (app.parcel_opacity > 0) {
                        parcel_layer.setOpacity(app.parcel_opacity);   
                    } else {
                        parcel_layer.setOpacity(0);   
                    }
                    break
                default:
                    console.log('key code', e.keyCode);
                    break;
            }
        })
        .on('click', '.flatmap-link', function(e) {
            app.flatmap_on = true;
            e.preventDefault();
            var container = $('#flatmap-image-container');
            var index = $(this).data('index');
            app.flatmap_index = index;
            var flatmap_anchor = $('#flatmap-ul li:eq(' + index +') a');
            app.flatmap_caption = flatmap_anchor.data('caption');
            $('#flatmap-overlay').show();
            var flatmap = $('#flatmap-image').attr('src', flatmap_anchor.attr('href'));
        })
        .on('click', '#flatmap-holder,#flatmap-overlay', function(e) {
            app.flatmap_on = false;
            $('#flatmap-holder').hide();
            $('#flatmap-overlay').hide();
            $('#loading-monkey').show();
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
