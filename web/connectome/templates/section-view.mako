<!doctype html>
<html lang="en">
    <head>
        <link rel="stylesheet" href="${h.static('css/bootstrap.min.css')}" type="text/css">
        <link rel="stylesheet" href="${h.static('css/bootstrap-theme.min.css')}" type="text/css">
        <link rel="stylesheet" href="${h.static('css/jquery.modal.css')}" type="text/css">
        <link rel="stylesheet" href="${h.static('css/viewer.css')}" type="text/css">
        <script type="text/javascript" src="${h.static('scripts/lodash.min.js')}"></script>
        <script type="text/javascript" src="${h.static('scripts/jquery-1.11.2.min.js')}"></script>
        <script type="text/javascript" src="${h.static('scripts/jquery.lazyload.js')}"></script>
        <script type="text/javascript" src="${h.static('scripts/jquery.scrollTo.min.js')}"></script>
        <script type="text/javascript" src="${h.static('scripts/jquery.modal.min.js')}"></script>
        <script type="text/javascript" src="${h.static('scripts/bootstrap.min.js')}"></script>
        <script type="text/javascript">
            $.fn.modal.noConflict();
        </script>
        ##<script src="http://openlayers.org/en/v3.5.0/build/ol.js" type="text/javascript"></script>
        ##<script type='text/javascript' src="${h.static('scripts/ol-custom.js')}"></script>
        ##<script type='text/javascript' src="http://d13rgn2ixumcch.cloudfront.net/ol-custom.js"></script>
        <title>Section View: ${display_name}-${section_code}</title>
        <script type="text/javascript">
            window.app = {};
            app = window.app;
            app.route_name = '${request.matched_route.name}';
            app.assets = {
                logo_small: "${h.static('images/marmoset_logo_sm.png')}",
                monkey: "${h.static('images/monkey_walking.gif')}"
            }
            app.links = {
                injection_list: "${request.route_url('injection.search')}"
            }
            app.logged_in = ${h.logged_in};
            app.allow_admin = ${h.allow_admin};
            ##${int(bool(request.authenticated_userid) and ('marmoset.mrosa.org' in request.host))};
            ##app.cells = ${str(cells)|n};
            app.cells = [];
            app._cells = ${json.dumps(_cells) | n};
            app.injections = ${json.dumps(injections) | n};
            app.annotation_types = ${json.dumps(annotation_types) | n};
            app.delineation_types = ${json.dumps(delineation_types) | n};
            app.parcellation = ${parcellation | str,n};
            ##app.section_code = '${section.substitute_section.code if section.substitute_section_id else section.code}';
            app.case_id = '${case_id}';
            app.display_name = '${display_name}';
            app.section_code = '${section_code}';
            app.section_id = ${section_id};
            app.next_section_with_cells_url = "${request.route_url('section.view', section_id=next_section_with_cells_id) | n}";
            app.prev_section_with_cells_url = "${request.route_url('section.view', section_id=prev_section_with_cells_id) | n}";
            app.next_section_url = "${request.route_url('section.view', section_id=next_section_id) | n}";
            app.prev_section_url = "${request.route_url('section.view', section_id=prev_section_id) | n}";
            app.next_section_with_cells_id = ${next_section_with_cells_id};
            app.prev_section_with_cells_id = ${prev_section_with_cells_id};
            app.next_section_id = ${next_section_id};
            app.prev_section_id = ${prev_section_id};
            ##app.url = 'http://${request.host}/adore-djatoka/resolver';
            ##app.url = 'http://cdn-img1.marmosetbrain.org/adore-djatoka/resolver';
            app.url = 'http://cdn-img2.marmosetbrain.org/adore-djatoka/resolver';
            app.rft_id = '${rft_id}';
            app.back_url = "${request.route_url('injection.search')}";
            app.features_fr = [];
            app.features_fe = [];
            app.features_fb = [];
            app.features_dy = [];
            app.features_bda = [];
            app.features_fe_inj = [];
            app.features_fr_inj = [];
            app.features_fb_inj = [];
            app.features_dy_inj = [];
            app.features_bda_inj = [];
            app.series = ${series | n};
            app.sagittal_coord = ${sagittal_coord if sagittal_coord else -19.5};
            app.sagittal_series = ${sagittal_series | n};
            app.annotations = ${json.dumps(annotations) | n};
            app.delineations = ${json.dumps(delineations) | n};
            app.clip = ${json.dumps(clip) | n};
            app.overrideExtent = JSON.parse("[${override_extent}]");
            %if override_zoom:
                app.overrideZoom = ${override_zoom};
            %endif
            app.from_ = "${from_}";
            app.marmoset_id = '${marmoset_id}';
            app.marmoset = {
                <%
                    lines = []
                    for field in ('id', 'sex', 'dob', 'body_weight', 'injection_date', 'hemisphere', 'perfusion_date', 'survival_days', 'sectioning_plane', 'age'):
                        lines.append('%s: "%s"' % (field, getattr(marmoset, field)))

                    #import markupsafe
                    #def br(text):
                    #    return text.replace('\n', markupsafe.Markup('<br />'))
 
                    lines.append('%s: %s' % ('other_info', json.dumps(marmoset.other_info)))
                %>
                ${', '.join(lines) | n}
            };
            app.sectioning_plane = '${marmoset.sectioning_plane}';
            app.scale_factor_x = ${scale_factor_x};
            app.scale_factor_y = ${scale_factor_y};
            app.res = ${1/float(mm_per_px)};
            app.total_cells = ${json.dumps(total_cells) | n};
            <%doc>
            var annotation_types = app.annotation_types = {};
            app.annotype_lookup = {};
            %for at in annotation_types:
                annotation_types['${at.name}'] = {id: ${at.id}, name: "${at.name}", stroke: ${at.stroke}, fill: ${at.fill if at.fill else 'null'}, geometry: '${at.geometry}', width: ${at.width}};
                app.annotype_lookup['${at.id}'] = annotation_types['${at.name}'];
            %endfor

            var annotation_features = app.annotation_features = new ol.Collection();
            app.annotation_lookup = {};
            app.annotation_uuid_lookup = {};

            var anno_stylefunc = (function() {
                var style_cache = {};
                var re = /^([a-zA-Z]+) /;
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
                    var key = this.get('annotation_type');
                    if (style_cache[key]) {
                        return style_cache[key];
                    } else {
                        var style = [new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: this.get('style_').fill
                            }),
                            stroke: new ol.style.Stroke({
                                color: this.get('style_').stroke,
                                width: 3
                            }),
                            image: new ol.style.Circle({
                                radius: 7,
                                fill: new ol.style.Fill({
                                    color: '#ffcc33'
                                })
                            }),
                            text: new ol.style.Text({
                                textAlign: 'center',
                                textBaseline: 'middle',
                                font: 'normal 12px Arial',
                                text: this.get('memo').replace('&#39;', "'"), //getText(feature, resolution, dom),
                                fill: new ol.style.Fill({color: '#fff'}),
                                ##stroke: new ol.style.Stroke({color: style.stroke, width: 4}),
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
           
            var deli_stylefunc = (function() {
                var style_cache = {};
                var re = /^([a-zA-Z]+) /;
                return function (resolution) {
                    console.log('style func res', resolution);
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
                    if (style_cache[key]) {
                        return style_cache[key];
                    } else {
                        var style = [new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: this.get('style_').fill
                            }),
                            stroke: new ol.style.Stroke({
                                color: this.get('style_').stroke,
                                width: 3
                            }),
                            image: new ol.style.Circle({
                                radius: 7,
                                fill: new ol.style.Fill({
                                    color: '#ffcc33'
                                })
                            }),
                            text: new ol.style.Text({
                                textAlign: 'center',
                                textBaseline: 'middle',
                                font: 'normal 12px Arial',
                                text: this.get('memo').replace('&#39;', "'"), //getText(feature, resolution, dom),
                                fill: new ol.style.Fill({color: '#000'}),
                                ##stroke: new ol.style.Stroke({color: style.stroke, width: 4}),
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
            %for af in annotations:
                ##_.each([], function(v, k, l) {
                var style = app.annotype_lookup['${af.type_id}'];
                var geom = new ol.geom[style.geometry](${af.path_json});
                var f = new ol.Feature(geom);
                f.set('style_', style);
                f.set('annotation_type', app.annotype_lookup['${af.type_id}'].name);
                f.set('annotation_id', ${af.id});
                f.set('memo', '${af.memo}');
                f.set('section_id', ${af.section_id});
                f.setStyle(anno_stylefunc);
                annotation_features.push(f);
                app.annotation_lookup['${af.id}'] = f;
                ##}
            %endfor

            /* something for the delineation */
            /* a little quick and dirty but should serve its purpose */
            var delineation_types = app.delineation_types = {};
            app.delitype_lookup = {};
            _.each(${delineation_types | n}, function(v, k) {
                v.fill = JSON.parse(v.fill);
                v.stroke = JSON.parse(v.stroke);
                delineation_types[v.name] = v;
                app.delitype_lookup[v.id] = v;
            });

            var delineation_features = app.delineation_features = new ol.Collection();
            app.delineation_lookup = {};
            app.delineation_uuid_lookup = {};

            _.each(${delineations | n}, function(v, k) {
                var delitype = app.delitype_lookup[v.type_id];
                v.path = JSON.parse(v.path);
                var geom = new ol.geom[delitype.geometry](v.path);
                var f = new ol.Feature(geom);
                f.set('style_', delitype); 
                f.set('delineation_type', delitype.name);
                f.set('delineation_id', v.id);
                f.set('memo', v.memo);
                f.set('section_id', v.section_id);
                f.setStyle(deli_stylefunc);
                delineation_features.push(f);
                app.delineation_lookup[v.id] = f;
            });
            </%doc>
        </script>
        <!-- Piwik -->
        <script type="text/javascript">
          var _paq = _paq || [];
          /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
          _paq.push(['trackPageView']);
          _paq.push(['enableLinkTracking']);
          (function() {
            var u="//piwik.mrosa.org/";
            _paq.push(['setTrackerUrl', u+'piwik.php']);
            _paq.push(['setSiteId', '1']);
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
          })();
        </script>
        <!-- End Piwik Code -->
    </head>
    <body>
        <div class="map-wrapper" id="react-main"></div>
        <script type="text/javascript" src="${h.static('scripts/commons.min.js')}"></script>
        <script type="text/javascript" src="${h.static_nocache('scripts/' + h.js_bundle)}"></script>
    </body>
</html>
