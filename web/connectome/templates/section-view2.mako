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
        <script type='text/javascript' src="${h.static('scripts/ol-custom.js')}"></script>
        ##<script type='text/javascript' src="http://d13rgn2ixumcch.cloudfront.net/ol-custom.js"></script>
        <title>Section View: ${section.marmoset.case_id}-${section.code}</title>
        <script type="text/javascript">
            window.app = {};
            app = window.app;
            app.cells = ${str(cells)|n};
            app.injections = ${str(injections)|n};
            //app.section_code = '${section.substitute_section.code if section.substitute_section_id else section.code}';
            app.case_id = '${section.marmoset.case_id}';
            app.section_code = '${section.code}';
            app.section_id = ${section.id};
            app.next_section_with_cells_url = "${request.route_url('section.view', section_id=next_section_with_cells_id) | n}";
            app.prev_section_with_cells_url = "${request.route_url('section.view', section_id=prev_section_with_cells_id) | n}";
            app.next_section_url = "${request.route_url('section.view', section_id=next_section_id) | n}";
            app.prev_section_url = "${request.route_url('section.view', section_id=prev_section_id) | n}";
            app.url = 'http://${request.host}/adore-djatoka/resolver';
            app.rft_id = '${section.substitute_section.slug if section.substitute_section_id else section.slug}-nissl';
            app.back_url = '${request.route_url('injection.search')}';
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
            app.res = ${1/float(mm_per_px)};
            // test;
            for (var i=0, ii=app.cells.length; i < ii; i++) {
                var c = app.cells[i];
                c.x = c.x * app.res;
                c.y = c.y * app.res;
                switch (c.tracer) {
                    case 'FR':
                        app.features_fr.push(new ol.Feature(new ol.geom.Point([c.x, -c.y])));
                        break;
                    case 'FE':
                        app.features_fe.push(new ol.Feature(new ol.geom.Point([c.x, -c.y])));
                        break;
                    case 'FB':
                        app.features_fb.push(new ol.Feature(new ol.geom.Point([c.x, -c.y])));
                        break;
                    case 'DY':
                        app.features_dy.push(new ol.Feature(new ol.geom.Point([c.x, -c.y])));
                        break;
                    case 'BDA':
                        app.features_bda.push(new ol.Feature(new ol.geom.Point([c.x, -c.y])));
                        break;
                }
            }
            for (var i=0, ii=app.injections.length; i < ii; i++) {
                var inj = app.injections[i];
                if (inj.section_id != app.section_id) {
                    continue;
                }
                inj.x = inj.x * app.res;
                inj.y = inj.y * app.res;
                switch (inj.tracer) {
                    case 'FE':
                        app.features_fe_inj.push(new ol.Feature(new ol.geom.Point([inj.x, -inj.y])));
                        break;
                    case 'FR':
                        app.features_fr_inj.push(new ol.Feature(new ol.geom.Point([inj.x, -inj.y])));
                        break;
                    case 'FB':
                        app.features_fb_inj.push(new ol.Feature(new ol.geom.Point([inj.x, -inj.y])));
                        break;
                    case 'DY':
                        app.features_dy_inj.push(new ol.Feature(new ol.geom.Point([inj.x, -inj.y])));
                        break;
                    case 'BDA':
                        app.features_bda_inj.push(new ol.Feature(new ol.geom.Point([inj.x, -inj.y])));
                        break;
                }
            }
            var annotation_types = app.annotation_types = {};
            app.annotype_lookup = {};
            %for at in annotation_types:
                annotation_types['${at.name}'] = {id: ${at.id}, name: "${at.name}", stroke: ${at.stroke}, fill: ${at.fill if at.fill else 'null'}, geometry: '${at.geometry}', width: ${at.width}};
                app.annotype_lookup['${at.id}'] = annotation_types['${at.name}'];
            %endfor



            var annotation_features = app.annotation_features = new ol.Collection();
            app.annotation_lookup = {};
            app.annotation_uuid_lookup = {};
            %for af in annotations:
                ##_.each([], function(v, k, l) {
                var style = app.annotype_lookup['${af.type_id}'];
                var geom = new ol.geom[style.geometry](${af.path_json});
                var f = new ol.Feature(geom);
                f.set('annotation_type', app.annotype_lookup['${af.type_id}'].name);
                f.set('annotation_id', ${af.id});
                f.set('memo', '${af.memo}');
                f.set('section_id', ${af.section_id});
                f.setStyle(
                    new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: style.fill
                        }),
                        stroke: new ol.style.Stroke({
                            color: style.stroke,
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
                            font: 'normal 36px Arial',
                            text: "${af.memo}".replace('&#39;', "'"), //getText(feature, resolution, dom),
                            fill: new ol.style.Fill({color: '#fff'}),
                            stroke: new ol.style.Stroke({color: style.stroke, width: 4}),
                            offsetX: 0,
                            offsetY: 0,
                            rotation: 0
                      })
                    })
                );
                annotation_features.push(f);
                app.annotation_lookup['${af.id}'] = f;
                ##}
            %endfor


        </script>
        <script type="text/javascript" src="${h.static('scripts/ol-custom-controls.js')}"></script>
        <script type="text/javascript" src="${h.static('scripts/viewer.js')}"></script>
    </head>
    <body>
        <div class="map-wrapper">
            <div id="marmoset-logo" class="marmoset-logo">
                <a href="${request.route_url('injection.search')}"><img src="${h.static('images/marmoset_logo_sm.png')}" alt="marmoset logo"></a></div>
            <div id="brain-meta" class="brain-meta bg-primary">
                ##Section: ${section.marmoset.case_id}-${section.code}
                Cells: ${len(cells)}
                FE: <script type="text/javascript">document.write(app.features_fe.length);</script>
                FR: <script type="text/javascript">document.write(app.features_fr.length);</script>
                FB: <script type="text/javascript">document.write(app.features_fb.length);</script>
                DY: <script type="text/javascript">document.write(app.features_dy.length);</script>
                ##BDA: <script type="text/javascript">document.write(app.features_bda.length);</script>
                %for inj in injections:
                    <%
                        icon = {
                            'FE': 'images/jump-green.png',
                            'FR': 'images/jump-red.png',
                            'FB': 'images/jump-blue.png',
                            'DY': 'images/jump-yellow.png',
                        }
                    %>
                    <br>Tracer: ${inj['tracer']} Area: ${inj.get('region', 'N/A')}
                    Atlas: A ${inj['atlas_a']} L ${inj['atlas_l']} H ${inj['atlas_h']}
                    <a href="${request.route_url('section.view', section_id=inj['section_id'])}"><img src="${h.static(icon[inj['tracer']])}"/></a>
                %endfor
                <br>Current Position: <span id="mouse-position">&nbsp;</span>
            </div>
            <div id="map" class="map"></div>
            <div class="span6" id="mouse-position1">&nbsp;</div>
            <!--<div id="data"></div>-->
            <div id="gallery-thumbnail" class="gallery-thumbnail">
                %for s in series:
                    <%
                        #cnt = ['%s %s:' % (cnt.tracer.code, cnt.count) for cnt in s.cellcount]
                        #count = ' '.join(cnt)
                        count = sum([cnt.count for cnt in s.cellcount])
                        if count == 0:
                            continue
                        """    
                        if s.substitute_section_id:
                            img = s.substitute_section.nissl_img
                        else: 
                            img = s.nissl_img
                        img = s.nissl_img
                        img = img.replace('tif', 'png')
                        """
                        if s.substitute_section_id:
                            img_section = s.substitute_section
                    %>
                    ##<a href="${request.route_url('section.view', section_id=s.id)}"><div class="section-thumbnail${' current-section' if section.id == s.id else ''}" id="thumbnail-${s.code}"><span class="align-helper"></span><img class="lazy-load bottom-filmstrip" data-original="http://143.48.220.34/static/brainthumbs/marmoset/${img}" alt="Section ${s.code}" width="120"><div class="section-label">${s.code}<br/>Cells: ${count}</div></div></a>
                    <a href="${request.route_url('section.view', section_id=s.id)}">
                        <div class="section-thumbnail${' current-section' if section.id == s.id else ''}" id="thumbnail-${s.code}">
                            <span class="align-helper"></span>
                            <img class="lazy-load bottom-filmstrip" data-original="http://d13rgn2ixumcch.cloudfront.net/thumbnails/${s.case_id.upper()}/${img_section.code.upper()}.png" alt="Section ${s.code}" width="120"/>
                            <div class="section-label">${s.code}<br/>Cells: ${count}</div>
                        </div>
                    </a>
                %endfor
            </div>
        </div>
        <div class="hidden" id="memo-edit">
            <div class="modal-header">
                <a rel="modal:close"><button class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button></a>
                <h4 class="modal-title">Memo</h4>
            </div>
            <div class="modal-body" id="modal-body">
                <textarea id="memo-content" class="form-control"></textarea>
            </div>
            <div class="modal-footer">
                <a rel="modal:close"><button type="button" class="btn btn-default">Close</button></a>
                <a rel="modal:close"><button type="button" class="btn btn-primary btn-save-annotation">Save changes</button></a>
            </div>
        </div><!-- /.modal -->
    </body>
</html>
