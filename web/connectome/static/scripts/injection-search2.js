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

    return {
        h: h,
        s: s,
        v: v
    };
}


function HSVtoHSL(h, s, v) {
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    var _h = h,
        _s = s * v,
        _l = (2 - s) * v;
    _s /= (_l <= 1) ? _l : 2 - _l;
    _l /= 2;

    return {
        h: _h,
        s: _s,
        l: _l
    };
}

function HSLtoHSV(h, s, l) {
    if (arguments.length === 1) {
        s = h.s, l = h.l, h = h.h;
    }
    var _h = h,
        _s,
        _v;

    l *= 2;
    s *= (l <= 1) ? l : 2 - l;
    _v = (l + s) / 2;
    _s = (2 * s) / (l + s);

    return {
        h: _h,
        s: _s,
        v: _v
    };
}



$(function() {
    var app = window.app || {};
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

    var _dot_size = 5;
    app.tip_injection = function(inj) {
        var tip = app.base_tip_text;
        tip += '<div>Injection: ' + inj.title + '</div>';
        tip += '<div>A: ' + inj.a + ' L: ' + inj.l + ' P: ' + inj.p + '</div>';
        $('#tip').html(tip);
    }

    app.highlight_injection = function(inj) {
        ctx.save();
        ctx.beginPath();
        var f_x = (inj.flatmap_x + 25) / 0.05;
        var f_y = (inj.flatmap_y + 25) / 0.05;

        var gradient = ctx.createRadialGradient(f_x, f_y, _dot_size + 2, f_x, f_y, _dot_size + 5);
        var shade = '#ffffff';
        switch (inj.tracer) {
            case 'DY':
                gradient.addColorStop(1, shade);
                gradient.addColorStop(0, '#ffff00');
                break;
            case 'FR':
                gradient.addColorStop(1, shade);
                gradient.addColorStop(0, '#ff0000');
                break;
            case 'FB':
                gradient.addColorStop(1, shade);
                gradient.addColorStop(0, '#0000ff');
                break;
            case 'FE':
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
        var f_x = (inj.flatmap_x + 25) / 0.05;
        var f_y = (inj.flatmap_y + 25) / 0.05;

        var gradient = ctx.createRadialGradient(f_x, f_y, _dot_size, f_x, f_y, _dot_size + 2);
        switch (inj.tracer) {
            case 'DY':
                gradient.addColorStop(1, '#000000');
                gradient.addColorStop(0, '#ffff00');
                break;
            case 'FR':
                gradient.addColorStop(1, '#000000');
                gradient.addColorStop(0, '#ff0000');
                break;
            case 'FB':
                gradient.addColorStop(1, '#000000');
                gradient.addColorStop(0, '#0000ff');
                break;
            case 'FE':
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
    var imageData;
    //var img = document.createElement('img');
    var arr;

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
    var prep_flatimage = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //ctx.drawImage(img, 0, 0);
        //
        ctx.save();
        _.each(app.injections, function(inj) {
            app.draw_injection(inj);
        });
        ctx.restore();
        imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        //buf = new ArrayBuffer(imageData.data.length);
        var buf = imageData.data.buffer;
        var buf8 = new Uint8ClampedArray(buf);
        pix_color = new Uint32Array(buf);
        //console.log('buf8 len', buf8.length, '32 len', pix_color.length);
    }
    //img.onload = function() {
    //};
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
                                console.log('Error, not starting with P');
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
                prep_flatimage();
                app.flat_ready = true;
                app.region_dim = [width, height];
            }
        });
        req.open('GET', '/static/images/region.ppm.gz');
        req.responseType = 'arraybuffer';
        req.send();
    //img.src = '/static/images/flat.png';

    var last_region;
    $('#flat-canvas').mousemove(function(e) {
        if (!app.flat_ready) {
            return true;
        }
        //var pos = findPos(this);
        //var x = e.pageX - pos.x;
        //var y = e.pageY - pos.y;
        var BB = canvas.getBoundingClientRect();
        var x = parseInt(e.clientX - BB.left, 10);
        var y = parseInt(e.clientY - BB.top, 10);
        var coord = "x=" + x + ", y=" + y;
        //var c = this.getContext('2d');
        //var p = c.getImageData(x, y, 1, 1).data; 
        var idx = y * 1000 + x;
        var region_picked = app.regions[arr[idx]];
        if (region_picked) {
            canvas.style.cursor = 'pointer';
            var cc = region_picked.color_code;
            var p = [
                parseInt(cc.slice(1, 3), 16),
                parseInt(cc.slice(3, 5), 16),
                parseInt(cc.slice(5, 7), 16),
                255
            ];

            //var hex = app.color_code(p);
            var binary_color = ((p[0] * 1) + (p[1] * (1 << 8)) + (p[2] * (1 << 16)) + (p[3] * (1 << 24)));
            if (binary_color == 0xff000000 || last_color != binary_color) {
                prep_flatimage();
                last_color = binary_color;
            }
            var ii = pix_color.length;
            for (var i=0; i<ii; i++) {
                if (pix_color[i] == binary_color) {
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
                }
            }
            ctx.putImageData(imageData, 0, 0); 
            var tipCanvas = document.getElementById('tip');
            tipCanvas.style.left = (x) + "px";
            tipCanvas.style.top = (y - 80) + "px";
            //tipCtx.textBaseline = 'top';
            if (region_picked != last_region) {
                /*
                   $.get(app.injection_async_url + "?region=" + region_picked.code, function(data) {
                   app.dataView.setItems(data);
                   tipCtx.clearRect(0, 0, tipCanvas.width, tipCanvas.height);
                // tipCtx.rect(0,0,tipCanvas.width,tipCanvas.height);
                tipCtx.fillText(region_picked.name, 5, 15);
                tipCtx.fillText('Injections: ' + data.length, 5, 25);
                });
                */
                var data = _.filter(app.injections, function(i) {
                    if (i.region_id == region_picked.id) {
                        return true;
                    }
                });
                //app.dataView.setItems(data);
                //tipCtx.clearRect(0, 0, tipCanvas.width, tipCanvas.height);
                // tipCtx.rect(0,0,tipCanvas.width,tipCanvas.height);
                //tipCtx.fillText(region_picked.name, 5, 15);
                //tipCtx.fillText('Injections: ' + data.length, 5, 25);
                app.injection_filtered = data;
                last_region = region_picked;
            }
            /*
            var tipCtx = tipCanvas.getContext('2d');
            tipCanvas.width = Math.max(200, tipCtx.measureText(region_picked.name).width + 15);
            tipCtx.clearRect(0, 0, tipCanvas.width, tipCanvas.height);
            tipCtx.fillText(region_picked.name, 5, 15);
            tipCtx.fillText('Injections: ' + app.injection_filtered.length, 5, 25);
            var coord_text = 'Coord:' + ((0.05 * (x + 0.5)) - 25).toFixed(2) + ', ' + ((0.05 * (y + 0.5)) - 25).toFixed(2);
            tipCtx.fillText(coord_text, 5, 35);
            */
            var tip = '<span class="region-name">' + region_picked.name + '</span>';
            app.base_tip_text = tip;
            tip += '<span class="injection">Injections: ' + (app.injection_filtered.length) + '</span>';
            $(tipCanvas).html(tip);
        } else {
            prep_flatimage();
            last_color = 0xff000000;
            var tipCanvas = document.getElementById('tip');
            tipCanvas.style.left = "-65536px";
            canvas.style.cursor = null;
        }


        var nearest;
        var nearest_distance = Infinity;
        _.each(app.injections, function(inj) {
            var f_x = (inj.flatmap_x + 25) / 0.05;
            var f_y = (inj.flatmap_y + 25) / 0.05;
            var dist = Math.pow(f_x - x, 2) + Math.pow(f_y - y, 2);
            if (dist < nearest_distance) {
                nearest = inj;
                nearest_distance = dist;
            }
        });
        if (nearest && nearest_distance < 500) {
            app.highlight_injection(nearest);
            app.tip_injection(nearest);
        }
    })
    .click(function(e) {
        if (!app.flat_ready) {
            return true;
        }
        var BB = canvas.getBoundingClientRect();
        var x = parseInt(e.clientX - BB.left, 10);
        var y = parseInt(e.clientY - BB.top, 10);
        var coord = "x=" + x + ", y=" + y;
        //var c = this.getContext('2d');
        //var p = c.getImageData(x, y, 1, 1).data; 
        var idx = y * 1000 + x;
        var region_picked = app.regions[arr[idx]];
        if (region_picked) {
            var data = _.filter(app.injections, function(i) {
                if (i.region_id == region_picked.id) {
                    return true;
                }
            });
            app.dataView.setItems(data);
        }
    });
});
