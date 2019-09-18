import * as d3 from 'd3';
import moment from 'moment';
export function toTitleCase(str) {
    //return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    return str.charAt(0).toUpperCase() + str.substr(1);
}
export function scientificNotion(value) {
    if (value < 0) {
        value = -value;
        negative = true;
    }
    let exp = Math.floor(Math.log10(value));
    let base = value;
    base = base * Math.pow(10, -exp);
    let v = '';
    v += base.toFixed(2);
    if (exp != 0) {
        v += '&#215;10<sup>' + (exp) + '</sup>';
    }
    return v;
}
export function expandTracerID(t) {
    switch (t) {
        case 'DY':
            return 'Diamidino yellow';
            break;
        case 'FB':
            return 'Fast blue';
            break;
        case 'FR':
            return 'Fluoro ruby';
            break;
        case 'FE':
            return 'Fluoro emerald';
            break;
        case 'CTBgr':
            return 'CTB Green';
            break;
        case 'CTBr':
            return 'CTB Red';
            break;
        case 'CTBg':
            return 'CTB Gold';
            break;
        default:
            return t; 
            break;
    }
}
export function humanReadableDate(m) {
    if (m === null) {
        return 'Not provided';
    } else {
        let d = moment(m);
        if (d.isValid()) {
            return d.format('DD/MMM/YYYY');
        }  else {
            return 'Not provided';
        }
    }
}
export function humanReadableDiffInMonth(a, b) {
    if (!a || !b) {
        return null;
    }
    a = moment(a);
    b = moment(b);
    if (!a.isValid() || !b.isValid()) {
        return null;
    }
    let years = Math.floor(a.diff(b, 'years', true));
    let months = Math.floor(a.diff(b, 'months', true));
    if (years == 0) {
        years = '';
    } else if (years == 1) {
        years = '' + years + ' year';
    } else {
        years = '' + years + ' years';
    }
    months = months % 12;
    if (months == 0) {
        months = '';
    } else if (months == 1) {
        months = '' + months + ' month';
    } else {
        months = '' + months + ' months';
    }
    if (years == 0) {
        return months;
    } else {
        return years + ' ' + months;
    }
}

export function parseAP(v) {
    let dist;
    if (v == 0) {
        return 'At interaural line';
    } else if (v > 0) {
        dist = parseFloat(v).toFixed(1);
        return '' + dist + ' mm rostral to interaural line';
    } else {
        dist = parseFloat(-v).toFixed(1);
        return '' + dist + ' mm caudal to interaural line';
    }
}
export function parseML(v) {
    let dist;
    if (v == 0) {
        return 'At the midline';
    } else if (v > 0) {
        dist = parseFloat(v).toFixed(1);
        return '' + dist + ' mm lateral to the midline';
    } else {
        dist = parseFloat(-v).toFixed(1);
        return '' + dist + ' mm lateral to the midline';
    }
}
export function parseDV(v) {
    let dist;
    if (v == 0) {
        return 'At interaural line';
    } else if (v > 0) {
        dist = parseFloat(v).toFixed(1);
        return '' + dist + ' mm dorsal to the interaural line';
    } else {
        dist = parseFloat(-v).toFixed(1);
        return '' + dist + ' mm ventral to the interaural line';
    }
}
export function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}
export function getTargetAreaSummaryHTML(target_area, source_area, matrix, flne_per_injection) {
        let txt = 'Target: ' + target_area.fullname + '<br/>';
        txt += 'Source: ' + source_area.fullname + '<br/>';
        let value = matrix.data[target_area.id][source_area.id].value;
        if (value !== undefined) {
            let colorFunc = getLogColorFunc();
            let barWidthFunc = getBarWidthFunc(-5, 0, 180);
            let negative = false;
            let log10 = Math.log10(value).toFixed(2);
            let s = scientificNotion(value);
            txt += 'Connection strength: <br/>';
            txt += '<span style="padding-left: 30px;">FLNe: ' + s + '</span><br/>';
            txt += '<span style="padding-left: 30px;">' + 'log<sub>10</sub>(FLNe) ' + log10 + '</span><br/>';
            txt += '<div style="margin-top: 8px;">Based on ' + target_area.injections.length + ' injection' + (target_area.injections.length > 1 ? 's' : '') + ', log<sub>10</sub>(FLNe):</div>';
            txt += '<table class="injection-strength"><tbody>';
            let injection_strength = [];
            let _injections = _.sortBy(target_area.injections, i => {
                let injection_id = i.case_id + '-' + i.tracer_id;
                let flne = _.find(flne_per_injection[injection_id], {source: source_area.abbrev});
                if (flne) {
                    return -flne.flne;
                } else {
                    return Infinity;
                }
            });
            _.each(_injections, _inj => {
                let injection_id = _inj.case_id + '-' + _inj.tracer_id;
                let injection_name = (_inj.display_name ? _inj.display_name : _inj.case_id) + '-' + _inj.tracer_id;
                let flne = _.find(flne_per_injection[injection_id], {source: source_area.abbrev});
                let strength;
                if (flne) {
                    //strength = scientificNotion(flne.flne) + ' / ' + flne.log10_flne.toFixed(2);
                    strength = '<div class="summary-flne"><div class="summary-flne-bar" style="width: ' + barWidthFunc(flne.log10_flne) + 'px; background-color: ' + colorFunc(flne.log10_flne) + '"></div>' +
                        '<div class="summary-flne-value">' + flne.log10_flne.toFixed(2) + '</div></div>';
                } else {
                    strength = '<div class="summary-flne"><div class="summary-flne-value nan">not found</div></div>';
                }
                injection_strength.push('<tr><td>' + injection_name + '</td><td>' + strength + '</td></tr>');
            });

            txt += injection_strength.join('');
        } else {
            if (target_area.id === source_area.id) {
                txt += 'Intrinsic connections not shown<br/>';
            } else {
                txt += 'Connection not detected<br/>';
            }
        }
        txt += '</tbody></table>';
        return txt;
}
export function getColorOfTracer(t) {
    switch (t) {
        case 'FR':
        case 'CTBr':
            return 'red';
            break;
        case 'FB':
            return 'blue';
            break;
        case 'CTBgr':
        case 'FE':
            return 'green';
            break;
        case 'DY':
        case 'CTBg':
            return 'yellow';
            break;
    }
}

