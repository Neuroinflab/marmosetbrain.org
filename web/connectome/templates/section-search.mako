<%inherit file='page.mako'/>
<%block name='scripts'>
<script type="text/javascript" src="${h.static('scripts/jquery.event.drag-2.2.js')}"></script>
<script type="text/javascript" src="${h.static('scripts/jquery-ui.min.js')}"></script>
<script type="text/javascript" src="${h.static('scripts/slick.core.js')}"></script>
<script type="text/javascript" src="${h.static('scripts/slick.formatters.js')}"></script>
<script type="text/javascript" src="${h.static('scripts/slick.dataview.js')}"></script>
<script type="text/javascript" src="${h.static('scripts/slick.grid.js')}"></script>
<script type="text/javascript" src="${h.static('scripts/injection-search.js')}"></script>
</%block>
<%block name='styles'>
<link rel='stylesheet' href="${h.static('css/slick.grid.css')}" type='text/css' media='all' />
<link rel='stylesheet' href="${h.static('css/slick-default-theme.css')}" type='text/css' media='all' />
<link rel='stylesheet' href="${h.static('css/viewer.css')}" type='text/css' media='all' />
</%block>
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <label>Search</label>
            <label>Section</label>
            <input type="text" id="input-region" name="region">
        </div>
    </div><!-- /.row -->
    <div class="bottom-pane row">
        <div class="search-results row col-md-12">
            <div class="search-result col-md-12">
                <div id="result-grid" style="width:100%;min-height:600px;"></div>
            </div>
        </div><!-- /.row -->
        <%doc>
        <div class="injection-meta row col-md-6">
            <div class="injection-preview col-md-12">
            </div>
        </div><!-- /.row -->
        </%doc>
    </div>
</div><!-- /.container -->
<script>
    function viewLinkFormatter(row, cell, value, columnDef, dataContext) {
        return '<a href="' + value + '">View</a>';
    }
    var grid;
    var data = [];
    var columns = [
    {id: "action", name: "", field: "action", cssClass: "injection-action", formatter: viewLinkFormatter},
    {id: "case", name: "Brain #", field: "case_id"},
    {id: "title", name: "Section", field: "title", cssClass: "injection-title"},
    {id: "FE", name: "FE", field: "FE"},
    {id: "FR", name: "FR", field: "FR"},
    {id: "FB", name: "FB", field: "FB"},
    {id: "DY", name: "DY", field: "DY"},
    {id: "BDA", name: "BDA", field: "BDA"},
    {id: 'total', name: 'Total Cells', field: 'total'},
    //{id: "hemisphere", name: "Hemisphere", field: "hemisphere"},
    //{id: "tracer", name: "Tracer", field: "tracer"},
    //{id: "region", name: "Region", field: "region"},
    ];

    var options = {
        editable: false,
        enableAddRow: false,
        enableCellNavigation: true,
        forceFitColumns: true
    };

    $(function () {
        var dataView = new Slick.Data.DataView();
        // Make the grid respond to DataView change events.
        dataView.onRowCountChanged.subscribe(function (e, args) {
            grid.updateRowCount();
            grid.render();
        });

        dataView.onRowsChanged.subscribe(function (e, args) {
            grid.invalidateRows(args.rows);
            grid.render();
        });        
        var grid = new Slick.Grid('#result-grid', dataView, columns, options);
        $.get("${request.route_url('section.search_async')}", function(data) {
            dataView.setItems(data);
        });
        $('#input-region').change(function() {
            var region = $(this).val();
            $.get("${request.route_url('section.search_async')}" + "?region="+region, function(data) {
                dataView.setItems(data);
            }); 
        });
    })
</script>

