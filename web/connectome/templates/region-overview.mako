<%inherit file='page.mako'/>
<%block name='scripts'>
<script type="text/javascript" src="${h.static('scripts/d3.v3.min.js')}" charset="utf-8"></script>
<script type="text/javascript">
    region_hierarchy = ${region_hierarchy | n}
</script>
<script type="text/javascript" src="${h.static('scripts/tree.js')}"></script>
</%block>
<%block name='styles'>
<style>
    .node {
        cursor: pointer;
    }
    .node circle {
        fill: #fff;
        stroke: steelblue;
        stroke-width: 2px;
    }
    .node text {
        font: 11px sans-serif;
    }
    .link {
        fill: none;
        stroke: #ccc;
        stroke-width: 2px;
    }
</style>
</%block>
<div id="d3-canvas" class="theme-page-wrapper mk-main-wrapper full-layout mk-grid vc_row-fluid">
</div><!-- /.mk-page-section -->
