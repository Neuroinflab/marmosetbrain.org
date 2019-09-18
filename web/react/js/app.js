import React from 'react';
import {render} from 'react-dom';
//var React = require('react');
//var ReactDOM = require('react-dom');

//var MarmosetConnectomeApp = require('./components/MarmosetConnectomeApp.react');
import MarmosetConnectomeApp from './components/MarmosetConnectomeApp.react';
import './lib/Libs';

var HSLtoHSV = require('./lib/color').HSLtoHSV;
var HSVtoRGB = require('./lib/color').HSVtoRGB;


var app = window.app || {};
app.hold_counter = 0;
app.Sx = 0.06;
app.Sy = 0.06;
app.flat_center = {x: 22, y: 18.4};
app.flatmap_width = 700;
$(function() {
    (function() {
        app.holding_img = new Image();
        app.holding_img.src = '/static/images/holding.gif';
    })();
    app.injection_page = function(start, limit) {

        //var last_region = window.sessionStorage['last_injection_table_region'];
        /*
        var inj_text;
        if (app.region_picked) {
            inj_text = app.build_injection_table('Injections in area <i>' + app.region_picked.name + '</i>', start, limit);
            window.sessionStorage['injection_table_last'] = JSON.stringify({start: start, limit: limit, region: app.region_picked});
        } else {
            inj_text = app.build_injection_table('List of all injections', start, limit);
            var injection_table_last = {
                start: start,
                limit: limit,
                region: null
            }
            window.sessionStorage['injection_table_last'] = JSON.stringify(injection_table_last);
        }
        var other_inj_caption = $('#other-injection-caption');
        other_inj_caption.html(inj_text);
        //window.sessionStorage['last_injection_table_region'] = app.region_picked;
        //*/
    }
    var restore_user_selection = function() {
        /*
        try {
            var injection_table_last = JSON.parse(window.sessionStorage['injection_table_last']);
            var region = injection_table_last.region;
            console.log('injection got', injection_table_last.injection);

            if (region) {
                var inj_count = _.countBy(app.injections, {region_id: region.id});
                console.log('total injection in this region', inj_count);
                if (inj_count.true > 0) {
                    app.region_picked = region;
                    last_region = region;
                    app.highlight_region(region);
                } else {
                    app.region_picked = null;
                }
            } else {
                app.region_picked = null;
            }
            app.injection_picked = injection_table_last.injection;
            if (app.injection_picked) {
                app.nearest_injection = app.injection_picked;
                app.show_injection_info(app.injection_picked);
                app.highlight_injection(app.injection_picked);
            } else {
                app.injection_page(injection_table_last.start, injection_table_last.limit);
            }
        } catch(e) {
        */
            var injection_table_last = {start: undefined, limit: undefined};
            app.injection_page(injection_table_last.start, injection_table_last.limit);
        //}
    }

    $(document)
        .mouseup(function(e) {
            if (e.button == 0) {
                if (app.hold_handle) {
                    app.hold_cancel();
                    window.clearTimeout(app.hold_handle);
                    app.hold_handle = null;
                    $('#holding-cursor').hide();
                    $('#holding-cursor img').attr('src', '');
                }
            }
        })
        ;
    app.hold_timeout = function() {
        if (app.hold_handle) {
            if (app.hold_counter == 2) {
                // show the holding cursor
                $('#holding-cursor').css({left: app.holding_pos.x, top: app.holding_pos.y + 4}).show();
                window.setTimeout(function() {$('#holding-cursor img').attr('src', '/static/images/holding.gif');}, 0);
            }
            app.hold_counter++;
            if (app.hold_counter > 17) {
                $('#holding-cursor').hide();
                $('#holding-cursor img').attr('src', '');
                window.clearTimeout(app.hold_handle);
                window.location.href = app.nearest_injection.action;
                //window.open(app.nearest_injection.action);
                app.hold_handle = null;
            } else {
                window.setTimeout(app.hold_timeout, 50);
            }
        }
    }
    app.hold_cancel = function() {
        app.hold_counter = 0;
    }

});
render(
  <MarmosetConnectomeApp />,
  document.getElementById('react-main')
);
