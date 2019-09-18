<%inherit file='page.mako' />
<%block name='styles'>
<link rel="stylesheet" type="text/css" media="all" href="${h.static('css/iip.css')}" />
</%block>
<%block name='scripts'>
<script type="text/javascript" src="${h.static('scripts/mootools-core-1.5.1-full-nocompat-yc.js')}"></script>
<script type="text/javascript" src="${h.static('scripts/iipmooviewer-2.0-min.js')}"></script>
##<script type="text/javascript" src="${h.static('scripts/mootools-core-1.5.1-full-nocompat.js')}"></script>
##<script type="text/javascript" src="${h.static('scripts/mootools-more-1.5.1.js')}"></script>
##<script type="text/javascript" src="${h.static('scripts/iipmooviewer-2.0.js')}"></script>
##<script type="text/javascript" src="${h.static('scripts/help.en.js')}"></script>
##<script type="text/javascript" src="${h.static('scripts/blending.js')}"></script>
<script type="text/javascript" src="${h.static('scripts/djatoka.js')}"></script>
<script type="text/javascript">
    var iip = new IIPMooViewer('targetframe', {
        server: 'http://${request.host}/webapps/adore-djatoka/resolver',
        image: 'MouseBrain/413800',
        nSections: 256,
        bitDepth: Math.pow(2,16)-1,
        sectionId: 413800,
        ##scale: Math.round(1000/0.49),
        scale: 20,
        isAuxiliary: 0,
        protocol: 'djatoka',
        prefix: '/static/images/',
    });
</script>
</%block>
<div id="targetframe" style="width:1024px; height: 1024px; position: relative;"></div>
