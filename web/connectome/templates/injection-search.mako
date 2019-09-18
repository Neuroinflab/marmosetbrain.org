<%inherit file='page.mako'/>
<%block name='scripts'>
##<script type="text/javascript" src="${h.static('scripts/jquery.event.drag-2.2.js')}"></script>
##<script type="text/javascript" src="${h.static('scripts/jquery-ui.min.js')}"></script>
##<script type="text/javascript" src="${h.static('scripts/slick.core.js')}"></script>
##<script type="text/javascript" src="${h.static('scripts/slick.formatters.js')}"></script>
##<script type="text/javascript" src="${h.static('scripts/slick.dataview.js')}"></script>
##<script type="text/javascript" src="${h.static('scripts/slick.grid.js')}"></script>
<script type="text/javascript">
    var app = {};
    app.route_name = '${request.matched_route.name}';
    app.regions = ${regions_json | n};
    app.injections = ${injections_json | n};
    //app.injections = _.sortBy(app.injections, 'a');
    app.regions_by_color = {};
    _.forOwn(app.regions, function(v, key) {
        var cc = v.color_code;
        app.regions[key].color = {
            r: parseInt(cc.slice(1, 3), 16),
            g: parseInt(cc.slice(3, 5), 16),
            b: parseInt(cc.slice(5, 7), 16)
        };
        app.regions_by_color[v.color_code.toLowerCase()] = v;
    });

    app.rgbToHex = function (r, g, b) {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
    };
    app.color_code = function (p) {
        return "#" + ('000000' + app.rgbToHex(p[0], p[1], p[2])).slice(-6); 
    };

    app.injection_async_url = "${request.route_url('injection.search_async')}";
</script>
</%block>
<%block name='styles'>
##<link rel='stylesheet' href="${h.static('css/slick.grid.css')}" type='text/css' media='all' />
##<link rel='stylesheet' href="${h.static('css/slick-default-theme.css')}" type='text/css' media='all' />
<link rel='stylesheet' href="${h.static('css/viewer.css')}" type='text/css' media='all' />
</%block>
<div class="container page-body">
    <div id="react-main">
    </div>
    <p>&nbsp;</p>
    <h6>For project documentation and technical details click <a href="${request.route_url('whitepaper')}">here</a>.</h6>
    <h6>Scanned images by MHP, Department of Anatomy and Developmental Biology</h6>
    <h6><a href="${request.route_url('login')}">Administrator access</a>.</h6>
</div><!-- /.container -->
<script type="text/javascript" src="${h.static_nocache('scripts/commons.min.js')}"></script>
<script type="text/javascript" src="${h.static_nocache('scripts/bundle.min.js')}"></script>

