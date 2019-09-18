<%inherit file='page.mako'/>
<%block name='scripts'>
<script type="text/javascript" src="${h.static('scripts/d3.v3.min.js')}" charset="utf-8"></script>
<script type="text/javascript" src="${h.static('scripts/jstree.min.js')}"></script>
<script type="text/javascript">
##    region_hierarchy = ${region_hierarchy | n}
    $(function() {
        $('#ontology_tree').jstree();
    });
</script>
</%block>
<%block name='styles'>
<link rel='stylesheet' href="${h.static('css/jstree.css')}" type='text/css' media='all' />
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
<%def name="ontology_menu(node)">
    <li class="jstree-open" data-id="${node['id']}">
        <b style="background-color: ${node['color_code']}">${node['code']}</b> ${node['name']}
        %if len(node['children']) > 0:
            <ul>
                %for n in node['children']:
                    ${ontology_menu(n)}
                %endfor
            </ul>
        %endif
    </li>
</%def>
<div id="d3-canvas" class="theme-page-wrapper mk-main-wrapper full-layout mk-grid vc_row-fluid">
    <div class="search-pane">
        <div class="search-type">
            <div class="row">
                <input type="radio"> Source Search
            </div>
        </div>
        <div class="search-condition">
            <div class="row">
                <label>Region</label>
                <input type="text" name="region">
            </div>
        </div>
    </div>
</div><!-- /.mk-page-section -->
<div id="ontology_tree" class="ontology">
    <ul class="jstree-no-icons">
        %for branch in region_tree:
            ${ontology_menu(branch)}
        %endfor
    </ul>
</div>
