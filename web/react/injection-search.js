/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}



/* accepts parameters
 * r  Object = {r:x, g:y, b:z}
 * OR 
 * r, g, b
*/
function RGBtoHSV(r, g, b) {
    if (arguments.length === 1) {
        g = r.g, b = r.b, r = r.r;
    }
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return {h: h, s: s, v: v};
}


function HSVtoHSL(h, s, v) {
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    var _h = h, _s = s * v, _l = (2 - s) * v;
    _s /= (_l <= 1) ? _l : 2 - _l;
    _l /= 2;

    return {h: _h, s: _s, l: _l};
}

function HSLtoHSV(h, s, l) {
    if (arguments.length === 1) {
        s = h.s, l = h.l, h = h.h;
    }
    var _h = h, _s, v;

    l *= 2;
    s *= (l <= 1) ? l : 2 - l;
    _v = (l + s) / 2;
    _s = (2 * s) / (l + s);

    return {h: _h, s: _s, v: _v};
}



$(function() {
    var app = window.app || {};
    app.hold_counter = 0;
    app.Sx = 0.06;
    app.Sy = 0.06;
    app.flat_center = {x: 22, y: 18.4};
    app.flatmap_width = 700;
    (function() {
        app.holding_img = new Image();
        app.holding_img.src = '/static/images/holding.gif';
    })();
    
    function findPos(obj) {
        var curleft = 0, curtop = 0;
        if (obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            return { x: curleft, y: curtop };
        }
        return undefined;
    }
    var canvas = document.getElementById('flat-canvas');
    var canvasWidth  = canvas.width;
    var canvasHeight = canvas.height;
    var ctx = canvas.getContext('2d');

    var color_palette = {};
    for (var r_key in app.regions) {
        var region = app.regions[r_key];
        var cc = region.color_code;
        var rgb = {
            r: parseInt(cc.slice(1, 3), 16),
            g: parseInt(cc.slice(3, 5), 16),
            b: parseInt(cc.slice(5, 7), 16)
        };
        var hsv = RGBtoHSV(rgb);
        var hsl = HSVtoHSL(hsv);
        hsv = HSLtoHSV(hsl);
        rgb = HSVtoRGB(hsv);
        color_palette[r_key] = rgb;
    }
 


    var _dot_size = 4;
    app.tip_injection = function(inj) {
        var tip = '<span>Injection: ' + inj.title + '</span> in ';
        tip += app.base_tip_text;
        //tip += '<div>A: ' + inj.a + ' L: ' + inj.l + ' P: ' + inj.h + '</div>';
        $('#tip').html(tip);
    };
    app.build_injection_table = function(caption, start, limit) {
        start = start !== undefined ? start : 0;
        limit = limit !== undefined ? limit : 15;

        var injection_count = 0;
        var text = '<table class="table table-bordered injection-table-view">';
        text += '<caption>' + caption + '</caption>';
        text += '<tr><th>Tracer</th><th>Region</th><th>L</th><th>A</th><th>H</th><th>Brain</th></tr>';
        _.each(app.injections, function(_inj) {
            if ((!app.region_picked) || _inj.region_id == app.region_picked.id) {
                if (app.injection_picked && app.injection_picked.id == _inj.id) {
                    return;
                }
                if (injection_count >= start && injection_count < start + limit) {
                    var _region;
                    if (app.region_picked) {
                        _region = app.region_picked;
                    } else {
                        _region = _.find(app.regions, {id: _inj.region_id});
                    }
                    var bg_color = 'rgba(' + _region.color.r + ', ' + _region.color.g + ', ' + _region.color.b + ', 0.9)';
                    text += '<tr data-id="' + _inj.id + '" style=""><td>' + _inj.tracer + '</td><td style="background-color: ' + bg_color +';">' + _region.code + '</td><td>' + _inj.l.toFixed(1) + '</td><td>' + _inj.a.toFixed(1) + '</td><td>' + _inj.h.toFixed(1) + '</td><td>' + _inj.case_id + '</td></tr>';
                }
                injection_count++;
            }
        });
        text += '</table>';
        text += '<div class="pager">';
        if (start != 0) {
            text += '&nbsp;<a href="javascript:app.injection_page(0, ' + limit + ')">&lt;&lt;</a>&nbsp;';
        } else {
            text += '&nbsp;&lt;&lt;&nbsp;';
        }
        if (start != 0) {
            text += '&nbsp;<a href="javascript:app.injection_page(' + (start - limit)  + ', ' + limit + ')">&lt;</a>&nbsp;';
        } else {
            text += '&nbsp;&lt;&nbsp;';
        }
        text += '&nbsp;' + (start + 1) + '-' + Math.min(start + limit, injection_count) + ' of ' + injection_count + ' injections&nbsp;'
        if (start + limit < injection_count) {
            text += '&nbsp;<a href="javascript:app.injection_page(' + (start + limit) + ', ' + limit + ')">&gt;</a>&nbsp;';
        } else {
            text += '&nbsp;&gt;&nbsp;';
        }
        if (start + limit < injection_count) {
            var last_start = Math.floor((injection_count - 1) / limit) * limit;
            text += '&nbsp;<a href="javascript:app.injection_page(' + (last_start) + ', ' + limit + ')">&gt;&gt;</a>&nbsp;';
        } else {
            text += '&nbsp;&gt;&gt;&nbsp;';
        }
        text += '</div>';
        if (injection_count) {
            return text;
        } else {
            return 'There is no ' + (app.injection_picked ? 'other ' : '') + 'injection in area <i>' + app.region_picked.name + '</i>';
        }
    }
    app.show_injection_info = function(inj, e) {
        if (inj) {
            app.injection_picked = inj;
            var inj_info = $('#injection-selected-info');
            var inj_info_text = '<ul><li>Tracer: ' + inj.tracer + '</li><li>Brain:' + inj.case_id + '</li>';
            inj_info_text += '<li>Section: ' + inj.section + '</li>';
            inj_info_text += '<li>Region: ' + inj.region + '</li>';
            inj_info_text += '<li>A: ' + inj.a.toFixed(1) + ' L: ' + inj.l.toFixed(1) + ' H: ' + inj.h.toFixed(1) + '</li>';
            inj_info_text += '<li><a href="' + inj.action + '">View injection in section viewer (Click and hold)</a></li>';
            inj_info_text += '</ul>';
            inj_info.html(inj_info_text);

            app.other_injection_page(inj);

            $('#injection-selected-block').show();
        } else {
            app.injection_picked = null;
            if (!app.region_picked) {
                var BB = canvas.getBoundingClientRect();
                var x = parseInt(e.clientX - BB.left, 10);
                var y = parseInt(e.clientY - BB.top, 10);
                app.pick_region(x, y);
            }

            app.injection_page();
            $('#injection-selected-block').hide();
        }
    }

    app.other_injection_page = function(inj, start, limit) {
        var other_inj_text = app.build_injection_table('Other injections in <i>' + inj.region_name + '</i>');
        var other_inj_caption = $('#other-injection-caption');
        other_inj_caption.html(other_inj_text);
        window.sessionStorage['injection_table_last'] = JSON.stringify({start: start, limit: limit, region: app.region_picked, injection: app.injection_picked});
    }
    app.injection_page = function(start, limit) {
        //var last_region = window.sessionStorage['last_injection_table_region'];

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
    }
    app.highlight_injection = function(inj) {
        ctx.save();
        ctx.beginPath();
        var f_x = (inj.flatmap_x + app.flat_center.x) / app.Sx;
        var f_y = (inj.flatmap_y + app.flat_center.y) / app.Sy;

        var gradient = ctx.createRadialGradient(f_x, f_y, _dot_size + 2, f_x, f_y, _dot_size + 5);
        var shade = '#ffffff';
        switch (inj.tracer) {
            case 'DY':
                gradient.addColorStop(1, shade);
                gradient.addColorStop(0, '#ffff00');
                break;
            case 'FR':
            case 'CTBr':
                gradient.addColorStop(1, shade);
                gradient.addColorStop(0, '#ff0000');
                break;
            case 'FB':
                gradient.addColorStop(1, shade);
                gradient.addColorStop(0, '#0000ff');
                break;
            case 'FE':
            case 'CTBgr':
                gradient.addColorStop(1, shade);
                gradient.addColorStop(0, '#00ff00');
                break;

        }
        ctx.fillStyle = gradient;


        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.arc(f_x, f_y, _dot_size + 4, 0, 2*Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
        
    };
    app.draw_injection = function(inj) {
        ctx.beginPath();
        var f_x = (inj.flatmap_x + app.flat_center.x) / app.Sx;
        var f_y = (inj.flatmap_y + app.flat_center.y) / app.Sy;

        var gradient = ctx.createRadialGradient(f_x, f_y, _dot_size, f_x, f_y, _dot_size + 2);
        switch (inj.tracer) {
            case 'DY':
                gradient.addColorStop(1, '#000000');
                gradient.addColorStop(0, '#ffff00');
                break;
            case 'FR':
            case 'CTBr':
                gradient.addColorStop(1, '#000000');
                gradient.addColorStop(0, '#ff0000');
                break;
            case 'FB':
                gradient.addColorStop(1, '#000000');
                gradient.addColorStop(0, '#0000ff');
                break;
            case 'FE':
            case 'CTBgr':
                gradient.addColorStop(1, '#000000');
                gradient.addColorStop(0, '#00ff00');
                break;

        }
        ctx.fillStyle = gradient;


        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.arc(f_x, f_y, _dot_size + 2, 0, 2*Math.PI);
        ctx.stroke();
        ctx.fill();
    };
    var canvas = document.getElementById('flat-canvas');
    var canvasWidth  = canvas.width;
    var canvasHeight = canvas.height;
    var ctx = canvas.getContext('2d');
    var pix_color;

    var last_color = null;
    var img_data;
    var img = document.createElement('img');
    var arr;

    app.prep_flatimage = function() {
        if (app.flatmap_cache) {
            ctx.putImageData(app.flatmap_cache, 0, 0); 
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            ctx.save();
            _.each(app.injections, function(inj) {
                app.draw_injection(inj);
            });
            ctx.restore();
            app.restore_img_data();
            //console.log('buf8 len', buf8.length, '32 len', pix_color.length);
            var dst = ctx.createImageData(img_data.width, img_data.height);
            dst.data.set(img_data.data);
            app.flatmap_cache = dst;
        }
    }
    app.restore_img_data = function() {
        img_data = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        //buf = new ArrayBuffer(imageData.data.length);
        //var buf8 = new Uint8ClampedArray(buf);
        pix_color = new Uint32Array(img_data.data.buffer);
    }
    var last_region;
    var restore_user_selection = function() {
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
            var injection_table_last = {start: undefined, limit: undefined};
            app.injection_page(injection_table_last.start, injection_table_last.limit);
        }
    }    
    img.onload = function() {
        console.log('image loaded');
        var req = new window.XMLHttpRequest();
        req.overrideMimeType('text/plain; charset=x-user-defined');
        req.addEventListener('load', function(oEvent) {
            var arrayBuffer = req.response; // Note: not oReq.responseText
            //console.log('status', oEvent.status);
            if (arrayBuffer) {
                arr = new Uint8Array(arrayBuffer);
                var done = false;
                var ptr = 0;
                var stage = 'init';
                var width;
                var height;
                var width_ascii = '';
                var height_ascii = '';
                while (!done) {
                    var chr = String.fromCharCode(arr[ptr]);
                    switch (stage) {
                        case 'init':
                            if (chr != 'P') {
                                console.log('Error, not starting with P', 'starting with', chr.charCodeAt(0));
                            }
                            stage = 'version';
                            break;
                        case 'version':
                            if (chr == '\n') {
                                stage = 'dimension_width';
                            } else {
                                console.log('PNM version', chr);
                            }
                            break;
                        case 'dimension_width':
                            if (chr == ' ') {
                                width = parseInt(width_ascii, 10);
                                stage = 'dimension_height';
                            } else {
                                width_ascii += chr;
                            }
                            break;
                        case 'dimension_height':
                            if (chr == '\n') {
                                height = parseInt(height, 10);
                                stage = 'depth';
                            } else {

                            }
                            break;
                        case 'depth':
                            if (chr == '\n') {
                                done = true;
                            }
                            break;
                        default:
                            console.log('error, unexpected stage');
                            done = true;
                            break;
                    }
                    ptr++;
                }
                arr = new Uint8Array(arrayBuffer, ptr); 
                //done(byteArray);
                //console.log('yes array buffer!!');
                app.prep_flatimage();
                app.flat_ready = true;
                app.region_dim = [width, height];
                restore_user_selection();
            }
        });
        req.open('GET', '/static/images/region.ppm.gz');
        req.responseType = 'arraybuffer';
        req.send();
        /*
        var img_raw = document.createElement('img');
        img_raw.onload = function() {
            //ctx.drawImage(img, 0, 0);

        };
        img_raw.src = '/static/images/flat_raw.png';
        */
    };
    img.src = '/static/images/flat.png';

    app.pick_region = function(x, y) {
        var idx = y * app.flatmap_width + x;
        var region_picked = app.regions[arr[idx]];
        app.region_picked = region_picked;

        if (region_picked) {
            var cc = region_picked.color_code;
            var p = [
                parseInt(cc.slice(1, 3), 16),
                parseInt(cc.slice(3, 5), 16),
                parseInt(cc.slice(5, 7), 16),
                255
            ];

            //var hex = app.color_code(p);
            var color_binary = app.get_color_binary(p);
            if (color_binary == 0xff000000 || last_color != color_binary) {
                app.prep_flatimage();
                app.restore_img_data();
                if (last_color != color_binary) {
                    app.highlight_region(region_picked);
                }    
                last_color = color_binary;
            }
        }
    }
    app.restore_map = function(e) {
    };
    app.get_color_binary = function(p) {
        var color_binary = ((p[0] * 1) + (p[1] * (1 << 8)) + (p[2] * (1 << 16)) + (p[3] * (1 << 24)));
        return color_binary;
    };
    app.highlight_region = function(r) {
        var cc = r.color_code;
        var p = [
            parseInt(cc.slice(1, 3), 16),
            parseInt(cc.slice(3, 5), 16),
            parseInt(cc.slice(5, 7), 16),
            255
        ];

        //var hex = app.color_code(p);
        var color_binary = app.get_color_binary(p);

        var ii = pix_color.length;
        for (var i=0; i<ii; i++) {
            if (pix_color[i] == color_binary) {
                //pix_color[i] = 0xffffffff;
                //var hsv = RGBtoHSV(binary_color & 0x000000ff, (binary_color & 0x0000ff00) >> 8, (binary_color & 0x00ff0000) >> 16);
                //var hsl = HSVtoHSL(hsv);
                //hsl.s = Math.min(hsl.s * 1.2, 1);
                //hsl.s = 1;
                //hsl.l = 0.86;
                //hsl.h += 0.5;
                //hsv = HSLtoHSV(hsl);
                //var new_v = (1 - hsv.v) * 0.9;
                //hsv.v += new_v;
                //var rgb = HSVtoRGB(hsv);
                //var p = [rgb.r, rgb.g, rgb.b, 255];
                //var new_color = ((p[0] * 1) + (p[1] * (1 << 8)) + (p[2] * (1 << 16)) + (p[3] * (1 << 24)));
                var new_color = 0xffffffff;
                pix_color[i] = new_color;
            } else {
                continue;
                if (pix_color[i] == 0xff000000) continue;
                var hsv = RGBtoHSV(pix_color[i] & 0x000000ff, (pix_color[i] & 0x0000ff00) >> 8, (pix_color[i] & 0x00ff0000) >> 16);
                var hsl = HSVtoHSL(hsv);
                hsv = HSLtoHSV(hsl);
                hsv.v = 0.95;
                hsv.s = 0.3;
                rgb = HSVtoRGB(hsv);
                var p = [rgb.r, rgb.g, rgb.b, 255];
                pix_color[i] = ((p[0] * 1) + (p[1] * (1 << 8)) + (p[2] * (1 << 16)) + (p[3] * (1 << 24)));

            }

        }
        ctx.putImageData(img_data, 0, 0); 
    };
    var canvas_mouse_move = function(e) {
        if (!app.flat_ready) {
            return true;
        }
        var BB = canvas.getBoundingClientRect();
        var x = parseInt(e.clientX - BB.left, 10);
        var y = parseInt(e.clientY - BB.top, 10);

        var nearest;
        var nearest_distance = Infinity;
        var region_picked;
        _.each(app.injections, function(inj) {
            var f_x = (inj.flatmap_x + app.flat_center.x) / app.Sx;
            var f_y = (inj.flatmap_y + app.flat_center.y) / app.Sy;
            var dist = Math.pow(f_x - x, 2) + Math.pow(f_y - y, 2);
            if (dist < nearest_distance) {
                nearest = inj;
                nearest_distance = dist;
            }
        });
        if (nearest && nearest_distance < 160) {
            app.nearest_injection = nearest;
            app.nearest_injection_distance = nearest_distance;
            region_picked = _.find(app.regions, {id: nearest.region_id});
        } else {
            app.nearest_injection = null;
            app.nearest_injection_distance = Infinity;

            app.pick_region(x, y);
            region_picked = app.region_picked;
        }
        if (region_picked) {
            canvas.style.cursor = 'pointer';
            var tipCanvas = document.getElementById('tip');
            tipCanvas.style.left = (x) + "px";
            tipCanvas.style.top = (y - 40) + "px";
            if (region_picked != last_region) {

                app.prep_flatimage();
                app.restore_img_data();

                var data = _.filter(app.injections, function(i) {
                    if (i.region_id == region_picked.id) {
                        return true;
                    }
                });
                app.injection_filtered = data;


                last_region = region_picked;
            }

            app.highlight_region(region_picked);
            var tip = '<span class="region-name">' + region_picked.name + '</span>';
            var coord_text = 'Coord:' + ((app.Sx * (x)) - app.flat_center.x).toFixed(2) + ', ' + ((app.Sy * (y)) - app.flat_center.y).toFixed(2);
            //tip += '<span class="coord">' + coord_text + '</span>';
            console.log(coord_text);
            app.base_tip_text = tip;
            tip += '<span class="injection">Injections: ' + (app.injection_filtered.length) + '</span>';
            $(tipCanvas).html(tip);
        } else {
            app.prep_flatimage();
            last_color = 0xff000000;
            var tipCanvas = document.getElementById('tip');
            tipCanvas.style.left = "-65536px";
            canvas.style.cursor = null;
        }
        if (app.nearest_injection) {
            app.highlight_injection(app.nearest_injection);
            app.tip_injection(app.nearest_injection);
        }
    }
    $('#flat-canvas').mousemove(
        canvas_mouse_move
    )
    .mouseleave(function(e) {
        app.prep_flatimage();
        last_color = 0xff000000;
        var tipCanvas = document.getElementById('tip');
        tipCanvas.style.left = "-65536px";
        canvas.style.cursor = null;
    })
    .click(function(e) {
        if (!app.flat_ready) {
            return true;
        }
        var BB = canvas.getBoundingClientRect();
        var x = parseInt(e.clientX - BB.left, 10);
        var y = parseInt(e.clientY - BB.top, 10);
        //var c = this.getContext('2d');
        //var p = c.getImageData(x, y, 1, 1).data; 
        var idx = y * app.flatmap_width + x;
        var region_picked = app.regions[arr[idx]];
        if (region_picked) {
            var data = _.filter(app.injections, function(i) {
                if (i.region_id == region_picked.id) {
                    return true;
                }
            });
            app.dataView.setItems(data);
        }
        if (app.nearest_injection && app.nearest_injection_distance < 250) {
            app.show_injection_info(app.nearest_injection, e);
        } else {
            app.show_injection_info(null, e);
        }

    })
    .mousedown(function(e) {
        var BB = canvas.getBoundingClientRect();
        var x = parseInt(e.clientX - BB.left, 10);
        var y = parseInt(e.clientY - BB.top, 10);
        if (e.button == 0 && app.nearest_injection) {
            if (!app.hold_handle) {
                app.hold_handle = window.setTimeout(app.hold_timeout, 50);
                app.holding_pos = {x: x, y: y};
            }
        }
    })
    ;

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
        .on('mouseenter', '.injection-table-view tr', function(e) {
            if (!app.flat_ready) return;
            var inj_id = $(this).data('id');
            if (inj_id) {
                var inj = _.find(app.injections, function(v) { return v.id == inj_id; });
                app.prep_flatimage();
                app.restore_img_data();
                var _region = _.find(app.regions, {id: inj.region_id});
                app.highlight_region(_region);
                app.highlight_injection(inj);
            }
        })
        .on('click', '.injection-table-view tr', function(e) {
            var inj_id = $(this).data('id');
            if (inj_id) {
                var inj = _.find(app.injections, function(v) { return v.id == inj_id; });
                window.location.href = inj.action;
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
