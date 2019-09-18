//var ReactPropTypes = React.PropTypes;
import FlatmapCanvas from './FlatmapCanvas.react';
import React from 'react';
import InjectionInfo from './InjectionInfo.react';
import SectionViewer from '../lib/SectionViewer';
import AppStore from '../stores/AppStore';
import classNames from 'classnames';
import numberFormat from '../lib/numberformat';

function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}
class BrainMeta extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let m = app.marmoset;
        let cells = app.cells;
        let icon = {
            'FE': 'images/jump-green.png',
            'FR': 'images/jump-red.png',
            'CTBr': 'images/jump-red.png',
            'FB': 'images/jump-blue.png',
            'DY': 'images/jump-yellow.png',
            'CTBgr': 'images/jump-green.png'
        }
        let titles = {
        }
        let injections = [];
        _.each(app.injections, inj => {
            switch (inj.tracer) {
                case 'FE':
                case 'CTBgr':
                    titles.FE = inj.tracer;
                    break;
                case 'FR':
                case 'CTBr':
                    titles.FR = inj.tracer;
                    break;
                case 'DY':
                case 'CTBgold':
                    titles.DY = inj.tracer;
                    break;
                case 'FB':
                    titles.FB = inj.tracer;
                    break;
                case 'BDA':
                    titles.BDA = inj.tracer;
                    break;

            }
            injections.push(
                <div key={inj.id}>
                    <div>
                        <br />
                        Tracer: {inj.tracer} Area: {inj.region}  Atlas: A {inj.atlas_a.toFixed(1)} L {inj.atlas_l.toFixed(1)} H {inj.atlas_h.toFixed(1)}
                        <a href={'/goto/' + app.case_id + '/' + inj.section_code + '/' + (inj.section_x) + '/' + (inj.section_y) + '/3'}><img src={'/static/' + icon[inj.tracer]}/></a>
                    </div>
                </div>
            );
            /* getTargetAreaSummaryHTML
                    <div>
                        Search literature for region {inj.region}&nbsp;
                        (<a href={'http://mouse.brainarchitecture.org/webapps/neuro_nlp/index.jsp?query=' + fixedEncodeURIComponent(inj.region_name) + '&docsPerPage=5&category0=connectivity&sentsPerDoc=5&twoBrains=yes&sentsToSort=1000'} target="_blank">Link</a>)
                    </div>
            */
        });
        return (
            <div>
                Brain Meta<br/>
                Sex: {m.sex}<br/>
                Body weight: {m.body_weight}g<br/>
                Date of birth: {m.dob}<br/>
                Hemisphere: {m.hemisphere}<br/>
                Age: {m.age}<br/>
                Date of injection: {m.injection_date}<br/>
                Survival time: {m.survival_days} {m.survival_days > 1 ? 'days': 'day'}<br/>
                Date of perfusion: {m.perfusion_date}<br/>
                <div className="other-info">{m.other_info ?
                    m.other_info.split('\n').map((item, key) => {
                        if (item) {
                            return (<span key={key}>{item}<br/></span>);
                        }
                    })
                    : 'n/a'}</div>
                {_.map(app.injections, inj => {
                    return inj.memo ? (<div key={'inj-' + inj.id}>
                        {inj.memo.split('\n').map((item, idx) => {
                            return (<span key={'inj-' + inj.id + '-' + idx}>{item}</span>);
                        })}
                    </div>) : null;
                })}
                <br/>
                Cells in this section: {numberFormat(cells.length, 0, '.', '\u2009')}
                {app.features_fe.length > 0 ? (', ' + titles.FE + ': ' + numberFormat(app.features_fe.length, 0, '.', '\u2009')) : ''}
                {app.features_fr.length > 0 ? (', ' + titles.FR + ': ' + numberFormat(app.features_fr.length, 0, '.', '\u2009')) : ''}
                {app.features_fb.length > 0 ? (', ' + titles.FB + ': ' + numberFormat(app.features_fb.length, 0, '.', '\u2009')) : ''}
                {app.features_dy.length > 0 ? (', ' + titles.DY + ': ' + numberFormat(app.features_dy.length, 0, '.', '\u2009')) : ''}
                {app.features_bda.length > 0 ? (', ' + titles.BDA + ': ' + numberFormat(app.features_bda.length, 0, '.', '\u2009')) : ''}<br/>
                Total cells in this animal: {numberFormat(app.total_cells.total, 0, '.', '\u2009')}
                {app.total_cells.fe > 0 ? (', ' + titles.FE + ': ' + numberFormat(app.total_cells.fe, 0, '.', '\u2009')) : ''}
                {app.total_cells.fr > 0 ? (', ' + titles.FR + ': ' + numberFormat(app.total_cells.fr, 0, '.', '\u2009')) : ''}
                {app.total_cells.fb > 0 ? (', ' + titles.FB + ': ' + numberFormat(app.total_cells.fb, 0, '.', '\u2009')) : ''}
                {app.total_cells.dy > 0 ? (', ' + titles.DY + ': ' + numberFormat(app.total_cells.dy, 0, '.', '\u2009')) : ''}
                {app.total_cells.bda > 0 ? ', ' + titles_bda + ': ' + numberFormat(app.total_cells.bda, 0, '.', '\u2009') : ''}
                {injections}
                <div className="info-mouse-position">
                    <br/>
                    Current Position: <span id="mouse-position">&nbsp;</span><br/>
                    <span className="info-extent" id="info_extent"></span>
                </div>
            </div>
        );
    }
}
class SectionViewMain extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            enhanceBorder: false,
            flatmapOn: false
        }
        _.bindAll(this, 'handleShowBorderToggle', 'handleChange', 'handleRestore');
    }
    handleShowBorderToggle(e) {
        let enhanceBorder = e.target.checked;
        this.setState({
            enhanceBorder: enhanceBorder,
        });
        if (enhanceBorder) {

        }
    }
    componentDidMount() {
        AppStore.addChangeListener(this.handleChange);
        AppStore.addListener('restore', this.handleRestore);
    }
    componentWillUnmount() {
        AppStore.removeChangeListener(this.handleChange);
        AppStore.removeListener('restore', this.handleRestore);
    }
    handleChange() {
        //parcel_layer.setOpacity(this.state.viewerState.parcellationDensity);
        this.setState({
            flatmapOn: AppStore.getFlatmapOnState()
        });
    }
    handleRestore() {
        let parcel_layer = app.parcel_layer;
        let viewerState = AppStore.getViewerState();
        console.log('viewer state', viewerState);

        let view = app.map.getView();
        let overriden = false;
        try {
            let override = app.overrideExtent;
            if (typeof override === 'object' && override.length == 4) {
                override = override.map(v => (v *= app.res));
                view.fit(override, {size: app.map.getSize()});
                console.log('override to', override);
                overriden = true;
                if (app.overrideZoom) {
                    view.setResolution(app.overrideZoom);
                }
                if (app.from_) {
                    window.history.replaceState('', 'Section View', app.from_);
                }
            }
        } catch (e) {
            console.log(e);
        }
        if (viewerState) {
            let density = viewerState.parcellationDensity;
            console.log('density received', density, 'restore layer');
            if (density < 0) {
                parcel_layer.setOpacity(0);
                app.parcel_opacity = density;
                $('.parcellation-toggle').addClass('layer-invisible');
            } else {
                parcel_layer.setOpacity(density);
                app.parcel_opacity = density;
            }
            if (!overriden) {
                let lastView = viewerState.lastView;
                let now = Math.floor(new Date().getTime() / 1000);
                if (now - lastView < 3600) {
                    let extent = viewerState.extent;
                    extent = extent.map(v => (v *= app.res));

                    if (typeof extent === 'object' && extent.length == 4) {
                        view.fit(extent, app.map.getSize());
                    }
                }
            }
        }
    }
    render() {
        let flatmaps = [];
        _.each(app.injections, (inj, key) => {
            flatmaps.push(
                <li key={inj.tracer}>
                    <a className="flatmap-link" href={inj.flatmap_image} target="_blank"
                        data-caption={app.display_name + '-' + inj.tracer} data-index={key}>
                        <img src={inj.flatmap_image} width="300" height="300" />
                        {inj.tracer}
                    </a>
                </li>
            );
        });
        let thumbnails = [];
        _.each(app.series, (s, key) => {
            let count = s.count;
            /*if (count == 0 && s.anno_count == 0) {
                return;
            }*/
            if (count === 0) {
                return;
            }
            thumbnails.push(
                <a key={s.id} href={'/section/' + s.id}>
                    <div className={classNames('section-thumbnail', {'current-section': app.section_id == s.id})}
                        id={'thumbnail-' + s.code} data-section-id={s.id} data-annotation-count={s.anno_count}>
                        <span className="align-helper"></span>
                        <img className="lazy-load bottom-filmstrip" data-original={'http://cdn.marmosetbrain.org/thumbnails/' + app.case_id.toUpperCase() + '/' + s.nissl_section + '.png'} alt={'Section ' + s.code} width="120" />
                        <div className="section-label">{s.code}<br/>Cells: {s.count}</div>
                    </div>
                </a>
            );
        });
        let imageCaption = null, borderToggle = null;
        if (this.state.flatmapOn) {
            imageCaption = (
                <div id="flatmap-image-caption"></div>
            )
        }
        if (this.state.flatmapOn) {
            borderToggle = (
                <div id="flatmap-border-toggle">
                    <input type="checkbox" name="enhance_border" checked={this.state.enhanceBorder} onChange={this.handleShowBorderToggle} /> Enhance Border
                </div>
            );
        }
        return (
            <div className="full-width-height">
                <div id="marmoset-logo" className="marmoset-logo"><a href="/injection"><img src={app.assets.logo_small} alt="marmoset logo" /></a></div>
                <div id="brain-meta" className="brain-meta bg-primary"><BrainMeta/></div>
                <div id="flatmap" className="flatmap bg-primary">
                    <ul id="flatmap-ul">
                        {flatmaps}
                    </ul>
                </div>
                <div id="map" className="map"></div>
                <div className="gallery-thumbnail-container">
                    <div id="gallery-thumbnail" className="gallery-thumbnail">
                        {thumbnails}
                    </div>
                </div>
                <div className="display-none" id="memo-edit">
                    <div className="modal-header">
                        <a rel="modal:close"><button className="close" aria-label="Close"><span aria-hidden="true">&times;</span></button></a>
                        <h4 className="modal-title">Memo</h4>
                    </div>
                    <div className="modal-body" id="modal-body">
                        <textarea id="memo-content" className="form-control"></textarea>
                    </div>
                    <div className="modal-footer">
                        <a rel="modal:close"><button type="button" className="btn btn-default">Close</button></a>
                        <a rel="modal:close"><button type="button" className="btn btn-primary btn-save-annotation">Save changes</button></a>
                    </div>
                </div>
                <div className="display-none" id="reconstruction-thumbnail">
                    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Placeholder for reconstruction thumbnail" />
                </div>
                <div className="flatmap-overlay dark" id="flatmap-overlay">
                    <img className="loading-monkey" id="loading-monkey" src={app.assets.monkey}/>
                </div>
                <div onDragStart={ () => {return false;}} className="flatmap-holder dark" id="flatmap-holder">
                    <div id="flatmap-image-container">
                        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Placeholder for flat map" id="flatmap-image" />
                        <img src="/static/images/flatmap_border.png" className={classNames({hide: !this.state.enhanceBorder})} id="flatmap-enhanced-borders" alt="Enhanced Borders"/>
                    </div>
                    {imageCaption}
                    {borderToggle}
                </div>
            </div>
        );
    }
}

class InjectionSearchMain  extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
}

export default class MainSection extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    componentDidMount() {
    }

    /**
     * @return {object}
     */
    render() {
        if (app.route_name == 'injection.search') {
            return (
                <div>
                    <div className="row flatmap-container">
                        <div className="col-md-12">
                            <table className="injection-flatmap">
                                <tbody>
                                    <tr>
                                        <FlatmapCanvas />
                                        <InjectionInfo />
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div id="holding-cursor"><img src="" width="32" height="32" /></div>
                    </div>

                    <div className="row hide">
                        <div className="col-md-12">
                            <h5>List of injections</h5>

                        </div>
                    </div>
                    <div className="bottom-pane row hide">
                        <div className="search-results row col-md-12">
                            <div className="search-result col-md-12">
                                <div id="result-grid" style={{width: '100%', 'height': '820px'}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (app.route_name == 'section.view') {
            return (<SectionViewMain />);
        }
    }
}
MainSection.propTypes = {};
MainSection.defaultProps = {};
