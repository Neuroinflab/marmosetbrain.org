import React from 'react';
import Actions from '../actions/Actions';
import AppStore from '../stores/AppStore';
import classNames from 'classnames';
import _ from 'lodash';

function getColorBinary(p) {
    let color_binary = ((p[0] * 1) + (p[1] * (1 << 8)) + (p[2] * (1 << 16)) + (p[3] * (1 << 24)));
    return color_binary;
}

function getHexColor(cc) {
    let p = [
        parseInt(cc.slice(1, 3), 16),
        parseInt(cc.slice(3, 5), 16),
        parseInt(cc.slice(5, 7), 16),
        255
    ];

    let color_binary = getColorBinary(p);
    return color_binary;
}
export default class FlatmapCanvas extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.canvas = {
            dom: null,
            last_color: undefined,
            last_region: undefined,
            img_dom: document.createElement('img'),
            // the typed array to hold all position to region data
            flatmap_region_index_array: undefined,
            flatmap_cache: undefined,
            // the array keep current flatmat image
            // highlighted region will be changed to white
            flatmap_array: undefined,
            // the backend for flatmap_array
            // the ImgData object is invoked to put content onto canvas
            // (after typed array is modified)
            flatmap_img_data: undefined,
            last_injection: null,
            tip: undefined,
            shiftTimeout: undefined,
            mouseLeaveTimeout: undefined
        };
        this.dot_size = 4;
        this.state = {
            tipVisible: false,
            tipLeft: -65535,
            tipTop: '0px',
            tipInjection: undefined,
            tipRegion: undefined,
            tipCoord: {x: 0, y: 0}
        }
        _.bindAll(this,
            'handleMouseMove', 'handleMouseDown', 'handleMouseLeave', 'handleMouseEnter', 'handleClick', 'handleImageLoad',
            'drawFlatmap', 'drawInjection',
            'createFlatmapDrawingBuffer', 'highlightRegion', 'highlightInjection',
            'pickRegion',
            'handleHighlightInjection', 'handleHighlightRegion', 'handleRemoveTip'
        );

    }

    /**
     * create drawing buffer from current canvas content
     * normally created after canvas is prepared is base flatmap
     * and all injections drawn
     */
    createFlatmapDrawingBuffer() {
        let canvas = this.canvas.dom;
        let ctx = canvas.getContext('2d');
        let img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        this.canvas.flatmap_img_data = img_data;
        let flatmap_arr = new Uint32Array(img_data.data.buffer);
        this.canvas.flatmap_array = flatmap_arr;
    }

    pickRegion(x, y) {
        let canvas = this.canvas.dom;
        let idx = y * canvas.width + x;

        let region_picked = app.regions[this.canvas.flatmap_region_index_array[idx]];
        app.region_picked = region_picked;

        if (region_picked) {
            let cc = region_picked.color_code;
            let hexColor = getHexColor(cc);
            // if the current cursor is at a border or the underlying region is changed
            if (hexColor == 0xff000000 || this.canvas.last_color != hexColor) {
                // redraw the flatmap (preferrably using cache)
                this.drawFlatmap();
                if (this.canvas.last_color != hexColor) {
                    // if cursor is at a new region, highlight it
                    this.highlightRegion(region_picked);
                }
                this.canvas.last_color = hexColor;
            }
        }
        return region_picked;
    }

    highlightRegion(r) {
        let cc = r.color_code;
        let hexColor = getHexColor(cc);

        let arr = this.canvas.flatmap_array;
        let ii = arr.length;
        for (let i=0; i<ii; i++) {
            if (arr[i] == hexColor) {
                let new_color = 0xffffffff;
                arr[i] = new_color;
            }
        }
        this.transferBufferToCanvas();
    }

    highlightInjection(inj) {
        let canvas = this.canvas.dom;
        let ctx = canvas.getContext('2d');
        ctx.save();
        ctx.beginPath();

        let f_x = (inj.flatmap_x + app.flat_center.x) / app.Sx;
        let f_y = (inj.flatmap_y + app.flat_center.y) / app.Sy;

        let gradient = ctx.createRadialGradient(f_x, f_y, this.dot_size + 2, f_x, f_y, this.dot_size + 5);
        let shade = '#ffffff';

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
        ctx.arc(f_x, f_y, this.dot_size + 4, 0, 2*Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
        this.createFlatmapDrawingBuffer();
    }

    transferBufferToCanvas() {
        let canvas = this.canvas.dom;
        let ctx = canvas.getContext('2d');
        ctx.putImageData(this.canvas.flatmap_img_data, 0, 0);
    }

    drawFlatmap() {
        let canvas = this.canvas.dom;
        let ctx = canvas.getContext('2d');
        if (this.canvas.flatmap_cache) {
            ctx.putImageData(this.canvas.flatmap_cache, 0, 0);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(this.canvas.flatmap_base, 0, 0);
            ctx.save();
            _.each(app.injections, inj => {
                this.drawInjection(inj);
            });
            ctx.restore();
            this.createFlatmapDrawingBuffer();
            // console.log('buf8 len', buf8.length, '32 len', pix_color.length);

            // create a imageData object to hold buffer as drawn flatmap (with injections)
            let img_data = this.canvas.flatmap_img_data;
            // save the buffer into cache
            // so that when we reset the flatmap, we just repaint it using cache
            let cache = ctx.createImageData(img_data.width, img_data.height);
            cache.data.set(img_data.data);
            this.canvas.flatmap_cache = cache;
        }
    }

    drawInjection(inj) {
        let canvas = this.canvas.dom;
        let ctx = canvas.getContext('2d');
        ctx.beginPath();
        let f_x = (inj.flatmap_x + app.flat_center.x) / app.Sx;
        let f_y = (inj.flatmap_y + app.flat_center.y) / app.Sy;

        let gradient = ctx.createRadialGradient(f_x, f_y, this.dot_size, f_x, f_y, this.dot_size + 2);
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

        ctx.arc(f_x, f_y, this.dot_size + 2, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }

    handleImageLoad() {
        let req = new window.XMLHttpRequest();
        // a user-defined mime type to guarantee binary data is not parsed or decoded
        req.overrideMimeType('text/plain; charset=x-user-defined');
        function retryLoadRegionData() {
            setTimeout(() => {
                try {
                    req.open('GET', '/static/images/region.ppm.gz');
                    req.send();
                } catch(e) {
                    throw 'Error retrieving data file. Some browsers only accept cross-domain request with HTTP.';
                }
                console.log('request to fetch region data reinitiated');
            }, 3000);
        }
        req.addEventListener('load', oEvent => {
        });

        req.onreadystatechange = oEvent => {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    // the return of the XMLHttpRequest is an ArrayBuffer, in order to access the ArrayBuffer
                    // a typed array must be created.
                    let arrayBuffer = req.response; // Note: not req.responseText
                    if (arrayBuffer) {
                        // typed array created here
                        let arr = new Uint8Array(arrayBuffer);
                        // FSM to decode PPM gray scale image. the rgb value stores the region id
                        let done = false;
                        let ptr = 0;
                        let stage = 'init';
                        let width;
                        let height;
                        let width_ascii = '';
                        let height_ascii = '';
                        while (!done) {
                            let chr = String.fromCharCode(arr[ptr]);
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
                        // decoding of header finish reset typed array to point to the start of image data
                        arr = new Uint8Array(arrayBuffer, ptr);
                        this.canvas.flatmap_region_index_array = arr;

                        this.drawFlatmap();
                        app.flat_ready = true;
                        app.region_dim = [width, height];
                        //restore_user_selection();
                    }
                } else {
                    retryLoadRegionData();
                }
            }
        };
        req.addEventListener('error', oEvent => {
            // if request to fetch region data failed, retry it in 5 seconds
            retryLoadRegionData();

        });
        req.responseType = 'arraybuffer';
        try {
            req.open('GET', '/static/images/region.ppm.gz');
            req.send();
        } catch(e) {
            throw 'Error retrieving data file. Some browsers only accept cross-domain request with HTTP.';
        }
    }

    componentDidMount() {
        // prepare flatmap image
        let img = document.createElement('img');
        img.onload = this.handleImageLoad;
        img.src = '/static/images/flat.png';
        this.canvas.flatmap_base = img;
        AppStore.addListener('HIGHLIGHT_INJECTION', this.handleHighlightInjection);
        AppStore.addListener('HIGHLIGHT_REGION', this.handleHighlightRegion);
        AppStore.addListener('REMOVE_TIP', this.handleRemoveTip);

    }

    componentWillUnmount() {
        AppStore.removeListener('HIGHLIGHT_INJECTION');
        AppStore.removeListener('HIGHLIGHT_REGION');
        AppStore.removeListener('REMOVE_TIP');
    }
    /**
     * @return {object}
     */
    render() {
        let x = this.state.tipCoord.x;
        let y = this.state.tipCoord.y;
        let coord_text = 'Coord: ' + ((app.Sx * (x)) - app.flat_center.x).toFixed(2) + ',' + ((app.Sy * (y)) - app.flat_center.y).toFixed(2);
        console.debug(coord_text);
        let tipInjection;
        let _inj = this.state.tipInjection;
        let tipRegion;
        let injections;

        if (this.state.tipInjection) {
            let flatmap_url = '//flatmap.marmosetbrain.org/flatmap-quarter/' + _inj.case_id + '/' + _inj.tracer + '.jpg'
            tipInjection = (<div>
                <img src={flatmap_url} width="145" height="137"/>
                <span className="injection-tip">{_inj.injection_id} in {_inj.region}</span>
                <div className="injection-detail">Click to view details</div>
            </div>
            );
            injections = [];
        } else if (this.state.tipRegion) {
            tipRegion = (<span className="region-name">Area {this.state.tipRegion.name} ({this.state.tipRegion.code}),</span>);
            injections = _.filter(app.injections, {region_id: this.state.tipRegion.id});
            let tipInjectionContent = _.map(injections, _inj => {
                return (<div className="injection-tip-injection" key={_inj.id}>{_inj.injection_id}</div>);
            });
            let len = injections.length;
            tipInjection = (<div className="injection-tip">Injection: {tipInjectionContent}</div>);
            if (len > 0) {
                tipInjection = (<div className="injection-tip">{len} injection{len > 1 ? 's' : ''}.<br/><br/>Click to list</div>);
            } else {
                tipInjection = (<div className="injection-tip">No injections found.</div>);
            }
        } else {
            tipRegion = null;
            injections = [];
        }
        let tip = $(this.canvas.tip);
        let tipLeft = this.state.tipLeft;
        let tipTop = this.state.tipTop - 80;
        /*
        $(tip).stop();
        if (this.canvas.shiftTimeout) {
            clearTimeout(this.canvas.shiftTimeout);
            this.canvas.shiftTimeout = null;
        }
        this.canvas.shiftTimeout = setTimeout(() => {
            if (tip.height() > 42) {
                tip.animate({
                    top: tipTop - (tip.height() - 42) / 2
                }, 'fast');
            }
        }, 100);
        */
        let injections_dom;
        if (injections.length > 0) {
            injections_dom = (
                <span className="injection">Injections: {_.map(injections, (_inj) => (<div key={_inj.id}>{_inj.injection_id}</div>))}</span>
            );
        }
        return (
            <td className="flatmap-canvas-pane">
                <canvas id="flat-canvas" width="700" height="640"
                    ref={(canvas) => {this.canvas.dom = canvas; }}
                    onMouseMove={this.handleMouseMove}
                    onMouseDown={this.handleMouseDown}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                    onClick={this.handleClick}
                    ></canvas>
                <div id="tip" className={classNames('noselect')} style={{left: tipLeft + 'px', top: tipTop + 'px'}} ref={(tip) => {this.canvas.tip = tip; }}>
                    {tipRegion}
                    {tipInjection}
                </div>
            </td>

        );
    }

    handleMouseMove(e) {
        if (!app.flat_ready) {
            return true;
        }
        let canvas = this.canvas.dom;
        let BB = canvas.getBoundingClientRect();
        let x = parseInt(e.clientX - BB.left, 10);
        let y = parseInt(e.clientY - BB.top, 10);

        let nearest;
        let nearest_distance = Infinity;
        let region_picked;
        let state = {};
        _.each(app.injections, function(inj) {
            let f_x = (inj.flatmap_x + app.flat_center.x) / app.Sx;
            let f_y = (inj.flatmap_y + app.flat_center.y) / app.Sy;
            let dist = Math.pow(f_x - x, 2) + Math.pow(f_y - y, 2);
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
            region_picked = this.pickRegion(x, y);
        }
        if (region_picked != this.canvas.last_region || app.nearest_injection != this.canvas.last_injection) {
            this.drawFlatmap();
            this.createFlatmapDrawingBuffer();
            if (region_picked) {
                this.highlightRegion(region_picked);
            }
            if (region_picked != this.canvas.last_region) {
                this.canvas.last_region = region_picked;
            }
            this.canvas.last_injection = nearest;
        }
        if (region_picked) {
            canvas.style.cursor = 'pointer';
            state = {
                tipLeft: x + 40,
                tipTop: y + 120,
                tipCoord: {x: x, y: y},
                tipRegion: region_picked
            }
        } else {
            //this.drawFlatmap();
            // if no region is picked (outside flatmap or at border)
            this.canvas.last_color = 0xff000000;
            Actions.removeTip();
            canvas.style.cursor = null;
        }
        if (app.nearest_injection) {
            this.highlightInjection(app.nearest_injection);
        }
        state.tipInjection = app.nearest_injection;
        this.setState(state);
    }

    handleMouseDown(e) {
        let canvas = this.canvas.dom;
        let BB = canvas.getBoundingClientRect();
        let x = parseInt(e.clientX - BB.left, 10);
        let y = parseInt(e.clientY - BB.top, 10);
        if (e.button == 0 && app.nearest_injection) {
            if (!app.hold_handle) {
                app.hold_handle = window.setTimeout(app.hold_timeout, 50);
                app.holding_pos = {x: x, y: y};
            }
        }
    }

    handleMouseEnter(e) {
        if (this.canvas.mouseLeaveTimeout) {
            clearTimeout(this.canvas.mouseLeaveTimeout);
            this.canvas.mouseLeaveTimeout = null;
        }
    }

    handleMouseLeave(e) {
        console.log('mouse leaving');
        // handle transient mouse leaving canvas due to tool tip div being in the front
        this.canvas.mouseLeaveTimeout = setTimeout(() => {
            this.drawFlatmap();
            this.canvas.last_color = 0xff000000;
            app.region_picked = null;
            Actions.removeTip();
            this.canvas.dom.style.cursor = null;
        }, 1);
    }

    handleClick(e) {
        if (!app.flat_ready) {
            return true;
        }
        let canvas = this.canvas.dom;
        let BB = canvas.getBoundingClientRect();
        let x = parseInt(e.clientX - BB.left, 10);
        let y = parseInt(e.clientY - BB.top, 10);
        let region_picked = this.pickRegion(x, y);
        if (app.nearest_injection && app.nearest_injection_distance < 250) {
            //app.show_injection_info(app.nearest_injection, e);
            //Actions.filterInjectionListByInjection(app.nearest_injection);
            let i = app.nearest_injection;
            Actions.filterInjectionListByIntelliSearch('detail:' + i.display_name + '-' + i.tracer);
            Actions.pushIntelliFilter('detail:' + i.display_name + '-' + i.tracer);
            Actions.stackInjectionModal(app.nearest_injection);
            Actions.showModal('metadata', app.nearest_injection);
            //Actions.pickInjection(app.nearest_injection);
        } else {
            //app.show_injection_info(null, e);
            //Actions.filterInjectionListByRegion(region_picked);
            if (region_picked) {
                Actions.filterInjectionListByIntelliSearch('area:' + region_picked.code);
                Actions.pushIntelliFilter('area:' + region_picked.code);
                Actions.hideModal('metadata');
            }
        }

    }

    handleHighlightInjection() {
        this.drawFlatmap();
        this.createFlatmapDrawingBuffer();
        this.highlightInjection(AppStore.getInjectionToHighlight());
    }

    handleHighlightRegion() {
        this.highlightRegion(AppStore.getRegionToHighlight());
    }

    handleRemoveTip() {
        this.setState({
            tipVisible: false,
            tipLeft: -65535,
        });
    }
}
