<!doctype html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="http://openlayers.org/en/v3.5.0/css/ol.css" type="text/css">
    <script type='text/javascript' src="${h.static('scripts/jquery-1.11.2.min.js')}"></script>
    <style>
        .map {
            height: 800px;
            width: 100%;
        }
    </style>
    ##<script src="http://openlayers.org/en/v3.5.0/build/ol.js" type="text/javascript"></script>
    <script type='text/javascript' src="${h.static('scripts/ol-custom.js')}"></script>
    <title>OpenLayers 3 example</title>
</head>
<body>
    <h2>My Map</h2>
    <div id="map" class="map"></div>
    <div id="data"></div>
    <script type="text/javascript">
        $(function() {
            var url = 'http://${requst.host}/webapps/adore-djatoka/resolver';
            var source = new ol.source.Djatoka({
                url: url,
                image: 'MouseBrain/747167',
            });
            var layers = [
                new ol.layer.Tile({
                    source: source,
                })
            ];
            source.getImageMetadata(function() {
                var meta = source.imgMeta;
                var imgWidth = meta.width;
                var imgHeight = meta.height;
                var proj = new ol.proj.Projection({
                    code: 'ZOOMIFY',
                    units: 'pixels',
                    extent: [0, 0, imgWidth, imgHeight]
                });
                var imgCenter = [imgWidth / 2, - imgHeight / 2];
                layers[0].setVisible(true);
                var map = new ol.Map({
                    target: 'map',
                    layers: layers,
                    view: new ol.View({
                        zoom: 2,
                        projection: proj,
                        center: imgCenter,
                    }),
                    /*controls: ol.control.defaults({
                    }).extend([
                    //new ol.control.OverviewMap()
                    ]),
                    */
                });
            });
            //layers[1].setVisible(false);
        });
    </script>
</body>
</html>