let case_id_re = /([a-zA-Z]+)(\d+)([a-zA-Z]?)/;
export function sortInjection(a, b) {
    let a_case_id = a.case_id.match(case_id_re);
    let b_case_id = b.case_id.match(case_id_re);
    const a_r_center_ap = a.region_center_ap;
    const b_r_center_ap = b.region_center_ap;
    if (a_r_center_ap < b_r_center_ap) {
        return -1;
    } else if (a_r_center_ap > b_r_center_ap) {
        return 1;
    } else {
        const a_case_no = parseInt(a_case_id[2], 10);
        const b_case_no = parseInt(b_case_id[2], 10);

        if (a_case_no < b_case_no) {
            return 1;
        } else if (a_case_no > b_case_no) {
            return -1;
        } else {
            if (a.tracer < b.tracer) {
                return -1;
            } else if (a.tracer > b.tracer) {
                return 1;
            } else {
                return 0;
            }

        }
    }
}

export function getColorFunc() {
    let min = 0, max = 1, w = 1;
    let colorFunction = d3.scaleLinear().domain([min, min + 0.005 * w, min + 0.13 * w, min + 0.28 * w, min + 0.32 * w, min + 0.74 * w, min + 0.92 * w, max])
        .range(['rgb(230, 230, 230)', 'rgb(244, 247, 140)', 'rgb(226, 139, 33)', 'rgb(215, 82, 35)', 'rgb(212, 67, 36)', 'rgb(124, 83, 89)', 'rgb(81, 51, 49)', 'rgb(81, 51, 49)']);
    return colorFunction;
}

export function getLogColorFunc() {
    let min = 0, max = 1, w = 1;
    let colorFunction = d3.scaleLinear().domain([min, min + 0.005 * w, min + 0.13 * w, min + 0.28 * w, min + 0.32 * w, min + 0.74 * w, min + 0.92 * w, max])
        .range(['rgb(230, 230, 230)', 'rgb(244, 247, 140)', 'rgb(226, 139, 33)', 'rgb(215, 82, 35)', 'rgb(212, 67, 36)', 'rgb(124, 83, 89)', 'rgb(81, 51, 49)', 'rgb(81, 51, 49)']);
    function _colorFunction(v) {
        return colorFunction(Math.pow(10, v));
    }
    return _colorFunction;
}

export function getColorGradient() {
    let grad = [
        {offset: 0, color: 'rgb(230, 230, 230)'},
        {offset: 0.005, color: 'rgb(244, 247, 140)'},
        {offset: 0.13, color: 'rgb(226, 139, 33)'},
        {offset: 0.28, color: 'rgb(215, 82, 35)'},
        {offset: 0.32, color: 'rgb(212, 67, 36)'},
        {offset: 0.74, color: 'rgb(124, 83, 89)'},
        {offset: 0.92, color: 'rgb(81, 51, 49)'},
        {offset: 1, color: 'rgb(81, 51, 49)'}
    ];
    return _.map(grad, v => {
        return {
            offset: (Math.log10(v.offset) + 6) / 6,
            color: v.color
        };
    });
}
export function getBarWidthFunc(min, max, width) {
    let func = d3.scaleLinear().domain([min, max]).range([0, width]);
    return func;
}

